# sched-01-earliest-finish-dag — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("theremin bagpipe").

## Objective checks
- obj-1 (earliest finish 19 hours): PASS — “Project earliest finish: 19 hours”.
- obj-2 (finish times A=4…G=19 H=12): PASS — table matches answer key including E=15, G=19.
- obj-3 (critical path A -> C -> E -> G): PASS — exact chain stated.
- obj-4 (E start = 10, not 7): PASS — table shows E Start 10 (max of B=7 and C=10).
- obj-5 (Task|Start|Finish table, all 8 tasks): PASS — all eight rows present (order A B C D E F H G).

## Subjective criteria
- sub-quality (Table completeness/correctness): 10/10 — every start/finish matches the max-predecessor forward pass, including G start 15.
- sub-craft (Clarity of path + table): 8/10 — clean markdown table and explicit path line; schedule.md itself has almost no justification for why A→C→E→G dominates (that lives only in REASONING).
- sub-reasoning (Reasoning quality): 9/10 — REASONING computes E = max(7,10)=10 and G = max(15,10)=15, then reverse-traces G←E←C←A with duration sum 19; no false A→B→E→G trap.

## Verdict
Correct full schedule and unique critical path; presentation is spare but the multi-predecessor max logic is applied and stated.
