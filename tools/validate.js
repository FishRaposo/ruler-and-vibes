#!/usr/bin/env node
// Benchmark data validator for the Ruler & Vibes kit.
// Run from the repo root:
//   node tools/validate.js
//   node tools/validate.js --strict   (treats warnings as errors)
//
// Checks structural integrity, boilerplate detection, coverage gaps,
// score variance, and orphan file hygiene.
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const strict = process.argv.includes('--strict');
const issues = [];   // errors (exit 1)
const warnings = []; // warnings (exit 0 unless --strict)

// =========== helpers ===========
function stddev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / (arr.length - 1));
}

// Known boilerplate strings the judge should never emit.
const BOILERPLATE = {
  subQuality: 'Subjective quality reflects the number and seriousness of rubric misses in the deliverable.',
  subCraft: 'Subjective craft reflects clarity, structure, and whether the output is easy to verify.',
  subReasoning: 'Reasoning score reflects the specificity and completeness of REASONING.md; missing reasoning scores 0.',
  decisions: 'The runner describes applying the task constraints and checking edge cases or traps relevant to the deliverable.',
  limitations: 'Limitations are only those explicitly present in the runner\'s reasoning; no additional claims are inferred.',
};

// Core suite: 31 tests, one per category (from RUN.md).
const CORE = new Set([
  'coding-01-edge-cases', 'debug-01-root-cause', 'writing-02-registers',
  'planning-01-tradeoff', 'data-02-decision-metrics', 'precision-01-exact-format',
  'creative-02-css-scene', 'game-02-card-ruleset', 'business-02-pricing',
  'logic-02-wrenmarket-stalls', 'context-02-changelog-tally', 'research-02-conflict-brief',
  'judgment-02-policy-conflict-memo', 'security-02-decoy-triage', 'reverse-01-tangled-tag',
  'sql-01-join-cardinality', 'pat-01-ipv4-octet', 'cplx-01-loop-triangular',
  'extr-01-receipt-fields', 'edit-01-style-card', 'tom-01-sally-anne',
  'inj-01-ticket-summarizer-override', 'sched-01-earliest-finish-dag',
  'causal-01-garden-dag', 'audit-01-aquifer-recharge-calculation',
  'a11y-01-thornbury-signup', 'apidoc-01-paginate-reference', 'calib-01-triage-dossier',
  'story-01-absolute-vs-rate', 'txsyn-01-decision-reversal', 'uxcopy-01-quatrefoil-latch',
]);

// =========== parse rubrics ===========
// rubrics[testId] = { path, objIds: [...], subIds: [...] }
const rubrics = {};
for (const f of fs.readdirSync(path.join(REPO, 'rubrics'))) {
  if (!f.endsWith('.md')) continue;
  const txt = fs.readFileSync(path.join(REPO, 'rubrics', f), 'utf8');
  const testId = (txt.match(/^test:\s*(.+?)\s*$/m) || [])[1];
  if (!testId) { issues.push('RUBRIC ' + f + ' missing "test:" field'); continue; }

  const objIds = [], subIds = [];
  let inObj = false, inSub = false;
  for (const line of txt.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === 'objective:') { inObj = true; inSub = false; continue; }
    if (trimmed === 'subjective:') { inSub = true; inObj = false; continue; }
    // exit criteria section once we hit the frontmatter closing --- or a new top-level key
    if (trimmed === '---' && (inObj || inSub)) { inObj = false; inSub = false; continue; }
    if (inObj) {
      const m = line.match(/^\s*-?\s*id:\s*(\S+)/);
      if (m) objIds.push(m[1]);
    }
    if (inSub) {
      const m = line.match(/^\s*-?\s*id:\s*(\S+)/);
      if (m) subIds.push(m[1]);
    }
  }
  rubrics[testId] = { path: f, objIds, subIds };
}
console.log('validate: ' + Object.keys(rubrics).length + ' rubrics parsed');

