#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BENCHMARK_PATH = path.join(ROOT, 'benchmark.json');
const TIERS_PATH = path.join(ROOT, 'tiers.json');
const REPORT_CONFIG_PATH = path.join(ROOT, 'report', 'config.js');
const RUN_PATH = path.join(ROOT, 'RUN.md');

function loadSources() {
  return {
    benchmark: JSON.parse(fs.readFileSync(BENCHMARK_PATH, 'utf8')),
    tiers: JSON.parse(fs.readFileSync(TIERS_PATH, 'utf8')),
  };
}

function buildConfig(benchmark, tiers) {
  return {
    schemaVersion: 1,
    defaultSuite: benchmark.defaultSuite,
    categories: benchmark.categories,
    domains: benchmark.domains,
    suites: {
      core: tiers.tiers.core.tests,
      extended: tiers.tiers.extended.tests,
      full: null,
      ...benchmark.daySuites,
    },
  };
}

function wrapIds(ids, width = 88) {
  const lines = [];
  let line = '';
  for (const id of ids) {
    const piece = (line ? ', ' : '') + id;
    if (line && line.length + piece.length > width) {
      lines.push(line + ',');
      line = id;
    } else {
      line += piece;
    }
  }
  if (line) lines.push(line + '.');
  return lines.map((value) => `  ${value}`).join('\n');
}

function renderRunSuites(config) {
  const suiteLines = [];
  for (const [name, ids] of Object.entries(config.suites)) {
    if (name === 'full') continue;
    const label = name === 'core' ? 'Core' : name === 'extended' ? 'Extended' : name;
    suiteLines.push(`- **${label}** (${ids.length} forms):\n${wrapIds(ids)}`);
  }
  return [
    '<!-- BEGIN GENERATED SUITES -->',
    '## Suites',
    '',
    'Default when omitted: **Core**. Full is never inferred; the user must name',
    '`full` explicitly. A named list of tests or categories is `ad-hoc`.',
    'Unknown suite names stop the run before any output is created; they are not',
    'silently treated as `ad-hoc`.',
    '',
    'Breadth tiers are nested: **Core ⊂ Extended ⊂ Full**. Core and Extended',
    'contain base forms only. Full means every form under `tests/`, including',
    'parallel forms. Day suites are workflow pickers, not breadth tiers.',
    '',
    ...suiteLines.flatMap((line) => [line, '']),
    '- **Full**: every test form under `tests/`; explicit selection only.',
    '',
    '<!-- END GENERATED SUITES -->',
  ].join('\n');
}

function replaceRunSuiteBlock(runSource, generated) {
  const marked = /<!-- BEGIN GENERATED SUITES -->[\s\S]*?<!-- END GENERATED SUITES -->/;
  if (marked.test(runSource)) return runSource.replace(marked, generated);
  const legacy = /## Suites[\s\S]*?(?=\n## Rules — read these first)/;
  if (!legacy.test(runSource)) throw new Error('RUN.md suite section not found');
  return runSource.replace(legacy, generated + '\n');
}

function sync() {
  const { benchmark, tiers } = loadSources();
  const config = buildConfig(benchmark, tiers);
  fs.writeFileSync(REPORT_CONFIG_PATH, `window.BENCH_CONFIG = ${JSON.stringify(config, null, 2)};\n`);
  const runSource = fs.readFileSync(RUN_PATH, 'utf8');
  fs.writeFileSync(RUN_PATH, replaceRunSuiteBlock(runSource, renderRunSuites(config)));
  return config;
}

if (require.main === module) {
  const config = sync();
  console.log(`sync-config: default=${config.defaultSuite}, suites=${Object.keys(config.suites).length}, domains=${config.domains.length}`);
}

module.exports = { buildConfig, renderRunSuites, replaceRunSuiteBlock, sync };
