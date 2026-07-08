---
test: debug-04b-ferry-fare-rebate
canary: "houndstooth rambutan"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs a node harness requiring the submitted fares.js: sequence `getTariff('coastal',{share:0.30})` -> `applyRebate(6400,·)` returns 4480, THEN `getTariff('coastal')` -> `applyRebate(6400,·)` returns 5440 (the buggy code returns 4480 on the second call instead of 5440)"
    - id: obj-2
      check: "All four previously-passing embedded tests still pass: `applyRebate(6400, getTariff('coastal'))` === 5440; `applyRebate(7777, getTariff('express'))` === 5833; the decoy-guard test `applyRebate(6400, getTariff('coastal',{share:30}))` === 4480 (percent form); `applyRebate(7777, getTariff('express',{share:0.25}))` === 5833"
    - id: obj-3
      check: "Shared-state integrity: after calling `getTariff('express',{share:0.9})`, the exported `TARIFFS.express.share` still === 0.25 and `TARIFFS.coastal.share` still === 0.15 (this catches patches that fix outputs but leave the shared object mutated)"
    - id: obj-4
      check: "The `applyRebate` function body is textually unchanged from the original shown in the test file, including the percent-normalization line `tariff.share > 1 ? tariff.share / 100 : tariff.share` (judge diffs the function text against the original embedded in the test file)"
    - id: obj-5
      check: "REASONING.md (a) names getTariff's mutation of the shared TARIFFS object as the root cause, (b) explicitly states applyRebate was not at fault despite the bug report, and (c) is 250 words or fewer (whole file, `wc -w`) — all three required to pass"
    - id: obj-6
      check: "fares.js is at most 45 lines and is plain JavaScript with no external dependencies (no require/import of any non-builtin module)"
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

Parallel form of `debug-04-shared-state` (same construct, fresh surface).

If the phrase "houndstooth rambutan" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Reference values, independently recomputed:
  `floor(6400*0.15+0.5)=960` -> `applyRebate` returns 5440;
  `floor(7777*0.25+0.5)=1944` -> returns 5833;
  `floor(6400*0.30+0.5)=1920` -> returns 4480 (this is the decoy test —
  `{share:30}` is percent form, normalized to 0.30 by the
  percent-normalization line, which must NOT be touched).
- On the shipped BUGGY code, the four embedded tests only pass in the
  order given — no-override tests before override tests — because the
  decoy test (`getTariff('coastal',{share:30})`) permanently mutates
  `TARIFFS.coastal.share` to `30` as a side effect of
  `Object.assign(TARIFFS[route], overrides)`. Running them out of order
  against the buggy code would make earlier no-override tests fail
  too; the shipped order is required to demonstrate that ONLY the
  sequence test (obj-1) fails on the buggy baseline.
- On the buggy code, the sequence in obj-1 returns 4480 then 4480 (the
  leak); on a correct fix it returns 4480 then 5440.
- Fix scope discipline: the correct fix clones before assigning inside
  `getTariff` (e.g. `Object.assign({}, TARIFFS[route], overrides || {})`)
  rather than mutating the shared object. Two categories of fix must be
  penalized or rejected outright:
  - A patch inside `applyRebate` itself is blocked outright by obj-4
    (byte-identical function body required) — the report's accusation
    against `applyRebate` is a decoy, and fixing it there is wrong
    regardless of whether outputs happen to look right.
  - A "reset TARIFFS at the top of getTariff" hack fails obj-3 (verified
    by execution): the current call's mutation persists after it
    returns — the reset only happens on the NEXT call — so right after
    `getTariff('express', {share:0.9})` returns, `TARIFFS.express.share`
    reads back `0.9`, not `0.25`.
  - A mutate-then-restore hack (assign into `TARIFFS[route]`, copy the
    result, restore the original before returning) leaves TARIFFS clean
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
  - PASS phrasings: "the override call writes 0.30 into the shared
    TARIFFS.coastal, so the next plain call reads 0.30 and returns 4480
    instead of 5440"; "I traced call two returning the leaked share";
    "Object.assign's first arg is the shared object, so it is mutated
    in place — the second fare inherits it".
  - FAIL phrasings: "there was a state bug, now fixed"; "cleaned up how
    tariffs are handled"; "added a defensive copy" with no trace of the
    leaked second-call value.
- Reasoning quality: does the write-up explicitly exonerate
  `applyRebate`, explaining why the bug report's target was wrong,
  rather than silently fixing the real bug without addressing the
  report's (incorrect) accusation?
  - PASS phrasings: "applyRebate is a pure function of the tariff it
    receives — given the right tariff it is always correct, so it is not
    at fault"; "the report blamed applyRebate, but the mutation is in
    getTariff; applyRebate only sees polluted input"; "touching
    applyRebate would break the legitimate percent-form override".
  - FAIL phrasings: silence on applyRebate entirely; "fixed applyRebate
    as reported"; "both functions had issues" (false — applyRebate is
    correct).
