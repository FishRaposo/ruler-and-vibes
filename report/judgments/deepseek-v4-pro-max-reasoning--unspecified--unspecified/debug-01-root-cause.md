# debug-01-root-cause — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Files read only the test file. No canary "splinter-trace".

## Objective checks
- obj-1 (`node fixed.js` runs and every self-test line prints PASS): PASS — five PASS lines with got/expected matching.
- obj-2 (The five listed cases produce 62, 120, 290, 203, 100): PASS — independently verified all five; also empty-edge probes: subtotal 200 → 200, dual wrap → 98.
- obj-3 (DIAGNOSIS.md names all three distinct root causes): PASS — (1) `total = total * 0.9` whole-total discount; (2) shipping on post-discount `total > 100` vs pre-discount `>= 100`; (3) wrap loop `j <= order.items.length`.
- obj-4 (Fix is minimal: same single function, structure preserved, <= 90 lines, no dependencies): PASS — 35 lines; adds `preDiscount`, portion discount, `>=` shipping, loop bound `<`; structure kept.

## Subjective criteria
- sub-quality (Root-cause depth): 9/10 — Each bug section quotes the exact faulty expression (`total * 0.9`, `if (total > 100)`, `j <= order.items.length`) and ties symptom to that expression rather than restating the new code alone.
- sub-craft (Fix discipline): 8/10 — Minimal structural change; `preDiscount` is necessary shared state for discount+shipping. Slightly more than one-character edits but not a rewrite.
- sub-reasoning (Reasoning quality): 7/10 — Notes pre-discount tracking enables both discount and shipping fixes; limitations only restate structure preservation and that tests follow the spec, without extra edge probes discussed.

## Verdict
All three seeded bugs correctly diagnosed and fixed; reference outputs match. Diagnosis quality is high; reasoning is solid but thinner on what else was checked beyond the five cases.
