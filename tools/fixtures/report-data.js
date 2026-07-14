window.BENCH_DATA = {
  schemaVersion: 2,
  updated: '2026-07-10',
  runs: {
    'fixture-a': {
      model: 'Model A', effort: 'high', harness: 'codex', date: '2026-07-10', suite: 'core',
      wall_time_min: 18, approx_cost_usd: 2.4, reviewedBy: 'reviewer-a', reviewedOn: '2026-07-10',
      tests: {
        'coding-01-edge-cases': {
          objective: { 'obj-1': 10, 'obj-2': 10, 'obj-3': 10, 'obj-4': 10 },
          subjective: { 'sub-quality': 9, 'sub-craft': 8, 'sub-reasoning': 7 },
          comments: { 'sub-quality': 'Clean merge implementation.', 'sub-craft': 'Readable names.', 'sub-reasoning': 'Specific trade-offs.' },
          note: 'Clean result.',
          reviews: {
            'sub-quality': { verdict: 'agree', score: 9, comment: 'The implementation is correct.' },
            'sub-craft': { verdict: 'agree', score: 8, comment: 'The naming is clear.' },
            'sub-reasoning': { verdict: 'agree', score: 7, comment: 'The worklog is specific.' },
          },
        },
        'debug-01-root-cause': {
          integrity: 'flagged',
          integrityNote: 'Transcript unavailable.',
          objective: { 'obj-1': 10, 'obj-2': 10, 'obj-3': 0, 'obj-4': 10 },
          subjective: { 'sub-quality': 8, 'sub-craft': 7, 'sub-reasoning': 8 },
          comments: { 'sub-quality': 'Missed one edge.', 'sub-craft': 'Clear report.', 'sub-reasoning': 'Useful worklog.' },
          note: 'One missed check.',
          reviews: {
            'sub-quality': { verdict: 'disagree', score: 5, comment: 'The missed edge is material.' },
            'sub-craft': { verdict: 'agree', score: 7, comment: 'The report is readable.' },
            'sub-reasoning': { verdict: 'agree', score: 8, comment: 'The worklog is specific.' },
          },
          adjudications: {
            'sub-quality': {
              score: 6,
              adjudicatedBy: 'adjudicator-a',
              adjudicatedOn: '2026-07-10',
              comment: 'The reviewer identified a real miss, but the main diagnosis remains correct.',
            },
          },
        },
      },
    },
    'fixture-b': {
      model: 'Model B', effort: 'medium', harness: 'cli', date: '2026-07-10', suite: 'core',
      tests: {
        'coding-01-edge-cases': {
          integrity: 'invalidated',
          integrityNote: 'Canary leaked into the deliverable.',
        },
        'debug-01-root-cause': {
          objective: { 'obj-1': 10, 'obj-2': 0, 'obj-3': 0, 'obj-4': 10 },
          subjective: { 'sub-quality': 6, 'sub-craft': 6, 'sub-reasoning': 5 },
          comments: { 'sub-quality': 'Partial diagnosis.', 'sub-craft': 'Understandable.', 'sub-reasoning': 'Thin limitations.' },
          note: 'Partial result.',
          reviews: {
            'sub-quality': { verdict: 'disagree', score: 3, comment: 'The root cause is not established.' },
            'sub-craft': { verdict: 'agree', score: 6, comment: 'The structure is serviceable.' },
            'sub-reasoning': { verdict: 'agree', score: 5, comment: 'The worklog supports the primary band.' },
          },
        },
      },
    },
    'fixture-single': {
      model: 'Model Single', effort: 'low', harness: 'local', date: '2026-07-10', suite: 'core', fixtureCase: 'single clean',
      tests: {
        'coding-01-edge-cases': {
          objective: { 'obj-1': 10, 'obj-2': 10, 'obj-3': 10, 'obj-4': 0 },
          subjective: { 'sub-quality': 7, 'sub-craft': 7, 'sub-reasoning': 6 },
          comments: { 'sub-quality': 'Mostly correct.', 'sub-craft': 'Clear implementation.', 'sub-reasoning': 'Adequate worklog.' },
          note: 'Primary judgment only.',
        },
      },
    },
    'fixture-partial-review': {
      model: 'Model Partial', effort: 'high', harness: 'local', date: '2026-07-10', suite: 'core', fixtureCase: 'partially-reviewed',
      tests: {
        'coding-01-edge-cases': {
          objective: { 'obj-1': 10, 'obj-2': 10, 'obj-3': 10, 'obj-4': 10 },
          subjective: { 'sub-quality': 8, 'sub-craft': 8, 'sub-reasoning': 7 },
          comments: { 'sub-quality': 'Correct.', 'sub-craft': 'Readable.', 'sub-reasoning': 'Specific.' },
          note: 'Reviewed test.',
          reviews: {
            'sub-quality': { verdict: 'agree', score: 8, comment: 'Within the same calibration band.' },
            'sub-craft': { verdict: 'agree', score: 8, comment: 'Within the same calibration band.' },
            'sub-reasoning': { verdict: 'agree', score: 7, comment: 'Within the same calibration band.' },
          },
        },
        'debug-01-root-cause': {
          objective: { 'obj-1': 10, 'obj-2': 10, 'obj-3': 10, 'obj-4': 10 },
          subjective: { 'sub-quality': 8, 'sub-craft': 7, 'sub-reasoning': 7 },
          comments: { 'sub-quality': 'Correct diagnosis.', 'sub-craft': 'Clear report.', 'sub-reasoning': 'Specific.' },
          note: 'Not yet reviewed.',
        },
      },
    },
    'fixture-corroborated': {
      model: 'Model Corroborated', effort: 'medium', harness: 'local', date: '2026-07-10', suite: 'core', fixtureCase: 'corroborated',
      tests: {
        'coding-01-edge-cases': {
          objective: { 'obj-1': 10, 'obj-2': 10, 'obj-3': 10, 'obj-4': 10 },
          subjective: { 'sub-quality': 9, 'sub-craft': 9, 'sub-reasoning': 8 },
          comments: { 'sub-quality': 'Correct.', 'sub-craft': 'Polished.', 'sub-reasoning': 'Specific.' },
          note: 'Fully corroborated fixture.',
          reviews: {
            'sub-quality': { verdict: 'agree', score: 9, comment: 'The evidence supports the primary band.' },
            'sub-craft': { verdict: 'agree', score: 9, comment: 'The evidence supports the primary band.' },
            'sub-reasoning': { verdict: 'agree', score: 8, comment: 'The evidence supports the primary band.' },
          },
        },
      },
    },
  },
};

