#!/usr/bin/env node
'use strict';

// Backward-compatible entry point. Canonical configuration now lives in
// benchmark.json + tiers.json and is synchronized by tools/sync-config.js.
const { sync } = require('./sync-config.js');

const config = sync();
console.log(`sync-tiers-to-report: delegated to sync-config (core=${config.suites.core.length}, extended=${config.suites.extended.length})`);