// =========== parse TESTS block from index.html ===========
const htmlPath = path.join(REPO, 'report', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
let TESTS = {};
let testIdsInHTML = [];
const testsStart = html.indexOf('const TESTS={');
if (testsStart === -1) {
  issues.push('INDEX.HTML: cannot find const TESTS block');
} else {
  // Extract by brace-counting (block is too large for regex; contains }; in SVGs)
  let pos = testsStart + 'const TESTS='.length;
  let depth = 0;
  let inString = false, inComment = false, escape = false;
  for (; pos < html.length; pos++) {
    const ch = html[pos];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '/' && !inString && !inComment && html[pos + 1] === '/') { inComment = true; pos++; continue; }
    if (ch === '\n' && inComment) { inComment = false; continue; }
    if (ch === '"' && !inComment) { inString = !inString; continue; }
    if (inString || inComment) continue;
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { pos++; break; } }
  }
  if (depth === 0) {
    const block = html.slice(testsStart + 'const TESTS='.length, pos);
    try { TESTS = eval('(' + block + ')'); } catch (e) { issues.push('INDEX.HTML: TESTS block parse error — ' + e.message); }
    testIdsInHTML = Object.keys(TESTS);
  } else {
    issues.push('INDEX.HTML: unbalanced braces in TESTS block');
  }
}
console.log('validate: ' + testIdsInHTML.length + ' TESTS entries in index.html');

// =========== parse data.js ===========
let BENCH = { runs: {} };
let dataRaw;
try {
  const dataPath = path.join(REPO, 'report', 'data.js');
  dataRaw = fs.readFileSync(dataPath, 'utf8');
  const match = dataRaw.match(/window\.BENCH_DATA\s*=\s*([\s\S]*?);?\s*$/);
  if (match) BENCH = eval('(' + match[1] + ')');
  else issues.push('DATA.JS: cannot parse window.BENCH_DATA');
} catch (e) {
  issues.push('DATA.JS: syntax error — ' + e.message);
}

// =========== Check 1: Rubric ↔ TESTS alignment ===========
for (const id of Object.keys(rubrics)) {
  if (!TESTS[id]) {
    issues.push('ALIGN: rubric exists for "' + id + '" but no TESTS entry in index.html');
    continue;
  }
  const rb = rubrics[id];
  const t = TESTS[id];

  const tObjIds = (t.objective || []).map(e => e[0]);
  const tSubIds = (t.subjective || []).map(e => e[0]);

  const missingFromTESTS = rb.objIds.filter(x => !tObjIds.includes(x));
  const extraInTESTS = tObjIds.filter(x => !rb.objIds.includes(x));
  if (missingFromTESTS.length || extraInTESTS.length)
    issues.push('ALIGN: "' + id + '" objective mismatch — rubric has [' + rb.objIds.join(', ') +
      '], TESTS has [' + tObjIds.join(', ') + ']' + (missingFromTESTS.length ? ' (rubric ids missing from TESTS: ' + missingFromTESTS.join(', ') + ')' : '') + (extraInTESTS.length ? ' (TESTS ids not in rubric: ' + extraInTESTS.join(', ') + ')' : ''));

  const missingSub = rb.subIds.filter(x => !tSubIds.includes(x));
  const extraSub = tSubIds.filter(x => !rb.subIds.includes(x));
  if (missingSub.length || extraSub.length)
    issues.push('ALIGN: "' + id + '" subjective mismatch — rubric has [' + rb.subIds.join(', ') +
      '], TESTS has [' + tSubIds.join(', ') + ']' + (missingSub.length ? ' (rubric ids missing from TESTS: ' + missingSub.join(', ') + ')' : '') + (extraSub.length ? ' (TESTS ids not in rubric: ' + extraSub.join(', ') + ')' : ''));
}

for (const id of testIdsInHTML) {
  if (!rubrics[id])
    issues.push('ALIGN: TESTS entry for "' + id + '" has no matching rubric');
}

