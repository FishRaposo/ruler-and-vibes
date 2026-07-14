#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { loadDataFile } = require('./lib/bench-data.js');
const { analyzeCalibration, formatCalibration, parseArgs } = require('./calibration.js');

const ROOT = path.resolve(__dirname, '..');

function loadWindowAssignment(filePath, name) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context);
  return context.window[name];
}

function loadTests() {
  const source = fs.readFileSync(path.join(ROOT, 'report', 'tests.js'), 'utf8');
  const context = {};
  vm.runInNewContext(`${source};globalThis.TEST_OUTPUT=TESTS`, context);
  return context.TEST_OUTPUT;
}

function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const data = loadDataFile(path.join(ROOT, 'report', 'data.js'));
  const config = loadWindowAssignment(path.join(ROOT, 'report', 'config.js'), 'BENCH_CONFIG');
  const tests = loadTests();
  const report = analyzeCalibration(data, config, tests, options);
  const output = formatCalibration(report, options.format);
  if (options.out) {
    fs.writeFileSync(path.resolve(options.out), output);
    console.log(`calibrate: wrote ${options.out}`);
  } else {
    process.stdout.write(output);
  }
}

if (require.main === module) main();

module.exports = { main, loadWindowAssignment, loadTests };

