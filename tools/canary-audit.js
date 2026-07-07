#!/usr/bin/env node
// Canary audit for the Ruler & Vibes kit. Run from the repo root:
//   node tools/canary-audit.js
//
// Checks, kit-wide (rules 1-3 of the canary registry, plus weaving):
//   - every test has a rubric canary, every canary phrase is unique
//   - no phrase is a substring of another
//   - no content word appears in more than 2 canaries
//   - no canary phrase appears in ANY test file (leak invariant)
//   - no canary phrase appears in another rubric (cross-contamination)
//   - each canary appears >=2x in its own rubric (frontmatter + woven
//     mention), matched with whitespace normalized so line wraps count
//
// On success it refreshes the registry table and counts in
// docs/superpowers/specs/2026-07-04-canary-registry.md, preserving all
// prose (rules, provenance notes) outside the generated table.
// Exit code: 0 clean, 1 issues found (registry left untouched).
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const REGISTRY = path.join(REPO, 'docs', 'superpowers', 'specs', '2026-07-04-canary-registry.md');
const norm = s => s.toLowerCase().replace(/\s+/g, ' ');

// --- collect tests (dir = category) ---
const testMeta = {}; // id -> {category}
const testTexts = {}; // path -> normalized text
for (const d of fs.readdirSync(path.join(REPO, 'tests'))) {
  const dp = path.join(REPO, 'tests', d);
  if (!fs.statSync(dp).isDirectory()) continue;
  for (const f of fs.readdirSync(dp)) {
    if (!f.endsWith('.md')) continue;
    const txt = fs.readFileSync(path.join(dp, f), 'utf8');
    const id = (txt.match(/^id:\s*(.+?)\s*$/m) || [])[1] || f.replace(/\.md$/, '');
    testMeta[id] = { category: d };
    testTexts['tests/' + d + '/' + f] = norm(txt);
  }
}

