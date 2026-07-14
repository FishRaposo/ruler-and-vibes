'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CURRENT_SCHEMA_VERSION,
  parseDataSource,
  migrateData,
  initialRunMap,
  resolveSuite,
  validateReviewAdjudication,
} = require('../lib/bench-data.js');

test('parseDataSource accepts schema v2 and rejects unknown versions', () => {
  const parsed = parseDataSource('window.BENCH_DATA = {"schemaVersion":2,"updated":"2026-07-10","runs":{}};');
  assert.equal(parsed.schemaVersion, 2);
  assert.throws(
    () => parseDataSource('window.BENCH_DATA = {"schemaVersion":99,"runs":{}};'),
    /Unsupported BENCH_DATA schemaVersion 99/,
  );
});

test('parseDataSource accepts JSON data only and never evaluates expressions', () => {
  assert.throws(
    () => parseDataSource('window.BENCH_DATA = ({"schemaVersion":2,"runs":{}});'),
    /Could not parse BENCH_DATA/,
  );
});

test('parseDataSource rejects a corrupt runs container instead of erasing it during migration', () => {
  assert.throws(
    () => parseDataSource('window.BENCH_DATA = {"schemaVersion":2,"runs":[]};'),
    /runs must be an object/,
  );
});

test('resolveSuite defaults to Core and rejects unknown suites before execution', () => {
  const config = { defaultSuite: 'core', suites: { core: [], extended: [], full: null } };
  assert.equal(resolveSuite(undefined, config), 'core');
  assert.equal(resolveSuite('full', config), 'full');
  assert.equal(resolveSuite('ad-hoc', config), 'ad-hoc');
  assert.throws(() => resolveSuite('mystery', config), /Unknown suite mystery/);
});

test('initialRunMap preserves every unselected run during targeted prebuilds', () => {
  const existing = { selected: { model: 'a' }, untouched: { model: 'b' } };
  assert.deepEqual(initialRunMap(existing, ['selected']), existing);
  assert.deepEqual(initialRunMap(existing, null), {});
});

test('migrateData upgrades legacy data without changing raw scores or adjudications', () => {
  const legacy = {
    updated: '2026-07-09',
    runs: {
      sample: {
        model: 'sample',
        effort: 'high',
        harness: 'cli',
        suite: 'core',
        wall_time_min: 12,
        approx_cost_usd: 1.5,
        notes: 'preserve me',
        metajudgedBy: 'meta-judge',
        metajudgedOn: '2026-07-10',
        tests: {
          'coding-01': {
            objective: { 'obj-1': 10 },
            subjective: { 'sub-quality': 9, 'sub-reasoning': 7 },
            reviews: { 'sub-quality': { verdict: 'disagree', score: 6, comment: 'evidence' } },
            adjudications: {
              'sub-quality': {
                score: 7,
                adjudicatedBy: 'judge',
                adjudicatedOn: '2026-07-10',
                comment: 'resolution',
              },
            },
          },
        },
      },
    },
  };
  const migrated = migrateData(legacy);
  assert.equal(migrated.schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.deepEqual(migrated.runs.sample.tests['coding-01'], legacy.runs.sample.tests['coding-01']);
  assert.equal(migrated.runs.sample.approx_cost_usd, 1.5);
  assert.equal(migrated.runs.sample.notes, 'preserve me');
  assert.equal(migrated.runs.sample.metajudgedBy, 'meta-judge');
});

test('validateReviewAdjudication requires material disagreement and complete adjudication evidence', () => {
  const primary = { 'sub-quality': 8, 'sub-craft': 7 };
  const testEntry = {
    subjective: primary,
    reviews: {
      'sub-quality': { verdict: 'disagree', score: 7, comment: 'only one point' },
      'sub-craft': { verdict: 'disagree', score: 4, comment: 'material evidence' },
    },
    adjudications: {
      'sub-quality': { score: 7, adjudicatedBy: '', adjudicatedOn: 'bad-date', comment: '' },
      'sub-craft': { score: 5, adjudicatedBy: 'fresh-judge', adjudicatedOn: '2026-07-10', comment: 'resolved' },
    },
  };
  const result = validateReviewAdjudication('run/test', testEntry, ['sub-quality', 'sub-craft']);
  assert.ok(result.issues.some((issue) => issue.includes('must differ by at least 2')));
  assert.ok(result.issues.some((issue) => issue.includes('missing adjudicatedBy')));
  assert.ok(result.issues.some((issue) => issue.includes('invalid adjudicatedOn')));
  assert.ok(result.issues.some((issue) => issue.includes('missing adjudication comment')));
  assert.equal(result.issues.some((issue) => issue.includes('sub-craft')), false);
});

test('validateReviewAdjudication rejects adjudication without a disagreement', () => {
  const entry = {
    subjective: { 'sub-quality': 8 },
    reviews: { 'sub-quality': { verdict: 'agree', score: 8, comment: 'supported' } },
    adjudications: {
      'sub-quality': {
        score: 9,
        adjudicatedBy: 'judge',
        adjudicatedOn: '2026-07-10',
        comment: 'not allowed',
      },
    },
  };
  const result = validateReviewAdjudication('run/test', entry, ['sub-quality']);
  assert.ok(result.issues.some((issue) => issue.includes('exists without a disagree review')));
});

test('validateReviewAdjudication requires reviewer scores and enforces the agree calibration band', () => {
  const result = validateReviewAdjudication('run/test', {
    subjective: { 'sub-quality': 8, 'sub-craft': 7 },
    reviews: {
      'sub-quality': { verdict: 'agree', comment: 'missing independent score' },
      'sub-craft': { verdict: 'agree', score: 5, comment: 'outside one-point band' },
    },
  }, ['sub-quality', 'sub-craft']);
  assert.ok(result.issues.some((issue) => issue.includes('sub-quality') && issue.includes('numeric score')));
  assert.ok(result.issues.some((issue) => issue.includes('sub-craft') && issue.includes('within 1 point')));
});

test('validateReviewAdjudication rejects review evidence without a valid primary score', () => {
  const result = validateReviewAdjudication('run/test', {
    subjective: { 'sub-quality': null },
    reviews: {
      'sub-quality': { verdict: 'agree', score: 8, comment: 'cannot corroborate an unjudged criterion' },
    },
  }, ['sub-quality']);
  assert.ok(result.issues.some((issue) => issue.includes('valid primary score')));
});
