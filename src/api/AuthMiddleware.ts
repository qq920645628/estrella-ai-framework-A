import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@common/logger';
import { AppError, ErrorCode, UnauthorizedError, ForbiddenError } from '@common/errors';
import * as crypto from 'crypto';

const logger = createLogger('AuthMiddleware');

export interface JWTPayload {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  enableAuth: boolean;
}

const DEFAULT_CONFIG: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  enableAuth: process.env.ENABLE_SECURITY === 'true',
};

export class AuthMiddleware {
  private readonly config: AuthConfig;

  constructor(config: Partial<AuthConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public authenticate(req: Request, res: Response, next: NextFunction): void {
    if (!this.config.enableAuth) {
      next();
      return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next(new UnauthorizedError('No authorization header provided'));
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      next(new UnauthorizedError('Invalid authorization header format'));
      return;
    }

    const token = parts[1];

    try {
      const decoded = this.verifyToken(token);

      (req as Request & { user?: JWTPayload }).user = decoded;

      logger.debug('User authenticated', { userId: decoded.userId });
      next();
    } catch (error) {
      logger.warn('Token verification failed', { error: (error as Error).message });
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }

  public authorize(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enableAuth) {
        next();
        return;
      }

      const user = (req as Request & { user?: JWTPayload }).user;

      if (!user) {
        next(new UnauthorizedError('User not authenticated'));
        return;
      }

      if (roles.length > 0 && !roles.some((role) => user.roles.includes(role))) {
        logger.warn('Access denied - insufficient permissions', {
          userId: user.userId,
          userRoles: user.roles,
          requiredRoles: roles,
        });
        next(new ForbiddenError('Insufficient permissions'));
        return;
      }

      next();
    };
  }

  public requirePermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enableAuth) {
        next();
        return;
      }

      const user = (req as Request & { user?: JWTPayload }).user;

      if (!user) {
        next(new UnauthorizedError('User not authenticated'));
        return;
      }

      if (!user.permissions.includes(permission)) {
        logger.warn('Access denied - missing permission', {
          userId: user.userId,
          requiredPermission: permission,
        });
        next(new ForbiddenError(`Missing required permission: ${permission}`));
        return;
      }

      next();
    };
  }

  private verifyToken(token: string): JWTPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    const expectedSignature = this.computeSignature(headerB64, payloadB64);
    const providedSignature = signatureB64.replace(/-/g, '+').replace(/_/g, '/');

    if (expectedSignature !== providedSignature) {
      throw new Error('Invalid token signature');
    }

    const payload: JWTPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64').toString('utf-8')
    );

    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token has expired');
    }

    return payload;
  }

  private computeSignature(headerB64: string, payloadB64: string): string {
    const data = `${headerB64}.${payloadB64}`;
    const hmac = crypto.createHmac('sha256', this.config.jwtSecret);
    hmac.update(data);
    return hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  public generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = this.parseExpiresIn(this.config.jwtExpiresIn);

    const fullPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn,
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
    const signature = this.computeSignature(headerB64, payloadB64);

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)(s|m|h|d)$/);
    if (!match) {
      return 86400;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 86400;
    }
  }
}

export const authMiddleware = new AuthMiddleware();

export default AuthMiddleware;
