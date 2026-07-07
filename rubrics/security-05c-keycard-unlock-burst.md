---
test: security-05c-keycard-unlock-burst
canary: "drumlin barque"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge requires the runner's detect.js via require() (typeof exports.detect === 'function') and runs its OWN reference harness against the full EVENTS fixture: detect(EVENTS) must equal [\"holloway\"] exactly under sorted array/set equality — not trusting any runner-pasted self-test"
    - id: obj-2
      check: "Called by the judge on a second, rubric-shipped fixture containing ONLY drayton's five slow UNLOCKs (ts 0,90,180,270,360), detect returns an empty array (not undefined/null, does not throw)"
    - id: obj-3
      check: "RULE.md states BOTH the numeric threshold (>=5 UNLOCK events) AND the 45-second sliding-window bound explicitly; a statement omitting the time window, or giving only a per-day/total count, fails. Judge-decided by reading."
    - id: obj-4
      check: "RULE.md explicitly explains why decoy 'drayton' (5 UNLOCKs over 360s) must NOT alert, tying the non-alert to the window rather than the count. Judge-decided by reading."
    - id: obj-5
      check: "detect keys its count on the UNLOCK action only: the judge calls detect on a rubric-shipped fixture where a user has 5+ in-window BADGE_IN/BADGE_OUT events but fewer than 5 in-window UNLOCKs, and asserts that user is NOT alerted"
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

Parallel form of `security-05-detection-rule-authoring` (same construct,
fresh surface).

Do not trust a runner-supplied self-test. Import the runner's `detect`
via `require()` and run the reference harness and fixtures below
yourself. If the phrase "drumlin barque" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Reference detect (for the judge's own harness)

```js
function detect(events) {
  const byUser = new Map();
  for (const e of events) {
    if (e.action !== 'UNLOCK') continue;
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
        if (sorted[j] - sorted[i] <= 45) count++;
        else break;
      }
      if (count >= 5) alerted = true;
    }
    if (alerted) alerts.push(user);
  }
  return alerts.sort();
}
```

Verified by execution during authoring:

- Full embedded `EVENTS` fixture → `detect(EVENTS)` returns exactly
  `["holloway"]`.
- Drayton-only fixture (`[0,90,180,270,360]` as UNLOCK timestamps for
  `drayton`) → `detect(...)` returns `[]`.
- A wrong rule that only counts total UNLOCKs with no window (`count >=
  5` over all time) alerts **both** `holloway` and `drayton` — this is
  exactly the failure mode obj-1/obj-2 together isolate.
- A wrong rule that windows over **any** action (not just UNLOCK) alerts
  **both** `holloway` and `cobbett` — `cobbett` has only 4 UNLOCKs but 3
  in-window BADGE_IN/BADGE_OUT events pad an any-action count to 7
  within a 45s window. This is what obj-5 isolates.
- `grindle` has 4 UNLOCKs inside a 30-second span (ts 200-230) — just
  under the threshold. No correct implementation of the stated rule
  alerts him; this catches off-by-one errors (`>` vs `>=`, or a window
  boundary bug) without a dedicated objective check, but the judge
  should notice if a submission alerts grindle and treat it as evidence
  against sub-quality.

### Second fixture for obj-2 (drayton-only)

```js
const DRAYTON_ONLY = [0, 90, 180, 270, 360].map(ts => ({ ts, user: 'drayton', action: 'UNLOCK' }));
```

### Fixture for obj-5 (BADGE-heavy, UNLOCK-light)

Reuse `cobbett` directly from the embedded EVENTS: 4 UNLOCKs (ts 100,
116, 130, 140) plus BADGE_IN at 108/136 and BADGE_OUT at 124, all within
a 45s span. A correct UNLOCK-only rule does not alert him; a rule that
counts any action does. The judge can call `detect` on the full EVENTS
array and confirm `cobbett` is absent from the result (this also
double-checks obj-1's exact-set requirement, since `cobbett` appearing
would make the returned set `["cobbett","holloway"]`, failing obj-1).

### Per-check guidance

- **obj-1**: exact-set equality against `["holloway"]` — no extra names,
  no missing name. A `node detect.js --selftest` printing something like
  `DETECT OK` is a convenience only; it does not satisfy this check on
  its own.
- **obj-2**: must be an empty array specifically — `undefined`, `null`,
  or a thrown error all fail this check.
- **obj-3**: reject a RULE.md that says only "alert on 5+ unlocks" (no
  window) or "alert if a cardholder is very active." Example phrasings
  (apply the same standard to equivalent wordings):
  - PASS: "Alert a cardholder if they have 5 or more UNLOCK events whose
    timestamps fall within any 45-second span."
  - PASS: "Threshold: >=5 UNLOCKs; window: any sliding 45s interval, not
    clock-aligned."
  - PASS: "Fire when at least five UNLOCK actions by one cardholder
    occur inside a rolling 45-second window."
  - FAIL (no window): "Alert if a cardholder has performed at least 5
    unlocks in the log."
  - FAIL (no window): "Cardholders who unlock a lot of doors should be
    flagged as suspicious."
  - FAIL (no threshold): "Alert on any cluster of unlocks inside a
    45-second window." (no numeric count)
- **obj-4**: reject a RULE.md that mentions drayton without connecting
  her non-alert to the window specifically.
  - PASS: "drayton also has 5 UNLOCKs total, but they're spread across
    360 seconds — no 45-second window contains 5 of them, so she does
    not alert under the windowed rule."
  - PASS: "drayton is a false-positive trap for a count-only rule: her
    unlocks occur every 90s, so the sliding window never contains more
    than one at a time."
  - PASS: "A total-count rule would flag drayton at 5 unlocks, but her
    events are 90s apart; inside any 45s window she never reaches the
    threshold, so the windowed rule correctly clears her."
  - FAIL: "drayton is fine because she's a normal user." (no mechanism)
  - FAIL: "drayton has fewer unlocks than holloway." (false — she has
    the same total of 5; this misdiagnoses why she doesn't alert)
  - FAIL: "drayton badges out properly, so she's trusted." (invented
    reason unrelated to the window)
- **obj-5**: run the judge's own call; a submission that alerts
  `cobbett` fails this regardless of what RULE.md claims.

### Subjective guidance

- **Rule fidelity and false-positive control**: does the implementation
  handle the sliding window correctly for all four cardholders (not just
  pass the exact test cases by coincidence — e.g. check whether the
  window logic would generalize, such as an O(n^2) or two-pointer scan
  over sorted per-user UNLOCK timestamps)? Penalize an implementation
  that special-cases specific timestamps or usernames.
- **Rule statement clarity**: is RULE.md precise and unambiguous — could
  a second engineer implement the same rule from the prose alone without
  seeing the code?
- **Reasoning quality**: does REASONING.md show genuine engagement with
  why a naive rule fails on this specific fixture (drayton and/or
  cobbett), rather than restating the task prompt?
