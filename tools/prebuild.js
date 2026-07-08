#!/usr/bin/env node
// Prebuild: generate a structurally complete data.js skeleton from rubrics,
// preserving any existing scores. The judge only fills in null/TODO fields.
// Run from the repo root:
//   node tools/prebuild.js
//   node tools/prebuild.js --runs claude-sonnet-5--unspecified--claude-code  (specific runs)
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const DATA_PATH = path.join(REPO, 'report', 'data.js');
const RESULTS_DIR = path.join(REPO, 'results');

// =========== parse rubrics ===========
// rubrics[testId] = { objIds: [id,...], subIds: [id,...], weights, canary }
const rubrics = {};
for (const f of fs.readdirSync(path.join(REPO, 'rubrics'))) {
  if (!f.endsWith('.md')) continue;
  const txt = fs.readFileSync(path.join(REPO, 'rubrics', f), 'utf8');
  const testId = (txt.match(/^test:\s*(.+?)\s*$/m) || [])[1];
  if (!testId) continue;

  const weightsMatch = txt.match(/^weights:\s*\n\s*objective:\s*([\d.]+)\s*\n\s*subjective:\s*([\d.]+)/m);
  const objIds = [], subIds = [];
  let inObj = false, inSub = false;
  for (const line of txt.split('\n')) {
    const t = line.trim();
    if (t === 'objective:') { inObj = true; inSub = false; continue; }
    if (t === 'subjective:') { inSub = true; inObj = false; continue; }
    if (t === '---' && (inObj || inSub)) { inObj = false; inSub = false; continue; }
    if (inObj) { const m = line.match(/^\s*-?\s*id:\s*(\S+)/); if (m) objIds.push(m[1]); }
    if (inSub) { const m = line.match(/^\s*-?\s*id:\s*(\S+)/); if (m) subIds.push(m[1]); }
  }
  rubrics[testId] = { objIds, subIds, weights: weightsMatch ? { objective: parseFloat(weightsMatch[1]), subjective: parseFloat(weightsMatch[2]) } : null };
}
console.log('prebuild: ' + Object.keys(rubrics).length + ' rubrics parsed');

// =========== load existing data.js ===========
let existing = { updated: new Date().toISOString().slice(0, 10), runs: {} };
try {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const m = raw.match(/window\.BENCH_DATA\s*=\s*([\s\S]*?);?\s*$/);
  if (m) try { existing = eval('(' + m[1] + ')'); } catch (e) { console.warn('prebuild: could not parse existing data.js — starting fresh'); }
} catch (e) { console.warn('prebuild: no existing data.js — starting fresh'); }

// =========== discover runs from results/ ===========
const argsRuns = process.argv.includes('--runs');
const requestedRuns = argsRuns ? process.argv.slice(process.argv.indexOf('--runs') + 1) : null;

const discoveredRuns = [];
if (fs.existsSync(RESULTS_DIR)) {
  for (const d of fs.readdirSync(RESULTS_DIR)) {
    const mp = path.join(RESULTS_DIR, d, 'meta.json');
    if (fs.existsSync(mp)) {
      try {
        const meta = JSON.parse(fs.readFileSync(mp, 'utf8'));
        discoveredRuns.push({ id: d, model: meta.model || null, effort: meta.effort || 'unspecified', harness: meta.harness || 'unspecified', date: meta.date || '' });
      } catch (e) { console.warn('prebuild: bad meta.json in ' + d); }
    }
  }
}

// Determine which runs to include
let includeRuns = discoveredRuns;
if (requestedRuns) {
  includeRuns = discoveredRuns.filter(r => requestedRuns.includes(r.id));
  console.log('prebuild: ' + includeRuns.length + '/' + discoveredRuns.length + ' runs selected');
} else {
  // Include discovered runs AND runs already in data.js
  const existingIds = new Set(Object.keys(existing.runs || {}));
  for (const dr of discoveredRuns) existingIds.add(dr.id);
  console.log('prebuild: ' + discoveredRuns.length + ' runs on disk, ' + existingIds.size + ' total (incl. data.js-only)');
}

