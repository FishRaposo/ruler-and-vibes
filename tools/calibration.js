'use strict';

const scoring = require('../report/scoring.js');

const THRESHOLDS = Object.freeze({
  minimumRuns: 5,
  ceilingRate: 0.8,
  ceilingScore: 9,
  floorRate: 0.8,
  floorScore: 3,
  lowStandardDeviation: 0.75,
  parallelGap: 1.5,
  parallelModels: 3,
  lowAlpha: 0.667,
  highDisagreementRate: 0.2,
});

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function sampleStandardDeviation(values) {
  if (values.length < 2) return 0;
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1));
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function correlation(xs, ys) {
  if (xs.length < 3 || xs.length !== ys.length) return null;
  const mx = mean(xs);
  const my = mean(ys);
  let numerator = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i++) {
    numerator += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return dx && dy ? numerator / Math.sqrt(dx * dy) : null;
}

function krippendorffAlpha(primary, reviewer) {
  const pairs = [];
  for (let index = 0; index < primary.length; index++) {
    if (typeof primary[index] === 'number' && typeof reviewer[index] === 'number') {
      pairs.push([primary[index], reviewer[index]]);
    }
  }
  if (pairs.length < 2) return null;
  const observed = mean(pairs.map(([left, right]) => (left - right) ** 2));
  const pooled = pairs.flat();
  let expectedTotal = 0;
  let comparisons = 0;
  for (let i = 0; i < pooled.length; i++) {
    for (let j = i + 1; j < pooled.length; j++) {
      expectedTotal += (pooled[i] - pooled[j]) ** 2;
      comparisons++;
    }
  }
  const expected = comparisons ? expectedTotal / comparisons : 0;
  return expected ? 1 - observed / expected : null;
}

function expectedIds(config, tests, suite) {
  if (suite === 'full') return Object.keys(tests);
  const ids = config.suites?.[suite];
  if (!Array.isArray(ids)) throw new Error(`Unknown suite ${suite}`);
  return ids;
}

function itemTotalCorrelation(runEntries, testId, ids, tests) {
  const itemScores = [];
  const otherScores = [];
  for (const run of runEntries) {
    const item = scoring.testScore(testId, run.tests?.[testId], 'combined', tests);
    const others = ids
      .filter((id) => id !== testId)
      .map((id) => scoring.testScore(id, run.tests?.[id], 'combined', tests))
      .filter((value) => typeof value === 'number');
    if (typeof item === 'number' && others.length) {
      itemScores.push(item);
      otherScores.push(mean(others));
    }
  }
  return correlation(itemScores, otherScores);
}

