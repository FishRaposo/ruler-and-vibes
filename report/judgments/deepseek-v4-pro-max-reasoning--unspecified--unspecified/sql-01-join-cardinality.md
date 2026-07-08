# sql-01-join-cardinality — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Files read only the test file. No canary ("zither axolotl").

## Objective checks
- obj-1 (5 total customers; 3 with ≥1 order): PASS — ANSWERS 5 and 3; node:sqlite confirms.
- obj-2 (Per-customer counts Ash=3,Bo=1,Cy=3,Di=0,El=0): PASS — Full 5-row set with Di/El at 0; re-ran LEFT JOIN COUNT(o.id) in node:sqlite.
- obj-3 (Spend Ash=130,Bo=40,Cy=100,Di=0,El=0): PASS — COALESCE(SUM) yields exact zeros for Di/El; re-executed.
- obj-4 (LEFT JOIN + COUNT(o.id) / COALESCE, not INNER/COUNT(*)): PASS — Q3 uses LEFT JOIN + COUNT(o.id); Q4 uses LEFT JOIN + COALESCE(SUM(...),0).

## Subjective criteria
- sub-quality (Join choice and null-safe counting): 8/10 — Correct LEFT JOIN + COUNT(o.id) + COALESCE pattern; REASONING explains preserving left-table rows and NULL→0, but does not explicitly contrast why COUNT(*) would yield 1 for Di/El.
- sub-craft (SQL readability and result presentation): 9/10 — `-- Q1`…`-- Q4` labels, sensible aliases (`order_count`, `total_spend`), ANSWERS tables in question order with id/name.
- sub-reasoning (Reasoning quality): 7/10 — States LEFT JOIN + COALESCE rationale cleanly, but never names the COUNT(*) vs COUNT(o.id) trap that produces the 1-vs-0 failure mode.

## Verdict
All four result sets correct under node:sqlite, SQL uses the right outer-join/null-safe idioms, presentation is clean. Reasoning slightly undersells the COUNT(*) trap.
