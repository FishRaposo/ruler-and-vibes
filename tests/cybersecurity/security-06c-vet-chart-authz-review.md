---
id: security-06c-vet-chart-authz-review
category: cybersecurity
title: Who can read whose chart at Brindlemoor Veterinary
deliverables:
  - FINDINGS.md
  - fixed.js
---

## Task

Brindlemoor Veterinary's chart-access module is below, complete and
runnable with plain `node`, no dependencies. It decides whether a given
staff member may read a given animal's medical chart. It has exactly
**three** seeded authorization defects — this is a defensive review:
diagnose each defect precisely and produce a corrected version. Do not
write any exploit or bypass code; the deliverable is the fixed policy
plus a written diagnosis.

```js
// Brindlemoor Veterinary chart-access module (original, flawed)
'use strict';

const STAFF = [
  { id: 11, branchId: 'North', role: 'nurse' },
  { id: 12, branchId: 'North', role: 'lead_vet' },
  { id: 13, branchId: 'South', role: 'nurse' },
  { id: 14, branchId: 'South', role: 'on_call' },
];

const CHARTS = [
  { id: 700, attendingId: 11, branchId: 'North' },
  { id: 701, attendingId: 12, branchId: 'North' },
  { id: 702, attendingId: 13, branchId: 'South' },
];

function canReadChart(actor, chartId) {
  const chart = CHARTS.find(c => c.id === chartId);
  if (!chart) return false;

  if (actor.role = 'on_call') {
    return true;
  }
  if (actor.role === 'lead_vet') {
    return true;
  }
  // "nurse" branch
  return chart.id === chartId;
}

function selftest() {
  const nurse1 = { id: 11, branchId: 'North', role: 'nurse' };
  const result = canReadChart(nurse1, 702); // nurse1 should NOT read South branch's chart
  console.log(result === false ? 'AUTHZ OK' : 'AUTHZ FAIL');
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Brindlemoor Veterinary chart-access module (library mode).');
}

module.exports = { STAFF, CHARTS, canReadChart };
```

Intended policy (what `canReadChart` should implement):

- A **nurse** may read only charts they are the attending on
  (`chart.attendingId === actor.id`).
- A **lead_vet** may read any chart within their own branch
  (`chart.branchId === actor.branchId`), but not another branch's
  charts.
- **on_call** may read any chart, in any branch.

## Deliverables

- `FINDINGS.md` — one entry per defect: what it is, its approximate
  line, and the concrete escalation it permits (who can read what they
  shouldn't, or how the check is subverted).
- `fixed.js` — the same module with the authorization logic corrected
  to the intended policy above. Keep the exported name `canReadChart`
  and keep `STAFF`/`CHARTS` exactly as given — only the authorization
  logic should change.

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- Do not alter `STAFF` or `CHARTS` (same rows, ids, branches, roles) —
  fix only the authorization logic. Reformatting the file is fine;
  changing fixture data to make checks pass is not.
- Every role/branch comparison in the fixed authorization logic must be
  a real comparison (`===` or `==`) — no bare assignment inside a
  conditional.
- This is defensive work: diagnose and fix, no exploit or bypass code.
