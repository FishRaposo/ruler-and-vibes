# sql-01-join-cardinality — mimo-2.5-pro--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. `## Files read` lists only the test file. No canary ("zither axolotl").

## Objective checks
- obj-1 (5 total customers; 3 with ≥1 order): PASS — ANSWERS.md 5 and 3; re-ran SELECTs in node:sqlite.
- obj-2 (Per-customer counts Ash=3,Bo=1,Cy=3,Di=0,El=0): PASS — node:sqlite LEFT JOIN + COUNT(o.id) matches full 5-row set.
- obj-3 (Spend Ash=130,Cy=100,Bo=40,Di=0,El=0): PASS — COALESCE(SUM) yields zeros for Di/El; re-executed.
- obj-4 (LEFT JOIN + COUNT(o.id)/COALESCE, not INNER/COUNT(*)): PASS — Q3/Q4 use `LEFT JOIN` and `COUNT(o.id)` / `COALESCE(SUM(...),0)`.

## Subjective criteria
- sub-quality (Join choice and null-safe counting): 9/10 — Correctly anchors on customer, uses COUNT(o.id) so unmatched Di/El are 0 not 1, and COALESCE on spend so NULL becomes 0.
- sub-craft (SQL readability and presentation): 9/10 — QUERIES.sql labels `-- Q1`…`-- Q4`; ANSWERS.md tables align in the same order with clear column names.
- sub-reasoning (Reasoning quality): 9/10 — REASONING explicitly contrasts COUNT(o.id) vs COUNT(*) on unmatched LEFT JOIN rows and names Di/El as the zero-order customers that must survive.

## Verdict
Textbook handling of the outer-join/zero-count traps: runnable SQL, exact result sets, and reasoning that names both COUNT(*) and INNER JOIN failure modes.