// --- collect rubrics ---
const canary = {}; // id -> phrase
const rubricText = {}; // id -> raw text
const rubricFile = {};
for (const f of fs.readdirSync(path.join(REPO, 'rubrics'))) {
  if (!f.endsWith('.md')) continue;
  const txt = fs.readFileSync(path.join(REPO, 'rubrics', f), 'utf8');
  const id = (txt.match(/^test:\s*(.+?)\s*$/m) || [])[1];
  const c = (txt.match(/^canary:\s*"?(.+?)"?\s*$/m) || [])[1];
  if (!id) continue;
  rubricText[id] = txt;
  rubricFile[id] = f;
  if (c) canary[id] = c.replace(/^["']|["']$/g, '').trim();
}

const issues = [];
const ids = Object.keys(canary).sort();

for (const id of Object.keys(testMeta)) if (!canary[id]) issues.push('MISSING: no canary for test ' + id);

for (const id of ids) {
  const phrase = norm(canary[id]);
  for (const [p, txt] of Object.entries(testTexts))
    if (txt.includes(phrase)) issues.push('LEAK: "' + canary[id] + '" (' + id + ') appears in ' + p);
  for (const other of ids)
    if (other !== id && norm(rubricText[other]).includes(phrase))
      issues.push('CROSS-RUBRIC: "' + canary[id] + '" (' + id + ') appears in rubrics/' + rubricFile[other]);
  const hay = norm(rubricText[id]);
  let n = 0, i = 0;
  while ((i = hay.indexOf(phrase, i)) !== -1) { n++; i += phrase.length; }
  if (n < 2) issues.push('NOT WOVEN: "' + canary[id] + '" (' + id + ') appears ' + n + 'x in its own rubric (need exactly 2)');
  if (n > 2) issues.push('OVER-WOVEN: "' + canary[id] + '" (' + id + ') appears ' + n + 'x in its own rubric (want exactly 2: frontmatter + one woven mention)');
}

const byPhrase = {};
for (const id of ids) (byPhrase[norm(canary[id])] = byPhrase[norm(canary[id])] || []).push(id);
for (const [p, v] of Object.entries(byPhrase)) if (v.length > 1) issues.push('DUPLICATE: "' + p + '" used by ' + v.join(', '));

for (const a of ids) for (const b of ids) {
  const pa = norm(canary[a]), pb = norm(canary[b]);
  if (a !== b && pa.length < pb.length && pb.includes(pa))
    issues.push('SUBSTRING: "' + canary[a] + '" (' + a + ') is inside "' + canary[b] + '" (' + b + ')');
}

const STOP = new Set(['the', 'a', 'an', 'and', 'of', 'to', 'in', 'on', 'at']);
const wordMap = {};
for (const id of ids) for (const w of canary[id].toLowerCase().split(/[\s-]+/))
  if (w && !STOP.has(w)) (wordMap[w] = wordMap[w] || new Set()).add(id);
for (const [w, s] of Object.entries(wordMap))
  if (s.size > 2) issues.push('WORD OVERUSE: "' + w + '" in ' + s.size + ' canaries: ' + [...s].join(', '));

// word-set collision: two canaries using the exact same words (any order,
// e.g. "rigadoon galangal" vs "galangal rigadoon") are effectively the same
// phrase and must not both exist, even though DUPLICATE (string-exact) and
// WORD OVERUSE (>2 uses) miss this case.
const bySet = {};
for (const id of ids) {
  const key = canary[id].toLowerCase().split(/[\s-]+/).filter(w => !STOP.has(w)).sort().join('+');
  (bySet[key] = bySet[key] || []).push(id);
}
for (const [key, v] of Object.entries(bySet))
  if (v.length > 1) issues.push('WORD-SET COLLISION: same words in different order across ' + v.map(id => id + ' ("' + canary[id] + '")').join(' vs '));

console.log('canary-audit: ' + ids.length + ' canaries / ' + Object.keys(testMeta).length + ' tests');
if (issues.length) {
  console.log('\n' + issues.length + ' ISSUE(S):');
  for (const m of issues) console.log('  - ' + m);
  console.log('\nRegistry NOT updated (fix the issues first).');
  process.exit(1);
}
console.log('all checks pass');

// --- refresh registry: table + counts only, prose preserved ---
let doc = fs.readFileSync(REGISTRY, 'utf8');
const grouped = {};
for (const id of ids) (grouped[testMeta[id] ? testMeta[id].category : 'unknown'] ||= []).push(id);
const idKey = id => { const m = id.match(/^([a-z0-9]+)-(\d+)([a-z]?)/); return m ? [m[1], parseInt(m[2], 10), m[3] || ''] : [id, 0, '']; };
let rows = '';
for (const cat of Object.keys(grouped).sort()) {
  const sorted = grouped[cat].sort((x, y) => {
    const kx = idKey(x), ky = idKey(y);
    if (kx[0] !== ky[0]) return kx[0] < ky[0] ? -1 : 1;
    if (kx[1] !== ky[1]) return kx[1] - ky[1];
    return kx[2] < ky[2] ? -1 : kx[2] > ky[2] ? 1 : 0;
  });
  for (const id of sorted) rows += '| ' + id + ' | ' + canary[id] + ' |\n';
}
doc = doc.replace(/## Canaries — all \d+ tests/, '## Canaries — all ' + ids.length + ' tests');
doc = doc.replace(/\*\*\d+ issues across all \d+ canaries\*\*/, '**0 issues across all ' + ids.length + ' canaries**');
// replace the table body (from the header row to the last table row)
doc = doc.replace(/\| test \| canary \|\r?\n\|---\|---\|\r?\n(?:\|[^\n]*\|\r?\n?)*/, '| test | canary |\n|---|---|\n' + rows);
fs.writeFileSync(REGISTRY, doc);
console.log('registry refreshed: ' + ids.length + ' rows (prose preserved)');
