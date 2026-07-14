'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const CLI = path.join(ROOT, 'tools', 'calibrate.js');

test('calibration CLI prints text to stdout by default', () => {
  const result = spawnSync(process.execPath, [CLI], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Insufficient comparable runs: 1\/5/);
  assert.match(result.stdout, /recommendation=review/);
});

test('calibration CLI writes only when --out is explicit and fails before unknown-suite output', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ruler-vibes-calibrate-'));
  try {
    const output = path.join(directory, 'calibration.json');
    const result = spawnSync(process.execPath, [CLI, '--format', 'json', '--out', output], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(fs.readFileSync(output, 'utf8')).suite, 'core');

    const rejected = path.join(directory, 'rejected.json');
    const failure = spawnSync(process.execPath, [CLI, '--suite', 'unknown', '--out', rejected], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert.notEqual(failure.status, 0);
    assert.equal(fs.existsSync(rejected), false);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
