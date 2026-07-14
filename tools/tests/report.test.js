'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

test('static report loads generated config, tests, scoring, data, and app in dependency order', () => {
  const html = read('report/index.html');
  const sources = [...html.matchAll(/<script src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sources, ['config.js', 'tests.js', 'scoring.js', 'data.js', 'app.js']);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
});

test('report HTML exposes the approved reading-order regions', () => {
  const html = read('report/index.html');
  for (const id of ['summary', 'domains', 'heatmap', 'details', 'profile']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.ok(html.indexOf('id="summary"') < html.indexOf('id="domains"'));
  assert.ok(html.indexOf('id="domains"') < html.indexOf('id="heatmap"'));
  assert.ok(html.indexOf('id="heatmap"') < html.indexOf('id="details"'));
});

test('report implementation removes weighted mode and bootstrap confidence claims', () => {
  const html = read('report/index.html');
  const app = read('report/app.js');
  assert.doesNotMatch(html + app, /Weighted \(÷ facet count\)|bootstrapCI|95% CI/);
  assert.match(html, /Worklog quality/);
  assert.match(html, /Category heatmap/);
});

test('styles include mobile, print, focus, and 44px control contracts', () => {
  const css = read('report/styles.css');
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /@media print/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.run-toggle:has\(input:focus-visible\)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /\.domain-bar/);
});

test('mobile rendering narrows summary and details to the selected run without hiding evidence columns', () => {
  const app = read('report/app.js');
  const css = read('report/styles.css');
  assert.match(app, /function displayRuns/);
  assert.match(app, /domain-bar/);
  assert.match(app, /data-label="Combined ability"/);
  assert.match(app, /forms.*range/s);
  assert.doesNotMatch(css, /summary-table th:nth-child/);
  assert.doesNotMatch(css, /criterion-table th:nth-child/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /\.summary-table tbody tr[\s\S]*grid-template-columns:\s*repeat\(2,/);
});

test('report fixture covers all judgment and integrity states', () => {
  const fixture = read('tools/fixtures/report-data.js');
  for (const state of ['flagged', 'invalidated', 'agree', 'disagree', 'adjudications']) {
    assert.match(fixture, new RegExp(state));
  }
});
