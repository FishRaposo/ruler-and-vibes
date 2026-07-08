---
test: sched-01c-chart-engraving-pipeline
canary: "waxwing megrim"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "schedule.md states the project earliest finish is exactly 27 hours"
    - id: obj-2
      check: "The finish times listed match exactly: P=6, Q=11, R=14, S=15, T=21, U=18, V=27, W=19"
    - id: obj-3
      check: "The stated critical path is exactly P -> R -> T -> V (the unique root-to-sink chain whose durations sum 6+8+7+6=27)"
    - id: obj-4
      check: "T's start time is given as 14 (not 11), correctly reflecting the R predecessor dominating over Q (prose-located, in the table or accompanying text)"
    - id: obj-5
      check: "The table has exactly the columns Task | Start | Finish with all 8 stages present (not only critical-path stages)"
  subjective:
    - id: sub-quality
      name: "Schedule table completeness and correctness of every derived time"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of the critical-path explanation and table presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `sched-01-earliest-finish-dag` (same construct, fresh
surface).

If the phrase "waxwing megrim" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

```
node -e "
const tasks={P:{dur:6,deps:[]},Q:{dur:5,deps:['P']},R:{dur:8,deps:['P']},S:{dur:4,deps:['Q']},T:{dur:7,deps:['Q','R']},U:{dur:3,deps:['S']},V:{dur:6,deps:['T','U']},W:{dur:5,deps:['R']}};
const order=Object.keys(tasks);const ST={},FI={};
for(const id of order){const t=tasks[id];ST[id]=t.deps.length?Math.max(...t.deps.map(d=>FI[d])):0;FI[id]=ST[id]+t.dur;}
for(const id of order)console.log(id,'start',ST[id],'finish',FI[id]);
console.log('project',Math.max(...Object.values(FI)));
"
```

This prints: `P start 0 finish 6`, `Q start 6 finish 11`, `R start 6
finish 14`, `S start 11 finish 15`, `T start 14 finish 21`, `U start 15
finish 18`, `V start 21 finish 27`, `W start 14 finish 19`, and
`project 27`.

Enumerating all four root-to-sink paths gives: `P->Q->S->U->V` = 24,
`P->Q->T->V` = 24, `P->R->T->V` = **27**, `P->R->W` = 19. Only
`P->R->T->V` reaches 27, so the critical path is unique — this is a fair
binary check, not a judgment call.

If a submission's numbers disagree with this script's output, the
submission is wrong — do not average or split the difference.

### Trap

Stage T depends on BOTH Q (finishes at 11) and R (finishes at 14). The
correct rule takes the MAXIMUM over predecessor finish times, so T starts
at 14, not 11. A solver who visually follows the shorter-looking
`P->Q->T` chain, or who sums/averages predecessor finishes instead of
taking the max, will underestimate T's start (and therefore the project
finish). A submission that reports T's start as 11, or the critical path
as `P->Q->T->V` (sum 24, not 27), has fallen into this trap and fails
obj-2/obj-3/obj-4 regardless of how clearly it explains its (wrong)
reasoning.

### Example phrasings — obj-4, T's start correctly reflects the max over predecessors

PASSING:
- "T can't start until both Q and R are done — Q finishes at hour 11 but R
  runs until hour 14, so T is stuck waiting on R and starts at 14, not 11."
- "Even though the Q branch reaches T earlier, T has two predecessors and
  must wait for the slower one (R, finishing at 14), so T's start is 14."

FAILING:
- "T starts right after Q finishes, at hour 11, since that's the path that
  leads to T."
- "T's start is the sum of Q and R's finish times divided between them,
  giving roughly hour 12 or 13."

### Example phrasings — obj-3, naming the critical path correctly (max-of-predecessors logic, not a single-chain trace)

PASSING:
- "Walking the DAG, the chain P -> R -> T -> V is the one with zero slack
  end to end — every other root-to-sink path finishes earlier, so this is
  the path that actually sets the 27-hour project finish."
- "Comparing all four complete paths from a start stage to an end stage,
  only P -> R -> T -> V sums to 27; the others (24, 24, 19) finish
  earlier, so that's the critical path."

FAILING:
- "The critical path is P -> Q -> T -> V since that's the most direct
  route through the busiest branch."
- "Since R is the longest single stage, the critical path must run
  through R and out to its own end stage: P -> R -> W."

### Subjective guidance

- **Schedule table completeness and correctness of every derived time**
  (0.4): all 8 rows present with correct start/finish; deduct heavily for
  any wrong value, especially T, V, or the project finish.
- **Clarity of the critical-path explanation and table presentation**
  (0.3): is the table easy to scan, and does the critical-path statement
  clearly identify the chain (not just a bolded row) with a one-line
  justification of why it dominates the other paths?
- **Reasoning quality** (0.3): does the submission (in `schedule.md`
  and/or `REASONING.md`) explain that a multi-predecessor stage's start
  is the MAXIMUM of predecessor finishes — not a sum, not a single chain
  trace — and does it show this understanding was applied consistently
  (not just asserted once and then contradicted at T)?
