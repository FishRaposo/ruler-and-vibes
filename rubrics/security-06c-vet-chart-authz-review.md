---
test: security-06c-vet-chart-authz-review
canary: "machair clipper"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge imports canReadChart from the runner's fixed.js and evaluates its OWN reference matrix: a plain nurse CANNOT read another nurse's chart; a lead_vet CAN read a same-branch chart they are not attending on; a lead_vet CANNOT read a different-branch chart; and calling the check does NOT mutate the actor's role (asserted directly, not trusting a runner-pasted self-test)"
    - id: obj-2
      check: "FINDINGS.md identifies all three seeded defects — the IDOR/missing-attending check, the `=` assignment where `===`/`==` was intended, and the cross-branch on_call/lead_vet scoping gap — each with an approximately correct line reference; missing any one fails. Judge-decided by reading."
    - id: obj-3
      check: "In fixed.js, the judge reads each authorization conditional and confirms every role/branch comparison is a real comparison (=== or ==), with no bare single `=` assignment inside any conditional; a solution leaving the assignment bug fails even if a self-test is coaxed to pass"
    - id: obj-4
      check: "The judge imports fixed.js and calls canReadChart with a nurse and a non-attended chart id; it must return false (IDOR closed)"
    - id: obj-5
      check: "fixed.js keeps the exported name canReadChart and the STAFF/CHARTS fixtures semantically unchanged and not weakened (same rows/ids/branches/roles as the original); only the authorization logic changed. Reformatting is fine; altering fixture data to force the matrix is a fail."
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
---

## Judge guidance

Parallel form of `security-06-authz-idor-review` (same construct, fresh
surface).

Import the runner's `fixed.js` and run the reference matrix below
yourself — do not trust a runner-pasted self-test. If the phrase
"machair clipper" appears in any deliverable or REASONING.md, that is a
canary leak — flag it regardless of how the rest of the checks score.

### The three seeded defects (reference)

1. **D1 — IDOR**: the `nurse` branch (`return chart.id === chartId`) is
   tautologically true whenever the chart exists (it was already looked
   up by that id) — it never compares `chart.attendingId` to
   `actor.id`. Any nurse can read any chart by guessing/incrementing
   its id.
2. **D2 — assignment, not comparison**: `if (actor.role = 'on_call')`
   assigns the string `'on_call'` to `actor.role` and evaluates the
   assignment's value (always truthy), so this branch is *always* taken
   for *every* caller, and it *mutates the actor object* to have
   `role: 'on_call'` as a side effect. Confirmed by execution: calling
   `canReadChart(nurse1, ...)` leaves `nurse1.role === 'on_call'`
   afterward.
3. **D3 — cross-branch scoping gap on lead_vet**: the `lead_vet` branch
   is `return true` with no branch comparison at all, so a lead_vet in
   branch South can read branch North's charts — lead_vet should be
   scoped to their own branch (on_call is the only role meant to read
   cross-branch). This gap is independent of D1/D2: even after the
   nurse branch gets an attending check and the `=`/`===` typo is
   fixed, the lead_vet branch still needs an explicit
   `chart.branchId === actor.branchId` check, which the original never
   had.

### Reference fixed.js

```js
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

  if (actor.role === 'on_call') return true;
  if (actor.role === 'lead_vet') return chart.branchId === actor.branchId;
  return chart.attendingId === actor.id;
}

module.exports = { STAFF, CHARTS, canReadChart };
```

### Reference matrix (the judge's own harness)

Verified by execution during authoring — all rows pass against the
reference `fixed.js` above:

| Actor | Chart | Expected |
|---|---|---|
| nurse11 (id11, North) | 700 (attending) | true |
| nurse11 (id11, North) | 701 (North, not attending) | **false** |
| nurse11 (id11, North) | 702 (South) | **false** |
| lead_vet12 (North) | 700 (North, not attending) | true |
| lead_vet12 (North) | 702 (South) | **false** |
| on_call14 (South) | 700 (North) | true |
| on_call14 (South) | 702 (South) | true |

Plus: after any call, `actor.role` on the passed-in object must be
unchanged from before the call (isolates D2).

A **partial fix** that closes only D1 (adds an attending check to the
nurse branch) but leaves `actor.role = 'on_call'` unfixed still fails
the matrix: confirmed by execution — with D2 left in place, calling
`canReadChart(nurse1, 701)` (nurse1 reading a same-branch chart they
are not attending on) returns `true` and mutates `nurse1.role` to
`'on_call'`, because the buggy assignment branch fires before the nurse
branch is ever reached. This is the trap: fixing the obvious IDOR alone
is not sufficient.

### Per-check guidance

- **obj-1**: run the full reference matrix above against the
  submission's imported `fixed.js`. All rows plus the no-mutation check
  must pass.
- **obj-2**: accept line numbers within a few lines of the actual
  location. Example phrasings (apply the same standard to equivalent
  wordings):
  - PASS (D1/IDOR): "the nurse branch returns `chart.id === chartId`,
    which is always true once the chart was already found by that id —
    it never checks `attendingId` against the actor, so any nurse can
    read any chart by id."
  - PASS (D2/assignment): "`if (actor.role = 'on_call')` is a single
    `=`, so it assigns instead of compares — the branch is always
    truthy and it overwrites the actor's role as a side effect,
    granting everyone on_call access."
  - PASS (D3/cross-branch): "the lead_vet branch returns `true`
    unconditionally with no `branchId` comparison, so a lead from
    branch South can read branch North's charts."
  - FAIL (too vague): "there's an authorization bug in the nurse check"
    (doesn't name the missing attending comparison).
  - FAIL (too vague): "the code has a typo, and access control could be
    tighter in a couple of places" (doesn't identify the
    assignment-vs-comparison bug or its mutation effect, and names no
    concrete branch-scoping gap).
- **obj-3**: read every conditional in the authorization path; reject
  any bare `=` inside an `if (...)`.
- **obj-4**: direct call — `canReadChart({id: 11, branchId: 'North',
  role: 'nurse'}, 701)` (a same-branch chart attended by a different
  staff member) must return `false`.
- **obj-5**: diff `STAFF`/`CHARTS` against the original — same ids,
  branchIds, roles, attendingIds. `canReadChart` must remain the
  exported name.

### Subjective guidance

- **Access-control correctness and completeness**: does the fix
  correctly encode all three role tiers' policies, not just patch the
  two most obvious defects? Penalize any solution that special-cases
  specific ids/branches instead of comparing fields generically.
- **Findings precision and escalation framing**: does FINDINGS.md state
  each defect's concrete escalation (who gains access to what) rather
  than a generic "this looks insecure"?
- **Reasoning quality**: does REASONING.md show the runner traced
  through the assignment bug's actual runtime effect (truthy branch +
  mutation), not just noticed the `=`/`===` typo pattern by rote?