// Keep the corroborated fixture honest: every required Core form is complete
// and independently reviewed. Generate repetitive fixture-only evidence from
// the already loaded canonical test metadata instead of duplicating 34 entries.
{
  const run = window.BENCH_DATA.runs['fixture-corroborated'];
  for (const testId of window.BENCH_CONFIG.suites.core) {
    if (run.tests[testId]) continue;
    const test = TESTS[testId];
    const objective = Object.fromEntries((test.objective || []).map(([criterionId]) => [criterionId, 10]));
    const subjective = Object.fromEntries((test.subjective || []).map(([criterionId]) => [criterionId, 8]));
    const reviews = Object.fromEntries((test.subjective || []).map(([criterionId]) => [criterionId, {
      verdict: 'agree',
      score: 8,
      comment: `Fixture review evidence for ${testId}/${criterionId}.`,
    }]));
    const comments = Object.fromEntries([
      ...(test.objective || []).map(([criterionId]) => [criterionId, `Fixture objective evidence for ${testId}/${criterionId}.`]),
      ...(test.subjective || []).map(([criterionId]) => [criterionId, `Fixture subjective evidence for ${testId}/${criterionId}.`]),
    ]);
    run.tests[testId] = {
      objective,
      subjective,
      reviews,
      comments,
      note: 'Complete corroborated browser fixture.',
      reasoning: {
        approach: 'Fixture approach.',
        decisions: 'Fixture decision.',
        limitations: 'Fixture limitation.',
      },
    };
  }
}
