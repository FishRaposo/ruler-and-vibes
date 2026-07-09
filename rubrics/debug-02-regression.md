---
test: debug-02-regression
canary: "shear-line diff"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce cafe-menu, hello-world, already-slugged, hello, sao-paulo (verify independently)"
    - id: obj-3
      check: "REGRESSION.md names BOTH regressions: accent normalization (NFD strip) dropped, and the trailing-hyphen strip reduced to leading-only"
    - id: obj-4
      check: "maxLen feature retained: results respect the cap and never end in a hyphen (cases 4 and 5 prove it); <= 80 lines, no dependencies"
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
anchors:
  - id: Regression isolation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Fix discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "shear-line diff" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Run the self-tests, verify the five outputs with node, and probe:
  a maxLen that lands exactly on a word boundary, maxLen larger than
  the slug, accented input combined with maxLen.
- Regression isolation: the strongest answers pinpoint the precise
  edits where v2 parted from v1, each tied to a broken behavior.
  Penalize vague "v2 handled accents worse" phrasing that never pins
  the mechanism.
  - PASS phrasings (obj-3, both regressions pinned to their edit):
    - "v2 deleted the `.normalize('NFD').replace(...)` line, so accents
      survive as stripped letters (`Café`→`caf`); and it changed
      `/^-+|-+$/` to `/^-+/`, so trailing hyphens are no longer
      removed."
    - "Two edits regressed: the diacritic-folding step was removed, and
      the end-anchored trim (`-+$`) was dropped from the final replace."
    - "Broke accent stripping (NFD step gone) AND trailing-separator
      cleanup (trim narrowed from both ends to leading-only)."
  - FAIL phrasings (obj-3, incomplete or unpinned):
    - "The accents and the trimming both got a bit worse in v2." (names
      neither edit)
    - "v2 forgot to normalize accents." (only one regression named)
    - "The trailing hyphen bug comes from slicing with maxLen."
      (misattributes the trailing-hyphen regression to the cap
      rather than the narrowed trim)
- Fix discipline: restores v1 semantics and keeps the feature without
  inventing new behavior (e.g. don't start trimming whitespace
  differently than v1 did).
- Reasoning quality: does REASONING.md say how the fix was validated
  against BOTH the old and new contract?
