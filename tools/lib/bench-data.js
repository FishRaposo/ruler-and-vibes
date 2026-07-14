'use strict';

const fs = require('node:fs');

const CURRENT_SCHEMA_VERSION = 2;

function extractDataLiteral(source) {
  const match = String(source).match(/window\.BENCH_DATA\s*=\s*([\s\S]*?);?\s*$/);
  if (!match) throw new Error('BENCH_DATA assignment not found');
  return match[1];
}

function migrateData(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('BENCH_DATA must be an object');
  }
  const data = JSON.parse(JSON.stringify(input || {}));
  const version = data.schemaVersion;
  if (version !== undefined && version !== CURRENT_SCHEMA_VERSION) {
    throw new Error(`Unsupported BENCH_DATA schemaVersion ${version}`);
  }
  data.schemaVersion = CURRENT_SCHEMA_VERSION;
  if (typeof data.updated !== 'string') data.updated = new Date().toISOString().slice(0, 10);
  if (data.runs === undefined) data.runs = {};
  else if (!data.runs || typeof data.runs !== 'object' || Array.isArray(data.runs)) {
    throw new Error('BENCH_DATA runs must be an object');
  }
  return data;
}

function parseDataSource(source) {
  let parsed;
  try {
    parsed = JSON.parse(extractDataLiteral(source));
  } catch (error) {
    throw new Error(`Could not parse BENCH_DATA: ${error.message}`);
  }
  return migrateData(parsed);
}

function loadDataFile(filePath) {
  return parseDataSource(fs.readFileSync(filePath, 'utf8'));
}

function validScore(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10;
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function resolveSuite(value, config, options = {}) {
  const suite = value === undefined || value === null || value === ''
    ? (config?.defaultSuite || 'core')
    : String(value).toLowerCase();
  if (suite === 'ad-hoc' && options.allowAdHoc !== false) return suite;
  if (!Object.prototype.hasOwnProperty.call(config?.suites || {}, suite)) {
    throw new Error(`Unknown suite ${suite}`);
  }
  return suite;
}

function initialRunMap(existingRuns, requestedRuns) {
  if (!Array.isArray(requestedRuns)) return {};
  return JSON.parse(JSON.stringify(existingRuns || {}));
}

function validateReviewAdjudication(label, testEntry, subjectiveIds) {
  const issues = [];
  const warnings = [];
  const known = new Set(subjectiveIds || []);
  const reviews = testEntry?.reviews || {};
  const adjudications = testEntry?.adjudications || {};

  for (const [criterionId, review] of Object.entries(reviews)) {
    const prefix = `${label}/${criterionId}`;
    if (!known.has(criterionId)) {
      issues.push(`${prefix} review references unknown subjective criterion`);
      continue;
    }
    if (!review || !['agree', 'disagree'].includes(review.verdict)) {
      issues.push(`${prefix} review verdict must be agree or disagree`);
      continue;
    }
    if (typeof review.comment !== 'string' || !review.comment.trim()) {
      issues.push(`${prefix} missing review comment`);
    }
    const primary = testEntry?.subjective?.[criterionId];
    if (!validScore(primary)) {
      issues.push(`${prefix} review requires a valid primary score from 0 to 10`);
    }
    if (!validScore(review.score)) {
      issues.push(`${prefix} review requires numeric score from 0 to 10`);
      continue;
    }
    if (review.verdict === 'agree') {
      if (validScore(primary) && Math.abs(primary - review.score) > 1) {
        issues.push(`${prefix} agree review score must be within 1 point of primary`);
      }
      continue;
    }
    if (validScore(primary) && Math.abs(primary - review.score) < 2) {
      issues.push(`${prefix} disagree score must differ by at least 2 from primary`);
    }
    if (!adjudications[criterionId]) warnings.push(`${prefix} unresolved review disagreement`);
  }

  for (const [criterionId, adjudication] of Object.entries(adjudications)) {
    const prefix = `${label}/${criterionId}`;
    if (!known.has(criterionId)) {
      issues.push(`${prefix} adjudication references unknown subjective criterion`);
      continue;
    }
    if (reviews[criterionId]?.verdict !== 'disagree') {
      issues.push(`${prefix} adjudication exists without a disagree review`);
    }
    if (!reviews[criterionId] && !validScore(testEntry?.subjective?.[criterionId])) {
      issues.push(`${prefix} adjudication requires a valid primary score from 0 to 10`);
    }
    if (!validScore(adjudication?.score)) issues.push(`${prefix} adjudication score must be 0 to 10`);
    if (typeof adjudication?.adjudicatedBy !== 'string' || !adjudication.adjudicatedBy.trim()) {
      issues.push(`${prefix} missing adjudicatedBy`);
    }
    if (!validDate(adjudication?.adjudicatedOn)) issues.push(`${prefix} invalid adjudicatedOn`);
    if (typeof adjudication?.comment !== 'string' || !adjudication.comment.trim()) {
      issues.push(`${prefix} missing adjudication comment`);
    }
  }

  return { issues, warnings };
}

module.exports = {
  CURRENT_SCHEMA_VERSION,
  extractDataLiteral,
  migrateData,
  parseDataSource,
  loadDataFile,
  validScore,
  initialRunMap,
  resolveSuite,
  validateReviewAdjudication,
};
