'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  analyzeCalibration,
  formatCalibration,
  parseArgs,
} = require('../calibration.js');

const TESTS = {
  'coding-01-base': {
    category: 'coding',
    weights: { objective: 0.5, subjective: 0.5 },
    objective: [['obj-1', 'one']],
    subjective: [
      ['sub-quality', 'Quality', 0.4],
      ['sub-craft', 'Craft', 0.3],
      ['sub-reasoning', 'Reasoning', 0.3],
    ],
  },
  'coding-01b-parallel': {
    category: 'coding',
    weights: { objective: 0.5, subjective: 0.5 },
    objective: [['obj-1', 'one']],
    subjective: [
      ['sub-quality', 'Quality', 0.4],
      ['sub-craft', 'Craft', 0.3],
      ['sub-reasoning', 'Reasoning', 0.3],
    ],
  },
};

const CONFIG = {
  defaultSuite: 'core',
  suites: { core: ['coding-01-base'], full: null },
  domains: [{ id: 'software', label: 'Software', categories: ['coding'] }],
};

function scored(value, objective = 10) {
  return {
    objective: { 'obj-1': objective },
    subjective: {
      'sub-quality': value,
      'sub-craft': value,
      'sub-reasoning': value,
    },
  };
}

function dataWithRuns(values) {
  return {
    schemaVersion: 2,
    updated: '2026-07-10',
    runs: Object.fromEntries(values.map((value, index) => [
      `run-${index + 1}`,
      {
        model: `model-${index + 1}`,
        suite: 'core',
        tests: { 'coding-01-base': scored(value) },
      },
    ])),
  };
}

test('reports insufficient comparable runs below the five-run threshold', () => {
  const report = analyzeCalibration(dataWithRuns([9]), CONFIG, TESTS, { suite: 'core' });
  assert.equal(report.comparableRuns, 1);
  assert.equal(report.sufficientSample, false);
  assert.equal(report.items[0].recommendation, 'review');
  assert.equal(report.coverage[0].coverage, 1);
  assert.match(formatCalibration(report, 'text'), /insufficient comparable runs/i);
});

test('empty data reports no comparable coverage instead of a fabricated zero', () => {
  const report = analyzeCalibration({ schemaVersion: 2, runs: {} }, CONFIG, TESTS, { suite: 'core' });
  assert.match(formatCalibration(report, 'text'), /mean coverage: n\/a/);
});

test('flags ceiling and low discrimination only once five comparable runs exist', () => {
  const report = analyzeCalibration(dataWithRuns([10, 10, 10, 10, 9]), CONFIG, TESTS, { suite: 'core' });
  assert.equal(report.sufficientSample, true);
  assert.equal(report.items[0].ceiling, true);
  assert.equal(report.items[0].ceilingRate, 1);
  assert.equal(report.items[0].floorRate, 0);
  assert.deepEqual(report.compression.categoryMeanRange, [9.9, 9.9]);
  assert.match(formatCalibration(report, 'text'), /category compression:/);
  assert.equal(report.items[0].lowDiscrimination, true);
  assert.equal(report.items[0].recommendation, 'harden');
});

test('computes review disagreement and adjudication rates from raw reviewer evidence', () => {
  const data = dataWithRuns([8, 8, 8, 8, 8]);
  const first = data.runs['run-1'].tests['coding-01-base'];
  first.reviews = {
    'sub-quality': { verdict: 'disagree', score: 5, comment: 'missed issue' },
    'sub-craft': { verdict: 'agree', score: 7, comment: 'supported' },
    'sub-reasoning': { verdict: 'agree', score: 8, comment: 'supported' },
  };
  first.adjudications = {
    'sub-quality': {
      score: 6,
      adjudicatedBy: 'judge',
      adjudicatedOn: '2026-07-10',
      comment: 'resolved',
    },
  };
  const report = analyzeCalibration(data, CONFIG, TESTS, { suite: 'core' });
  assert.equal(report.judges.reviewedCriteria, 3);
  assert.equal(report.judges.disagreements, 1);
  assert.equal(report.judges.adjudicationRate, 1);
  assert.equal(report.judges.meanAbsoluteDifference, 4 / 3);
});

test('treats floor effects as review candidates rather than hardening targets', () => {
  const data = dataWithRuns([1, 1, 1, 1, 2]);
  for (const run of Object.values(data.runs)) run.tests['coding-01-base'].objective['obj-1'] = 0;
  const report = analyzeCalibration(data, CONFIG, TESTS, { suite: 'core' });
  assert.equal(report.items[0].floor, true);
  assert.equal(report.items[0].recommendation, 'review');
});

test('excludes invalidated evidence from comparable runs and item statistics', () => {
  const data = dataWithRuns([0, 10]);
  data.runs['run-2'].tests['coding-01-base'].integrity = 'invalidated';
  const report = analyzeCalibration(data, CONFIG, TESTS, { suite: 'core' });
  assert.equal(report.comparableRuns, 1);
  assert.equal(report.items[0].runs, 1);
  assert.equal(report.items[0].objectivePassRate, 1);
  assert.equal(report.items[0].mean, 5);
});

test('detects parallel drift only with five comparable runs and at least three paired models', () => {
  const tooSmall = dataWithRuns([9, 9, 9]);
  for (const run of Object.values(tooSmall.runs)) {
    run.tests['coding-01b-parallel'] = scored(3, 0);
  }
  const smallReport = analyzeCalibration(tooSmall, { ...CONFIG, suites: { core: Object.keys(TESTS) } }, TESTS, { suite: 'core' });
  assert.equal(smallReport.parallel[0].drift, false);

  const data = dataWithRuns([9, 9, 9, 9, 9]);
  for (const run of Object.values(data.runs)) run.tests['coding-01b-parallel'] = scored(3, 0);
  const report = analyzeCalibration(data, { ...CONFIG, suites: { core: Object.keys(TESTS) } }, TESTS, { suite: 'core' });
  assert.equal(report.parallel.length, 1);
  assert.equal(report.parallel[0].models, 5);
  assert.equal(report.parallel[0].drift, true);
});

test('formats JSON and Markdown and parses CLI filters', () => {
  const report = analyzeCalibration(dataWithRuns([9]), CONFIG, TESTS, { suite: 'core' });
  assert.equal(JSON.parse(formatCalibration(report, 'json')).suite, 'core');
  const markdown = formatCalibration(report, 'markdown');
  assert.match(markdown, /^# Ruler & Vibes calibration/m);
  assert.match(markdown, /## Judge reliability/);
  assert.match(formatCalibration(report, 'text'), /judge disagreement:/);
  assert.deepEqual(
    parseArgs(['--suite', 'extended', '--runs', 'a', 'b', '--format', 'json', '--out', 'x.json']),
    { suite: 'extended', runs: ['a', 'b'], format: 'json', out: 'x.json' },
  );
});
