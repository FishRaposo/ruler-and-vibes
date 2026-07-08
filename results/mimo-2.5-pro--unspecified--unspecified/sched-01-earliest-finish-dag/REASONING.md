# REASONING.md — sched-01-earliest-finish-dag

## Approach

I computed earliest start times forward through the DAG. Each task starts at the maximum finish time of all its predecessors (0 if none). The critical path is the longest path through the DAG.

## Key decisions

- Task E depends on both B and C; its start is max(7, 10) = 10, not 7.
- Task G depends on both E and F; its start is max(15, 10) = 15.
- Critical path A -> C -> E -> G (19 hours) is the longest chain, confirmed by checking all paths.

## Trade-offs and limitations

- None — the problem has a unique solution given the precedence constraints.

## Files read

- tests/temporal-scheduling/sched-01-earliest-finish-dag.md
