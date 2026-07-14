'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const scoring = require('../../report/scoring.js');

const TESTS = {
  'coding-01-base': {
    category: 'coding',
    weights: { objective: 0.5, subjective: 0.5 },
    objective: [['obj-1', 'one'], ['obj-2', 'two']],
    subjective: [
      ['sub-quality', 'Quality', 0.4],
      ['sub-craft', 'Craft', 0.3],
      ['sub-reasoning', 'Reasoning quality', 0.3],
    ],
  },
  'coding-01b-parallel': {
    category: 'coding',
    weights: { objective: 0.5, subjective: 0.5 },
    objective: [['obj-1', 'one'], ['obj-2', 'two']],
    subjective: [
      ['sub-quality', 'Quality', 0.4],
      ['sub-craft', 'Craft', 0.3],
      ['sub-reasoning', 'Reasoning quality', 0.3],
    ],
  },
  'coding-02-other': {
    category: 'coding',
    weights: { objective: 0.7, subjective: 0.3 },
    objective: [['obj-1', 'one']],
    subjective: [
      ['sub-quality', 'Quality', 0.4],
      ['sub-craft', 'Craft', 0.3],
      ['sub-reasoning', 'Reasoning quality', 0.3],
    ],
  },
  'writing-01-base': {
    category: 'writing',
    weights: { objective: 0.5, subjective: 0.5 },
    objective: [['obj-1', 'one']],
    subjective: [
      ['sub-quality', 'Quality', 0.4],
      ['sub-craft', 'Craft', 0.3],
      ['sub-reasoning', 'Reasoning quality', 0.3],
    ],
  },
};

function entry({ objective = [10, 0], quality = 8, craft = 6, reasoning = 2 } = {}) {
  return {
    objective: { 'obj-1': objective[0], 'obj-2': objective[1] },
    subjective: {
      'sub-quality': quality,
      'sub-craft': craft,
      'sub-reasoning': reasoning,
    },
  };
}

test('facetId collapses parallel forms but not distinct facets', () => {
  assert.equal(scoring.facetId('coding-01-edge-cases'), 'coding-01');
  assert.equal(scoring.facetId('coding-01b-other-surface'), 'coding-01');
  assert.equal(scoring.facetId('coding-02-refactor'), 'coding-02');
});

test('sectionScores excludes reasoning from subjective ability and reports it separately', () => {
  const scores = scoring.sectionScores('coding-01-base', entry(), TESTS);
  assert.equal(scores.objective, 5);
  assert.equal(scores.subjective, 50 / 7);
  assert.equal(scores.worklog, 2);
  assert.equal(scores.abilityDisputed, false);
  assert.equal(scores.worklogDisputed, false);
});

test('testScore applies rubric section weights to objective and non-reasoning subjective ability', () => {
  const t = entry();
  assert.equal(scoring.testScore('coding-01-base', t, 'objective', TESTS), 5);
  assert.equal(scoring.testScore('coding-01-base', t, 'subjective', TESTS), 50 / 7);
  assert.equal(scoring.testScore('coding-01-base', t, 'worklog', TESTS), 2);
  assert.equal(scoring.testScore('coding-01-base', t, 'combined', TESTS), (5 + 50 / 7) / 2);
});

test('adjudication overrides the primary criterion while reviewer disagreement alone does not', () => {
  const t = entry({ quality: 9, craft: 7, reasoning: 5 });
  t.reviews = {
    'sub-quality': { verdict: 'disagree', score: 5, comment: 'missed defect' },
    'sub-craft': { verdict: 'agree', score: 7, comment: 'reasonable' },
    'sub-reasoning': { verdict: 'agree', score: 5, comment: 'reasonable' },
  };

  const unresolved = scoring.effectiveCriterionScore(t, 'sub-quality');
  assert.deepEqual(unresolved, {
    score: 9,
    primary: 9,
    reviewer: 5,
    adjudicated: null,
    disputed: true,
    status: 'disputed',
  });

  t.adjudications = {
    'sub-quality': {
      score: 6,
      adjudicatedBy: 'fresh-judge',
      adjudicatedOn: '2026-07-10',
      comment: 'resolved from evidence',
    },
  };
  const resolved = scoring.effectiveCriterionScore(t, 'sub-quality');
  assert.deepEqual(resolved, {
    score: 6,
    primary: 9,
    reviewer: 5,
    adjudicated: 6,
    disputed: false,
    status: 'adjudicated',
  });
});

