---
test: security-06b-clinic-chart-review
canary: "moraine schooner"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge imports canReadChart from the runner's fixed.js and evaluates its OWN reference matrix: a plain nurse CANNOT read another nurse's chart; a clinic_lead CAN read a same-clinic chart they aren't assigned to; a clinic_lead CANNOT read a different-clinic chart; and calling the check does NOT mutate the actor's role (asserted directly, not trusting a runner-pasted self-test)"
    - id: obj-2
      check: "FINDINGS.md identifies all three seeded defects — the IDOR/missing-assignment check, the `=` assignment where `===`/`==` was intended, and the cross-clinic clinic_lead scoping gap — each with an approximately correct line reference; missing any one fails. Judge-decided by reading."
    - id: obj-3
      check: "In fixed.js, the judge reads each authorization conditional and confirms every role/clinic comparison is a real comparison (=== or ==), with no bare single `=` assignment inside any conditional; a solution leaving the assignment bug fails even if a self-test is coaxed to pass"
    - id: obj-4
      check: "The judge imports fixed.js and calls canReadChart with a nurse and a non-assigned chart id; it must return false (IDOR closed)"
    - id: obj-5
      check: "fixed.js keeps the exported name canReadChart and the STAFF/CHARTS fixtures semantically unchanged and not weakened (same rows/ids/clinics/roles as the original); only the authorization logic changed. Reformatting is fine; altering fixture data to force the matrix is a fail."
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

Parallel form of `security-06-authz-idor-review` (same construct, fresh
surface).

If the phrase "moraine schooner" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Import the runner's `fixed.js` and run the reference matrix below
yourself — do not trust a runner-pasted self-test.

### The three seeded defects (reference)

1. **D1 — IDOR**: the `nurse` branch (`return chart.id === chartId`) is
   tautologically true whenever the chart exists (it was already looked
   up by that id) — it never compares `chart.assignedTo` to `actor.id`.
   Any nurse can read any chart by guessing/incrementing its id.
2. **D2 — assignment, not comparison**: `if (actor.role = 'on_call')`
   assigns the string `'on_call'` to `actor.role` and evaluates the
   assignment's value (always truthy), so this branch is *always* taken
   for *every* caller, and it *mutates the actor object* to have
   `role: 'on_call'` as a side effect. Confirmed by execution: calling
   `canReadChart(nurse10, ...)` leaves `nurse10.role === 'on_call'`
   afterward.
3. **D3 — cross-clinic scoping gap on clinic_lead**: the `clinic_lead`
   branch is `return true` with no clinic comparison at all, so a
   clinic_lead in clinic WG can read clinic RH's charts — a clinic_lead
   should be scoped to their own clinic (on_call is the only role meant
   to read cross-clinic). This gap is independent of D1/D2: even after
   the nurse branch gets an assignment check and the `=`/`===` typo is
   fixed, the clinic_lead branch still needs an explicit
   `chart.clinicId === actor.clinicId` check, which the original never
   had.

### Reference fixed.js

```js
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

  if (actor.role === 'on_call') return true;
  if (actor.role === 'clinic_lead') return chart.clinicId === actor.clinicId;
  return chart.assignedTo === actor.id;
}

module.exports = { STAFF, CHARTS, canReadChart };
```

### Reference matrix (the judge's own harness)

Verified by execution during authoring — all rows pass against the
reference `fixed.js` above:

| Actor | Chart | Expected |
|---|---|---|
| nurse10 (id10, RH) | 500 (assigned) | true |
| nurse10 (id10, RH) | 501 (RH, not assigned) | **false** |
| nurse10 (id10, RH) | 502 (WG) | **false** |
| clinic_lead11 (RH) | 500 (RH, not assigned) | true |
| clinic_lead11 (RH) | 502 (WG) | **false** |
| on_call13 (WG) | 500 (RH) | true |
| on_call13 (WG) | 502 (WG) | true |

Plus: after any call, `actor.role` on the passed-in object must be
unchanged from before the call (isolates D2).

A **partial fix** that closes only D1 (adds the assignment check to the
nurse branch) but leaves `actor.role = 'on_call'` unfixed still fails
the matrix: confirmed by execution — with D2 left in place, calling
`canReadChart(nurse10, 501)` (nurse10 reading a same-clinic chart they
aren't assigned to) returns `true` and mutates `nurse10.role` to
`'on_call'`, because the buggy assignment branch fires before the nurse
branch is ever reached. This is the trap: fixing the obvious IDOR alone
is not sufficient.

### Per-check guidance

- **obj-1**: run the full reference matrix above against the
  submission's imported `fixed.js`. All rows plus the no-mutation
  check must pass.
- **obj-2**: accept line numbers within a few lines of the actual
  location. Example phrasings (apply the same standard to equivalent
  wordings):
  - PASS (D1/IDOR): "the nurse branch returns `chart.id === chartId`,
    which is always true once the chart was already found by that id —
    it never checks `assignedTo` against the actor, so any nurse can
    read any chart by id."
  - PASS (D2/assignment): "`if (actor.role = 'on_call')` is a single
    `=`, so it assigns instead of compares — the branch is always
    truthy and it overwrites the actor's role as a side effect,
    granting everyone on-call access."
  - PASS (D3/cross-clinic): "the clinic_lead branch returns `true`
    unconditionally with no `clinicId` comparison, so a lead from
    clinic WG can read clinic RH's charts."
  - FAIL (too vague): "there's an authorization bug in the nurse check"
    (doesn't name the missing assignment comparison).
  - FAIL (too vague): "the code has a typo, and access control could be
    tighter in a couple of places" (doesn't identify the
    assignment-vs-comparison bug or its mutation effect, and names no
    concrete clinic-scoping gap).
- **obj-3**: read every conditional in the authorization path; reject
  any bare `=` inside an `if (...)`.
- **obj-4**: direct call — `canReadChart({id: 10, clinicId: 'RH', role:
  'nurse'}, 501)` (a same-clinic chart assigned to a different staff
  member) must return `false`.
- **obj-5**: diff `STAFF`/`CHARTS` against the original — same ids,
  clinicIds, roles, assignedTo. `canReadChart` must remain the exported
  name.

### Subjective guidance

- **Access-control correctness and completeness**: does the fix
  correctly encode all three role tiers' policies, not just patch the
  two most obvious defects? Penalize any solution that special-cases
  specific ids/clinics instead of comparing fields generically.
- **Findings precision and escalation framing**: does FINDINGS.md state
  each defect's concrete escalation (who gains access to what) rather
  than a generic "this looks insecure"?
- **Reasoning quality**: does REASONING.md show the runner traced
  through the assignment bug's actual runtime effect (truthy branch +
  mutation), not just noticed the `=`/`===` typo pattern by rote?