// =========== build the test skeleton from rubrics ===========
function testSkeleton(testId) {
  const rb = rubrics[testId];
  if (!rb) return null;
  const objective = {};
  for (const id of rb.objIds) objective[id] = null;
  const subjective = {};
  for (const id of rb.subIds) subjective[id] = null;
  const comments = {};
  for (const id of rb.objIds) comments[id] = null;
  for (const id of rb.subIds) comments[id] = null;
  return { objective, subjective, note: null, comments, reasoning: { approach: null, decisions: null, limitations: null } };
}

// =========== merge existing data into skeleton ===========
function mergeSkeleton(tid, existingTest) {
  const skel = testSkeleton(tid);
  if (!skel) return existingTest || null;
  if (!existingTest) return skel;

  // Preserve integrity fields
  if (existingTest.integrity) skel.integrity = existingTest.integrity;
  if (existingTest.integrityNote) skel.integrityNote = existingTest.integrityNote;

  // Merge objective scores — keep existing values, fill missing with null
  for (const [k, v] of Object.entries(skel.objective)) {
    if (existingTest.objective && typeof existingTest.objective[k] === 'number')
      skel.objective[k] = existingTest.objective[k];
  }
  // Carry over any extra keys from existing (e.g., if rubric changed)
  if (existingTest.objective) {
    for (const k of Object.keys(existingTest.objective)) {
      if (!(k in skel.objective)) skel.objective[k] = existingTest.objective[k];
    }
  }

  // Merge subjective scores
  for (const [k, v] of Object.entries(skel.subjective)) {
    if (existingTest.subjective && typeof existingTest.subjective[k] === 'number')
      skel.subjective[k] = existingTest.subjective[k];
  }
  if (existingTest.subjective) {
    for (const k of Object.keys(existingTest.subjective)) {
      if (!(k in skel.subjective)) skel.subjective[k] = existingTest.subjective[k];
    }
  }

  // Keep existing note if it's not boilerplate-null
  if (existingTest.note && existingTest.note !== 'TODO') skel.note = existingTest.note;

  // Merge comments — keep existing non-null, non-boilerplate, override with null for skeleton
  if (existingTest.comments) {
    for (const [k, v] of Object.entries(skel.comments)) {
      if (existingTest.comments[k] != null && existingTest.comments[k] !== 'TODO')
        skel.comments[k] = existingTest.comments[k];
    }
    for (const k of Object.keys(existingTest.comments)) {
      if (!(k in skel.comments)) skel.comments[k] = existingTest.comments[k];
    }
  }

  // Merge reasoning — keep existing non-null
  if (existingTest.reasoning) {
    for (const k of Object.keys(skel.reasoning)) {
      if (existingTest.reasoning[k] != null && existingTest.reasoning[k] !== 'TODO')
        skel.reasoning[k] = existingTest.reasoning[k];
    }
    for (const k of Object.keys(existingTest.reasoning)) {
      if (!(k in skel.reasoning)) skel.reasoning[k] = existingTest.reasoning[k];
    }
  }

  // Keep reviews if present
  if (existingTest.reviews) skel.reviews = existingTest.reviews;

  return skel;
}

// =========== discover which tests each run actually attempted ===========
// A test is "attempted" if results/<run-id>/<test-id>/ exists on disk
// or if it already has an entry in data.js (even partial).
function runAttemptedTests(runId) {
  const set = new Set();
  // Check disk
  const runDir = path.join(RESULTS_DIR, runId);
  if (fs.existsSync(runDir)) {
    for (const ent of fs.readdirSync(runDir)) {
      const ep = path.join(runDir, ent);
      if (fs.statSync(ep).isDirectory() && rubrics[ent]) set.add(ent);
    }
  }
  // Check existing data.js
  const existingRun = existing.runs?.[runId];
  if (existingRun?.tests) {
    for (const tid of Object.keys(existingRun.tests)) {
      if (rubrics[tid]) set.add(tid);
    }
  }
  return set;
}

