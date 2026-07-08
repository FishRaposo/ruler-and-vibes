---
test: sched-03c-towing-tank-runs
canary: "papyrus origami"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The makespan is stated as exactly 23"
    - id: obj-2
      check: "The assignment matches the deterministic rule: H1 t0 [0,6], H2 t1 [0,4], H4 t1 [4,7], H5 t1 [7,14], H3 t0 [6,16], H7 t1 [14,23], H6 t0 [16,22]"
    - id: obj-3
      check: "Every run's start is >= the max finish of its prerequisite runs (dependency respected, e.g. H6 starts at 16 = max(H3=16, H4=7))"
    - id: obj-4
      check: "No two runs on the same tank overlap in time (verifiable by scanning each tank's interval list)"
    - id: obj-5
      check: "The submission's account of the assignment (in tow-schedule.md or REASONING.md) reflects event-driven assignment honoring the priority list, not a duration-sorted (e.g. shortest-run-first) or unlimited-parallelism approach (prose-located)"
  subjective:
    - id: sub-quality
      name: "Correctness and completeness of the machine assignment and makespan"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of the step-by-step scheduler simulation trace"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `sched-03-two-machine-makespan` (same construct, fresh
surface).

If the phrase "papyrus origami" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

A discrete-event list-scheduling simulation over the pinned rule
(priority order H1..H7 breaks ties among ready runs; lower-indexed
tank breaks ties among free tanks; a freed tank with no ready run
idle-waits to the next completion event) produces exactly:

```
H1 t0 [0,6]
H2 t1 [0,4]
H4 t1 [4,7]
H5 t1 [7,14]
H3 t0 [6,16]
H7 t1 [14,23]
H6 t0 [16,22]
Makespan: 23
```

Precedence check passes for all 7 runs (each run's start equals or
exceeds the max finish of its prerequisites — e.g. H6 depends on H3
(finish 16) and H4 (finish 7), so H6's start of 16 is exactly the
max). Tank-overlap check passes for both tanks (t0:
H1[0,6]->H3[6,16]->H6[16,22]; t1: H2[0,4]->H4[4,7]->H5[7,14]->H7[14,23],
each back-to-back, never overlapping).

The idle-wait branch of the rule never actually triggers on this
instance (a ready run is always available whenever a tank frees up),
so the answer is robust to that rule detail — it's stated in the test
purely to make the rule unambiguous, not because this instance
exercises it.

If a submission's assignment or makespan disagrees with the values
above, the submission is wrong — do not average or split the
difference, even if the submission's own internal logic is
self-consistent.

### Trap

A solver who ignores the two-tank capacity and treats this like
unlimited-parallelism scheduling (as in sched-01) computes a
longest-path makespan of 22 (H1->H3->H6 = 6+10+6=22, versus
H2->H5->H7 = 4+7+9=20) — smaller than the correct 23, and invalid
because it silently assumes more than two runs can be underway at
once. The real bottleneck is hiding on the OTHER branch: H4 (dur 3,
higher priority than H5) occupies tank t1 from t=4 to t=7, which
delays H5's start from its unlimited-parallelism time of 4 to the
actual 7 — a 3-minute capacity-induced delay that propagates straight
through to H7, pushing its finish from an unlimited-parallelism 20 to
the actual 23, which now exceeds the H1-branch's untouched 22. A
solver who reorders runs by shortest-duration-first instead of
following the pinned priority list will also diverge from the
assignment above (for instance, at t=0 a duration-sorted rule would
prefer H2 (dur 4) over H1 (dur 6) for tank t0, which contradicts
placing the highest-priority ready run in the lower-indexed free tank
first). Either deviation should fail obj-1/obj-2 regardless of how
cleanly the (wrong) simulation is presented.

### Example phrasings — obj-5, event-driven assignment honoring the priority list

PASSING:
- "At t=0 both tanks are free and H1 and H2 are the only ready runs
  (no prerequisites); by priority order H1 outranks H2, so H1 goes to
  the lower-indexed tank t0 and H2 takes t1 — not because H1 is
  longer or shorter, just because it's earlier in the priority list."
- "When t1 frees at t=4, H3 isn't ready yet (H1 hasn't finished), so
  the only ready run is H4; it gets started even though H5 is also
  waiting, because H4 is the highest-priority run that's actually
  ready at that instant."

FAILING:
- "I sorted all seven runs by duration, shortest first, and started
  them on whichever tank was free next, since that tends to minimize
  makespan."
- "Since there are 7 runs and unlimited effective parallelism across
  the dependency graph, I computed the longest path through the
  precedence graph and used that as the makespan."

### Subjective guidance

- **Correctness and completeness of the machine assignment and
  makespan** (0.4): all 7 runs correctly assigned with correct
  tank/start/end, and correct makespan; any single wrong interval
  should meaningfully cap this score.
- **Clarity of the step-by-step scheduler simulation trace** (0.3): can
  a reader follow, event by event, why each run was assigned to which
  tank at which time — including the moments where a run becomes
  ready and where a tank becomes free?
- **Reasoning quality** (0.3): does the submission demonstrate genuine
  event-driven simulation (tracking ready sets and free tanks over
  time) rather than a static heuristic like shortest-run-first or an
  unlimited-parallelism longest-path calculation?
