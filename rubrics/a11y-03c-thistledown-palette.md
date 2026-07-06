---
test: a11y-03c-thistledown-palette
canary: "earwig chiffchaff"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "CONTRAST.md reports all four ratios correct to two decimals: 1 #8566c6/#fff = 4.46, 2 #5b93a8/#fff = 3.40, 3 #fff/#c66a4a = 3.78, 4 #8f9a00/#fff = 3.09 (within +/-0.01 of a recompute with the WCAG relative-luminance formula)"
    - id: obj-2
      check: "CONTRAST.md applies the correct threshold and PASS/FAIL to each: 1 FAIL (4.46 < 4.5 normal), 2 PASS (3.40 >= 3.0 because 28px bold is large text), 3 FAIL (3.78 < 4.5 normal), 4 FAIL (3.09 < 4.5 normal) — exactly 1, 3, 4 are FAIL and 2 is PASS, with 2's pass justified by the large-text 3.0 threshold"
    - id: obj-3
      check: "In fixed.html, the three failing chips are changed to hex values that meet their thresholds on recompute: 1's foreground yields >=4.5 on its background, 3's yields >=4.5, 4's yields >=4.5"
    - id: obj-4
      check: "The passing chip 2's colors are unchanged in fixed.html (#5b93a8 on #ffffff retained)"
    - id: obj-5
      check: "fixed.html is a single self-contained file that opens from file:// and still shows four labeled chips; the printed hex tags match the hex values actually used in the CSS for each chip"
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

Parallel form of `a11y-03-quillfen-contrast` (same construct, fresh surface).

If the phrase "earwig chiffchaff" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### WCAG relative-luminance formula (sRGB, per-channel)

For channel value `c` in [0,1]: `cs = c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`;
`L = 0.2126*Rs + 0.7152*Gs + 0.0722*Bs`; contrast ratio between two
luminances `= (Lmax+0.05)/(Lmin+0.05)`.

### Author-verified reference values

Recomputed independently with a node script implementing the formula
above, run against the exact hex pairs in the embedded starter:

- 1 `#8566c6` on `#ffffff` = **4.46** (FAIL, needs 4.5 normal)
- 2 `#5b93a8` on `#ffffff` = **3.40** (PASS as large text — 28px bold
  clears both the >=24px and >=18.66px-bold large-text definitions,
  threshold 3.0)
- 3 `#ffffff` on `#c66a4a` = **3.78** (FAIL, needs 4.5 normal)
- 4 `#8f9a00` on `#ffffff` = **3.09** (FAIL, needs 4.5 normal)

Reference passing fixes (also independently recomputed):

- 1 -> `#66499e` on `#ffffff` = **6.97** (PASS; the minimal passing shade
  of this violet on white is around `#8266c6` = 4.50, so any darkening
  past that clears the bar)
- 3 -> `#ffffff` on `#9c4d28` (darkened rust) = **5.99** (PASS)
- 4 -> `#65700a` on `#ffffff` = **5.42** (PASS)
- 2 is left untouched: `#5b93a8` on `#ffffff` = **3.40**, still PASS.

Both the starter (1, 3, 4 fail; 2 passes via large-text) and the
reference fix (1, 3, 4 now pass; 2 untouched) were confirmed by running a
checker script that extracts each chip's CSS color/background, recomputes
the ratio, and checks it against the correct per-chip threshold — before
this rubric was finalized.

### Trap

Two-pronged: chip 1 at 4.46:1 is a near-miss that a careless auditor
rounds to "about 4.5, close enough" — it actually FAILS the 4.5
threshold. Chip 2 at 3.40:1 would fail the 4.5 normal-text threshold, but
it PASSES because 28px bold text qualifies as WCAG "large text"
(threshold 3.0). A model that applies 4.5 uniformly to every chip wrongly
flags 2 as a failure; a model that eyeballs 1 wrongly waves it through as
a pass. The correct verdict is exactly 1, 3, 4 FAIL and 2 PASSES — for
two different reasons in two different directions.

### Example phrasings — chip 2 large-text justification

PASSING:
- "2 passes because 28px bold qualifies as WCAG large text, so the
  threshold is 3.0:1 rather than 4.5:1, and 3.40 clears that bar."
- "At 3.40:1, 2 would fail the normal-text requirement, but it's
  exempted: 28px bold meets the >=18.66px-bold large-text definition, so
  only 3.0:1 is required."
- "Don't flag 2 just because 3.40 is under 4.5 — check the font size and
  weight first; large/bold text gets the relaxed 3:1 threshold."

FAILING:
- "2 passes because 3.40 is close enough to 4.5."
- "2 fails: 3.40 is below the 4.5:1 requirement, so it needs to be
  darkened like the others."
- "All text needs 4.5:1 regardless of size, so 2 should be corrected
  too."

### Subjective guidance

- **Contrast measurement and threshold correctness** (0.4): all four
  ratios computed correctly to two decimals, and the correct threshold
  (4.5 vs 3.0) applied per chip based on actual size/weight — not a
  blanket rule. Getting 1's near-miss or 2's large-text exemption
  backwards should cap this dimension well below full marks.
- **Palette repair fidelity** (0.3): only the three failing chips
  changed, each landing comfortably above its threshold (not a marginal
  4.51:1 recompute-rounding risk), 2 left untouched, and the visible tags
  kept in sync with the applied CSS.
- **Reasoning quality** (0.3): does the submission show its arithmetic
  (naming the luminance formula or intermediate values) and explain *why*
  2 is exempt and 1 is not, rather than just asserting pass/fail verdicts
  without justification?
