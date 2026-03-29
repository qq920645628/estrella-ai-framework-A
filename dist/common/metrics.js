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
exports.metricsCollector = void 0;
const logger_1 = require("@common/logger");
const os = __importStar(require("os"));
const logger = (0, logger_1.createLogger)('MetricsCollector');
class MetricsCollector {
    constructor() {
        this.counters = new Map();
        this.gauges = new Map();
        this.histograms = new Map();
        this.startTime = new Date();
    }
    incrementCounter(name, value = 1, labels) {
        const key = this.getKeyWithLabels(name, labels);
        const current = this.counters.get(key);
        this.counters.set(key, {
            value: (current?.value || 0) + value,
            timestamp: new Date(),
            labels,
        });
        logger.debug('Counter incremented', { name, value, labels });
    }
    setGauge(name, value, labels) {
        const key = this.getKeyWithLabels(name, labels);
        this.gauges.set(key, {
            value,
            timestamp: new Date(),
            labels,
        });
        logger.debug('Gauge set', { name, value, labels });
    }
    recordHistogram(name, value) {
        const values = this.histograms.get(name) || [];
        values.push(value);
        if (values.length > 1000) {
            values.shift();
        }
        this.histograms.set(name, values);
        logger.debug('Histogram recorded', { name, value });
    }
    observe(name, value, labels) {
        this.recordHistogram(name, value);
        this.incrementCounter(`${name}_count`, 1, labels);
    }
    getKeyWithLabels(name, labels) {
        if (!labels || Object.keys(labels).length === 0) {
            return name;
        }
        const labelStr = Object.entries(labels)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}="${v}"`)
            .join(',');
        return `${name}{${labelStr}}`;
    }
    getSnapshot() {
        const summary = {};
        for (const [name, values] of this.histograms.entries()) {
            if (values.length === 0)
                continue;
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = sum / values.length;
            const sorted = [...values].sort((a, b) => a - b);
            summary[name] = {
                count: values.length,
                sum,
                avg: Math.round(avg * 100) / 100,
                min: sorted[0],
                max: sorted[sorted.length - 1],
            };
        }
        return {
            timestamp: new Date(),
            counters: Object.fromEntries(this.counters),
            gauges: Object.fromEntries(this.gauges),
            histograms: Object.fromEntries(this.histograms),
            summary,
        };
    }
    getSystemMetrics() {
        const memUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        return {
            uptime: Date.now() - this.startTime.getTime(),
            memory: {
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                external: memUsage.external,
                rss: memUsage.rss,
                usagePercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
            },
            cpu: {
                user: cpuUsage.user,
                system: cpuUsage.system,
            },
            process: {
                pid: process.pid,
                versions: process.versions,
            },
            system: {
                platform: os.platform(),
                arch: os.arch(),
                cpus: os.cpus().length,
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                loadAverage: os.loadavg(),
            },
        };
    }
    reset() {
        this.counters.clear();
        this.gauges.clear();
        this.histograms.clear();
        logger.info('Metrics reset');
    }
    getPrometheusMetrics() {
        const lines = [];
        lines.push('# HELP process_uptime_seconds Process uptime in seconds');
        lines.push('# TYPE process_uptime_seconds gauge');
        lines.push(`process_uptime_seconds ${Date.now() - this.startTime.getTime() / 1000}`);
        lines.push('# HELP process_memory_heap_used_bytes Process heap memory used');
        lines.push('# TYPE process_memory_heap_used_bytes gauge');
        const memUsage = process.memoryUsage();
        lines.push(`process_memory_heap_used_bytes ${memUsage.heapUsed}`);
        for (const [name, metric] of this.counters.entries()) {
            const labelStr = metric.labels
                ? `{${Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',')}}`
                : '';
            lines.push(`# HELP ${name} Counter`);
            lines.push(`# TYPE ${name} counter`);
            lines.push(`${name}${labelStr} ${metric.value}`);
        }
        for (const [name, metric] of this.gauges.entries()) {
            const labelStr = metric.labels
                ? `{${Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',')}}`
                : '';
            lines.push(`# HELP ${name} Gauge`);
            lines.push(`# TYPE ${name} gauge`);
            lines.push(`${name}${labelStr} ${metric.value}`);
        }
        return lines.join('\n');
    }
}
exports.metricsCollector = new MetricsCollector();
exports.default = MetricsCollector;
//# sourceMappingURL=metrics.js.map