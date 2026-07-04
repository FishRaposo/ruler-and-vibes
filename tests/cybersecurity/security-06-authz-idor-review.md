---
id: security-06-authz-idor-review
category: cybersecurity
title: Who can read whose invoice at Kestrel Billing
deliverables:
  - FINDINGS.md
  - fixed.js
---

## Task

Kestrel Billing's authorization module is below, complete and runnable
with plain `node`, no dependencies. It decides whether a given actor
may read a given invoice. It has exactly **three** seeded authorization
defects — this is a defensive review: diagnose each defect precisely
and produce a corrected version. Do not write any exploit or bypass
code; the deliverable is the fixed policy plus a written diagnosis.

```js
// Kestrel Billing authorization module (original, flawed)
'use strict';

const USERS = [
  { id: 1, orgId: 'A', role: 'member' },
  { id: 2, orgId: 'A', role: 'org_admin' },
  { id: 3, orgId: 'B', role: 'member' },
  { id: 4, orgId: 'B', role: 'support' },
];

const INVOICES = [
  { id: 100, ownerId: 1, orgId: 'A' },
  { id: 101, ownerId: 2, orgId: 'A' },
  { id: 102, ownerId: 3, orgId: 'B' },
];

function canReadInvoice(actor, invoiceId) {
  const invoice = INVOICES.find(i => i.id === invoiceId);
  if (!invoice) return false;

  if (actor.role = 'support') {
    return true;
  }
  if (actor.role === 'org_admin') {
    return true;
  }
  // "member" branch
  return invoice.id === invoiceId;
}

function selftest() {
  const member1 = { id: 1, orgId: 'A', role: 'member' };
  const result = canReadInvoice(member1, 102); // member1 should NOT read org B's invoice
  console.log(result === false ? 'AUTHZ OK' : 'AUTHZ FAIL');
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Kestrel Billing authz module (library mode).');
}

module.exports = { USERS, INVOICES, canReadInvoice };
```

Intended policy (what `canReadInvoice` should implement):

- A **member** may read only invoices they own (`invoice.ownerId ===
  actor.id`).
- An **org_admin** may read any invoice within their own org
  (`invoice.orgId === actor.orgId`), but not another org's invoices.
- **support** may read any invoice, in any org.

## Deliverables

- `FINDINGS.md` — one entry per defect: what it is, its approximate
  line, and the concrete escalation it permits (who can read what they
  shouldn't, or how the check is subverted).
- `fixed.js` — the same module with the authorization logic corrected
  to the intended policy above. Keep the exported name
  `canReadInvoice` and keep `USERS`/`INVOICES` exactly as given —
  only the authorization logic should change.

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- Do not alter `USERS` or `INVOICES` (same rows, ids, orgs, roles) —
  fix only the authorization logic. Reformatting the file is fine;
  changing fixture data to make checks pass is not.
- Every role/org comparison in the fixed authorization logic must be a
  real comparison (`===` or `==`) — no bare assignment inside a
  conditional.
- This is defensive work: diagnose and fix, no exploit or bypass code.
