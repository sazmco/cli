# sazm

> Official SazM CLI & SDK: live website speed audit, TTFB diagnostic, and latency waterfall analyzer.

Maintained by **[SazM](https://sazm.in)** — 20+ years in production engineering (since Oct 2006).

[![npm version](https://img.shields.io/npm/v/sazm.svg)](https://www.npmjs.com/package/sazm)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![SazM Speed Audit](https://img.shields.io/badge/Online%20Audit-sazm.in%2Faudit-emerald)](https://sazm.in/audit)

---

## Quick Run via NPX

No installation needed — run audits instantly against any domain or URL:

```bash
npx sazm audit https://sazm.in
```

Example terminal output:
```text
⚡ SazM Website Speed Audit — Running diagnostic on https://sazm.in...

  Target URL:         https://sazm.in/
  HTTP Status:        200 OK
  Edge Server:        cloudflare
  Content Size:       14.2 KB

  Latency Waterfall:
  ├─ DNS Lookup:      14.2 ms
  ├─ TCP Handshake:   28.1 ms
  ├─ TLS Negotiation: 31.4 ms
  ├─ TTFB (Server):   72.6 ms [GOOD]
  └─ Total Response:  89.3 ms

  Web Vitals Benchmark: TTFB <= 800ms is Good (Chrome 75th percentile).
  Detailed Core Web Vitals audit: https://sazm.in/audit
```

---

## Global CLI Installation

```bash
npm install -g sazm
```

### Commands

| Command | Description |
| :--- | :--- |
| `sazm audit <url>` | Measures TTFB, DNS, TCP, TLS and server response timings |
| `sazm audit <url> --json` | Outputs machine-readable JSON for CI/CD pipelines |
| `sazm ping <url>` | Fast latency edge ping |
| `sazm version` | Displays CLI version |
| `sazm help` | Shows command options |

---

## Programmatic Node.js SDK

You can also use the SazM diagnostic engine directly inside Node.js applications:

```javascript
import { auditWebsite } from 'sazm';

const result = await auditWebsite('https://sazm.in');

console.log('HTTP Status:', result.statusCode);
console.log('TTFB:', result.timings.ttfb, 'ms');
console.log('Total Response Time:', result.timings.total, 'ms');
```

---

## About SazM

**[SazM](https://sazm.in)** delivers fixed-price website speed optimizations and production engineering:
- **Free Automated Web Audit:** [sazm.in/audit](https://sazm.in/audit)
- **Production Engineering:** [sazm.in](https://sazm.in)
- **Portfolio & Case Studies:** [sazm.in/projects](https://sazm.in/projects)

20+ years in production engineering (since Oct 2006). 1,000+ projects for 300+ clients for Weismann Web per CEO letter.

---

## License

[MIT](LICENSE) © 2026 [SazM](https://sazm.in)
