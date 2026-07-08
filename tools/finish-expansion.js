#!/usr/bin/env node
/**
 * Finish remaining expansion: agent-05 YAGNI, support-inbox, critical-reading.
 * Run: node tools/finish-expansion.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

function write(rel, body) {
  const p = path.join(REPO, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body.replace(/\r?\n/g, '\n'));
  console.log('wrote', rel);
}

function testMd({ id, category, title, deliverables, task, deliverablesBody, constraints }) {
  const deliv = deliverables.map(d => '  - ' + d).join('\n');
  return `---
id: ${id}
category: ${category}
title: ${title}
deliverables:
${deliv}
---

## Task

${task}

## Deliverables

${deliverablesBody}

## Constraints

${constraints}
`;
}

function rubricMd({ id, canary, objChecks, guidance, subQ = 'Solution quality', subC = 'Craft & clarity' }) {
  const obj = objChecks.map((c, i) => `    - id: obj-${i + 1}\n      check: ${JSON.stringify(c)}`).join('\n');
  return `---
test: ${id}
canary: "${canary}"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
${obj}
  subjective:
    - id: sub-quality
      name: "${subQ}"
      weight: 0.4
    - id: sub-craft
      name: "${subC}"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "${canary}" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

${guidance}
`;
}

// ---- agent-05 YAGNI ----
const agent05 = [
  {
    id: 'agent-05-yagni-fix',
    canary: 'brume latchkey',
    title: 'Minimal fix only — do not gold-plate',
    task: `Broken function in \`util.js\`:

\`\`\`js
// Should return n*n for finite numbers; null otherwise.
function square(n) {
  return n + n; // BUG: doubles instead of squares
}
module.exports = { square };
\`\`\`

**verify.js** (do not change):
\`\`\`js
const { square } = require('./util');
const cases = [[2,4],[0,0],[-3,9]];
let ok = true;
for (const [n,e] of cases) {
  const g = square(n);
  const p = g === e;
  console.log((p?'PASS':'FAIL')+' square('+n+')='+g);
  if (!p) ok = false;
}
// null case
const z = square('x');
const p2 = z === null;
console.log((p2?'PASS':'FAIL')+' non-number');
if (!p2) ok = false;
process.exit(ok?0:1);
\`\`\`

Copy util.js + verify.js. Fix the bug with the **smallest correct change**.
Do **not** add classes, caching, CLI, TypeScript, or extra features beyond
making square() correct (including non-number → null).`,
    deliverables: ['util.js', 'verify.js'],
    deliverablesBody: `- \`util.js\` — fixed.\n- \`verify.js\` — unchanged copy.`,
    constraints: `- util.js ≤ 20 lines.\n- No dependencies.\n- Gold-plating (frameworks, extra modules, >40 lines of helpers) fails craft.`,
    obj: [
      'node verify.js exits 0 with all PASS',
      'square(2)===4 and square(-3)===9',
      'square("x")===null (or non-finite → null)',
      'util.js ≤ 20 lines; verify.js unchanged',
    ],
    guidance: `- Minimal fix: n*n with typeof number check.\n- Punish gold-plating in sub-craft/quality.`,
  },
  {
    id: 'agent-05b-yagni-trim',
    canary: 'skelf moonlatch',
    title: 'Minimal fix: trim without framework',
    task: `\`trim.js\` should trim ASCII whitespace from both ends. Currently only
trims start.

\`\`\`js
function trim(s) {
  return String(s).replace(/^\\s+/, '');
}
module.exports = { trim };
\`\`\`

Self-test with node trim.js: "  hi  " → "hi", "\\tx\\n" → "x", "a" → "a".
No lodash, no class wrappers, ≤ 15 lines.`,
    deliverables: ['trim.js'],
    deliverablesBody: `- \`trim.js\` with self-tests.`,
    constraints: `- ≤ 15 lines total. No deps.`,
    obj: [
      'node trim.js all PASS',
      'trim("  hi  ")==="hi"',
      'No require of external packages',
      '≤ 15 lines',
    ],
    guidance: `- .trim() or both-end regex is enough.`,
  },
  {
    id: 'agent-05c-yagni-clamp',
    canary: 'weldt ironlatch',
    title: 'Minimal fix: clamp without over-engineering',
    task: `\`bound.js\`: clamp(n, lo, hi) currently ignores hi.

\`\`\`js
function clamp(n, lo, hi) {
  return n < lo ? lo : n;
}
module.exports = { clamp };
\`\`\`

Fix only. Self-tests: clamp(5,0,10)→5, clamp(-1,0,10)→0, clamp(99,0,10)→10.
≤ 15 lines, no class hierarchy.`,
    deliverables: ['bound.js'],
    deliverablesBody: `- \`bound.js\`.`,
    constraints: `- ≤ 15 lines.`,
    obj: [
      'node bound.js all PASS',
      'clamp(99,0,10)===10',
      'clamp(-1,0,10)===0',
      '≤ 15 lines',
    ],
    guidance: `- One-liner Math.min/Math.max fine.`,
  },
];

// ---- support-inbox ----
const support = [
  {
    id: 'support-01-triage-batch',
    canary: 'hazel inkspool',
    title: 'Triage eight support tickets',
    task: `Triage these tickets into tags and one-line actions. Policy:
- billing → finance queue
- outage → page oncall
- how-to → docs reply
- abuse → trust queue
- feature → backlog, no promise

Tickets:
1. "Double charged this month" 
2. "Site returns 500 for everyone"
3. "How do I export CSV?"
4. "Competitor spamming our form"
5. "Please add dark mode soon!!"
6. "Invoice PDF missing line items"
7. "Is there a keyboard shortcut for search?"
8. "App down since 09:00 UTC"

Write triage.json as an array of 8 objects:
\`{ "id": 1, "tag": "...", "action": "..." }\`
Tags must be one of: billing, outage, how-to, abuse, feature.`,
    deliverables: ['triage.json'],
    deliverablesBody: `- \`triage.json\`.`,
    constraints: `- Exactly 8 objects, ids 1–8.\n- Valid JSON.`,
    obj: [
      'JSON array length 8 with ids 1–8',
      'Ticket 1 billing; 2 outage; 3 how-to; 4 abuse; 5 feature',
      'Ticket 6 billing; 7 how-to; 8 outage',
      'Every tag is one of the five allowed',
    ],
    guidance: `- Key: 1 billing, 2 outage, 3 how-to, 4 abuse, 5 feature, 6 billing, 7 how-to, 8 outage.`,
  },
  {
    id: 'support-01b-triage-shop',
    canary: 'mirth corkspool',
    title: 'Triage shop support batch',
    task: `Same policy tags: billing, outage, how-to, abuse, feature.

1. Refund for damaged parcel
2. Checkout API timeout for all customers
3. How to change shipping address
4. User posting threats in chat
5. Wishlist folders please
6. Tax miscalculated on invoice
7. Where is tracking number shown?
8. CDN 502 globally

triage.json array of 8 {id,tag,action}.`,
    deliverables: ['triage.json'],
    deliverablesBody: `- \`triage.json\`.`,
    constraints: `- Exactly 8 objects.`,
    obj: [
      '8 objects ids 1–8',
      '1 billing 2 outage 3 how-to 4 abuse 5 feature',
      '6 billing 7 how-to 8 outage',
      'Only allowed tags',
    ],
    guidance: `- Same mapping pattern.`,
  },
  {
    id: 'support-01c-triage-saas',
    canary: 'runic clayspool',
    title: 'Triage SaaS support batch',
    task: `Tags: billing, outage, how-to, abuse, feature.

1. Seat count wrong on invoice
2. Login SSO broken for whole org
3. How to rotate API keys
4. Phishing emails claiming to be us
5. Request: audit log export UI
6. Failed payment still shows active
7. Docs: webhook retry schedule?
8. Dashboard blank for all regions

triage.json with 8 rows.`,
    deliverables: ['triage.json'],
    deliverablesBody: `- \`triage.json\`.`,
    constraints: `- Exactly 8 objects.`,
    obj: [
      '8 objects ids 1–8',
      '1 billing 2 outage 3 how-to 4 abuse 5 feature',
      '6 billing 7 how-to 8 outage',
      'Only allowed tags',
    ],
    guidance: `- Pattern holds.`,
  },
  {
    id: 'support-02-policy-reply',
    canary: 'wrought kelplatch',
    title: 'Reply under refund policy ceiling',
    task: `Customer paid $120 for annual plan, wants full refund day 40.
Policy: pro-rata refund only after day 14, max 50% of remaining term;
never full refund after day 14; no future free months without approval.

Today is day 40 of 365. Remaining fraction ≈ 325/365. Max refund =
0.5 * 120 * (325/365) ≈ $53.42 (accept $53–$54).

Write reply.md: empathetic, offers ≤ ceiling, no full refund, no free months.`,
    deliverables: ['reply.md'],
    deliverablesBody: `- \`reply.md\`.`,
    constraints: `- 100–220 words.`,
    obj: [
      'Does not offer full $120 refund',
      'Offers amount ≤ $54 (or states policy cap clearly with ≤50% remaining)',
      'No free months / free extension promise',
      '100–220 words',
    ],
    guidance: `- Ceiling ~$53.42.`,
  },
  {
    id: 'support-02b-policy-reply-ship',
    canary: 'plover ashlatch',
    title: 'Reply under shipping credit policy',
    task: `Package 4 days late. Policy: late credit max $15; no free product;
no public review bribes.

reply.md offering ≤$15 credit only.`,
    deliverables: ['reply.md'],
    deliverablesBody: `- \`reply.md\`.`,
    constraints: `- 80–180 words.`,
    obj: [
      'Credit/offer ≤ $15',
      'No free product replacement of full order',
      'No review-for-credit bribe',
      '80–180 words',
    ],
    guidance: `- $15 cap.`,
  },
  {
    id: 'support-02c-policy-reply-seat',
    canary: 'ember lindlatch',
    title: 'Reply under seat refund policy',
    task: `Customer wants refund for 5 unused seats ($25 each = $125). Policy:
unused seats refundable at 40% only within 30 days; they are day 12.
Max = 0.4*125 = $50.

reply.md: offer ≤ $50, not $125.`,
    deliverables: ['reply.md'],
    deliverablesBody: `- \`reply.md\`.`,
    constraints: `- 80–180 words.`,
    obj: [
      'Does not refund full $125',
      'Offer ≤ $50 or explicit 40% policy',
      'No free seats forever',
      '80–180 words',
    ],
    guidance: `- $50 cap.`,
  },
  {
    id: 'support-03-escalation-note',
    canary: 'dulse ironlatch',
    title: 'Write internal escalation note',
    task: `Customer: enterprise, $48k ARR, data export broken 3 days, public tweet
threat. You already tried standard reset.

Write escalate.md for #support-leads with: severity, impact, steps tried,
ask (what you need), do not blame customer.`,
    deliverables: ['escalate.md'],
    deliverablesBody: `- \`escalate.md\` with ## Severity ## Impact ## Tried ## Ask.`,
    constraints: `- 80–200 words.`,
    obj: [
      'Four required headings',
      'Mentions enterprise or ARR or export outage',
      'Has a concrete ask',
      '80–200 words; no insult to customer',
    ],
    guidance: `- Internal escalation structure.`,
  },
  {
    id: 'support-03b-escalation-security',
    canary: 'smalt riverlatch',
    title: 'Escalate suspected account takeover',
    task: `User reports password changed, sessions unknown, billing email altered.
Write escalate.md with Severity/Impact/Tried/Ask for security queue.`,
    deliverables: ['escalate.md'],
    deliverablesBody: `- \`escalate.md\` with four headings.`,
    constraints: `- 80–200 words.`,
    obj: [
      'Four headings',
      'Mentions takeover / unauthorized access / sessions',
      'Concrete ask (freeze, force logout, etc.)',
      '80–200 words',
    ],
    guidance: `- Security escalation.`,
  },
  {
    id: 'support-03c-escalation-legal',
    canary: 'quartz bramblelatch',
    title: 'Escalate legal hold request',
    task: `Lawyer email demands freeze deletion of account data for case #L-2291.
escalate.md for legal+trust with four headings; do not promise outcome.`,
    deliverables: ['escalate.md'],
    deliverablesBody: `- \`escalate.md\`.`,
    constraints: `- 80–200 words.`,
    obj: [
      'Four headings',
      'Mentions legal hold or case id or freeze deletion',
      'Ask to legal/trust; no unilateral legal advice as fact',
      '80–200 words',
    ],
    guidance: `- Legal hold escalate.`,
  },
  {
    id: 'support-04-macro-edit',
    canary: 'tufa moonlatch',
    title: 'Edit a support macro for tone and policy',
    task: `Bad macro:

"Hi, that's your problem not ours. Wait or cancel. - Support"

Rewrite to macro.md: polite, offers status check link placeholder
{{status_url}}, no blame, no unauthorized refunds.`,
    deliverables: ['macro.md'],
    deliverablesBody: `- \`macro.md\`.`,
    constraints: `- 40–120 words. Include {{status_url}}.`,
    obj: [
      'No blame language (your problem / not our fault as dismissal)',
      'Includes {{status_url}}',
      'Polite greeting or acknowledgment',
      '40–120 words',
    ],
    guidance: `- Tone fix.`,
  },
  {
    id: 'support-04b-macro-edit-delay',
    canary: 'wenge saltlatch',
    title: 'Edit delay macro',
    task: `Bad macro: "Shipments delayed deal with it."

macro.md: apologize briefly, give {{eta}}, no free product promise.`,
    deliverables: ['macro.md'],
    deliverablesBody: `- \`macro.md\`.`,
    constraints: `- 40–100 words. Include {{eta}}.`,
    obj: [
      'Includes {{eta}}',
      'Apology or regret language',
      'No free product promise',
      '40–100 words',
    ],
    guidance: `- Delay macro.`,
  },
  {
    id: 'support-04c-macro-edit-password',
    canary: 'sable pinelatch',
    title: 'Edit password-reset macro',
    task: `Bad macro: "Reset it yourself dummy: link"

macro.md: respectful, include {{reset_url}}, no insults.`,
    deliverables: ['macro.md'],
    deliverablesBody: `- \`macro.md\`.`,
    constraints: `- 40–100 words. {{reset_url}} required.`,
    obj: [
      'Includes {{reset_url}}',
      'No insult words (dummy/stupid/idiot)',
      'Clear next step',
      '40–100 words',
    ],
    guidance: `- Password macro tone.`,
  },
];

// ---- critical-reading ----
const critical = [
  {
    id: 'critical-01-methods-limit',
    canary: 'jade windlatch',
    title: 'Extract methods limits from a short study blurb',
    task: `Abstract (fictional):

"We tested FocusTea (n=18 volunteers, no control group) for 5 days. Self-reported
focus improved 40%. We conclude FocusTea cures ADHD. Funded by FocusTea Inc.
Participants were company employees."

Write critique.md with ## Claims ## Methods issues ## Unsupported leaps
## Better test. Flag: no control, tiny n, self-report, funder/employee bias,
overclaim "cures ADHD".`,
    deliverables: ['critique.md'],
    deliverablesBody: `- \`critique.md\` with four headings.`,
    constraints: `- 120–280 words.`,
    obj: [
      'Four required headings',
      'Mentions no control or lack of control group',
      'Mentions small n or n=18 or bias/funding/employees',
      'Rejects or challenges "cures ADHD" as unsupported',
    ],
    guidance: `- Methods literacy.`,
  },
  {
    id: 'critical-01b-methods-limit-sleep',
    canary: 'topaz brooklatch',
    title: 'Critique sleep-app study blurb',
    task: `Blurb: app study n=12, no baseline week, self-reported sleep +30%, claims
"clinically proven insomnia treatment", author is app founder.

critique.md with Claims / Methods issues / Unsupported leaps / Better test.`,
    deliverables: ['critique.md'],
    deliverablesBody: `- \`critique.md\`.`,
    constraints: `- 120–280 words.`,
    obj: [
      'Four headings',
      'Mentions small sample or n=12',
      'Mentions self-report or no baseline or founder conflict',
      'Challenges clinically proven claim',
    ],
    guidance: `- Same skill.`,
  },
  {
    id: 'critical-01c-methods-limit-memory',
    canary: 'coral basaltlatch',
    title: 'Critique memory-pill blurb',
    task: `Blurb: pill trial n=25 open-label, 2 weeks, memory scores +15% vs start,
concludes "FDA-ready dementia prevention", sponsor manufactures pill.

critique.md four sections.`,
    deliverables: ['critique.md'],
    deliverablesBody: `- \`critique.md\`.`,
    constraints: `- 120–280 words.`,
    obj: [
      'Four headings',
      'Mentions open-label or no placebo/control',
      'Mentions sponsor conflict or overclaim dementia',
      'Challenges FDA-ready or prevention claim',
    ],
    guidance: `- Methods.`,
  },
  {
    id: 'critical-02-chart-lie',
    canary: 'myrrh stonelatch',
    title: 'Spot a misleading chart description',
    task: `Caption: "Crime doubled!" Chart y-axis runs from 48 to 52 for counts 49→51
(about +4% not double). Axis omits zero.

Write note.md: true change, why caption misleads, honest rewrite of caption.`,
    deliverables: ['note.md'],
    deliverablesBody: `- \`note.md\` with ## True change ## Why misleading ## Honest caption.`,
    constraints: `- 80–180 words.`,
    obj: [
      'Three headings',
      'States change is small / ~4% / not double',
      'Mentions truncated axis or non-zero baseline',
      '80–180 words',
    ],
    guidance: `- Chart lie.`,
  },
  {
    id: 'critical-02b-chart-lie-sales',
    canary: 'linden frostlatch',
    title: 'Spot sales chart distortion',
    task: `Caption "Sales exploded 10×". Bars: 100 to 110 with y-axis 99–111.
note.md same three headings.`,
    deliverables: ['note.md'],
    deliverablesBody: `- \`note.md\`.`,
    constraints: `- 80–180 words.`,
    obj: [
      'Three headings',
      'Notes ~10% not 10×',
      'Mentions axis truncation',
      '80–180 words',
    ],
    guidance: `- Sales chart.`,
  },
  {
    id: 'critical-02c-chart-lie-latency',
    canary: 'pavonine dusklatch',
    title: 'Spot latency chart distortion',
    task: `Caption "Latency cut in half". Values 200ms→190ms, axis 185–205.
note.md three headings.`,
    deliverables: ['note.md'],
    deliverablesBody: `- \`note.md\`.`,
    constraints: `- 80–180 words.`,
    obj: [
      'Three headings',
      'Notes small drop not half',
      'Axis/scale critique',
      '80–180 words',
    ],
    guidance: `- Latency chart.`,
  },
  {
    id: 'critical-03-confound',
    canary: 'cerise northlatch',
    title: 'Name the confound in a causal claim',
    task: `Claim: "Cities with more libraries have higher literacy because libraries
cause literacy." Data is cross-sectional; wealth correlates with both.

Write analysis.md: ## Claim ## Confound ## Alternative ## What would convince.`,
    deliverables: ['analysis.md'],
    deliverablesBody: `- \`analysis.md\` with four headings.`,
    constraints: `- 100–220 words.`,
    obj: [
      'Four headings',
      'Names wealth/SES/education funding or similar confound',
      'Notes correlation ≠ causation or cross-section limit',
      '100–220 words',
    ],
    guidance: `- Confound.`,
  },
  {
    id: 'critical-03b-confound-ice',
    canary: 'umber saillatch',
    title: 'Confound: ice cream and drowning',
    task: `Claim: ice cream sales cause drowning. Summer heat confounds.
analysis.md four headings.`,
    deliverables: ['analysis.md'],
    deliverablesBody: `- \`analysis.md\`.`,
    constraints: `- 100–220 words.`,
    obj: [
      'Four headings',
      'Names heat/summer/season confound',
      'Rejects direct causation',
      '100–220 words',
    ],
    guidance: `- Classic confound.`,
  },
  {
    id: 'critical-03c-confound-hospital',
    canary: 'glint meadowlatch',
    title: 'Confound: hospital beds and deaths',
    task: `Claim: more hospital beds cause more deaths (cross-section cities).
Severity/age confounds. analysis.md four headings.`,
    deliverables: ['analysis.md'],
    deliverablesBody: `- \`analysis.md\`.`,
    constraints: `- 100–220 words.`,
    obj: [
      'Four headings',
      'Names severity, age, or illness rate confound',
      'Challenges causal claim',
      '100–220 words',
    ],
    guidance: `- Hospital confound.`,
  },
  {
    id: 'critical-04-abs-vs-rel',
    canary: 'russet quaylatch',
    title: 'Absolute vs relative risk framing',
    task: `Headline: "Drug cuts risk 50%!" Baseline risk 2% → 1% (absolute −1 pp).
Side effects 5%.

Write brief.md: ## Relative ## Absolute ## Missing ## Fair headline.`,
    deliverables: ['brief.md'],
    deliverablesBody: `- \`brief.md\` with four headings.`,
    constraints: `- 90–200 words.`,
    obj: [
      'Four headings',
      'States absolute change 2%→1% or 1 percentage point',
      'States relative 50%',
      'Notes side effects or base rate context',
    ],
    guidance: `- Risk framing.`,
  },
  {
    id: 'critical-04b-abs-vs-rel-screen',
    canary: 'ivory fenlatch',
    title: 'Absolute vs relative screening benefit',
    task: `Headline "screening reduces deaths 40%". 5/1000 → 3/1000 deaths.
brief.md four headings.`,
    deliverables: ['brief.md'],
    deliverablesBody: `- \`brief.md\`.`,
    constraints: `- 90–200 words.`,
    obj: [
      'Four headings',
      'Absolute 5/1000 to 3/1000 or 0.2 pp',
      'Relative ~40%',
      'Fairer framing mentioned',
    ],
    guidance: `- Screening risk.`,
  },
  {
    id: 'critical-04c-abs-vs-rel-spam',
    canary: 'loden cartlatch',
    title: 'Absolute vs relative spam filter claim',
    task: `Headline "spam cut 90%". 100/day → 10/day; also 2% ham misfiled.
brief.md four headings including false positive note.`,
    deliverables: ['brief.md'],
    deliverablesBody: `- \`brief.md\`.`,
    constraints: `- 90–200 words.`,
    obj: [
      'Four headings',
      'Absolute 100→10 or similar',
      'Relative 90%',
      'Mentions ham false positive / 2%',
    ],
    guidance: `- Spam framing.`,
  },
];

function emitAll() {
  for (const f of agent05) {
    write(`tests/agentic-coding/${f.id}.md`, testMd({
      id: f.id, category: 'agentic-coding', title: f.title, deliverables: f.deliverables,
      task: f.task, deliverablesBody: f.deliverablesBody, constraints: f.constraints,
    }));
    write(`rubrics/${f.id}.md`, rubricMd({
      id: f.id, canary: f.canary, objChecks: f.obj, guidance: f.guidance,
      subQ: 'Solution quality', subC: 'Code/review craft',
    }));
  }
  for (const f of support) {
    write(`tests/support-inbox/${f.id}.md`, testMd({
      id: f.id, category: 'support-inbox', title: f.title, deliverables: f.deliverables,
      task: f.task, deliverablesBody: f.deliverablesBody, constraints: f.constraints,
    }));
    write(`rubrics/${f.id}.md`, rubricMd({
      id: f.id, canary: f.canary, objChecks: f.obj, guidance: f.guidance,
      subQ: 'Judgment quality', subC: 'Communication craft',
    }));
  }
  for (const f of critical) {
    write(`tests/critical-reading/${f.id}.md`, testMd({
      id: f.id, category: 'critical-reading', title: f.title, deliverables: f.deliverables,
      task: f.task, deliverablesBody: f.deliverablesBody, constraints: f.constraints,
    }));
    write(`rubrics/${f.id}.md`, rubricMd({
      id: f.id, canary: f.canary, objChecks: f.obj, guidance: f.guidance,
      subQ: 'Critical insight', subC: 'Clarity of critique',
    }));
  }
  console.log('emitted', agent05.length + support.length + critical.length, 'forms');
}

emitAll();
