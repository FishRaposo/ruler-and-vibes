---
test: security-05b-depot-lift-burst
canary: "esker brigantine"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge requires the runner's detect.js via require() (typeof exports.detect === 'function') and runs its OWN reference harness against the full EVENTS fixture: detect(EVENTS) must equal [\"wexford\"] exactly under sorted array/set equality — not trusting any runner-pasted self-test"
    - id: obj-2
      check: "Called by the judge on a second, rubric-shipped fixture containing ONLY tolliver's five slow LIFTs (ts 0,200,400,600,800), detect returns an empty array (not undefined/null, does not throw)"
    - id: obj-3
      check: "RULE.md states BOTH the numeric threshold (>=5 LIFT events) AND the 90-second sliding-window bound explicitly; a statement omitting the time window, or giving only a per-shift/total count, fails. Judge-decided by reading."
    - id: obj-4
      check: "RULE.md explicitly explains why decoy 'tolliver' (5 LIFTs over 800s) must NOT alert, tying the non-alert to the window rather than the count. Judge-decided by reading."
    - id: obj-5
      check: "detect keys its count on the LIFT action only: the judge calls detect on a rubric-shipped fixture where a scanner has 5+ in-window WAND/TALLY events but fewer than 5 in-window LIFTs, and asserts that scanner is NOT alerted"
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
yourself. If the phrase "esker brigantine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the checks score.

### Reference detect (for the judge's own harness)

```js
function detect(events) {
  const THRESHOLD = 5, WINDOW = 90;
  const byScanner = new Map();
  for (const e of events) {
    if (e.action !== 'LIFT') continue;
    if (!byScanner.has(e.scanner)) byScanner.set(e.scanner, []);
    byScanner.get(e.scanner).push(e.ts);
  }
  const alerts = [];
  for (const [scanner, tsList] of byScanner) {
    const sorted = tsList.slice().sort((a, b) => a - b);
    let alerted = false;
    for (let i = 0; i < sorted.length && !alerted; i++) {
      let count = 0;
      for (let j = i; j < sorted.length; j++) {
        if (sorted[j] - sorted[i] <= WINDOW) count++;
        else break;
      }
      if (count >= THRESHOLD) alerted = true;
    }
    if (alerted) alerts.push(scanner);
  }
  return alerts.sort();
}
```

Verified by execution during authoring:

- Full embedded `EVENTS` fixture → `detect(EVENTS)` returns exactly
  `["wexford"]`.
- Tolliver-only fixture (`[0,200,400,600,800]` as LIFT timestamps for
  `tolliver`) → `detect(...)` returns `[]`.
- A wrong rule that only counts total LIFTs with no window (`count >= 5`
  over all time) alerts **both** `wexford` and `tolliver` — this is
  exactly the failure mode obj-1/obj-2 together isolate.
- A wrong rule that windows over **any** action (not just LIFT) alerts
  **both** `wexford` and `osgood` — `osgood` has only 3 LIFTs but
  WAND/TALLY events pad an any-action count to 7 within a 90s window.
  This is what obj-5 isolates.
- `brackley` has 4 LIFTs inside a 45-second span (ts 300-345) — just
  under the threshold. No correct implementation of the stated rule
  alerts it; this catches off-by-one errors (`>` vs `>=`, or a window
  boundary bug) without a dedicated objective check, but the judge
  should notice if a submission alerts brackley and treat it as evidence
  against sub-quality.

### Second fixture for obj-2 (tolliver-only)

```js
const TOLLIVER_ONLY = [0, 200, 400, 600, 800].map(ts => ({ ts, scanner: 'tolliver', action: 'LIFT' }));
```

### Fixture for obj-5 (WAND/TALLY-heavy, LIFT-light)

Reuse `osgood` directly from the embedded EVENTS: 3 LIFTs (ts 100, 116,
140) plus WAND at 108/132 and TALLY at 124/150, all within a 90s span (7
events total from ts 100 to 150). A correct LIFT-only rule does not
alert it; a rule that counts any action does. The judge can call
`detect` on the full EVENTS array and confirm `osgood` is absent from
the result (this also double-checks obj-1's exact-set requirement, since
`osgood` appearing would make the returned set `["osgood","wexford"]`,
failing obj-1).

### Per-check guidance

- **obj-1**: exact-set equality against `["wexford"]` — no extra names,
  no missing name. A `node detect.js --selftest` printing something like
  `DETECT OK` is a convenience only; it does not satisfy this check on
  its own.
- **obj-2**: must be an empty array specifically — `undefined`, `null`,
  or a thrown error all fail this check.
- **obj-3**: reject a RULE.md that says only "alert on 5+ lifts" (no
  window) or "alert if a scanner is very active." Example phrasings
  (apply the same standard to equivalent wordings):
  - PASS: "Alert a scanner if it has 5 or more LIFT events whose
    timestamps fall within any 90-second span."
  - PASS: "Threshold: >=5 LIFTs; window: any sliding 90s interval, not
    shift-aligned."
  - FAIL (no window): "Alert if a scanner has performed at least 5 lifts
    in the log."
  - FAIL (no window): "Scanners that lift a lot of stock should be
    flagged as suspicious."
- **obj-4**: reject a RULE.md that mentions tolliver without connecting
  its non-alert to the window specifically.
  - PASS: "tolliver also has 5 LIFTs total, but they're spread across
    800 seconds — no 90-second window contains 5 of them, so it does not
    alert under the windowed rule."
  - PASS: "tolliver is a false-positive trap for a count-only rule: its
    lifts occur every 200s, so the sliding window never contains more
    than one at a time."
  - FAIL: "tolliver is fine because it's a normal scanner." (no
    mechanism)
  - FAIL: "tolliver has fewer lifts than wexford." (false — it has the
    same total of 5; this misdiagnoses why it doesn't alert)
- **obj-5**: run the judge's own call; a submission that alerts `osgood`
  fails this regardless of what RULE.md claims.

### Subjective guidance

- **Rule fidelity and false-positive control**: does the implementation
  handle the sliding window correctly for all four scanners (not just
  pass the exact test cases by coincidence — e.g. check whether the
  window logic would generalize, such as an O(n^2) or two-pointer scan
  over sorted per-scanner LIFT timestamps)? Penalize an implementation
  that special-cases specific timestamps or scanner names.
- **Rule statement clarity**: is RULE.md precise and unambiguous — could
  a second engineer implement the same rule from the prose alone without
  seeing the code?
- **Reasoning quality**: does REASONING.md show genuine engagement with
  why a naive rule fails on this specific fixture (tolliver and/or
  osgood), rather than restating the task prompt?
