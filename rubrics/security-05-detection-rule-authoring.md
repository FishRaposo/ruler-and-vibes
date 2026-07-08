---
test: security-05-detection-rule-authoring
canary: "pinwheel teeter roundabout"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge requires the runner's detect.js via require() (typeof exports.detect === 'function') and runs its OWN reference harness against the full EVENTS fixture: detect(EVENTS) must equal [\"mallory\"] exactly under sorted array/set equality — not trusting any runner-pasted self-test"
    - id: obj-2
      check: "Called by the judge on a second, rubric-shipped fixture containing ONLY peggy's six slow EXPORTs (ts 0,120,240,360,480,600), detect returns an empty array (not undefined/null, does not throw)"
    - id: obj-3
      check: "RULE.md states BOTH the numeric threshold (>=6 EXPORT events) AND the 60-second sliding-window bound explicitly; a statement omitting the time window, or giving only a per-day/total count, fails. Judge-decided by reading."
    - id: obj-4
      check: "RULE.md explicitly explains why decoy 'peggy' (6 EXPORTs over 600s) must NOT alert, tying the non-alert to the window rather than the count. Judge-decided by reading."
    - id: obj-5
      check: "detect keys its count on the EXPORT action only: the judge calls detect on a rubric-shipped fixture where a user has 6 in-window VIEW/SHARE events but fewer than 6 in-window EXPORTs, and asserts that user is NOT alerted"
  subjective:
    - id: sub-quality
      name: "Rule fidelity and false-positive control"
      weight: 0.4
    - id: sub-craft
      name: "Rule statement clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "pinwheel teeter roundabout" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Do not trust a runner-supplied self-test. Import the runner's
`detect` via `require()` and run the reference harness and fixtures
below yourself.

### Reference detect (for the judge's own harness)

```js
function detect(events) {
  const byUser = new Map();
  for (const e of events) {
    if (e.action !== 'EXPORT') continue;
    if (!byUser.has(e.user)) byUser.set(e.user, []);
    byUser.get(e.user).push(e.ts);
  }
  const alerts = [];
  for (const [user, tsList] of byUser) {
    const sorted = tsList.slice().sort((a, b) => a - b);
    let alerted = false;
    for (let i = 0; i < sorted.length && !alerted; i++) {
      let count = 0;
      for (let j = i; j < sorted.length; j++) {
        if (sorted[j] - sorted[i] <= 60) count++;
        else break;
      }
      if (count >= 6) alerted = true;
    }
    if (alerted) alerts.push(user);
  }
  return alerts.sort();
}
```

Verified by execution during authoring:

- Full embedded `EVENTS` fixture → `detect(EVENTS)` returns exactly
  `["mallory"]`.
- Peggy-only fixture (`[0,120,240,360,480,600]` as EXPORT timestamps
  for `peggy`) → `detect(...)` returns `[]`.
- A wrong rule that only counts total EXPORTs with no window (`count
  >= 6` over all time) alerts **both** `mallory` and `peggy` — this is
  exactly the failure mode obj-1/obj-2 together isolate.
- A wrong rule that windows over **any** action (not just EXPORT)
  alerts **both** `mallory` and `trent` — `trent` has only 4 EXPORTs
  but 3 in-window VIEW/SHARE events pad an any-action count to 7
  within a 60s window. This is what obj-5 isolates.
- `oscar` has 5 EXPORTs inside a 40-second span (ts 200-240) — just
  under the threshold. No correct implementation of the stated rule
  alerts him; this catches off-by-one errors (`>` vs `>=`, or a
  window boundary bug) without a dedicated objective check, but the
  judge should notice if a submission alerts oscar and treat it as
  evidence against sub-quality.

### Second fixture for obj-2 (peggy-only)

```js
const PEGGY_ONLY = [0, 120, 240, 360, 480, 600].map(ts => ({ ts, user: 'peggy', action: 'EXPORT' }));
```

### Fixture for obj-5 (VIEW/SHARE-heavy, EXPORT-light)

Reuse `trent` directly from the embedded EVENTS: 4 EXPORTs (ts 100,
120, 140, 150) plus VIEW at 110/145 and SHARE at 130, all within a
60s span. A correct EXPORT-only rule does not alert him; a rule that
counts any action does. The judge can call `detect` on the full
EVENTS array and confirm `trent` is absent from the result (this also
double-checks obj-1's exact-set requirement, since `trent` appearing
would make the returned set `["mallory","trent"]`, failing obj-1).

### Per-check guidance

- **obj-1**: exact-set equality against `["mallory"]" — no extra
  names, no missing name. A `node detect.js --selftest` printing
  something like `DETECT OK` is a convenience only; it does not
  satisfy this check on its own.
- **obj-2**: must be an empty array specifically — `undefined`,
  `null`, or a thrown error all fail this check.
- **obj-3**: reject a RULE.md that says only "alert on 6+ exports" (no
  window) or "alert if a user is very active." Example phrasings
  (apply the same standard to equivalent wordings):
  - PASS: "Alert a user if they have 6 or more EXPORT events whose
    timestamps fall within any 60-second span."
  - PASS: "Threshold: >=6 EXPORTs; window: any sliding 60s interval,
    not calendar-aligned."
  - FAIL (no window): "Alert if a user has performed at least 6
    exports in the log."
  - FAIL (no window): "Users who export a lot should be flagged as
    suspicious."
- **obj-4**: reject a RULE.md that mentions peggy without connecting
  her non-alert to the window specifically.
  - PASS: "peggy also has 6 EXPORTs total, but they're spread across
    600 seconds — no 60-second window contains 6 of them, so she does
    not alert under the windowed rule."
  - PASS: "peggy is a false-positive trap for a count-only rule: her
    exports occur every 120s, so the sliding window never contains
    more than one at a time."
  - FAIL: "peggy is fine because she's a normal user." (no mechanism)
  - FAIL: "peggy has fewer exports than mallory." (false — she has the
    same total of 6; this misdiagnoses why she doesn't alert)
- **obj-5**: run the judge's own call; a submission that alerts
  `trent` fails this regardless of what RULE.md claims.

### Subjective guidance

- **Rule fidelity and false-positive control**: does the implementation
  handle the sliding window correctly for all four users (not just
  pass the exact test cases by coincidence — e.g. check whether the
  window logic would generalize, such as an O(n^2) or two-pointer scan
  over sorted per-user EXPORT timestamps)? Penalize an implementation
  that special-cases specific timestamps or usernames.
- **Rule statement clarity**: is RULE.md precise and unambiguous —
  could a second engineer implement the same rule from the prose alone
  without seeing the code?
- **Reasoning quality**: does REASONING.md show genuine engagement
  with why a naive rule fails on this specific fixture (peggy and/or
  trent), rather than restating the task prompt?
