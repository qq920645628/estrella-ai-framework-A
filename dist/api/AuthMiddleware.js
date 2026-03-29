"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.AuthMiddleware = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const crypto = __importStar(require("crypto"));
const logger = (0, logger_1.createLogger)('AuthMiddleware');
const DEFAULT_CONFIG = {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    enableAuth: process.env.ENABLE_SECURITY === 'true',
};
class AuthMiddleware {
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    authenticate(req, res, next) {
        if (!this.config.enableAuth) {
            next();
            return;
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            next(new errors_1.UnauthorizedError('No authorization header provided'));
            return;
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            next(new errors_1.UnauthorizedError('Invalid authorization header format'));
            return;
        }
        const token = parts[1];
        try {
            const decoded = this.verifyToken(token);
            req.user = decoded;
            logger.debug('User authenticated', { userId: decoded.userId });
            next();
        }
        catch (error) {
            logger.warn('Token verification failed', { error: error.message });
            next(new errors_1.UnauthorizedError('Invalid or expired token'));
        }
    }
    authorize(...roles) {
        return (req, res, next) => {
            if (!this.config.enableAuth) {
                next();
                return;
            }
            const user = req.user;
            if (!user) {
                next(new errors_1.UnauthorizedError('User not authenticated'));
                return;
            }
            if (roles.length > 0 && !roles.some((role) => user.roles.includes(role))) {
                logger.warn('Access denied - insufficient permissions', {
                    userId: user.userId,
                    userRoles: user.roles,
                    requiredRoles: roles,
                });
                next(new errors_1.ForbiddenError('Insufficient permissions'));
                return;
            }
            next();
        };
    }
    requirePermission(permission) {
        return (req, res, next) => {
            if (!this.config.enableAuth) {
                next();
                return;
            }
            const user = req.user;
            if (!user) {
                next(new errors_1.UnauthorizedError('User not authenticated'));
                return;
            }
            if (!user.permissions.includes(permission)) {
                logger.warn('Access denied - missing permission', {
                    userId: user.userId,
                    requiredPermission: permission,
                });
                next(new errors_1.ForbiddenError(`Missing required permission: ${permission}`));
                return;
            }
            next();
        };
    }
    verifyToken(token) {
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
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
        if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new Error('Token has expired');
        }
        return payload;
    }
    computeSignature(headerB64, payloadB64) {
        const data = `${headerB64}.${payloadB64}`;
        const hmac = crypto.createHmac('sha256', this.config.jwtSecret);
        hmac.update(data);
        return hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    generateToken(payload) {
        const header = { alg: 'HS256', typ: 'JWT' };
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = this.parseExpiresIn(this.config.jwtExpiresIn);
        const fullPayload = {
            ...payload,
            iat: now,
            exp: now + expiresIn,
        };
        const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
        const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
        const signature = this.computeSignature(headerB64, payloadB64);
        return `${headerB64}.${payloadB64}.${signature}`;
    }
    parseExpiresIn(expiresIn) {
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
exports.AuthMiddleware = AuthMiddleware;
exports.authMiddleware = new AuthMiddleware();
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map