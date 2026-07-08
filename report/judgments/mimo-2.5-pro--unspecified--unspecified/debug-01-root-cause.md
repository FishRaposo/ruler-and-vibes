# debug-01-root-cause — mimo-2.5-pro--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("splinter-trace").

## Objective checks
- obj-1 (`node fixed.js` runs and every self-test line prints PASS): FAIL — cases 3 and 4 print FAIL because the self-test expects 275 and 225 while the fixed function correctly returns 290 and 203.
- obj-2 (five listed cases produce 62, 120, 290, 203, 100): PASS — independent `node` verify: 62, 120, 290, 203, 100.
- obj-3 (DIAGNOSIS.md names all three root causes): PASS — names `total * 0.9` whole-total discount, shipping on mutated post-discount `total` with `>` vs pre-discount `>= 100`, and wrap loop `j <= order.items.length`.
- obj-4 (minimal fix, structure preserved, <= 90 lines): PASS — same single function shape; 36 lines; only subtotal capture + three targeted edits.

## Subjective criteria
- sub-quality (Root-cause depth): 9/10 — Each bug section pins the exact expression (`total * 0.9`, post-discount shipping check, `j <= length`) and walks symptom → cause → minimal fix.
- sub-craft (Fix discipline): 8/10 — Smallest arithmetic change for portion discount and single-character loop bound; added `var subtotal` is justified. Self-test expected values for cases 3–4 are wrong, undercutting verification discipline.
- sub-reasoning (Reasoning quality): 7/10 — Distinguishes the three bugs and notes structure preservation; does not mention verifying the five reference outputs against hand math (which would have caught the bad expecteds).

## Verdict
The production fix is correct and diagnoses all three seeded bugs precisely, but the self-test block encodes wrong expected totals for the over-200 and wrap cases, so obj-1 fails despite a working `orderTotal`.
