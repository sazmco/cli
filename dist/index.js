/**
 * SazM SDK - Website Performance & Core Web Vitals Diagnostic
 * Maintained by SazM (https://sazm.in)
 * @license MIT
 */

import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

export async function auditWebsite(rawUrl, options = {}) {
  const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  const client = parsed.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    let dnsTime = 0;
    let tcpTime = 0;
    let tlsTime = 0;
    let ttfbTime = 0;

    const req = client.get(
      parsed,
      {
        headers: {
          'User-Agent': 'SazM-Audit-SDK/1.0 (+https://sazm.in/audit)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...(options.headers || {}),
        },
      },
      (res) => {
        ttfbTime = performance.now() - startTime;
        let bytes = 0;

        res.on('data', (chunk) => {
          bytes += chunk.length;
        });

        res.on('end', () => {
          const totalTime = performance.now() - startTime;
          resolve({
            url: parsed.href,
            statusCode: res.statusCode || 0,
            statusMessage: res.statusMessage || '',
            server: res.headers['server'] || 'Unknown',
            contentType: res.headers['content-type'] || 'Unknown',
            contentLength: bytes,
            timings: {
              dns: Number(dnsTime.toFixed(1)),
              tcp: Number(tcpTime.toFixed(1)),
              tls: Number(tlsTime.toFixed(1)),
              ttfb: Number(ttfbTime.toFixed(1)),
              total: Number(totalTime.toFixed(1)),
            },
            headers: res.headers,
          });
        });
      }
    );

    req.on('socket', (socket) => {
      socket.on('lookup', () => {
        dnsTime = performance.now() - startTime;
      });
      socket.on('connect', () => {
        tcpTime = performance.now() - startTime;
      });
      socket.on('secureConnect', () => {
        tlsTime = performance.now() - startTime;
      });
    });

    req.on('error', reject);
    req.setTimeout(options.timeout || 15000, () => {
      req.destroy(new Error('Connection timed out'));
    });
  });
}
