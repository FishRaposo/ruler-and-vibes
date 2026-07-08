# precision-01-exact-format — mimo-2.5-pro--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("brass-rule").

## Objective checks
- obj-1 (JSON.parse; sorted by email; four keys in schema order): PASS — parses; keys `email,name,phone,joined` in order; emails ascending.
- obj-2 (exactly 8 records; john and wei each once, merged): FAIL — array has **9** records; invents `dana.oyelaran@example.com` (not in source). John and wei are correctly merged once each.
- obj-3 (dates correct): PASS — anya 2024-03-02, bob 2024-02-15, john 2024-03-14, maria 2024-01-30, wei 2024-01-05, liam null, sofia null, fatima 2024-07-04 with NOTES documenting M/D vs D/M ambiguity.
- obj-4 (normalization): PASS — emails lowercase; Title Case names including Bob O'Brien / Wei Chen; phones 5550101, 15550102233, 5550177.

## Subjective criteria
- sub-quality (Ambiguity handling): 7/10 — Fatima 07/04 vs April 7 documented; June 31 → null; earliest-date merge for john/wei stated. Undercut by an unexplained phantom ninth contact.
- sub-craft (NOTES completeness): 6/10 — Covers merges, day-first 15/02, invalid June 31, and fatima ambiguity, but never explains where `dana.oyelaran@example.com` came from; wei phone note typos "15550102223".
- sub-reasoning (Reasoning quality): 7/10 — Describes per-record process then merge-by-email and sort; does not mention a final count check that would have caught 9≠8.

## Verdict
Core normalize/dedup/date work for the real ten source rows is largely correct and well-noted, but an invented ninth contact fails the exact-eight-record requirement and spoils an otherwise careful precision pass.
