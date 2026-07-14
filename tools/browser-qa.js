#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { createServer } = require('./serve-report.js');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'docs', 'superpowers', 'specs', 'assets');

function chromeExecutable() {
  const candidates = process.platform === 'win32' ? [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ] : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executable) throw new Error('Chrome or Edge executable not found');
  return executable;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    const fallback = setTimeout(resolve, 3000);
    child.once('exit', () => {
      clearTimeout(fallback);
      resolve();
    });
    child.kill();
  });
}

async function pollJson(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class Cdp {
  constructor(webSocket) {
    this.webSocket = webSocket;
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = new Map();
    webSocket.addEventListener('message', (event) => this.onMessage(event));
  }

  static connect(url) {
    return new Promise((resolve, reject) => {
      const webSocket = new WebSocket(url);
      webSocket.addEventListener('open', () => resolve(new Cdp(webSocket)), { once: true });
      webSocket.addEventListener('error', () => reject(new Error('CDP WebSocket failed')), { once: true });
    });
  }

  onMessage(event) {
    const message = JSON.parse(String(event.data));
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(`${message.error.message} (${message.error.code})`));
      else resolve(message.result || {});
      return;
    }
    if (message.method && this.waiters.has(message.method)) {
      const waiters = this.waiters.get(message.method);
      this.waiters.delete(message.method);
      for (const resolve of waiters) resolve(message.params || {});
    }
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.webSocket.send(JSON.stringify({ id, method, params }));
    });
  }

  event(method) {
    return new Promise((resolve) => {
      const waiters = this.waiters.get(method) || [];
      waiters.push(resolve);
      this.waiters.set(method, waiters);
    });
  }

  close() {
    this.webSocket.close();
  }
}

async function evaluate(cdp, expression) {
  const response = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Browser evaluation failed');
  return response.result?.value;
}

let navigationSequence = 0;

