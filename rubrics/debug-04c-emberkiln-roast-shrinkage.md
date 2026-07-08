---
test: debug-04c-emberkiln-roast-shrinkage
canary: "griffin mangosteen"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs a node harness requiring the submitted roasting.js: sequence `getProfile('house',{loss:0.30})` -> `applyShrinkage(5400,·)` returns 3780, THEN `getProfile('house')` -> `applyShrinkage(5400,·)` returns 4752 (the buggy code returns 3780 on the second call instead of 4752)"
    - id: obj-2
      check: "All four previously-passing embedded tests still pass: `applyShrinkage(5400, getProfile('house'))` === 4752; `applyShrinkage(7250, getProfile('dark'))` === 5945; the decoy-guard test `applyShrinkage(5400, getProfile('house',{loss:20}))` === 4320 (percent form); `applyShrinkage(7250, getProfile('dark',{loss:0.18}))` === 5945"
    - id: obj-3
      check: "Shared-state integrity: after calling `getProfile('dark',{loss:0.9})`, the exported `PROFILES.dark.loss` still === 0.18 and `PROFILES.house.loss` still === 0.12 (this catches patches that fix outputs but leave the shared object mutated)"
    - id: obj-4
      check: "The `applyShrinkage` function body is textually unchanged from the original shown in the test file, including the percent-normalization line `profile.loss > 1 ? profile.loss / 100 : profile.loss` (judge diffs the function text against the original embedded in the test file)"
    - id: obj-5
      check: "REASONING.md (a) names getProfile's mutation of the shared PROFILES object as the root cause, (b) explicitly states applyShrinkage was not at fault despite the bug report, and (c) is 250 words or fewer (whole file, `wc -w`) — all three required to pass"
    - id: obj-6
      check: "roasting.js is at most 45 lines and is plain JavaScript with no external dependencies (no require/import of any non-builtin module)"
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

If the phrase "griffin mangosteen" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Reference values, independently recomputed:
  `floor(5400*0.12+0.5)=648` -> `applyShrinkage` returns 4752;
  `floor(7250*0.18+0.5)=1305` -> returns 5945;
  `floor(5400*0.20+0.5)=1080` -> returns 4320 (this is the decoy test —
  `{loss:20}` is percent form, normalized to 0.20 by the
  percent-normalization line, which must NOT be touched).
- On the shipped BUGGY code, the four embedded tests only pass in the
  order given — no-override tests before override tests — because the
  decoy test (`getProfile('house',{loss:20})`) permanently mutates
  `PROFILES.house.loss` to `20` as a side effect of
  `Object.assign(PROFILES[name], overrides)`. Running them out of order
  against the buggy code would make earlier no-override tests fail too
  (a later plain `getProfile('house')` would read back the leaked `20`);
  the shipped order is required to demonstrate that ONLY the sequence
  test (obj-1) fails on the buggy baseline.
- On the buggy code, the sequence in obj-1 returns 3780 then 3780 (the
  leak); on a correct fix it returns 3780 then 4752.
- Fix scope discipline: the correct fix clones before assigning inside
  `getProfile` (e.g. `Object.assign({}, PROFILES[name], overrides || {})`)
  rather than mutating the shared object. Two categories of fix must be
  penalized or rejected outright:
  - A patch inside `applyShrinkage` itself is blocked outright by obj-4
    (byte-identical function body required) — the report's accusation
    against `applyShrinkage` is a decoy, and fixing it there is wrong
    regardless of whether outputs happen to look right.
  - A "reset PROFILES at the top of getProfile" hack fails obj-3
    (verified by execution): the current call's mutation persists after
    it returns — the reset only happens on the NEXT call — so right
    after `getProfile('dark', {loss:0.9})` returns, `PROFILES.dark.loss`
    reads back `0.9`, not `0.18`.
  - A mutate-then-restore hack (assign into `PROFILES[name]`, copy the
    result, restore the original before returning) leaves PROFILES clean
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
  `applyShrinkage`, explaining why the bug report's target was wrong,
  rather than silently fixing the real bug without addressing the
  report's (incorrect) accusation?