// =========== build the output ===========
const output = { updated: existing.updated || new Date().toISOString().slice(0, 10), runs: {} };

for (const dr of includeRuns) {
  const existingRun = existing.runs?.[dr.id] || {};
  const attempted = runAttemptedTests(dr.id);
  const runEntry = {
    model: dr.model || existingRun.model || '',
    effort: dr.effort || existingRun.effort || 'unspecified',
    harness: dr.harness || existingRun.harness || 'unspecified',
    date: dr.date || existingRun.date || '',
    judgedBy: existingRun.judgedBy || null,
    judgedOn: existingRun.judgedOn || null,
    reviewedBy: existingRun.reviewedBy || null,
    reviewedOn: existingRun.reviewedOn || null,
    tests: {},
  };

  // Only skeletonize tests the model actually ran
  for (const tid of attempted) {
    const existingTest = existingRun.tests?.[tid] || null;
    runEntry.tests[tid] = mergeSkeleton(tid, existingTest);
  }

  output.runs[dr.id] = runEntry;
}

// Also preserve runs that are in data.js but not on disk (no meta.json)
if (!requestedRuns && existing.runs) {
  for (const rid of Object.keys(existing.runs)) {
    if (!output.runs[rid]) {
      output.runs[rid] = existing.runs[rid];
    }
  }
}

// =========== serialize ===========
function serialize(v, indent) {
  if (v === null) return 'null';
  if (v === undefined) return 'null';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '[\n' + v.map(x => indent + '  ' + serialize(x, indent + '  ')).join(',\n') + '\n' + indent + ']';
  }
  // object
  const keys = Object.keys(v);
  if (keys.length === 0) return '{}';
  // Short objects (≤3 keys with primitive values) get inline
  const allShort = keys.length <= 3 && keys.every(k => {
    const val = v[k];
    return val === null || typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean';
  });
  if (allShort) {
    const pairs = keys.map(k => JSON.stringify(k) + ': ' + serialize(v[k], ''));
    return '{ ' + pairs.join(', ') + ' }';
  }
  return '{\n' + keys.map(k => indent + '  ' + JSON.stringify(k) + ': ' + serialize(v[k], indent + '  ')).join(',\n') + '\n' + indent + '}';
}

const outStr = 'window.BENCH_DATA = ' + serialize(output, '') + ';\n';
fs.writeFileSync(DATA_PATH, outStr);
console.log('prebuild: wrote ' + (outStr.length / 1024).toFixed(1) + ' KB to report/data.js');

// =========== summary ===========
let totalTests = 0, filledObj = 0, filledSub = 0, filledComments = 0, filledReasoning = 0, nullObj = 0, nullSub = 0, nullComments = 0, nullReasoning = 0;
for (const run of Object.values(output.runs)) {
  for (const [tid, t] of Object.entries(run.tests)) {
    if (t.integrity === 'invalidated') continue;
    totalTests++;
    for (const v of Object.values(t.objective || {})) { if (v === null) nullObj++; else filledObj++; }
    for (const v of Object.values(t.subjective || {})) { if (v === null) nullSub++; else filledSub++; }
    for (const v of Object.values(t.comments || {})) { if (v === null) nullComments++; else filledComments++; }
    if (t.reasoning) {
      for (const v of Object.values(t.reasoning)) { if (v === null) nullReasoning++; else filledReasoning++; }
    }
  }
}
console.log('prebuild: ' + totalTests + ' test entries across ' + Object.keys(output.runs).length + ' runs');
console.log('  objective: ' + filledObj + ' filled, ' + nullObj + ' null (needs judging)');
console.log('  subjective: ' + filledSub + ' filled, ' + nullSub + ' null (needs judging)');
console.log('  comments: ' + filledComments + ' filled, ' + nullComments + ' null (needs judging)');
console.log('  reasoning: ' + filledReasoning + ' filled, ' + nullReasoning + ' null (needs judging)');