// =========== Check 2: data.js structural integrity ===========
function isSentinel(v) { return v === null || v === 'TODO'; }
const runIds = Object.keys(BENCH.runs || {});
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  if (!run.model) issues.push('STRUCT: run "' + rid + '" missing "model"');
  if (run.effort === undefined) issues.push('STRUCT: run "' + rid + '" missing "effort"');
  if (run.harness === undefined) issues.push('STRUCT: run "' + rid + '" missing "harness"');
  if (!run.date) issues.push('STRUCT: run "' + rid + '" missing "date"');
  if (run.judgedBy === undefined) issues.push('STRUCT: run "' + rid + '" missing "judgedBy"');
  if (run.judgedOn === undefined) issues.push('STRUCT: run "' + rid + '" missing "judgedOn"');
  if (!run.tests || typeof run.tests !== 'object')
    issues.push('STRUCT: run "' + rid + '" missing or invalid "tests"');

  for (const tid of Object.keys(run.tests || {})) {
    const t = run.tests[tid];
    if (t.integrity === 'invalidated') continue; // no scores expected

    if (!t.objective || typeof t.objective !== 'object')
      issues.push('STRUCT: ' + rid + '/' + tid + ' missing or invalid "objective"');
    if (!t.subjective || typeof t.subjective !== 'object')
      issues.push('STRUCT: ' + rid + '/' + tid + ' missing or invalid "subjective"');
    if (t.note === undefined)
      issues.push('STRUCT: ' + rid + '/' + tid + ' missing "note" field');
    if (t.comments === undefined || t.comments === null || typeof t.comments !== 'object')
      issues.push('STRUCT: ' + rid + '/' + tid + ' missing "comments"');
    if (t.reasoning === undefined || t.reasoning === null || typeof t.reasoning !== 'object')
      issues.push('STRUCT: ' + rid + '/' + tid + ' missing "reasoning"');
    if (!t.reasoning || !("approach" in t.reasoning) || !('decisions' in t.reasoning) || !('limitations' in t.reasoning))
      issues.push('STRUCT: ' + rid + '/' + tid + ' "reasoning" missing approach/decisions/limitations');

    // check criterion ids match rubric
    if (rubrics[tid] && t.objective) {
      const rb = rubrics[tid];
      const dataObjIds = Object.keys(t.objective);
      const missing = rb.objIds.filter(x => !dataObjIds.includes(x));
      const extra = dataObjIds.filter(x => !rb.objIds.includes(x));
      if (missing.length || extra.length)
        issues.push('STRUCT: ' + rid + '/' + tid + ' objective ids don\'t match rubric' +
          (missing.length ? ' (missing: ' + missing.join(', ') + ')' : '') +
          (extra.length ? ' (extra: ' + extra.join(', ') + ')' : ''));
    }
    if (rubrics[tid] && t.subjective) {
      const rb = rubrics[tid];
      const dataSubIds = Object.keys(t.subjective);
      const missing = rb.subIds.filter(x => !dataSubIds.includes(x));
      const extra = dataSubIds.filter(x => !rb.subIds.includes(x));
      if (missing.length || extra.length)
        issues.push('STRUCT: ' + rid + '/' + tid + ' subjective ids don\'t match rubric' +
          (missing.length ? ' (missing: ' + missing.join(', ') + ')' : '') +
          (extra.length ? ' (extra: ' + extra.join(', ') + ')' : ''));
    }
  }
}

// =========== Check 3: Boilerplate comments ===========
let boilerplateCount = 0;
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  for (const tid of Object.keys(run.tests || {})) {
    const t = run.tests[tid];
    const comments = t.comments || {};
    if (comments['sub-quality'] === BOILERPLATE.subQuality) {
      boilerplateCount++;
      warnings.push('BOILERPLATE: ' + rid + '/' + tid + ' sub-quality is generic template');
    }
    if (comments['sub-craft'] === BOILERPLATE.subCraft) {
      boilerplateCount++;
      warnings.push('BOILERPLATE: ' + rid + '/' + tid + ' sub-craft is generic template');
    }
    if (comments['sub-reasoning'] === BOILERPLATE.subReasoning) {
      boilerplateCount++;
      warnings.push('BOILERPLATE: ' + rid + '/' + tid + ' sub-reasoning is generic template');
    }
    if (t.reasoning && t.reasoning.decisions === BOILERPLATE.decisions) {
      boilerplateCount++;
      warnings.push('BOILERPLATE: ' + rid + '/' + tid + ' reasoning.decisions is generic template');
    }
    if (t.reasoning && t.reasoning.limitations === BOILERPLATE.limitations) {
      boilerplateCount++;
      warnings.push('BOILERPLATE: ' + rid + '/' + tid + ' reasoning.limitations is generic template');
    }
  }
}

// =========== Check 4: Raw markdown in reasoning.approach ===========
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  for (const tid of Object.keys(run.tests || {})) {
    const t = run.tests[tid];
    if (t.reasoning && t.reasoning.approach && t.reasoning.approach.startsWith('## Approach')) {
      warnings.push('RAW-MD: ' + rid + '/' + tid + ' reasoning.approach is raw markdown (starts with "## Approach") — should be a condensed summary');
    }
  }
}

