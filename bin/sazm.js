#!/usr/bin/env node

/**
 * SazM CLI - Website Speed Audit & Core Web Vitals Diagnostic
 * Maintained by SazM (https://sazm.in)
 * @license MIT
 */

import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const VERSION = '1.0.0';

const HELP = `
SazM CLI v${VERSION} — Website Speed Audit & Core Web Vitals Diagnostic

Usage:
  sazm audit <url>       Run a live TTFB, latency & performance check on any URL
  sazm ping <url>        Measure global edge response timings
  sazm version           Display current SazM CLI version
  sazm help              Show this help message

Examples:
  npx sazm audit https://sazm.in
  npx sazm audit https://example.com --json

Learn more: https://sazm.in/audit
`;

async function measureUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  } catch (err) {
    console.error(`Error: Invalid URL "${rawUrl}"`);
    process.exit(1);
  }

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
          'User-Agent': `SazM-CLI/${VERSION} (+https://sazm.in/audit)`,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
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
    req.setTimeout(15000, () => {
      req.destroy(new Error('Connection timed out after 15s'));
    });
  });
}

function getRating(ttfb) {
  if (ttfb <= 800) return '\x1b[32mGOOD\x1b[0m';
  if (ttfb <= 1800) return '\x1b[33mNEEDS IMPROVEMENT\x1b[0m';
  return '\x1b[31mPOOR\x1b[0m';
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  if (command === 'version' || command === '-v' || command === '--version') {
    console.log(`sazm v${VERSION}`);
    return;
  }

  if (command === 'help' || command === '-h' || command === '--help') {
    console.log(HELP);
    return;
  }

  if (command === 'audit' || command === 'ping') {
    const target = args[1];
    if (!target) {
      console.error('Error: Please provide a URL to audit.');
      console.log('Usage: npx sazm audit https://example.com');
      process.exit(1);
    }

    const isJson = args.includes('--json');
    if (!isJson) {
      console.log(`\n\x1b[36m⚡ SazM Website Speed Audit\x1b[0m — Running diagnostic on \x1b[1m${target}\x1b[0m...\n`);
    }

    try {
      const result = await measureUrl(target);

      if (isJson) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      console.log(`  \x1b[1mTarget URL:\x1b[0m         ${result.url}`);
      console.log(`  \x1b[1mHTTP Status:\x1b[0m        ${result.statusCode} ${result.statusMessage}`);
      console.log(`  \x1b[1mEdge Server:\x1b[0m        ${result.server}`);
      console.log(`  \x1b[1mContent Size:\x1b[0m       ${(result.contentLength / 1024).toFixed(1)} KB\n`);

      console.log('  \x1b[1mLatency Waterfall:\x1b[0m');
      if (result.timings.dns > 0) console.log(`  ├─ DNS Lookup:      ${result.timings.dns} ms`);
      if (result.timings.tcp > 0) console.log(`  ├─ TCP Handshake:   ${result.timings.tcp} ms`);
      if (result.timings.tls > 0) console.log(`  ├─ TLS Negotiation: ${result.timings.tls} ms`);
      console.log(`  ├─ TTFB (Server):   \x1b[1m${result.timings.ttfb} ms\x1b[0m [${getRating(result.timings.ttfb)}]`);
      console.log(`  └─ Total Response:  ${result.timings.total} ms\n`);

      console.log('  \x1b[90mWeb Vitals Benchmark: TTFB <= 800ms is Good (Chrome 75th percentile).\x1b[0m');
      console.log(`  \x1b[90mDetailed Core Web Vitals audit: https://sazm.in/audit\x1b[0m\n`);
    } catch (err) {
      console.error(`\x1b[31mAudit failed:\x1b[0m ${err.message}`);
      process.exit(1);
    }
    return;
  }

  console.log(`Unknown command: "${command}"\nRun "sazm help" for usage.`);
  process.exit(1);
}

main();