function analyzeCalibration(data, config, tests, options = {}) {
  const suite = options.suite || config.defaultSuite || 'core';
  const ids = expectedIds(config, tests, suite);
  const requested = options.runs ? new Set(options.runs) : null;
  const runs = Object.entries(data.runs || {})
    .filter(([id]) => !requested || requested.has(id))
    .map(([id, run]) => ({ id, ...run }))
    .filter((run) => ids.some((testId) => {
      const entry = run.tests?.[testId];
      return entry?.integrity !== 'invalidated'
        && typeof scoring.testScore(testId, entry, 'combined', tests) === 'number';
    }));
  const sufficientSample = runs.length >= THRESHOLDS.minimumRuns;
  const coverage = runs.map((run) => {
    const summary = scoring.suiteSummary(run, 'combined', ids, tests);
    return {
      runId: run.id,
      scoredTests: summary.scoredTests,
      expectedTests: summary.expectedTests,
      coverage: summary.coverage,
      officialComplete: summary.officialComplete,
    };
  });

  const items = ids.map((testId) => {
    const scores = [];
    let objectivePasses = 0;
    let objectiveChecks = 0;
    for (const run of runs) {
      const entry = run.tests?.[testId];
      if (entry?.integrity === 'invalidated') continue;
      const score = scoring.testScore(testId, entry, 'combined', tests);
      if (typeof score === 'number') scores.push(score);
      for (const value of Object.values(entry?.objective || {})) {
        if (value === 0 || value === 10) {
          objectiveChecks++;
          if (value === 10) objectivePasses++;
        }
      }
    }
    const ceilingRate = scores.length
      ? scores.filter((value) => value >= THRESHOLDS.ceilingScore).length / scores.length : null;
    const floorRate = scores.length
      ? scores.filter((value) => value <= THRESHOLDS.floorScore).length / scores.length : null;
    const ceiling = sufficientSample && scores.length >= THRESHOLDS.minimumRuns
      && ceilingRate >= THRESHOLDS.ceilingRate;
    const floor = sufficientSample && scores.length >= THRESHOLDS.minimumRuns
      && floorRate >= THRESHOLDS.floorRate;
    const sd = sampleStandardDeviation(scores);
    const lowDiscrimination = sufficientSample && scores.length >= THRESHOLDS.minimumRuns
      && sd < THRESHOLDS.lowStandardDeviation;
    return {
      testId,
      runs: scores.length,
      objectivePassRate: objectiveChecks ? objectivePasses / objectiveChecks : null,
      mean: mean(scores),
      standardDeviation: scores.length ? sd : null,
      range: scores.length ? [Math.min(...scores), Math.max(...scores)] : null,
      ceilingRate,
      floorRate,
      ceiling,
      floor,
      lowDiscrimination,
      correctedItemTotalCorrelation: sufficientSample ? itemTotalCorrelation(runs, testId, ids, tests) : null,
      recommendation: !sufficientSample || scores.length < THRESHOLDS.minimumRuns || floor
        ? 'review' : ceiling || lowDiscrimination ? 'harden' : 'keep',
    };
  });

  const categoryIds = [...new Set(ids.map((testId) => tests[testId]?.category).filter(Boolean))];
  const categories = categoryIds.map((category) => {
    const values = runs
      .map((run) => scoring.categorySummary(run, category, 'combined', ids, tests).score)
      .filter((value) => typeof value === 'number');
    return {
      category,
      runs: values.length,
      mean: mean(values),
      standardDeviation: values.length ? sampleStandardDeviation(values) : null,
      range: values.length ? [Math.min(...values), Math.max(...values)] : null,
    };
  });

  const domains = (config.domains || []).map((domain) => {
    const values = runs
      .map((run) => scoring.domainSummary(run, domain.categories, 'combined', ids, tests).score)
      .filter((value) => typeof value === 'number');
    return {
      domain: domain.id,
      label: domain.label,
      runs: values.length,
      mean: mean(values),
      standardDeviation: values.length ? sampleStandardDeviation(values) : null,
      range: values.length ? [Math.min(...values), Math.max(...values)] : null,
    };
  });
  const categoryMeans = categories.map((entry) => entry.mean).filter((value) => typeof value === 'number');
  const domainMeans = domains.map((entry) => entry.mean).filter((value) => typeof value === 'number');
  const compression = {
    categoryMeanRange: categoryMeans.length ? [Math.min(...categoryMeans), Math.max(...categoryMeans)] : null,
    categoryMeanStandardDeviation: categoryMeans.length ? sampleStandardDeviation(categoryMeans) : null,
    domainMeanRange: domainMeans.length ? [Math.min(...domainMeans), Math.max(...domainMeans)] : null,
    domainMeanStandardDeviation: domainMeans.length ? sampleStandardDeviation(domainMeans) : null,
  };

  const facets = new Map();
  for (const testId of ids) {
    const facet = scoring.facetId(testId);
    if (!facets.has(facet)) facets.set(facet, []);
    facets.get(facet).push(testId);
  }
  const parallel = [];
  for (const [facet, formIds] of facets) {
    if (formIds.length < 2) continue;
    const gaps = [];
    const models = new Set();
    for (const run of runs) {
      const values = formIds
        .map((testId) => scoring.testScore(testId, run.tests?.[testId], 'combined', tests))
        .filter((value) => typeof value === 'number');
      if (values.length >= 2) {
        gaps.push(Math.max(...values) - Math.min(...values));
        models.add(run.model || run.id);
      }
    }
    if (gaps.length) {
      const gap = median(gaps);
      parallel.push({
        facet,
        models: models.size,
        medianGap: gap,
        drift: sufficientSample && models.size >= THRESHOLDS.parallelModels && gap > THRESHOLDS.parallelGap,
      });
    }
  }

  const judgePrimary = [];
  const judgeReviewer = [];
  let disagreements = 0;
  let adjudicated = 0;
  for (const run of runs) {
    for (const testId of ids) {
      const entry = run.tests?.[testId];
      if (entry?.integrity === 'invalidated') continue;
      for (const [criterionId, review] of Object.entries(entry?.reviews || {})) {
        const primary = entry.subjective?.[criterionId];
        const reviewer = review.score;
        if (typeof primary !== 'number' || typeof reviewer !== 'number') continue;
        judgePrimary.push(primary);
        judgeReviewer.push(reviewer);
        if (review.verdict === 'disagree') {
          disagreements++;
          if (typeof entry.adjudications?.[criterionId]?.score === 'number') adjudicated++;
        }
      }
    }
  }
  const reviewedCriteria = judgePrimary.length;
  const agreementRate = reviewedCriteria ? (reviewedCriteria - disagreements) / reviewedCriteria : null;
  const disagreementRate = reviewedCriteria ? disagreements / reviewedCriteria : null;
  const alpha = krippendorffAlpha(judgePrimary, judgeReviewer);

  const wallTimes = runs.map((run) => run.wall_time_min).filter((value) => typeof value === 'number');
  const costs = runs.map((run) => run.approx_cost_usd).filter((value) => typeof value === 'number');

  return {
    generatedOn: new Date().toISOString().slice(0, 10),
    suite,
    comparableRuns: runs.length,
    expectedTests: ids.length,
    coverage,
    sufficientSample,
    thresholds: THRESHOLDS,
    items,
    categories,
    domains,
    compression,
    parallel,
    judges: {
      reviewedCriteria,
      disagreements,
      agreementRate,
      disagreementRate,
      meanAbsoluteDifference: reviewedCriteria
        ? mean(judgePrimary.map((value, index) => Math.abs(value - judgeReviewer[index]))) : null,
      krippendorffAlpha: alpha,
      adjudicationRate: disagreements ? adjudicated / disagreements : null,
      unstable: sufficientSample && reviewedCriteria >= THRESHOLDS.minimumRuns
        && ((alpha !== null && alpha < THRESHOLDS.lowAlpha)
          || disagreementRate > THRESHOLDS.highDisagreementRate),
    },
    practical: {
      meanWallTimeMin: mean(wallTimes),
      meanApproxCostUsd: mean(costs),
    },
  };
}

