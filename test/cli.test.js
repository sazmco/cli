import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { auditWebsite } from '../dist/index.js';

describe('sazm CLI & SDK', () => {
  test('CLI responds to version command', () => {
    const output = execSync('node ./bin/sazm.js version').toString();
    assert.match(output, /sazm v1\.0\.0/);
  });

  test('CLI responds to help command', () => {
    const output = execSync('node ./bin/sazm.js help').toString();
    assert.match(output, /SazM CLI/);
    assert.match(output, /sazm audit/);
  });

  test('SDK exports auditWebsite function', () => {
    assert.equal(typeof auditWebsite, 'function');
  });
});
