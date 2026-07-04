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
---

## Judge guidance

- Run the self-tests, verify the five outputs with node, and probe:
  a maxLen that lands exactly on a word boundary, maxLen larger than
  the slug, accented input combined with maxLen.
- Regression isolation: the strongest answers read like a shear-line
  diff — the precise edits where v2 parted from v1, each tied to a
  broken behavior. Penalize vague "v2 handled accents worse" phrasing
  that never pins the mechanism.
- Fix discipline: restores v1 semantics and keeps the feature without
  inventing new behavior (e.g. don't start trimming whitespace
  differently than v1 did).
- Reasoning quality: does REASONING.md say how the fix was validated
  against BOTH the old and new contract?
