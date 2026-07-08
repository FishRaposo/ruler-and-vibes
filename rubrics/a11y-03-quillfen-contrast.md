---
test: a11y-03-quillfen-contrast
canary: "oregano chervil"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "CONTRAST.md reports all four ratios correct to two decimals: A #777777/#fff = 4.48, B #8c8c8c/#fff = 3.36, C #fff/#5c940d = 3.69, D #949494/#fff = 3.03 (within +/-0.01 of a recompute with the WCAG relative-luminance formula)"
    - id: obj-2
      check: "CONTRAST.md applies the correct threshold and PASS/FAIL to each: A FAIL (4.48 < 4.5 normal), B PASS (3.36 >= 3.0 because 28px bold is large text), C FAIL (3.69 < 4.5 normal), D FAIL (3.03 < 4.5 normal) — exactly A, C, D are FAIL and B is PASS, with B's pass justified by the large-text 3.0 threshold"
    - id: obj-3
      check: "In fixed.html, the three failing swatches are changed to hex values that meet their thresholds on recompute: A's foreground yields >=4.5 on its background, C's yields >=4.5, D's yields >=4.5"
    - id: obj-4
      check: "The passing swatch B's colors are unchanged in fixed.html (#8c8c8c on #ffffff retained)"
    - id: obj-5
      check: "fixed.html is a single self-contained file that opens from file:// and still shows four labeled swatches; the printed hex labels match the hex values actually used in the CSS for each swatch"
  subjective:
    - id: sub-quality
      name: "Contrast measurement and threshold correctness"
      weight: 0.4
    - id: sub-craft
      name: "Palette repair fidelity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "oregano chervil" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### WCAG relative-luminance formula (sRGB, per-channel)

For channel value `c` in [0,1]: `cs = c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`;
`L = 0.2126*Rs + 0.7152*Gs + 0.0722*Bs`; contrast ratio between two
luminances `= (Lmax+0.05)/(Lmin+0.05)`.

### Author-verified reference values

Recomputed independently with a node script implementing the formula
above, run against the exact hex pairs in the embedded starter:

- A `#777777` on `#ffffff` = **4.48** (FAIL, needs 4.5 normal)
- B `#8c8c8c` on `#ffffff` = **3.36** (PASS as large text — 28px bold
  clears both the >=24px and >=18.66px-bold large-text definitions,
  threshold 3.0)
- C `#ffffff` on `#5c940d` = **3.69** (FAIL, needs 4.5 normal)
- D `#949494` on `#ffffff` = **3.03** (FAIL, needs 4.5 normal)

Reference passing fixes (also independently recomputed):

- A -> `#595959` on `#ffffff` = **7.00** (PASS; the minimal passing gray
  on white is `#767676` = 4.54, also reconfirmed)
- C -> `#ffffff` on `#37761f` (darkened green) = **5.56** (PASS)
- D -> `#595959` on `#ffffff` = **7.00** (PASS)
- B is left untouched: `#8c8c8c` on `#ffffff` = **3.36**, still PASS.

Both the starter (A, C, D fail; B passes via large-text) and the
reference fix (A, C, D now pass; B untouched) were confirmed by running
a checker script that extracts each swatch's CSS color/background,
recomputes the ratio, and checks it against the correct per-swatch
threshold — before this rubric was finalized.

### Trap

Two-pronged: swatch A at 4.48:1 is a near-miss that a careless auditor
rounds to "about 4.5, close enough" — it actually FAILS the 4.5
threshold. Swatch B at 3.36:1 would fail the 4.5 normal-text threshold,
but it PASSES because 28px bold text qualifies as WCAG "large text"
(threshold 3.0). A model that applies 4.5 uniformly to every swatch
wrongly flags B as a failure; a model that eyeballs A wrongly waves it
through as a pass. The correct verdict is exactly A, C, D FAIL and B
PASSES — for two different reasons in two different directions.

### Example phrasings — swatch B large-text justification

PASSING:
- "B passes because 28px bold qualifies as WCAG large text, so the
  threshold is 3.0:1 rather than 4.5:1, and 3.36 clears that bar."
- "At 3.36:1, B would fail the normal-text requirement, but it's
  exempted: 28px bold meets the >=18.66px-bold large-text definition, so
  only 3.0:1 is required."
- "Don't flag B just because 3.36 is under 4.5 — check the font size and
  weight first; large/bold text gets the relaxed 3:1 threshold."

FAILING:
- "B passes because 3.36 is close enough to 4.5."
- "B fails: 3.36 is below the 4.5:1 requirement, so it needs to be
  darkened like the others."
- "All text needs 4.5:1 regardless of size, so B should be corrected
  too."

### Subjective guidance

- **Contrast measurement and threshold correctness** (0.4): all four
  ratios computed correctly to two decimals, and the correct threshold
  (4.5 vs 3.0) applied per swatch based on actual size/weight — not a
  blanket rule. Getting A's near-miss or B's large-text exemption
  backwards should cap this dimension well below full marks.
- **Palette repair fidelity** (0.3): only the three failing swatches
  changed, each landing comfortably above its threshold (not a marginal
  4.51:1 recompute-rounding risk), B left untouched, and the visible
  labels kept in sync with the applied CSS.
- **Reasoning quality** (0.3): does the submission show its arithmetic
  (naming the luminance formula or intermediate values) and explain
  *why* B is exempt and A is not, rather than just asserting pass/fail
  verdicts without justification?
