#!/usr/bin/env node
'use strict';
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

const htmlPath = path.join(REPO, 'report', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

for (const c of [
  { id: 'agentic-coding', label: 'Agentic Coding' },
  { id: 'ops', label: 'Ops & Tooling' },
  { id: 'safety', label: 'Safety Judgment' },
  { id: 'support-inbox', label: 'Support Inbox' },
  { id: 'critical-reading', label: 'Critical Reading' },
]) {
  if (!html.includes('id:"' + c.id + '"')) {
    // append before ]; of CATEGORIES — try several anchors
    if (html.includes('id:"safety"')) {
      html = html.replace(
        /\{id:"safety",label:"[^"]*"\},/,
        (m) => m + '\n  {id:"' + c.id + '",label:"' + c.label + '"},'
      );
      // only first missing — if already added via safety replace wrongly, check
      if (!html.includes('id:"' + c.id + '"')) {
        html = html.replace(
          '  {id:"ux-copy",label:"UX Copy"},\n];',
          '  {id:"ux-copy",label:"UX Copy"},\n  {id:"' + c.id + '",label:"' + c.label + '"},\n];'
        );
      }
    } else {
      html = html.replace(
        '  {id:"ux-copy",label:"UX Copy"},\n];',
        '  {id:"ux-copy",label:"UX Copy"},\n  {id:"' + c.id + '",label:"' + c.label + '"},\n];'
      );
    }
  }
}

const ai = html.search(/\r?\n\};\r?\nconst COLORS=/);
if (ai < 0) {
  console.error('anchor not found');
  process.exit(1);
}
const m = html.slice(ai).match(/^(\r?\n)\};(\r?\n)const COLORS=/);
const nl = m[1];

let block = ',\n';
for (const e of entries) {
  if (html.includes('"' + e.id + '":{category:')) continue;
  const obj = e.objMeta.map(o => '["' + o.id + '",' + JSON.stringify(o.check) + ']').join(',');
  const sub = e.subMeta.map(s => '["' + s.id + '",' + JSON.stringify(s.name) + ',' + s.w + ']').join(',');
  block += '"' + e.id + '":{category:' + JSON.stringify(e.category) + ',title:' + JSON.stringify(e.title) + ',\n' +
    ' objective:[' + obj + '],\n' +
    ' subjective:[' + sub + ']}';
  block += ',\n';
}
// remove trailing comma before };
block = block.replace(/,\n$/, '\n');

// Last existing entry ends with `}` without trailing comma sometimes - need comma before new entries
// The structure is: ...lastentry}\n};
// We insert ,\n newentries before };
const before = html.slice(0, ai); // ends with last `}` of last test
// before currently ends with `}\n` of last test - wait ai points to \n};\nconst COLORS
// html[ai] is newline before };
// Actually anchor is `\n};\nconst COLORS=` so before ends with last test's closing `}`

// before ends mid-file at start of `\n};\nconst COLORS`
// Replace that `};` with `block + };`
html = before + block + nl + '};' + html.slice(ai + m[0].indexOf('};') + 2);
fs.writeFileSync(htmlPath, html);

// verify
const start = html.indexOf('const TESTS=');
let pos = start + 'const TESTS='.length;
let depth = 0, inS = false, esc = false, inC = false;
for (; pos < html.length; pos++) {
  const ch = html[pos];
  if (esc) { esc = false; continue; }
  if (ch === '\\' && inS) { esc = true; continue; }
  if (ch === '/' && !inS && !inC && html[pos + 1] === '/') { inC = true; pos++; continue; }
  if (ch === '\n' && inC) { inC = false; continue; }
  if (ch === '"' && !inC) { inS = !inS; continue; }
  if (inS || inC) continue;
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { pos++; break; } }
}
try {
  const TESTS = eval('(' + html.slice(start + 'const TESTS='.length, pos) + ')');
  console.log('OK', Object.keys(TESTS).length, 'tests; agent-01?', !!TESTS['agent-01-multi-file-fix']);
} catch (e) {
  console.error('FAIL', e.message);
  // show around insertion
  const j = html.indexOf('"agent-01-multi-file-fix"');
  console.log(html.slice(j - 80, j + 120));
  process.exit(1);
}
