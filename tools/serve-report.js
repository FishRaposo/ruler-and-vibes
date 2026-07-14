#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.html') return 'text/html; charset=utf-8';
  if (extension === '.js') return 'text/javascript; charset=utf-8';
  if (extension === '.css') return 'text/css; charset=utf-8';
  if (extension === '.json') return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

function resolveReportPath(requestPath, root = ROOT) {
  const decoded = decodeURIComponent(String(requestPath || '/').split('?')[0]);
  const segments = decoded.replaceAll('\\', '/').split('/').filter(Boolean);
  if (decoded.includes('\0') || segments.includes('..')) throw new Error('Request is outside report root');
  const reportRoot = path.resolve(root, 'report');
  const filePath = path.resolve(reportRoot, segments.length ? segments.join(path.sep) : 'index.html');
  const relative = path.relative(reportRoot, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Request is outside report root');
  return filePath;
}

function renderIndex(root = ROOT, fixture = false) {
  const source = fs.readFileSync(path.join(root, 'report', 'index.html'), 'utf8');
  const fixtureFile = fixture === true || fixture === '1' ? 'fixture-data.js'
    : fixture === 'empty' ? 'empty-data.js'
      : fixture === 'malformed' ? 'malformed-data.js' : null;
  return fixtureFile
    ? source.replace('<script src="data.js"></script>', `<script src="${fixtureFile}"></script>`)
    : source;
}

function createServer(root = ROOT) {
  return http.createServer((request, response) => {
    const url = new URL(request.url || '/', 'http://localhost');
    const fixture = url.searchParams.get('fixture') || false;
    const commonHeaders = {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    };
    try {
      if (url.pathname === '/' || url.pathname === '/index.html') {
        response.writeHead(200, { ...commonHeaders, 'Content-Type': contentType('index.html') });
        response.end(renderIndex(root, fixture));
        return;
      }
      const fixtureFiles = {
        '/fixture-data.js': 'report-data.js',
        '/empty-data.js': 'report-empty-data.js',
        '/malformed-data.js': 'report-malformed-data.js',
      };
      const filePath = fixtureFiles[url.pathname]
        ? path.join(root, 'tools', 'fixtures', fixtureFiles[url.pathname])
        : resolveReportPath(url.pathname, root);
      fs.readFile(filePath, (error, body) => {
        if (error) {
          response.writeHead(error.code === 'ENOENT' ? 404 : 500, { ...commonHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
          response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
          return;
        }
        response.writeHead(200, { ...commonHeaders, 'Content-Type': contentType(filePath) });
        response.end(body);
      });
    } catch (error) {
      response.writeHead(400, { ...commonHeaders, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error.message);
    }
  });
}

function main() {
  const argument = process.argv.find((value) => /^--port=\d+$/.test(value));
  const hostArgument = process.argv.find((value) => /^--host=[a-zA-Z0-9.:-]+$/.test(value));
  const port = argument ? Number(argument.split('=')[1]) : 4173;
  const host = hostArgument ? hostArgument.slice('--host='.length) : '127.0.0.1';
  createServer().listen(port, host, () => {
    console.log(`report server: http://${host}:${port}`);
  });
}

if (require.main === module) main();

module.exports = { contentType, resolveReportPath, renderIndex, createServer };