function number(value, digits = 2) {
  return typeof value === 'number' ? value.toFixed(digits) : 'n/a';
}

function rangeLabel(range) {
  return Array.isArray(range) ? `${number(range[0])}-${number(range[1])}` : 'n/a';
}

function percentLabel(value) {
  return typeof value === 'number' ? `${number(value * 100, 1)}%` : 'n/a';
}

function formatCalibration(report, format = 'text') {
  if (format === 'json') return JSON.stringify(report, null, 2) + '\n';
  const insufficient = !report.sufficientSample
    ? `Insufficient comparable runs: ${report.comparableRuns}/${report.thresholds.minimumRuns}.` : null;
  const meanCoverage = mean(report.coverage.map((entry) => entry.coverage));
  const coverageLabel = meanCoverage === null ? 'n/a' : `${number(meanCoverage * 100, 1)}%`;
  if (format === 'markdown') {
    const lines = [
      '# Ruler & Vibes calibration',
      '',
      `- Suite: **${report.suite}**`,
      `- Comparable runs: **${report.comparableRuns}**`,
      `- Expected tests: **${report.expectedTests}**`,
      `- Mean coverage: **${coverageLabel}**`,
      `- Category compression: **range ${rangeLabel(report.compression.categoryMeanRange)}, SD ${number(report.compression.categoryMeanStandardDeviation)}**`,
      `- Domain compression: **range ${rangeLabel(report.compression.domainMeanRange)}, SD ${number(report.compression.domainMeanStandardDeviation)}**`,
      '',
    ];
    if (insufficient) lines.push(`> ${insufficient}`, '');
    lines.push('| Item | Runs | Obj pass | Mean | SD | Range | Ceiling | Floor | Item-total | Recommendation |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|---|');
    for (const item of report.items) {
      lines.push(`| ${item.testId} | ${item.runs} | ${percentLabel(item.objectivePassRate)} | ${number(item.mean)} | ${number(item.standardDeviation)} | ${rangeLabel(item.range)} | ${percentLabel(item.ceilingRate)} | ${percentLabel(item.floorRate)} | ${number(item.correctedItemTotalCorrelation)} | ${item.recommendation} |`);
    }
    lines.push('', '## Parallel forms', '');
    if (report.parallel.length) {
      lines.push('| Facet | Models | Median gap | Drift |', '|---|---:|---:|---|');
      for (const entry of report.parallel) lines.push(`| ${entry.facet} | ${entry.models} | ${number(entry.medianGap)} | ${entry.drift ? 'yes' : 'no'} |`);
    } else lines.push('No comparable paired forms.');
    lines.push('', '## Judge reliability', '',
      `- Reviewed criteria: **${report.judges.reviewedCriteria}**`,
      `- Agreement: **${percentLabel(report.judges.agreementRate)}**`,
      `- Mean absolute difference: **${number(report.judges.meanAbsoluteDifference)}**`,
      `- Krippendorff alpha: **${number(report.judges.krippendorffAlpha)}**`,
      `- Disagreement: **${percentLabel(report.judges.disagreementRate)}**`,
      `- Adjudication: **${percentLabel(report.judges.adjudicationRate)}**`,
      '', '## Practical metadata', '',
      `- Mean wall time: **${number(report.practical.meanWallTimeMin)} min**`,
      `- Mean approximate cost: **${number(report.practical.meanApproxCostUsd)} USD**`);
    return lines.join('\n') + '\n';
  }
  const lines = [
    'Ruler & Vibes calibration',
    `suite: ${report.suite}`,
    `comparable runs: ${report.comparableRuns}`,
    `expected tests: ${report.expectedTests}`,
    `mean coverage: ${coverageLabel}`,
    `category compression: range=${rangeLabel(report.compression.categoryMeanRange)} sd=${number(report.compression.categoryMeanStandardDeviation)}`,
    `domain compression: range=${rangeLabel(report.compression.domainMeanRange)} sd=${number(report.compression.domainMeanStandardDeviation)}`,
  ];
  if (insufficient) lines.push(insufficient);
  for (const item of report.items) {
    lines.push(`${item.testId}: n=${item.runs} objective_pass=${percentLabel(item.objectivePassRate)} mean=${number(item.mean)} sd=${number(item.standardDeviation)} range=${rangeLabel(item.range)} ceiling=${percentLabel(item.ceilingRate)} floor=${percentLabel(item.floorRate)} item_total=${number(item.correctedItemTotalCorrelation)} recommendation=${item.recommendation}`);
  }
  lines.push(`parallel forms: ${report.parallel.length ? report.parallel.map((entry) => `${entry.facet} models=${entry.models} median_gap=${number(entry.medianGap)} drift=${entry.drift}`).join('; ') : 'none'}`);
  lines.push(`judge agreement: ${percentLabel(report.judges.agreementRate)} reviewed=${report.judges.reviewedCriteria}`);
  lines.push(`judge mean absolute difference: ${number(report.judges.meanAbsoluteDifference)}`);
  lines.push(`judge Krippendorff alpha: ${number(report.judges.krippendorffAlpha)}`);
  lines.push(`judge disagreement: ${percentLabel(report.judges.disagreementRate)}`);
  lines.push(`judge adjudication: ${percentLabel(report.judges.adjudicationRate)}`);
  lines.push(`mean wall time: ${number(report.practical.meanWallTimeMin)} min`);
  lines.push(`mean approximate cost: ${number(report.practical.meanApproxCostUsd)} USD`);
  return lines.join('\n') + '\n';
}

function parseArgs(args) {
  const result = { suite: 'core', runs: null, format: 'text', out: null };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--suite') result.suite = args[++index];
    else if (arg === '--format') result.format = args[++index];
    else if (arg === '--out') result.out = args[++index];
    else if (arg === '--runs') {
      result.runs = [];
      while (args[index + 1] && !args[index + 1].startsWith('--')) result.runs.push(args[++index]);
    } else throw new Error(`Unknown argument ${arg}`);
  }
  if (!['text', 'json', 'markdown'].includes(result.format)) throw new Error(`Unknown format ${result.format}`);
  return result;
}

module.exports = {
  THRESHOLDS,
  analyzeCalibration,
  formatCalibration,
  parseArgs,
  krippendorffAlpha,
};
