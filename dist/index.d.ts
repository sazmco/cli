/**
 * SazM SDK - Website Performance & Core Web Vitals Diagnostic
 * Maintained by SazM (https://sazm.in)
 * @license MIT
 */

export interface TimingMetrics {
  dns: number;
  tcp: number;
  tls: number;
  ttfb: number;
  total: number;
}

export interface AuditResult {
  url: string;
  statusCode: number;
  statusMessage: string;
  server: string;
  contentType: string;
  contentLength: number;
  timings: TimingMetrics;
  headers: Record<string, string | string[] | undefined>;
}

export interface AuditOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export declare function auditWebsite(url: string, options?: AuditOptions): Promise<AuditResult>;
