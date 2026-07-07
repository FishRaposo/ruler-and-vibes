---
id: security-06b-clinic-chart-review
category: cybersecurity
title: Who can read whose chart at Brambleton Health
deliverables:
  - FINDINGS.md
  - fixed.js
---

## Task

Brambleton Health's chart-access module is below, complete and runnable
with plain `node`, no dependencies. It decides whether a given staff
member may read a given patient chart. It has exactly **three** seeded
authorization defects — this is a defensive review: diagnose each defect
precisely and produce a corrected version. Do not write any exploit or
bypass code; the deliverable is the fixed policy plus a written
diagnosis.

```js
// Brambleton Health chart-access module (original, flawed)
'use strict';

const STAFF = [
  { id: 10, clinicId: 'RH', role: 'nurse' },
  { id: 11, clinicId: 'RH', role: 'clinic_lead' },
  { id: 12, clinicId: 'WG', role: 'nurse' },
  { id: 13, clinicId: 'WG', role: 'on_call' },
];

const CHARTS = [
  { id: 500, assignedTo: 10, clinicId: 'RH' },
  { id: 501, assignedTo: 11, clinicId: 'RH' },
  { id: 502, assignedTo: 12, clinicId: 'WG' },
];

function canReadChart(actor, chartId) {
  const chart = CHARTS.find(c => c.id === chartId);
  if (!chart) return false;

  if (actor.role = 'on_call') {
    return true;
  }
  if (actor.role === 'clinic_lead') {
    return true;
  }
  // "nurse" branch
  return chart.id === chartId;
}

function selftest() {
  const nurse10 = { id: 10, clinicId: 'RH', role: 'nurse' };
  const result = canReadChart(nurse10, 502); // nurse10 should NOT read clinic WG's chart
  console.log(result === false ? 'AUTHZ OK' : 'AUTHZ FAIL');
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Brambleton Health chart-access module (library mode).');
}

module.exports = { STAFF, CHARTS, canReadChart };
```

Intended policy (what `canReadChart` should implement):

- A **nurse** may read only charts they are assigned to
  (`chart.assignedTo === actor.id`).
- A **clinic_lead** may read any chart within their own clinic
  (`chart.clinicId === actor.clinicId`), but not another clinic's
  charts.
- **on_call** may read any chart, in any clinic.

## Deliverables

- `FINDINGS.md` — one entry per defect: what it is, its approximate
  line, and the concrete escalation it permits (who can read what they
  shouldn't, or how the check is subverted).
- `fixed.js` — the same module with the authorization logic corrected
  to the intended policy above. Keep the exported name
  `canReadChart` and keep `STAFF`/`CHARTS` exactly as given — only the
  authorization logic should change.

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- Do not alter `STAFF` or `CHARTS` (same rows, ids, clinics, roles) —
  fix only the authorization logic. Reformatting the file is fine;
  changing fixture data to make checks pass is not.
- Every role/clinic comparison in the fixed authorization logic must be
  a real comparison (`===` or `==`) — no bare assignment inside a
  conditional.
- This is defensive work: diagnose and fix, no exploit or bypass code.
