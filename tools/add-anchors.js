#!/usr/bin/env node
// add-anchors.js — inject an `anchors:` block into every rubric's
// frontmatter (before the closing ---) so subjective criteria have 0/5/10
// exemplars that calibrate judges against the same poles. Idempotent:
// skips rubrics that already declare anchors. Run from repo root:
//   node tools/add-anchors.js
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

// Map a subjective criterion name -> {0,5,10} exemplar strings.
// Generic-but-meaningful defaults keyed on common name substrings; specific
// overrides for the most frequent criteria. Judges read these as poles.
function anchorsFor(name) {
  const n = (name || '').toLowerCase();
  // Specific, higher-value anchors for recurring criteria
  if (n.includes('reasoning')) return {
    0: 'REASONING.md missing, or restates the task with no real decisions/limitations.',
    5: 'States an approach and one decision, but limitations are vague or generic.',
    10: 'Names a concrete decision and a concrete limitation with honest trade-offs.'
  };
  if (n.includes('clarity') || n.includes('craft') || n.includes('concision') || n.includes('structure'))
    return {
      0: 'Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.',
      5: 'Understandable but verbose or uneven; some naming/structure could be tighter.',
      10: 'Clear, well-structured, minimal — a reader extracts the answer immediately.'
    };
  if (n.includes('quality') || n.includes('correctness') || n.includes('rigor') || n.includes('fidelity'))
    return {
      0: 'Core requirement wrong or missing; many misses against the rubric.',
      5: 'Mostly correct with one or two real gaps or weak spots.',
      10: 'Fully correct on every load-bearing point; no meaningful gaps.'
    };
  if (n.includes('diagnosis') || n.includes('root-cause') || n.includes('depth'))
    return {
      0: 'Misattributes the cause or stops at the symptom.',
      5: 'Names the right area but misses a contributing root cause.',
      10: 'Names every distinct root cause precisely and proves each.'
    };
  if (n.includes('calibration') || n.includes('abstention') || n.includes('confidence'))
    return {
      0: 'Over- or under-claims; asserts where the data is silent.',
      5: 'Mostly calibrated but hedges inconsistently or over-states one point.',
      10: 'States confidence honestly; abstains exactly where evidence is insufficient.'
    };
  // Fallback by generic quality word
  return {
    0: 'Fails the criterion: the relevant quality is absent or actively wrong.',
    5: 'Partially meets the criterion: present but inconsistent or weak.',
    10: 'Fully meets the criterion: strong and consistent throughout.'
  };
}

function inject(rubricPath) {
  let txt = fs.readFileSync(rubricPath, 'utf8');
  if (/^anchors:/m.test(txt)) return false; // already present
  const fmEnd = txt.indexOf('\n---', 3);
  if (fmEnd < 0) return false;
  const fm = txt.slice(0, fmEnd);
  // find subjective criteria names
  const subs = [];
  let inSub = false;
  for (const line of fm.split('\n')) {
    const t = line.trim();
    if (t === 'subjective:') { inSub = true; continue; }
    if (t === '---' && inSub) break;
    if (inSub) {
      const im = line.match(/^\s*-?\s*id:\s*(\S+)/);
      const nm = line.match(/name:\s*"(.*?)"/);
      if (nm) subs.push({ name: nm[1] });
    }
  }
  if (!subs.length) return false;
  let block = '\nanchors:\n';
  for (const s of subs) {
    const a = anchorsFor(s.name);
    block += '  - id: ' + (s.name || 'sub') + '\n';
    block += '    0: ' + a[0] + '\n';
    block += '    5: ' + a[5] + '\n';
    block += '    10: ' + a[10] + '\n';
  }
  // insert before closing ---
  const newTxt = txt.slice(0, fmEnd) + block + txt.slice(fmEnd);
  fs.writeFileSync(rubricPath, newTxt);
  return true;
}

let added = 0, skipped = 0;
for (const f of fs.readdirSync(path.join(REPO, 'rubrics'))) {
  if (!f.endsWith('.md')) continue;
  if (inject(path.join(REPO, 'rubrics', f))) added++;
  else skipped++;
}
console.log('add-anchors: injected ' + added + ', skipped ' + skipped + ' (already had anchors)');
