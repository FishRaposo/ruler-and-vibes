(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BENCH_SCORING = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DEFAULT_WEIGHTS = { objective: 0.5, subjective: 0.5 };
  const RUNS_TARGET = 3;

  function mean(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  }

  function median(values) {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function validScore(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10;
  }

  function facetId(testId) {
    const match = String(testId).match(/^([a-z0-9]+-\d{2})[a-z]?-/);
    return match ? match[1] : String(testId);
  }

  function effectiveCriterionScore(testEntry, criterionId) {
    const primaryValue = testEntry?.subjective?.[criterionId];
    const primary = validScore(primaryValue) ? primaryValue : null;
    const review = testEntry?.reviews?.[criterionId];
    const reviewer = validScore(review?.score) ? review.score : null;
    const adjudication = testEntry?.adjudications?.[criterionId];
    const adjudicated = validScore(adjudication?.score) ? adjudication.score : null;

    if (adjudicated !== null) {
      return { score: adjudicated, primary, reviewer, adjudicated, disputed: false, status: 'adjudicated' };
    }
    if (review?.verdict === 'disagree') {
      return { score: primary, primary, reviewer, adjudicated: null, disputed: true, status: 'disputed' };
    }
    return {
      score: primary,
      primary,
      reviewer,
      adjudicated: null,
      disputed: false,
      status: review?.verdict === 'agree' && primary !== null ? 'corroborated' : 'single',
    };
  }

  function reviewStatus(subject, suiteIds, testsConfig) {
    if (subject?.tests && typeof subject.tests === 'object') {
      const ids = Array.isArray(suiteIds) ? suiteIds : Object.keys(subject.tests);
      const entries = ids.map((testId) => subject.tests[testId])
        .filter((entry) => entry && entry.integrity !== 'invalidated');
      if (!entries.length) return 'single';
      const statuses = entries.map((entry) => reviewStatus(entry));
      if (statuses.includes('disputed')) return 'disputed';
      const reviewed = statuses.filter((status) => status !== 'single').length;
      if (!reviewed) return 'single';
      if (statuses.includes('adjudicated')) return 'adjudicated';
      const coverageComplete = ids.length > 0 && ids.every((testId) => {
        const entry = subject.tests[testId];
        if (!entry || entry.integrity === 'invalidated') return false;
        return testsConfig ? viewComplete(testId, entry, 'combined', testsConfig) : true;
      });
      if (reviewed < entries.length || !coverageComplete) return 'partially-reviewed';
      return 'corroborated';
    }
    const testEntry = subject;
    const reviews = testEntry?.reviews;
    if (!reviews || !Object.keys(reviews).length) return 'single';
    if (Object.keys(reviews).some((criterionId) =>
      !validScore(testEntry?.subjective?.[criterionId]))) return 'single';
    const disagreements = Object.entries(reviews).filter(([, review]) => review?.verdict === 'disagree');
    if (!disagreements.length) return 'corroborated';
    const unresolved = disagreements.some(([criterionId]) =>
      !validScore(testEntry?.adjudications?.[criterionId]?.score));
    return unresolved ? 'disputed' : 'adjudicated';
  }

  function sectionScores(testId, testEntry, testsConfig) {
    const config = testsConfig?.[testId];
    if (!config || !testEntry || testEntry.integrity === 'invalidated') {
      return {
        objective: null,
        subjective: null,
        worklog: null,
        abilityDisputed: false,
        worklogDisputed: false,
      };
    }

    const objectiveValues = (config.objective || [])
      .map(([criterionId]) => testEntry.objective?.[criterionId])
      .filter((value) => value === 0 || value === 10);

    let subjectiveWeight = 0;
    let subjectiveTotal = 0;
    let abilityDisputed = false;
    let worklog = null;
    let worklogDisputed = false;

    for (const [criterionId, , weight] of config.subjective || []) {
      const effective = effectiveCriterionScore(testEntry, criterionId);
      if (criterionId === 'sub-reasoning') {
        worklog = effective.score;
        worklogDisputed = effective.disputed;
        continue;
      }
      if (typeof effective.score === 'number') {
        if (typeof weight !== 'number') continue;
        subjectiveTotal += effective.score * weight;
        subjectiveWeight += weight;
      }
      if (effective.disputed) abilityDisputed = true;
    }

    return {
      objective: mean(objectiveValues),
      subjective: subjectiveWeight ? subjectiveTotal / subjectiveWeight : null,
      worklog,
      abilityDisputed,
      worklogDisputed,
    };
  }

  function testScore(testId, testEntry, view, testsConfig) {
    if (!testEntry || testEntry.integrity === 'invalidated') return null;
    const scores = sectionScores(testId, testEntry, testsConfig);
    if (view === 'objective') return scores.objective;
    if (view === 'subjective') return scores.subjective;
    if (view === 'worklog') return scores.worklog;
    if (scores.objective === null) return scores.subjective;
    if (scores.subjective === null) return scores.objective;
    const weights = testsConfig?.[testId]?.weights || DEFAULT_WEIGHTS;
    return weights.objective * scores.objective + weights.subjective * scores.subjective;
  }

  function viewComplete(testId, testEntry, view, testsConfig) {
    const config = testsConfig?.[testId];
    if (!config || !testEntry || testEntry.integrity === 'invalidated') return false;
    const objectiveComplete = (config.objective || []).every(([criterionId]) => {
      const value = testEntry.objective?.[criterionId];
      return value === 0 || value === 10;
    });
    const abilityCriteria = (config.subjective || []).filter(([criterionId]) => criterionId !== 'sub-reasoning');
    const subjectiveComplete = abilityCriteria.every(([criterionId]) =>
      typeof effectiveCriterionScore(testEntry, criterionId).score === 'number');
    const worklogCriterion = (config.subjective || []).find(([criterionId]) => criterionId === 'sub-reasoning');
    const worklogComplete = !worklogCriterion
      || typeof effectiveCriterionScore(testEntry, worklogCriterion[0]).score === 'number';
    if (view === 'objective') return objectiveComplete;
    if (view === 'subjective') return subjectiveComplete;
    if (view === 'worklog') return worklogComplete;
    return objectiveComplete && subjectiveComplete;
  }

  function allowedIds(run, suiteIds, testsConfig) {
    if (Array.isArray(suiteIds)) return suiteIds.filter((testId) => testsConfig?.[testId]);
    if (suiteIds === null) return Object.keys(testsConfig || {});
    return Object.keys(run?.tests || {}).filter((testId) => testsConfig?.[testId]);
  }

  function categorySummary(run, category, view, suiteIds, testsConfig) {
    const expectedIds = allowedIds(run, suiteIds, testsConfig)
      .filter((testId) => testsConfig[testId].category === category);
    const expectedFacets = new Set(expectedIds.map(facetId));
    const byFacet = new Map();
    let formCount = 0;
    let completeForms = 0;
    let invalidated = 0;
    let disputed = false;

    for (const testId of expectedIds) {
      const entry = run?.tests?.[testId];
      if (!entry) continue;
      if (entry.integrity === 'invalidated') {
        invalidated++;
        continue;
      }
      const score = testScore(testId, entry, view, testsConfig);
      if (score === null) continue;
      formCount++;
      if (viewComplete(testId, entry, view, testsConfig)) completeForms++;
      const key = facetId(testId);
      if (!byFacet.has(key)) byFacet.set(key, []);
      byFacet.get(key).push(score);
      const sections = sectionScores(testId, entry, testsConfig);
      if ((view === 'worklog' && sections.worklogDisputed)
        || (['combined', 'subjective'].includes(view) && sections.abilityDisputed)) disputed = true;
    }

    const facetScores = [...byFacet.values()].map(median).filter((value) => value !== null);
    const attemptedFacets = facetScores.length;
    const expectedFacetCount = expectedFacets.size;
    return {
      score: mean(facetScores),
      attemptedFacets,
      expectedFacets: expectedFacetCount,
      coverage: expectedFacetCount ? attemptedFacets / expectedFacetCount : null,
      formCount,
      completeForms,
      expectedForms: expectedIds.length,
      facetsAtTarget: [...byFacet.values()].filter((values) => values.length >= RUNS_TARGET).length,
      range: facetScores.length >= 2 ? [Math.min(...facetScores), Math.max(...facetScores)] : null,
      invalidated,
      disputed,
      provisional: expectedFacetCount === 0 || attemptedFacets < expectedFacetCount
        || completeForms < expectedIds.length || invalidated > 0 || disputed,
    };
  }

  function domainSummary(run, categories, view, suiteIds, testsConfig) {
    const allCategorySummaries = (categories || [])
      .map((category) => categorySummary(run, category, view, suiteIds, testsConfig));
    const categorySummaries = allCategorySummaries.filter((summary) => summary.score !== null);
    const expectedCategories = allCategorySummaries
      .filter((summary) => summary.expectedFacets > 0).length;
    return {
      score: mean(categorySummaries.map((summary) => summary.score)),
      categoryCount: categorySummaries.length,
      expectedCategories,
      coverage: expectedCategories ? categorySummaries.length / expectedCategories : null,
      provisional: categorySummaries.length === 0
        || allCategorySummaries.some((summary) => summary.expectedFacets > 0 && summary.provisional),
      disputed: allCategorySummaries.some((summary) => summary.disputed),
    };
  }

  function suiteSummary(run, view, suiteIds, testsConfig) {
    const expectedIds = allowedIds(run, suiteIds, testsConfig);
    const categories = [...new Set(expectedIds.map((testId) => testsConfig[testId].category))];
    const categorySummaries = categories
      .map((category) => categorySummary(run, category, view, expectedIds, testsConfig))
      .filter((summary) => summary.score !== null);
    let scoredTests = 0;
    let invalidated = 0;
    let disputed = false;
    for (const testId of expectedIds) {
      const entry = run?.tests?.[testId];
      if (entry?.integrity === 'invalidated') {
        invalidated++;
        continue;
      }
      if (viewComplete(testId, entry, view, testsConfig)) scoredTests++;
      if (entry) {
        const sections = sectionScores(testId, entry, testsConfig);
        if ((view === 'worklog' && sections.worklogDisputed)
          || (['combined', 'subjective'].includes(view) && sections.abilityDisputed)) disputed = true;
      }
    }
    const expectedTests = expectedIds.length;
    const coverage = expectedTests ? scoredTests / expectedTests : null;
    const adHoc = suiteIds === undefined || String(run?.suite || '').toLowerCase() === 'ad-hoc';
    const coverageComplete = expectedTests > 0 && scoredTests === expectedTests && invalidated === 0;
    const officialComplete = !adHoc && coverageComplete;
    return {
      score: mean(categorySummaries.map((summary) => summary.score)),
      categoryCount: categorySummaries.length,
      expectedCategories: categories.length,
      scoredTests,
      expectedTests,
      coverage,
      coverageComplete,
      officialComplete,
      invalidated,
      disputed,
      provisional: !officialComplete || disputed,
    };
  }

  return {
    RUNS_TARGET,
    facetId,
    reviewStatus,
    effectiveCriterionScore,
    sectionScores,
    testScore,
    categorySummary,
    domainSummary,
    suiteSummary,
  };
});
