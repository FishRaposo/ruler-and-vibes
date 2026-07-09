#!/usr/bin/env node
'use strict';
// This tool now appends new TESTS entries directly into report/tests.js
// (the generated source of truth owned by gen-tests.js). We append only
// entries that don't already exist there, then re-run gen-tests.js to keep
// the file canonically formatted and ordered.
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

const prefixes = /^(agent-|ops-|safety-|planning-11|planning-12|business-10|support-|critical-)/;
const entries = [];
for (const f of fs.readdirSync(path.join(REPO, 'rubrics')).filter(x => x.endsWith('.md'))) {
  const id = f.replace(/\.md$/, '');
  if (!prefixes.test(id)) continue;
  const txt = fs.readFileSync(path.join(REPO, 'rubrics', f), 'utf8');
  let category = 'unknown', title = id;
  for (const d of fs.readdirSync(path.join(REPO, 'tests'))) {
    const tp = path.join(REPO, 'tests', d, id + '.md');
    if (fs.existsSync(tp)) {
      category = d;
      const tt = fs.readFileSync(tp, 'utf8');
      title = (tt.match(/^title:\s*(.+)$/m) || [])[1] || id;
      break;
    }
  }
  const objMeta = [];
  let inObj = false, ocur = null;
  for (const line of txt.split('\n')) {
    const tr = line.trim();
    if (tr === 'objective:') { inObj = true; continue; }
    if (tr === 'subjective:') break;
    if (!inObj) continue;
    const im = line.match(/id:\s*(\S+)/);
    if (im) { ocur = { id: im[1], check: im[1] }; objMeta.push(ocur); }
    const cm = line.match(/check:\s*"(.*)"\s*$/);
    if (cm && ocur) ocur.check = cm[1].slice(0, 48);
  }
  const subMeta = [];
  let inSub = false, cur = null;
  for (const line of txt.split('\n')) {
    const tr = line.trim();
    if (tr === 'subjective:') { inSub = true; continue; }
    if (tr === '---' && inSub) break;
    if (!inSub) continue;
    const im = line.match(/id:\s*(\S+)/);
    if (im) { cur = { id: im[1], name: im[1], w: 0.3 }; subMeta.push(cur); }
    const nm = line.match(/name:\s*"(.*?)"/);
    if (nm && cur) cur.name = nm[1];
    const wm = line.match(/weight:\s*([\d.]+)/);
    if (wm && cur) cur.w = parseFloat(wm[1]);
  }
  entries.push({ id, category, title, objMeta, subMeta });
}

// Parse current tests.js entries to avoid duplicates
const testsJsPath = path.join(REPO, 'report', 'tests.js');
let existing = new Set();
if (fs.existsSync(testsJsPath)) {
  const ts = fs.readFileSync(testsJsPath, 'utf8');
  const m = ts.match(/const TESTS\s*=\s*(\{[\s\S]*\});\s*$/);
  if (m) existing = new Set(Object.keys(eval('(' + m[1] + ')')));
}

let added = 0;
for (const e of entries) {
  if (existing.has(e.id)) continue;
  const obj = e.objMeta.map(o => '["' + o.id + '",' + JSON.stringify(o.check) + ']').join(',');
  const sub = e.subMeta.map(s => '["' + s.id + '",' + JSON.stringify(s.name) + ',' + s.w + ']').join(',');
  fs.appendFileSync(testsJsPath,
    '  ' + JSON.stringify(e.id) + ':{category:' + JSON.stringify(e.category)
    + ',title:' + JSON.stringify(e.title)
    + ',objective:[' + obj + ']'
    + ',subjective:[' + sub + ']},\n');
  added++;
}

// Re-normalize the whole file via gen-tests.js so ordering/format is canonical
require('./gen-tests.js');

console.log('patch-index-tests: added ' + added + ' new entries; report/tests.js regenerated');