// =========== Check 5: Coverage gaps ===========
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  const testIds = Object.keys(run.tests || {});
  const coreRun = testIds.filter(id => CORE.has(id));
  const coreMissing = [...CORE].filter(id => !testIds.includes(id));
  const nonCore = testIds.filter(id => !CORE.has(id));

  if (coreRun.length < 31) {
    warnings.push('COVERAGE: ' + rid + ' has ' + coreRun.length + '/31 Core tests' +
      (coreMissing.length > 0 && coreMissing.length <= 5 ? ' (missing: ' + coreMissing.join(', ') + ')' : '') +
      (coreMissing.length > 5 ? ' (' + coreMissing.length + ' missing)' : ''));
  }
  if (coreRun.length > 0 && nonCore.length === 0 && coreRun.length >= 31) {
    // Full Core but no Full suite — worth noting but not warning
    // (many evaluations are Core-only on purpose)
  }
  if (testIds.length === 0) {
    warnings.push('COVERAGE: ' + rid + ' has no tests');
  }
}

// =========== Check 6: Score variance ===========
const byModel = {};
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  const model = run.model || rid;
  if (!byModel[model]) byModel[model] = { subQuality: [], subCraft: [], subReasoning: [] };
  for (const tid of Object.keys(run.tests || {})) {
    const t = run.tests[tid];
    if (t.integrity === 'invalidated') continue;
    if (t.subjective) {
      if (typeof t.subjective['sub-quality'] === 'number') byModel[model].subQuality.push(t.subjective['sub-quality']);
      if (typeof t.subjective['sub-craft'] === 'number') byModel[model].subCraft.push(t.subjective['sub-craft']);
      if (typeof t.subjective['sub-reasoning'] === 'number') byModel[model].subReasoning.push(t.subjective['sub-reasoning']);
    }
  }
}
for (const [model, scores] of Object.entries(byModel)) {
  for (const [criterion, vals] of Object.entries(scores)) {
    if (vals.length >= 5) {
      const sd = stddev(vals);
      if (sd < 0.5)
        warnings.push('VARIANCE: ' + model + ' ' + criterion + ' stddev=' + sd.toFixed(2) +
          ' across ' + vals.length + ' tests — judge may not be differentiating (scores: [' + [...new Set(vals)].sort().join(', ') + '])');
    }
  }
}

// =========== Check 7: Orphan judgment files ===========
const judgmentsDir = path.join(REPO, 'report', 'judgments');
if (fs.existsSync(judgmentsDir)) {
  for (const rd of fs.readdirSync(judgmentsDir)) {
    const rdp = path.join(judgmentsDir, rd);
    if (!fs.statSync(rdp).isDirectory()) continue;
    if (!BENCH.runs || !BENCH.runs[rd]) {
      warnings.push('ORPHAN: judgment folder "' + rd + '" exists but no matching data.js run entry');
      continue;
    }
    for (const f of fs.readdirSync(rdp)) {
      if (!f.endsWith('.md')) continue;
      const tid = f.replace(/\.md$/, '');
      if (!BENCH.runs[rd].tests || !BENCH.runs[rd].tests[tid])
        warnings.push('ORPHAN: judgment file report/judgments/' + rd + '/' + f + ' has no matching data.js entry');
    }
  }
}

// Reverse: data.js entries without judgment files
for (const rid of runIds) {
  for (const tid of Object.keys(BENCH.runs[rid].tests || {})) {
    const jp = path.join(judgmentsDir, rid, tid + '.md');
    if (!fs.existsSync(jp))
      warnings.push('ORPHAN: data.js has ' + rid + '/' + tid + ' but no judgment file');
  }
}

// =========== Check 8: Soft flag audit ===========
let softFlagCount = 0;
for (const rid of runIds) {
  for (const tid of Object.keys(BENCH.runs[rid].tests || {})) {
    const t = BENCH.runs[rid].tests[tid];
    if (t.integrity === 'flagged' || t.integrity === 'invalidated') {
      softFlagCount++;
      if (t.integrity === 'flagged')
        warnings.push('FLAG: ' + rid + '/' + tid + ' soft-flagged' + (t.integrityNote ? ' — ' + t.integrityNote : ''));
      else
        issues.push('INVALIDATED: ' + rid + '/' + tid + (t.integrityNote ? ' — ' + t.integrityNote : ''));
    }
  }
}

