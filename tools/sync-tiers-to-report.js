#!/usr/bin/env node
// Sync SUITES.core / SUITES.extended in report/index.html from tiers.json.
// Run from repo root: node tools/sync-tiers-to-report.js
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const tiers = JSON.parse(fs.readFileSync(path.join(REPO, 'tiers.json'), 'utf8'));
const core = JSON.stringify(tiers.tiers.core.tests);
const ext = JSON.stringify(tiers.tiers.extended.tests);
const coreN = tiers.tiers.core.tests.length;
const extN = tiers.tiers.extended.tests.length;

const htmlPath = path.join(REPO, 'report', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const start = html.indexOf('const SUITES={');
if (start < 0) {
  console.error('const SUITES={ not found');
  process.exit(1);
}
const end = html.indexOf('\n};', start) + 3;
const block = html.slice(start, end);

const dayKeys = [
  'coding-day', 'agent-day', 'writing-comms', 'analyst', 'product-day',
  'safety-day', 'ops-day', 'support-day', 'copy-day', 'critical-day',
];
const dayLines = [];
for (const k of dayKeys) {
  const re = new RegExp(
    '(?:' + k + '|"' + k + '")\\s*:\\s*\\[[^\\]]*\\]'
  );
  const m = block.match(re);
  if (!m) {
    console.error('missing day suite in SUITES:', k);
    process.exit(1);
  }
  // Normalize key quoting for string keys with hyphens
  let line = m[0];
  if (k.includes('-') && !line.startsWith('"')) {
    line = '"' + k + '":' + line.slice(line.indexOf(':'));
  }
  dayLines.push(line);
}

const newBlock = [
  'const SUITES={',
  '  full:null,',
  '  core:' + core + ',',
  '  extended:' + ext + ',',
  ...dayLines.map((l) => '  ' + l + ','),
  '};',
].join('\n');

html = html.slice(0, start) + newBlock + html.slice(end);

// Comment above SUITES
html = html.replace(
  /\/\* Use-case suites[\s\S]*?\*\//,
  '/* Breadth tiers (Core ⊂ Extended ⊂ Full) + use-case day suites.\n' +
    '   Keep core/extended in sync with tiers.json (source of truth).\n' +
    '   full:null = every form in TESTS. Day suites are orthogonal workflow pickers. */'
);
// Also replace older tier comment if already patched once
html = html.replace(
  /\/\* Breadth tiers[\s\S]*?workflow pickers\. \*\//,
  '/* Breadth tiers (Core ⊂ Extended ⊂ Full) + use-case day suites.\n' +
    '   Keep core/extended in sync with tiers.json (source of truth).\n' +
    '   full:null = every form in TESTS. Day suites are orthogonal workflow pickers. */'
);

// Default suite filter: full (all forms)
html = html.replace(
  /const state=\{view:"combined",harness:"all",effort:"all",suite:"all"/,
  'const state={view:"combined",harness:"all",effort:"all",suite:"full"'
);
html = html.replace(
  /const state=\{view:"combined",harness:"all",effort:"all",suite:"all",/,
  'const state={view:"combined",harness:"all",effort:"all",suite:"full",'
);

// Suite dropdown labels
html = html.replace(
  /o\.value=id;o\.textContent=id==="all"\?"All tests":id;/,
  'o.value=id;o.textContent=id==="full"?"full (all forms)"' +
    ':id==="core"?"core (' + coreN + ')"' +
    ':id==="extended"?"extended (' + extN + ')":id;'
);
html = html.replace(
  /o\.value=id;o\.textContent=id==="full"\?"full \(all forms\)":id==="core"\?"core \(\d+\)":id==="extended"\?"extended \(\d+\)":id;/,
  'o.value=id;o.textContent=id==="full"?"full (all forms)"' +
    ':id==="core"?"core (' + coreN + ')"' +
    ':id==="extended"?"extended (' + extN + ')":id;'
);

fs.writeFileSync(htmlPath, html);
console.log('Synced SUITES: core=' + coreN + ' extended=' + extN + ' full=null + day suites');
