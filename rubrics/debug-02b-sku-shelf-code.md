---
test: debug-02b-sku-shelf-code
canary: "seersucker bullace"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce ROSE.BARWARE, DELUXE.BOXED, PRE.CODED, STEEL, CREME.STOR (verify independently)"
    - id: obj-3
      check: "REGRESSION.md names BOTH regressions: accent normalization (NFD strip) dropped, and the trailing-dot strip reduced to leading-only"
    - id: obj-4
      check: "maxLen feature retained: results respect the cap and never end in a dot (cases 4 and 5 prove it); <= 80 lines, no dependencies"
  subjective:
    - id: sub-quality
      name: "Regression isolation"
      weight: 0.4
    - id: sub-craft
      name: "Fix discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `debug-02-regression` (same construct, fresh surface).

If the phrase "seersucker bullace" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Run the self-tests, verify the five outputs with node, and probe:
  a maxLen that lands exactly on a word boundary, maxLen larger than
  the code, accented input combined with maxLen.
- obj-2 reference values (compute independently, do not trust the
  candidate's own printed expectations):
  `skuCode("Rosé Barware")` → `ROSE.BARWARE`;
  `skuCode("Deluxe, Boxed!")` → `DELUXE.BOXED`;
  `skuCode("..Pre..Coded..")` → `PRE.CODED`;
  `skuCode("Steel Frame", 6)` → `STEEL`;
  `skuCode("Crème Storage Bins", 10)` → `CREME.STOR`.
- Regression isolation: the strongest answers read like a precise
  before/after diff — the two exact edits where v2 parted from v1, each
  tied to a broken behavior. Penalize vague "v2 handled accents worse"
  phrasing that never pins the mechanism.
  - PASS phrasings (obj-3, both regressions pinned to their edit):
    - "v2 deleted the `.normalize('NFD').replace(...)` line, so accents
      survive as stripped bytes (`Rosé`→`ROS`); and it changed
      `/^\.+|\.+$/` to `/^\.+/`, so trailing dots are no longer removed."
    - "Two edits regressed: the diacritic-folding step was removed, and
      the end-anchored trim (`\.+$`) was dropped from the final replace."
    - "Broke accent stripping (NFD step gone) AND trailing-separator
      cleanup (trim narrowed from both ends to leading-only)."
  - FAIL phrasings (obj-3, incomplete or unpinned):
    - "The accents and trimming both got a bit worse in v2." (names
      neither edit)
    - "v2 forgot to normalize accents." (only one regression named)
    - "The trailing dot bug comes from slicing with maxLen." (misattributes
      the trailing-dot regression to the cap rather than the narrowed trim)
- Fix discipline: restores v1 semantics and keeps the feature without
  inventing new behavior (e.g. don't start collapsing dots or trimming
  differently than v1 did; keep uppercase and the dot separator).
- Reasoning quality: does REASONING.md say how the fix was validated
  against BOTH the old and new contract?