// =========== Check 9: Duplicate comment text within a run ===========
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  const byCrit = { 'sub-quality': {}, 'sub-craft': {}, 'sub-reasoning': {} };
  for (const tid of Object.keys(run.tests || {})) {
    const comments = run.tests[tid].comments || {};
    for (const crit of Object.keys(byCrit)) {
      const text = comments[crit];
      if (text && text !== BOILERPLATE[crit === 'sub-quality' ? 'subQuality' : crit === 'sub-craft' ? 'subCraft' : 'subReasoning']) {
        if (!byCrit[crit][text]) byCrit[crit][text] = [];
        byCrit[crit][text].push(tid);
      }
    }
  }
  for (const [crit, groups] of Object.entries(byCrit)) {
    for (const [text, testIds] of Object.entries(groups)) {
      if (testIds.length > 1)
        warnings.push('DUP-COMMENT: ' + rid + ' ' + crit + ' identical across ' + testIds.length + ' tests: ' + testIds.slice(0, 4).join(', ') + (testIds.length > 4 ? ', ...' : ''));
    }
  }
}

// =========== Check 10: Review structure ===========
const REV_BOILERPLATE = {
  agree: 'Agree with',
  disagree: 'Disagree — I\'d give',
};
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  const hasReview = run.reviewedBy || run.reviewedOn;
  if (hasReview) {
    if (!run.reviewedBy) issues.push('REVIEW: ' + rid + ' missing "reviewedBy"');
    if (!run.reviewedOn) issues.push('REVIEW: ' + rid + ' missing "reviewedOn"');
  }
  for (const tid of Object.keys(run.tests || {})) {
    const t = run.tests[tid];
    if (t.integrity === 'invalidated') continue;
    const reviews = t.reviews;
    if (!reviews && hasReview) {
      warnings.push('REVIEW-GAP: ' + rid + '/' + tid + ' has run-level review but no test-level reviews');
      continue;
    }
    if (!reviews) continue;

    if (rubrics[tid]) {
      const rb = rubrics[tid];
      for (const subId of rb.subIds) {
        if (!reviews[subId]) {
          issues.push('REVIEW: ' + rid + '/' + tid + ' missing review for ' + subId);
          continue;
        }
        const rv = reviews[subId];
        if (!rv.verdict || (rv.verdict !== 'agree' && rv.verdict !== 'disagree'))
          issues.push('REVIEW: ' + rid + '/' + tid + '/' + subId + ' verdict must be "agree" or "disagree"');
        if (!rv.comment || typeof rv.comment !== 'string')
          issues.push('REVIEW: ' + rid + '/' + tid + '/' + subId + ' missing or empty "comment"');
        if (rv.verdict === 'disagree' && (rv.score === undefined || typeof rv.score !== 'number'))
          issues.push('REVIEW: ' + rid + '/' + tid + '/' + subId + ' disagree verdict must include numeric "score"');
        if (rv.verdict === 'agree' && rv.score !== undefined)
          warnings.push('REVIEW: ' + rid + '/' + tid + '/' + subId + ' agree verdict should not include "score" field');
      }
    }
  }
}

// =========== Check 11: Review boilerplate ===========
let reviewBoilerCount = 0;
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  for (const tid of Object.keys(run.tests || {})) {
    const reviews = run.tests[tid].reviews;
    if (!reviews) continue;
    for (const [subId, rv] of Object.entries(reviews)) {
      if (!rv.comment) continue;
      if (rv.comment.startsWith(REV_BOILERPLATE.agree) && rv.comment.length < 60) {
        reviewBoilerCount++;
        warnings.push('REVIEW-BOILER: ' + rid + '/' + tid + '/' + subId + ' review comment is generic starter');
      }
      if (rv.comment.startsWith(REV_BOILERPLATE.disagree) && rv.comment.length < 60) {
        reviewBoilerCount++;
        warnings.push('REVIEW-BOILER: ' + rid + '/' + tid + '/' + subId + ' review comment is generic starter');
      }
    }
  }
}

// =========== Check 12: Review orphan files ===========
const reviewsDir = path.join(REPO, 'report', 'reviews');
if (fs.existsSync(reviewsDir)) {
  for (const rd of fs.readdirSync(reviewsDir)) {
    const rdp = path.join(reviewsDir, rd);
    if (!fs.statSync(rdp).isDirectory()) continue;
    if (!BENCH.runs || !BENCH.runs[rd]) {
      warnings.push('REVIEW-ORPHAN: review folder "' + rd + '" exists but no matching data.js run entry');
      continue;
    }
    for (const f of fs.readdirSync(rdp)) {
      if (!f.endsWith('.md')) continue;
      const tid = f.replace(/\.md$/, '');
      if (!BENCH.runs[rd].tests || !BENCH.runs[rd].tests[tid])
        warnings.push('REVIEW-ORPHAN: review file report/reviews/' + rd + '/' + f + ' has no matching data.js entry');
    }
  }
}