test('reasoning-only disagreement makes worklog provisional without disputing ability', () => {
  const t = entry({ reasoning: 8 });
  t.reviews = {
    'sub-quality': { verdict: 'agree', score: 8, comment: 'reasonable' },
    'sub-craft': { verdict: 'agree', score: 6, comment: 'reasonable' },
    'sub-reasoning': { verdict: 'disagree', score: 5, comment: 'thin limitations' },
  };
  const scores = scoring.sectionScores('coding-01-base', t, TESTS);
  assert.equal(scores.abilityDisputed, false);
  assert.equal(scores.worklogDisputed, true);
  assert.equal(scoring.reviewStatus(t), 'disputed');
});

test('subjective disagreements never make the objective view disputed', () => {
  const t = entry({ objective: [10, 10] });
  t.reviews = {
    'sub-quality': { verdict: 'disagree', score: 5, comment: 'material subjective miss' },
  };
  const summary = scoring.categorySummary({ tests: { 'coding-01-base': t } }, 'coding', 'objective', ['coding-01-base'], TESTS);
  assert.equal(summary.disputed, false);
  assert.equal(summary.provisional, false);
});

test('reviewStatus computes single, partial, corroborated, disputed, and adjudicated run states', () => {
  const agreed = entry();
  agreed.reviews = {
    'sub-quality': { verdict: 'agree', score: 8, comment: 'within band' },
    'sub-craft': { verdict: 'agree', score: 6, comment: 'within band' },
    'sub-reasoning': { verdict: 'agree', score: 2, comment: 'within band' },
  };
  const disputed = entry();
  disputed.reviews = {
    'sub-quality': { verdict: 'disagree', score: 5, comment: 'material miss' },
  };
  assert.equal(scoring.reviewStatus({ tests: { a: entry() } }, ['a']), 'single');
  assert.equal(scoring.reviewStatus({ tests: { a: agreed, b: entry() } }, ['a', 'b']), 'partially-reviewed');
  assert.equal(scoring.reviewStatus({ tests: { a: agreed } }, ['a', 'b']), 'partially-reviewed');
  assert.equal(scoring.reviewStatus({ tests: { a: agreed } }, ['a']), 'corroborated');
  assert.equal(scoring.reviewStatus({ tests: { a: disputed } }, ['a']), 'disputed');
  disputed.adjudications = {
    'sub-quality': { score: 6, adjudicatedBy: 'fresh', adjudicatedOn: '2026-07-10', comment: 'resolved' },
  };
  assert.equal(scoring.reviewStatus({ tests: { a: disputed } }, ['a']), 'adjudicated');
});

test('categorySummary uses median per facet, unique facet coverage, and observed range', () => {
  const run = {
    tests: {
      'coding-01-base': entry({ objective: [10, 10], quality: 10, craft: 10, reasoning: 8 }),
      'coding-01b-parallel': entry({ objective: [0, 0], quality: 0, craft: 0, reasoning: 4 }),
      'coding-02-other': entry({ objective: [10, 0], quality: 8, craft: 6, reasoning: 7 }),
    },
  };
  const summary = scoring.categorySummary(
    run,
    'coding',
    'combined',
    ['coding-01-base', 'coding-01b-parallel', 'coding-02-other'],
    TESTS,
  );
  assert.equal(summary.attemptedFacets, 2);
  assert.equal(summary.expectedFacets, 2);
  assert.equal(summary.coverage, 1);
  assert.equal(summary.formCount, 3);
  assert.equal(summary.facetsAtTarget, 0);
  assert.equal(summary.range.length, 2);
  assert.ok(summary.score > summary.range[0]);
  assert.ok(summary.score < summary.range[1]);
});

test('domainSummary stays provisional when a required category is wholly missing', () => {
  const run = { tests: { 'coding-01-base': entry({ objective: [10, 10] }) } };
  const summary = scoring.domainSummary(
    run,
    ['coding', 'writing'],
    'combined',
    ['coding-01-base', 'writing-01-base'],
    TESTS,
  );
  assert.equal(summary.categoryCount, 1);
  assert.equal(summary.expectedCategories, 2);
  assert.equal(summary.coverage, 0.5);
  assert.equal(summary.provisional, true);
});

