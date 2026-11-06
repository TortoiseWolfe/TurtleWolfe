#!/usr/bin/env node

const { describe, test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const script = path.join(__dirname, '..', 'generate-manifest.js');

function generate(env = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
  const out = path.join(dir, 'manifest.json');
  execFileSync('node', [script], {
    env: { ...process.env, MANIFEST_OUTPUT_PATH: out, ...env },
    stdio: 'pipe',
  });
  const manifest = JSON.parse(fs.readFileSync(out, 'utf8'));
  fs.rmSync(dir, { recursive: true, force: true });
  return manifest;
}

describe('generate-manifest.js', () => {
  test('names the install after the portfolio, not the starter template', () => {
    const manifest = generate();
    assert.strictEqual(manifest.name, 'TurtleWolfe');
    assert.strictEqual(manifest.short_name, 'TurtleWolfe');
    assert.doesNotMatch(manifest.description, /template|starter/i);
    assert.match(manifest.description, /Jonathan Pohlner/);
  });

  test('a project name override still reaches the manifest', () => {
    const manifest = generate({ NEXT_PUBLIC_PROJECT_NAME: 'MyFork' });
    assert.strictEqual(manifest.name, 'MyFork');
    assert.doesNotMatch(manifest.description, /template|starter/i);
  });
});
