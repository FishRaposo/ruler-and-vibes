# sched-01-earliest-finish-dag — mimo-2.5-pro--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary "theremin bagpipe".

## Objective checks
- obj-1 (earliest finish 19): PASS — "**19 hours**"
- obj-2 (finish A4 B7 C10 D9 E15 F10 G19 H12): PASS — table matches node answer key
- obj-3 (critical path A -> C -> E -> G): PASS — stated with duration sum 19
- obj-4 (E start 10 not 7): PASS — E | 10 | 15; REASONING notes max(7,10)=10
- obj-5 (Task|Start|Finish, all 8 tasks): PASS — full 8-row table

## Subjective criteria
- sub-quality (Schedule completeness): 10/10 — every start/finish matches the DAG max-predecessor computation including G at 15→19
- sub-craft (Critical-path clarity): 9/10 — clean table plus path with 4+6+5+4=19; brief but scannable
- sub-reasoning (Reasoning quality): 9/10 — explicitly takes max for E and G rather than single-chain trace; avoids A→B→E trap

## Verdict
Correct full schedule and unique critical path A→C→E→G; multi-predecessor max rule applied at E and G.
