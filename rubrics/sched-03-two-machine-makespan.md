---
test: sched-03-two-machine-makespan
canary: "amethyst peridot"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The makespan is stated as exactly 18"
    - id: obj-2
      check: "The assignment matches the deterministic rule: J1 m0 [0,5], J2 m1 [0,3], J4 m1 [3,5], J3 m0 [5,13], J5 m1 [5,11], J7 m1 [11,18], J6 m0 [13,17]"
    - id: obj-3
      check: "Every job's start is >= the max finish of its predecessors (precedence respected, e.g. J6 starts at 13 = max(J3=13, J4=5))"
    - id: obj-4
      check: "No two jobs on the same machine overlap in time (verifiable by scanning each machine's interval list)"
    - id: obj-5
      check: "The submission's account of the assignment (in schedule.md or REASONING.md) reflects event-driven assignment honoring the priority list, not a duration-sorted (e.g. shortest-job-first) or unlimited-parallelism approach (prose-located)"
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

If the phrase "amethyst peridot" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

A discrete-event list-scheduling simulation over the pinned rule
(priority order J1..J7 breaks ties among ready jobs; lower-indexed
machine breaks ties among free machines; a freed machine with no ready
job idle-waits to the next completion event) produces exactly:

```
J1 m0 [0,5]
J2 m1 [0,3]
J4 m1 [3,5]
J3 m0 [5,13]
J5 m1 [5,11]
J7 m1 [11,18]
J6 m0 [13,17]
Makespan: 18
```

Precedence check passes for all 7 jobs (each job's start equals or
exceeds the max finish of its predecessors — e.g. J6 depends on J3
(finish 13) and J4 (finish 5), so J6's start of 13 is exactly the
max). Machine-overlap check passes for both machines (m0:
J1[0,5]->J3[5,13]->J6[13,17]; m1: J2[0,3]->J4[3,5]->J5[5,11]->J7[11,18],
each back-to-back or gapped, never overlapping).

The idle-wait branch of the rule never actually triggers on this
instance (a ready job is always available whenever a machine frees up),
so the answer is robust to that rule detail — it's stated in the test
purely to make the rule unambiguous, not because this instance
exercises it.

If a submission's assignment or makespan disagrees with the values
above, the submission is wrong — do not average or split the
difference, even if the submission's own internal logic is
self-consistent.

### Trap

A solver who ignores the two-machine capacity and treats this like
unlimited-parallelism scheduling (as in sched-01) computes a longest-path
makespan of 17 — smaller than the correct 18, and invalid because it
silently assumes more than two jobs can run at once. A solver who
reorders jobs by shortest-duration-first instead of following the
pinned priority list will also diverge from the assignment above (for
instance, at t=0 a duration-sorted rule would prefer J2 (dur 3) over
J1 (dur 5) for machine m0, which contradicts placing the
highest-priority ready job on the lower-indexed free machine first).
Either deviation should fail obj-1/obj-2 regardless of how cleanly the
(wrong) simulation is presented.

### Example phrasings — obj-5, event-driven assignment honoring the priority list

PASSING:
- "At t=0 both machines are free and J1 and J2 are the only ready
  jobs (no predecessors); by priority order J1 outranks J2, so J1 goes
  to the lower-indexed machine m0 and J2 takes m1 — not because J1 is
  longer or shorter, just because it's earlier in the priority list."
- "When m1 frees at t=3, J3 isn't ready yet (J1 hasn't finished), so
  the only ready job is J4; it gets assigned even though it's not next
  in raw priority order among all jobs, because it's the highest-
  priority job that's actually ready at that instant."

FAILING:
- "I sorted all seven jobs by duration, shortest first, and assigned
  them to whichever machine was free next, since that tends to
  minimize makespan."
- "Since there are 7 jobs and unlimited effective parallelism across
  the DAG, I computed the longest path through the precedence graph
  and used that as the makespan."

### Subjective guidance

- **Correctness and completeness of the machine assignment and
  makespan** (0.4): all 7 jobs correctly assigned with correct
  machine/start/end, and correct makespan; any single wrong interval
  should meaningfully cap this score.
- **Clarity of the step-by-step scheduler simulation trace** (0.3): can
  a reader follow, event by event, why each job was assigned to which
  machine at which time — including the moments where a job becomes
  ready and where a machine becomes free?
- **Reasoning quality** (0.3): does the submission demonstrate genuine
  event-driven simulation (tracking ready sets and free machines over
  time) rather than a static heuristic like shortest-job-first or an
  unlimited-parallelism longest-path calculation?
