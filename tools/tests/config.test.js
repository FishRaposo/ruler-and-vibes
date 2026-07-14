'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function loadGeneratedConfig() {
  const source = fs.readFileSync(path.join(ROOT, 'report', 'config.js'), 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context);
  return JSON.parse(JSON.stringify(context.window.BENCH_CONFIG));
}

test('benchmark configuration assigns every category to exactly one domain', () => {
  const benchmark = loadJson('benchmark.json');
  const categoryIds = benchmark.categories.map((category) => category.id).sort();
  const domainCategories = benchmark.domains.flatMap((domain) => domain.categories).sort();
  assert.equal(new Set(categoryIds).size, categoryIds.length);
  assert.equal(new Set(domainCategories).size, domainCategories.length);
  assert.deepEqual(domainCategories, categoryIds);
  assert.equal(benchmark.domains.length, 8);
});

test('Core is the canonical default and breadth tiers remain nested base forms', () => {
  const benchmark = loadJson('benchmark.json');
  const tiers = loadJson('tiers.json');
  assert.equal(benchmark.defaultSuite, 'core');
  const core = tiers.tiers.core.tests;
  const extended = tiers.tiers.extended.tests;
  assert.ok(core.every((id) => extended.includes(id)));
  assert.ok(core.every((id) => !/^[a-z0-9]+-\d{2}[b-z]-/.test(id)));
  assert.ok(extended.every((id) => !/^[a-z0-9]+-\d{2}[b-z]-/.test(id)));
});

test('every day suite references a generated test entry', () => {
  const benchmark = loadJson('benchmark.json');
  const testsSource = fs.readFileSync(path.join(ROOT, 'report', 'tests.js'), 'utf8');
  const context = {};
  vm.runInNewContext(`${testsSource};globalThis.TEST_OUTPUT=TESTS`, context);
  for (const [suite, ids] of Object.entries(benchmark.daySuites)) {
    assert.ok(ids.length > 0, `${suite} is not empty`);
    for (const id of ids) assert.ok(context.TEST_OUTPUT[id], `${suite} references unknown ${id}`);
  }
});

test('generated report configuration matches canonical sources', () => {
  const benchmark = loadJson('benchmark.json');
  const tiers = loadJson('tiers.json');
  const generated = loadGeneratedConfig();
  assert.equal(generated.defaultSuite, 'core');
  assert.deepEqual(generated.categories, benchmark.categories);
  assert.deepEqual(generated.domains, benchmark.domains);
  assert.deepEqual(generated.suites.core, tiers.tiers.core.tests);
  assert.deepEqual(generated.suites.extended, tiers.tiers.extended.tests);
  assert.equal(generated.suites.full, null);
  for (const [suite, ids] of Object.entries(benchmark.daySuites)) {
    assert.deepEqual(generated.suites[suite], ids, `${suite} differs from benchmark.json`);
  }
});

test('RUN.md generated suite marker says omitted suite defaults to Core', () => {
  const run = fs.readFileSync(path.join(ROOT, 'RUN.md'), 'utf8');
  assert.match(run, /<!-- BEGIN GENERATED SUITES -->/);
  assert.match(run, /Default when omitted: \*\*Core\*\*/);
  assert.match(run, /Unknown suite names stop the run before any output is created/);
  assert.match(run, /<!-- END GENERATED SUITES -->/);
});
