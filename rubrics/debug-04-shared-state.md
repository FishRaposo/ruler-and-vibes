---
test: debug-04-shared-state
canary: "porcelain otter mandate"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs a node harness requiring the submitted pricing.js: sequence `getRules('standard',{rate:0.25})` -> `applyDiscount(8000,·)` returns 6000, THEN `getRules('standard')` -> `applyDiscount(8000,·)` returns 7200 (the buggy code returns 6000 on the second call instead of 7200)"
    - id: obj-2
      check: "All four previously-passing embedded tests still pass: `applyDiscount(8000, getRules('standard'))` === 7200; `applyDiscount(9999, getRules('premium'))` === 7999; the decoy-guard test `applyDiscount(8000, getRules('standard',{rate:25}))` === 6000 (percent form); `applyDiscount(9999, getRules('premium',{rate:0.20}))` === 7999"
    - id: obj-3
      check: "Shared-state integrity: after calling `getRules('premium',{rate:0.9})`, the exported `RULES.premium.rate` still === 0.20 and `RULES.standard.rate` still === 0.10 (this catches patches that fix outputs but leave the shared object mutated)"
    - id: obj-4
      check: "The `applyDiscount` function body is textually unchanged from the original shown in the test file, including the percent-normalization line `rules.rate > 1 ? rules.rate / 100 : rules.rate` (judge diffs the function text against the original embedded in the test file)"
    - id: obj-5
      check: "REASONING.md (a) names getRules's mutation of the shared RULES object as the root cause, (b) explicitly states applyDiscount was not at fault despite the bug report, and (c) is 250 words or fewer (whole file, `wc -w`) — all three required to pass"
    - id: obj-6
      check: "pricing.js is at most 45 lines and is plain JavaScript with no external dependencies (no require/import of any non-builtin module)"
  subjective:
    - id: sub-quality
      name: "Root-cause depth"
      weight: 0.4
    - id: sub-craft
      name: "Fix scope discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "porcelain otter mandate" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Reference values, independently recomputed:
  `floor(8000*0.10+0.5)=800` -> `applyDiscount` returns 7200;
  `floor(9999*0.20+0.5)=2000` -> returns 7999;
  `floor(8000*0.25+0.5)=2000` -> returns 6000 (this is the decoy test —
  `{rate:25}` is percent form, normalized to 0.25 by the
  percent-normalization line, which must NOT be touched).
- On the shipped BUGGY code, the four embedded tests only pass in the
  order given — no-override tests before override tests — because the
  decoy test (`getRules('standard',{rate:25})`) permanently mutates
  `RULES.standard.rate` to `25` as a side effect of
  `Object.assign(RULES[tier], overrides)`. Running them out of order
  against the buggy code would make earlier no-override tests fail
  too; the shipped order is required to demonstrate that ONLY the
  sequence test (obj-1) fails on the buggy baseline.
- On the buggy code, the sequence in obj-1 returns 6000 then 6000 (the
  leak); on a correct fix it returns 6000 then 7200.
- Fix scope discipline: the correct fix clones before assigning inside
  `getRules` (e.g. `Object.assign({}, RULES[tier], overrides || {})`)
  rather than mutating the shared object. Two categories of fix must be
  penalized or rejected outright:
  - A patch inside `applyDiscount` itself is blocked outright by obj-4
    (byte-identical function body required) — the report's accusation
    against `applyDiscount` is a decoy, and fixing it there is wrong
    regardless of whether outputs happen to look right.
  - A "reset RULES at the top of getRules" hack fails obj-3 (verified
    by execution): the current call's mutation persists after it
    returns — the reset only happens on the NEXT call — so right after
    `getRules('premium', {rate:0.9})` returns, `RULES.premium.rate`
    reads back `0.9`, not `0.20`.
  - A mutate-then-restore hack (assign into `RULES[tier]`, copy the
    result, restore the original before returning) leaves RULES clean
    at return time, so it passes obj-3 and the other objective checks
    (verified by execution) — do not fail it objectively. Penalize it
    under Fix scope discipline as needlessly convoluted next to simply
    not mutating the shared object in the first place.
- Order-safety note: the judge may run the objective checks in ANY
  order against the submitted (fixed) code — a correct fix is
  state-free, so no check can pollute another. Ordering only matters
  when demonstrating the buggy baseline, as described above.
- Root-cause depth: does REASONING.md reproduce the actual order
  dependence (show the leak happening), or does it just assert "there
  was a mutation bug" without demonstrating the mechanism?
- Reasoning quality: does the write-up explicitly exonerate
  `applyDiscount`, explaining why the bug report's target was wrong,
  rather than silently fixing the real bug without addressing the
  report's (incorrect) accusation?
