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
exports.healthController = void 0;
const logger_1 = require("@common/logger");
const os = __importStar(require("os"));
const logger = (0, logger_1.createLogger)('HealthController');
class HealthController {
    constructor() {
        this.startTime = new Date();
    }
    async getHealth(req, res) {
        try {
            const health = await this.collectHealth();
            const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
            res.status(statusCode).json(health);
        }
        catch (error) {
            logger.error('Health check failed', { error });
            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: 'Health check failed',
            });
        }
    }
    async getReadiness(req, res) {
        try {
            const health = await this.collectHealth();
            const isReady = health.status !== 'unhealthy';
            res.status(isReady ? 200 : 503).json({
                ready: isReady,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            res.status(503).json({
                ready: false,
                timestamp: new Date().toISOString(),
            });
        }
    }
    async getLiveness(req, res) {
        res.status(200).json({
            alive: true,
            timestamp: new Date().toISOString(),
        });
    }
    async collectHealth() {
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            uptime: Date.now() - this.startTime.getTime(),
            memory: {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                usagePercent: Math.round((usedMem / totalMem) * 100),
            },
            cpu: {
                cores: os.cpus().length,
                loadAverage: os.loadavg(),
            },
            services: {},
        };
        if (health.memory.usagePercent > 90) {
            health.status = 'degraded';
        }
        if (health.cpu.loadAverage[0] > os.cpus().length * 0.8) {
            health.status = 'degraded';
        }
        return health;
    }
}
exports.healthController = new HealthController();
exports.default = HealthController;
//# sourceMappingURL=HealthController.js.map