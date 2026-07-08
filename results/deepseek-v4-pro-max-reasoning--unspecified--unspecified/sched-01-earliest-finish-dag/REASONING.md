## Approach
Forward-pass computation: start at time 0, each task begins when all predecessors finish, and runs for its full duration.

## Key decisions
Task A starts at 0, finishes at 4. B and C both depend on A, both start at 4. B finishes at 7 (4+3), C finishes at 10 (4+6). D depends on B, starts at 7, finishes at 9. E depends on B and C, so start = max(7,10) = 10, finishes at 15. F depends on D, starts at 9, finishes at 10. H depends on C, starts at 10, finishes at 12. G depends on E and F, starts at max(15,10) = 15, finishes at 19. Project finish = max(4,7,10,9,15,10,19,12) = 19. Critical path traced from end: G(15→19) ← E(10→15) ← C(4→10) ← A(0→4). Durations sum: 4+6+5+4 = 19 = project finish.

## Files read
- tests/temporal-scheduling/sched-01-earliest-finish-dag.md
