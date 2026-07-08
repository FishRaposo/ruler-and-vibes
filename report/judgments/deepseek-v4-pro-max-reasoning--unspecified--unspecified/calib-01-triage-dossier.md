# calib-01-triage-dossier — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("chisel awl").

## Objective checks
- obj-1 (valid JSON array of 10 schema objects, ids 1–10 once): PASS — Parses; ten objects with id/label/answer.
- obj-2 (all 10 labels match key): FAIL — Labels for 6 and 8 wrong: got underdetermined/underdetermined; key is missing/missing (5,7,10,9 correct; 1–4 answerable correct).
- obj-3 (answerable values correct; others null): PASS — 82000; "A-3, 82000"; "A-3" (date omitted but correct applicant); 8.7; all non-answerable answers null.
- obj-4 (item 5 underdetermined AND item 6 missing): FAIL — Item 5 OK underdetermined; item 6 labeled underdetermined instead of missing.

## Subjective criteria
- sub-quality (Triage accuracy and gap discrimination): 4/10 — Collapses missing vs underdetermined: treats A-4 "Pending review" (Q8) and total absence of approval policy (Q6) as partial data rather than field/rule never present.
- sub-craft (Label discipline and answer precision): 6/10 — Clean schema and null discipline; Q3 answer drops the submission date; wrong labels on two trap-adjacent items.
- sub-reasoning (Reasoning quality): 5/10 — Q5 correctly cites A-4 pending as blocking Panel B average; Q6/Q8 rationales invent "not yet decided / not yet entered" as underdetermined when the dossier defines those as no score and no decision rule.

## Verdict
Gets the easy answerables and the Panel B average trap, but fails the missing/underdetermined distinction on Q6 and Q8, which is the calibration core of the test.
