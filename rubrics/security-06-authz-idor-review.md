---
test: security-06-authz-idor-review
canary: "lingonwood millrace beryl"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge imports canReadInvoice from the runner's fixed.js and evaluates its OWN reference matrix: a plain member CANNOT read another member's invoice; an org_admin CAN read a same-org invoice they don't own; an org_admin CANNOT read a different-org invoice; and calling the check does NOT mutate the actor's role (asserted directly, not trusting a runner-pasted self-test)"
    - id: obj-2
      check: "FINDINGS.md identifies all three seeded defects — the IDOR/missing-ownership check, the `=` assignment where `===`/`==` was intended, and the cross-org org_admin scoping gap — each with an approximately correct line reference; missing any one fails. Judge-decided by reading."
    - id: obj-3
      check: "In fixed.js, the judge reads each authorization conditional and confirms every role/org comparison is a real comparison (=== or ==), with no bare single `=` assignment inside any conditional; a solution leaving the assignment bug fails even if a self-test is coaxed to pass"
    - id: obj-4
      check: "The judge imports fixed.js and calls canReadInvoice with a member and a non-owned invoice id; it must return false (IDOR closed)"
    - id: obj-5
      check: "fixed.js keeps the exported name canReadInvoice and the USERS/INVOICES fixtures semantically unchanged and not weakened (same rows/ids/orgs/roles as the original); only the authorization logic changed. Reformatting is fine; altering fixture data to force the matrix is a fail."
  subjective:
    - id: sub-quality
      name: "Access-control correctness and completeness"
      weight: 0.4
    - id: sub-craft
      name: "Findings precision and escalation framing"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Access-control correctness and completeness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Findings precision and escalation framing
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "lingonwood millrace beryl" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Import the runner's `fixed.js` and run the reference matrix below
yourself — do not trust a runner-pasted self-test.

### The three seeded defects (reference)

1. **D1 — IDOR**: the `member` branch (`return invoice.id ===
   invoiceId`) is tautologically true whenever the invoice exists
   (it was already looked up by that id) — it never compares
   `invoice.ownerId` to `actor.id`. Any member can read any invoice by
   guessing/incrementing its id.
2. **D2 — assignment, not comparison**: `if (actor.role = 'support')`
   assigns the string `'support'` to `actor.role` and evaluates the
   assignment's value (always truthy), so this branch is *always*
   taken for *every* caller, and it *mutates the actor object* to have
   `role: 'support'` as a side effect. Confirmed by execution: calling
   `canReadInvoice(member1, ...)` leaves `member1.role === 'support'`
   afterward.
3. **D3 — cross-org scoping gap on org_admin**: the `org_admin` branch
   is `return true` with no org comparison at all, so an org_admin in
   org B can read org A's invoices — org_admin should be scoped to
   their own org (support is the only role meant to read cross-org).
   This gap is independent of D1/D2: even after the member branch gets
   an ownership check and the `=`/`===` typo is fixed, the org_admin
   branch still needs an explicit `invoice.orgId === actor.orgId`
   check, which the original never had.

### Reference fixed.js

```js
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

  if (actor.role === 'support') return true;
  if (actor.role === 'org_admin') return invoice.orgId === actor.orgId;
  return invoice.ownerId === actor.id;
}

module.exports = { USERS, INVOICES, canReadInvoice };
```

### Reference matrix (the judge's own harness)

Verified by execution during authoring — all rows pass against the
reference `fixed.js` above:

| Actor | Invoice | Expected |
|---|---|---|
| member1 (id1, orgA) | 100 (own) | true |
| member1 (id1, orgA) | 101 (orgA, not owned) | **false** |
| member1 (id1, orgA) | 102 (orgB) | **false** |
| org_admin2 (orgA) | 100 (orgA, not owned) | true |
| org_admin2 (orgA) | 102 (orgB) | **false** |
| support4 (orgB) | 100 (orgA) | true |
| support4 (orgB) | 102 (orgB) | true |

Plus: after any call, `actor.role` on the passed-in object must be
unchanged from before the call (isolates D2).

A **partial fix** that closes only D1 (adds ownership check to the
member branch) but leaves `actor.role = 'support'` unfixed still fails
the matrix: confirmed by execution — with D2 left in place, calling
`canReadInvoice(member1, 101)` (member1 reading a same-org invoice
they don't own) returns `true` and mutates `member1.role` to
`'support'`, because the buggy assignment branch fires before the
member branch is ever reached. This is the trap: fixing the obvious
IDOR alone is not sufficient.

### Per-check guidance

- **obj-1**: run the full reference matrix above against the
  submission's imported `fixed.js`. All rows plus the no-mutation
  check must pass.
- **obj-2**: accept line numbers within a few lines of the actual
  location. Example phrasings (apply the same standard to equivalent
  wordings):
  - PASS (D1/IDOR): "the member branch returns `invoice.id ===
    invoiceId`, which is always true once the invoice was already
    found by that id — it never checks `ownerId` against the actor,
    so any member can read any invoice by id."
  - PASS (D2/assignment): "`if (actor.role = 'support')` is a single
    `=`, so it assigns instead of compares — the branch is always
    truthy and it overwrites the actor's role as a side effect,
    granting everyone support access."
  - PASS (D3/cross-org): "the org_admin branch returns `true`
    unconditionally with no `orgId` comparison, so an admin from org B
    can read org A's invoices."
  - FAIL (too vague): "there's an authorization bug in the member
    check" (doesn't name the missing ownership comparison).
  - FAIL (too vague): "the code has a typo, and access control could
    be tighter in a couple of places" (doesn't identify the
    assignment-vs-comparison bug or its mutation effect, and names no
    concrete org-scoping gap).
- **obj-3**: read every conditional in the authorization path; reject
  any bare `=` inside an `if (...)`.
- **obj-4**: direct call — `canReadInvoice({id: 1, orgId: 'A', role:
  'member'}, 101)` (a same-org invoice belonging to a different user)
  must return `false`.
- **obj-5**: diff `USERS`/`INVOICES` against the original — same ids,
  orgIds, roles, ownerIds. `canReadInvoice` must remain the exported
  name.

### Subjective guidance

- **Access-control correctness and completeness**: does the fix
  correctly encode all three role tiers' policies, not just patch the
  two most obvious defects? Penalize any solution that special-cases
  specific ids/orgs instead of comparing fields generically.
- **Findings precision and escalation framing**: does FINDINGS.md
  state each defect's concrete escalation (who gains access to what)
  rather than a generic "this looks insecure"?
- **Reasoning quality**: does REASONING.md show the runner traced
  through the assignment bug's actual runtime effect (truthy branch +
  mutation), not just noticed the `=`/`===` typo pattern by rote?