async function navigate(cdp, url) {
  const target = new URL(url);
  target.searchParams.set('__qa', String(++navigationSequence));
  const targetUrl = target.href;
  const targetBase = targetUrl.split('#')[0];
  await cdp.send('Page.navigate', { url: targetUrl });
  const deadline = Date.now() + 10000;
  let state = null;
  while (Date.now() < deadline) {
    state = await evaluate(cdp, `({ href: location.href, base: location.href.split('#')[0], ready: document.readyState })`);
    if (state.base === targetBase && state.ready === 'complete') return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out navigating to ${targetUrl}; observed ${JSON.stringify(state)}`);
}

async function setViewport(cdp, width, height, mobile = false) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
}

async function screenshot(cdp, filePath) {
  const result = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  fs.writeFileSync(filePath, Buffer.from(result.data, 'base64'));
}

function check(condition, message) {
  if (!condition) throw new Error(`QA assertion failed: ${message}`);
}

async function runMatrix(cdp, baseUrl) {
  const fixture = `${baseUrl}/?fixture=1#suite=core&view=combined&selected=fixture-a`;

  await setViewport(cdp, 1440, 900, false);
  await navigate(cdp, fixture);
  const desktop = await evaluate(cdp, `(() => ({
    width: innerWidth,
    overflow: document.documentElement.scrollWidth > innerWidth,
    suite: document.querySelector('#suite').value,
    view: document.querySelector('#view').value,
    summaryRows: document.querySelectorAll('.summary-table tbody tr').length,
    domainRows: document.querySelectorAll('.domain-row').length,
    heatCells: document.querySelectorAll('.heat-cell').length,
    heatEvidence: document.querySelector('.heat-cell .evidence')?.textContent || '',
    details: document.querySelectorAll('.test-group').length,
    detailHeaders: [...document.querySelectorAll('.criterion-table th')].map((element) => element.textContent.trim()),
    reviewerValues: [...document.querySelectorAll('.criterion-table tbody td:nth-child(3)')].map((element) => element.textContent.trim()).filter((value) => value && value !== '—'),
    badges: [...document.querySelectorAll('.badge')].map((element) => element.textContent.trim()),
    svg: document.querySelectorAll('#profile svg').length,
    controlMetrics: [...document.querySelectorAll('select')].map((element) => ({ id: element.id, rect: element.getBoundingClientRect().height, client: element.clientHeight, display: getComputedStyle(element).display, minHeight: getComputedStyle(element).minHeight })),
  }))()`);
  check(desktop.width === 1440, 'desktop viewport is 1440px');
  check(!desktop.overflow, 'desktop has no page-level horizontal overflow');
  check(desktop.suite === 'core' && desktop.view === 'combined', 'Core/combined hash restores');
  check(desktop.summaryRows === 5, 'desktop compares all fixture runs');
  check(desktop.domainRows === 8, 'desktop renders all eight domains');
  check(desktop.heatCells > 0 && desktop.details > 0, 'heatmap and details render');
  check(desktop.heatEvidence.includes('complete forms'), 'heatmap exposes form completeness without hover');
  check(['Primary', 'Reviewer', 'Adjudicator', 'Effective'].every((label) => desktop.detailHeaders.includes(label)), 'drill-down preserves all scoring trails');
  check(desktop.reviewerValues.some((value) => /^\d/.test(value)), 'drill-down shows independent reviewer values');
  check(desktop.badges.some((badge) => badge.includes('disputed')) && desktop.badges.some((badge) => badge.includes('adjudicated')), 'status text accompanies color');
  check(desktop.svg === 0, 'wide Core profile falls back to ordered dots');
  check(desktop.controlMetrics.every((metric) => parseFloat(metric.minHeight) >= 44), `desktop controls meet 44px target (${JSON.stringify(desktop.controlMetrics)})`);
  await screenshot(cdp, path.join(ASSETS, 'report-desktop-qa.png'));

  const filterResult = await evaluate(cdp, `(() => {
    const select = document.querySelector('#harness');
    select.value = 'local';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return { hash: location.hash, rows: document.querySelectorAll('.summary-table tbody tr').length };
  })()`);
  check(filterResult.hash.includes('harness=local') && filterResult.rows === 3, 'harness filter updates hash and rows');

  await navigate(cdp, fixture);
  const toggleResult = await evaluate(cdp, `(() => {
    const checkbox = document.querySelector('input[data-run="fixture-b"]');
    checkbox.click();
    return { hash: location.hash, rows: document.querySelectorAll('.summary-table tbody tr').length };
  })()`);
  check(toggleResult.hash.includes('hidden=fixture-b') && toggleResult.rows === 4, 'run toggle updates hash and comparison');

  await navigate(cdp, fixture);
  await evaluate(cdp, `document.querySelector('.test-group summary').focus()`);
  const keyboardBefore = await evaluate(cdp, `({ active: document.activeElement?.tagName, isSummary: document.activeElement === document.querySelector('.test-group summary'), open: document.querySelector('.test-group').open })`);
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  const keyboardAfter = await evaluate(cdp, `({ active: document.activeElement?.tagName, isSummary: document.activeElement === document.querySelector('.test-group summary'), open: document.querySelector('.test-group').open })`);
  check(keyboardAfter.open === true, `test details expand from the keyboard (before ${JSON.stringify(keyboardBefore)}, after ${JSON.stringify(keyboardAfter)})`);

  await navigate(cdp, `${baseUrl}/?fixture=1#suite=coding-day&view=combined&selected=fixture-a`);
  check(await evaluate(cdp, `document.querySelectorAll('#profile svg').length === 1`), '3-12 category workflow suite uses radar');

  await navigate(cdp, `${baseUrl}/?fixture=1#suite=unknown&view=unknown&harness=unknown&effort=unknown`);
  const fallback = await evaluate(cdp, `({ suite: document.querySelector('#suite').value, view: document.querySelector('#view').value, harness: document.querySelector('#harness').value, effort: document.querySelector('#effort').value })`);
  check(fallback.suite === 'core' && fallback.view === 'combined' && fallback.harness === 'all' && fallback.effort === 'all', 'invalid hash state falls back safely');

  await setViewport(cdp, 390, 844, true);
  await navigate(cdp, fixture);
  const mobile = await evaluate(cdp, `(() => ({
    width: innerWidth,
    overflow: document.documentElement.scrollWidth > innerWidth,
    summaryRows: document.querySelectorAll('.summary-table tbody tr').length,
    summaryContained: document.querySelector('#summary-content').scrollWidth <= document.querySelector('#summary-content').clientWidth,
    selectedRun: document.querySelector('#mobile-run').value,
    domainBars: document.querySelectorAll('.domain-bar').length,
    domainProvisional: document.querySelectorAll('#domains-content .provisional-mark').length,
    visibleHeatColumns: [...document.querySelectorAll('.heat-table thead th')].filter((element) => getComputedStyle(element).display !== 'none').length,
    svg: document.querySelectorAll('#profile svg').length,
    controlMetrics: [...document.querySelectorAll('select')].map((element) => ({ id: element.id, rect: element.getBoundingClientRect().height, client: element.clientHeight, display: getComputedStyle(element).display, minHeight: getComputedStyle(element).minHeight })),
  }))()`);
  check(mobile.width === 390, 'mobile viewport is 390px');
  check(!mobile.overflow, 'mobile has no page-level horizontal overflow');
  check(mobile.summaryRows === 1 && mobile.selectedRun === 'fixture-a', 'mobile summary is selected-run only');
  check(mobile.summaryContained, 'mobile summary card is contained without horizontal scrolling');
  check(mobile.domainBars === 8, 'mobile uses eight domain bars');
  check(mobile.domainProvisional > 0, 'missing domain categories retain visible provisional status');
  check(mobile.visibleHeatColumns === 2, 'mobile heatmap shows category plus one run');
  check(mobile.svg === 0, 'mobile profile never compresses to a radar');
  check(mobile.controlMetrics.every((metric) => parseFloat(metric.minHeight) >= 44), `mobile controls meet 44px target (${JSON.stringify(mobile.controlMetrics)})`);
  await evaluate(cdp, `new Promise((resolve) => { scrollTo(0, 0); requestAnimationFrame(() => requestAnimationFrame(resolve)); })`);
  await screenshot(cdp, path.join(ASSETS, 'report-mobile-qa.png'));

  await navigate(cdp, `${baseUrl}/?fixture=empty`);
  check(await evaluate(cdp, `document.querySelector('#report-status').textContent.includes('No judged runs')`), 'empty data shows a visible state');

  await navigate(cdp, `${baseUrl}/?fixture=malformed`);
  const malformed = await evaluate(cdp, `({ visible: !document.querySelector('#report-status').hidden, text: document.querySelector('#report-status').textContent, error: document.querySelector('#report-status').classList.contains('error') })`);
  check(malformed.visible && malformed.error && malformed.text.includes('Expected 2'), 'unknown schema fails closed visibly');

  return { desktop, mobile, malformed };
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const reportServer = createServer(ROOT);
  const reportPort = await listen(reportServer);
  const debugPort = await freePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ruler-vibes-browser-qa-'));
  const browser = spawn(chromeExecutable(), [
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-background-mode',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: 'ignore', windowsHide: true });

  try {
    const pages = await pollJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = pages.find((entry) => entry.type === 'page');
    if (!page?.webSocketDebuggerUrl) throw new Error('No debuggable browser page found');
    const cdp = await Cdp.connect(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    const result = await runMatrix(cdp, `http://127.0.0.1:${reportPort}`);
    cdp.close();
    console.log(`browser-qa: pass desktop=${result.desktop.width}px mobile=${result.mobile.width}px`);
    console.log('browser-qa: fixture, hash, filters, toggles, keyboard, heatmap, details, radar fallback, empty data, and schema failure verified');
  } finally {
    await stopChild(browser);
    await new Promise((resolve) => reportServer.close(resolve));
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    } catch (error) {
      console.warn(`browser-qa: temporary profile cleanup skipped (${error.code || error.message})`);
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}

module.exports = { Cdp, chromeExecutable, runMatrix, stopChild };
