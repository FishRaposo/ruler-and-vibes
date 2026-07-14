'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

test('report server resolves only files inside the report bundle', () => {
  const { resolveReportPath } = require('../serve-report.js');
  assert.equal(resolveReportPath('/', ROOT), path.join(ROOT, 'report', 'index.html'));
  assert.equal(resolveReportPath('/app.js', ROOT), path.join(ROOT, 'report', 'app.js'));
  assert.throws(() => resolveReportPath('/../README.md', ROOT), /outside report root/);
});

test('report server fixture mode swaps only the raw data source', () => {
  const { renderIndex } = require('../serve-report.js');
  const production = renderIndex(ROOT, false);
  const fixture = renderIndex(ROOT, true);
  const empty = renderIndex(ROOT, 'empty');
  const malformed = renderIndex(ROOT, 'malformed');
  assert.match(production, /<script src="data\.js"><\/script>/);
  assert.doesNotMatch(production, /fixture-data/);
  assert.match(fixture, /<script src="fixture-data\.js"><\/script>/);
  assert.match(empty, /<script src="empty-data\.js"><\/script>/);
  assert.match(malformed, /<script src="malformed-data\.js"><\/script>/);
});

test('report server sends explicit static content types', () => {
  const { contentType } = require('../serve-report.js');
  assert.equal(contentType('index.html'), 'text/html; charset=utf-8');
  assert.equal(contentType('app.js'), 'text/javascript; charset=utf-8');
  assert.equal(contentType('styles.css'), 'text/css; charset=utf-8');
});