test('suiteSummary weights represented categories equally and marks incomplete suites provisional', () => {
  const run = {
    tests: {
      'coding-01-base': entry({ objective: [10, 10], quality: 10, craft: 10, reasoning: 8 }),
      'writing-01-base': {
        objective: { 'obj-1': 0 },
        subjective: { 'sub-quality': 0, 'sub-craft': 0, 'sub-reasoning': 9 },
      },
    },
  };
  const complete = scoring.suiteSummary(
    run,
    'combined',
    ['coding-01-base', 'writing-01-base'],
    TESTS,
  );
  assert.equal(complete.categoryCount, 2);
  assert.equal(complete.coverage, 1);
  assert.equal(complete.officialComplete, true);
  assert.equal(complete.provisional, false);
  assert.equal(complete.score, 5);

  const incomplete = scoring.suiteSummary(
    run,
    'combined',
    ['coding-01-base', 'coding-02-other', 'writing-01-base'],
    TESTS,
  );
  assert.equal(incomplete.coverage, 2 / 3);
  assert.equal(incomplete.provisional, true);
});

test('suiteSummary treats invalidated required forms as incomplete and ad-hoc as unofficial', () => {
  const invalidated = { tests: { 'coding-01-base': { integrity: 'invalidated' } } };
  const fullLike = scoring.suiteSummary(invalidated, 'combined', ['coding-01-base'], TESTS);
  assert.equal(fullLike.scoredTests, 0);
  assert.equal(fullLike.invalidated, 1);
  assert.equal(fullLike.provisional, true);

  const run = { tests: { 'coding-01-base': entry({ objective: [10, 10] }) } };
  const adHoc = scoring.suiteSummary(run, 'combined', undefined, TESTS);
  assert.equal(adHoc.score !== null, true);
  assert.equal(adHoc.officialComplete, false);
  assert.equal(adHoc.provisional, true);

  run.suite = 'ad-hoc';
  const explicitAdHoc = scoring.suiteSummary(run, 'combined', ['coding-01-base'], TESTS);
  assert.equal(explicitAdHoc.officialComplete, false);
  assert.equal(explicitAdHoc.provisional, true);
});

test('category completeness requires every selected parallel form while coverage uses unique facets', () => {
  const run = { tests: { 'coding-01-base': entry({ objective: [10, 10] }) } };
  const summary = scoring.categorySummary(
    run,
    'coding',
    'combined',
    ['coding-01-base', 'coding-01b-parallel'],
    TESTS,
  );
  assert.equal(summary.attemptedFacets, 1);
  assert.equal(summary.expectedFacets, 1);
  assert.equal(summary.coverage, 1);
  assert.equal(summary.completeForms, 1);
  assert.equal(summary.expectedForms, 2);
  assert.equal(summary.provisional, true);
});

test('out-of-range primary, reviewer, and adjudicator values never enter scoring', () => {
  const t = entry({ quality: 100, craft: 6, reasoning: -1 });
  t.reviews = {
    'sub-craft': { verdict: 'agree', score: 100, comment: 'invalid evidence' },
  };
  t.adjudications = {
    'sub-craft': { score: 100, adjudicatedBy: 'judge', adjudicatedOn: '2026-07-10', comment: 'invalid' },
  };
  const scores = scoring.sectionScores('coding-01-base', t, TESTS);
  assert.equal(scores.subjective, 6);
  assert.equal(scores.worklog, null);
  assert.equal(scoring.effectiveCriterionScore(t, 'sub-quality').score, null);
  assert.equal(scoring.effectiveCriterionScore(t, 'sub-craft').reviewer, null);
  assert.equal(scoring.effectiveCriterionScore(t, 'sub-craft').adjudicated, null);
});

test('suite coverage requires every criterion used by the selected view', () => {
  const partial = entry();
  delete partial.objective['obj-2'];
  const run = { tests: { 'coding-01-base': partial } };
  const objective = scoring.suiteSummary(run, 'objective', ['coding-01-base'], TESTS);
  const subjective = scoring.suiteSummary(run, 'subjective', ['coding-01-base'], TESTS);
  assert.equal(objective.score, 10);
  assert.equal(objective.scoredTests, 0);
  assert.equal(objective.officialComplete, false);
  assert.equal(subjective.scoredTests, 1);
  assert.equal(subjective.officialComplete, true);
});