// =========== Check 13: Review agreement stats ===========
let reviewAgreed = 0, reviewTotal = 0, reviewRunsWithData = 0;

// =========== Check 14: Sentinel detection (null/TODO from prebuild) ===========
let sentinelCount = 0;
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  for (const tid of Object.keys(run.tests || {})) {
    const t = run.tests[tid];
    if (t.integrity === 'invalidated') continue;
    for (const [k, v] of Object.entries(t.objective || {})) {
      if (v === null || v === 'TODO') { sentinelCount++; warnings.push('SENTINEL: ' + rid + '/' + tid + ' objective.' + k + ' is ' + (v === null ? 'null' : '"TODO"') + ' — needs judging'); }
    }
    for (const [k, v] of Object.entries(t.subjective || {})) {
      if (v === null || v === 'TODO') { sentinelCount++; warnings.push('SENTINEL: ' + rid + '/' + tid + ' subjective.' + k + ' is ' + (v === null ? 'null' : '"TODO"') + ' — needs judging'); }
    }
    for (const [k, v] of Object.entries(t.comments || {})) {
      if (v === null || v === 'TODO') { sentinelCount++; warnings.push('SENTINEL: ' + rid + '/' + tid + ' comments.' + k + ' is ' + (v === null ? 'null' : '"TODO"') + ' — needs judging'); }
    }
    if (t.reasoning && t.reasoning.approach === null) { sentinelCount++; warnings.push('SENTINEL: ' + rid + '/' + tid + ' reasoning.approach is null — needs judging'); }
    if (t.reasoning && t.reasoning.decisions === null) { sentinelCount++; warnings.push('SENTINEL: ' + rid + '/' + tid + ' reasoning.decisions is null — needs judging'); }
    if (t.reasoning && t.reasoning.limitations === null) { sentinelCount++; warnings.push('SENTINEL: ' + rid + '/' + tid + ' reasoning.limitations is null — needs judging'); }
    if (t.note === null || t.note === 'TODO') { sentinelCount++; warnings.push('SENTINEL: ' + rid + '/' + tid + ' note is ' + (t.note === null ? 'null' : '"TODO"') + ' — needs judging'); }
  }
}
for (const rid of runIds) {
  const run = BENCH.runs[rid];
  let runReviews = 0, runAgreed = 0;
  for (const tid of Object.keys(run.tests || {})) {
    const reviews = run.tests[tid].reviews;
    if (!reviews) continue;
    for (const rv of Object.values(reviews)) {
      runReviews++;
      if (rv.verdict === 'agree') runAgreed++;
    }
  }
  if (runReviews > 0) {
    reviewRunsWithData++;
    reviewTotal += runReviews;
    reviewAgreed += runAgreed;
  }
}
if (reviewTotal > 0) {
  console.log('review: ' + reviewRunsWithData + ' run(s) reviewed, '
    + reviewAgreed + '/' + reviewTotal + ' criteria agreed ('
    + (reviewAgreed / reviewTotal * 100).toFixed(1) + '%)');
}

// =========== output ===========
console.log('\nRESULTS: ' + issues.length + ' issue(s), ' + warnings.length + ' warning(s)');

if (issues.length) {
  console.log('\nISSUES:');
  for (const m of issues) console.log('  - ' + m);
}
if (warnings.length) {
  console.log('\nWARNINGS:');
  for (const m of warnings) console.log('  - ' + m);
}
if (boilerplateCount) console.log('\nBoilerplate comment hits: ' + boilerplateCount + ' (see WARNINGS)');
if (reviewBoilerCount) console.log('Review boilerplate hits: ' + reviewBoilerCount + ' (see WARNINGS)');
if (sentinelCount) console.log('Sentinel/null fields: ' + sentinelCount + ' — run prebuild.js to regenerate skeleton, then judge');

const exitCode = issues.length > 0 ? 1 : (strict && warnings.length > 0 ? 1 : 0);
if (exitCode === 0) console.log('\n✓ pass');
else console.log('\n✗ ' + (issues.length > 0 ? 'issues found' : 'warnings treated as errors (--strict)'));
process.exit(exitCode);
