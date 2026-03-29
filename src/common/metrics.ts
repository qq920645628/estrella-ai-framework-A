import { createLogger } from '@common/logger';
import * as os from 'os';

const logger = createLogger('MetricsCollector');

export interface MetricValue {
  value: number;
  timestamp: Date;
  labels?: Record<string, string>;
}

export interface MetricsSnapshot {
  timestamp: Date;
  counters: Record<string, MetricValue>;
  gauges: Record<string, MetricValue>;
  histograms: Record<string, number[]>;
  summary: {
    [key: string]: {
      count: number;
      sum: number;
      avg: number;
      min: number;
      max: number;
    };
  };
}

class MetricsCollector {
  private counters: Map<string, MetricValue> = new Map();
  private gauges: Map<string, MetricValue> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private startTime: Date = new Date();

  public incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const key = this.getKeyWithLabels(name, labels);
    const current = this.counters.get(key);

    this.counters.set(key, {
      value: (current?.value || 0) + value,
      timestamp: new Date(),
      labels,
    });

    logger.debug('Counter incremented', { name, value, labels });
  }

  public setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKeyWithLabels(name, labels);

    this.gauges.set(key, {
      value,
      timestamp: new Date(),
      labels,
    });

    logger.debug('Gauge set', { name, value, labels });
  }

  public recordHistogram(name: string, value: number): void {
    const values = this.histograms.get(name) || [];
    values.push(value);

    if (values.length > 1000) {
      values.shift();
    }

    this.histograms.set(name, values);

    logger.debug('Histogram recorded', { name, value });
  }

  public observe(name: string, value: number, labels?: Record<string, string>): void {
    this.recordHistogram(name, value);
    this.incrementCounter(`${name}_count`, 1, labels);
  }

  private getKeyWithLabels(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }

    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');

    return `${name}{${labelStr}}`;
  }

  public getSnapshot(): MetricsSnapshot {
    const summary: MetricsSnapshot['summary'] = {};

    for (const [name, values] of this.histograms.entries()) {
      if (values.length === 0) continue;

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

  public getSystemMetrics(): Record<string, unknown> {
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

  public reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    logger.info('Metrics reset');
  }

  public getPrometheusMetrics(): string {
    const lines: string[] = [];

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

export const metricsCollector = new MetricsCollector();
export default MetricsCollector;
