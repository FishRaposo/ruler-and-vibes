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
      check: "schedule.md states the project earliest finish is exactly 22 hours"
    - id: obj-2
      check: "The finish times listed match exactly: P=5, Q=7, R=12, S=10, T=18, U=12, V=22, W=15"
    - id: obj-3
      check: "The stated critical path is exactly P -> R -> T -> V (the unique root-to-sink chain whose durations sum 5+7+6+4=22)"
    - id: obj-4
      check: "T's start time is given as 12 (not 7), correctly reflecting the R predecessor dominating over Q (prose-located, in the table or accompanying text)"
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
const tasks={P:{dur:5,deps:[]},Q:{dur:2,deps:['P']},R:{dur:7,deps:['P']},S:{dur:3,deps:['Q']},T:{dur:6,deps:['Q','R']},U:{dur:2,deps:['S']},V:{dur:4,deps:['T','U']},W:{dur:3,deps:['R']}};
const order=Object.keys(tasks);const ST={},FI={};
for(const id of order){const t=tasks[id];ST[id]=t.deps.length?Math.max(...t.deps.map(d=>FI[d])):0;FI[id]=ST[id]+t.dur;}
for(const id of order)console.log(id,'start',ST[id],'finish',FI[id]);
console.log('project',Math.max(...Object.values(FI)));
"
```

This prints: `P start 0 finish 5`, `Q start 5 finish 7`, `R start 5
finish 12`, `S start 7 finish 10`, `T start 12 finish 18`, `U start 10
finish 12`, `V start 18 finish 22`, `W start 12 finish 15`, and
`project 22`.

Enumerating all four root-to-sink paths gives: `P->Q->S->U->V` = 16,
`P->Q->T->V` = 17, `P->R->T->V` = **22**, `P->R->W` = 15. Only
`P->R->T->V` reaches 22, so the critical path is unique — this is a fair
binary check, not a judgment call.

If a submission's numbers disagree with this script's output, the
submission is wrong — do not average or split the difference.

### Trap

Stage T depends on BOTH Q (finishes at 7) and R (finishes at 12). The
correct rule takes the MAXIMUM over predecessor finish times, so T starts
at 12, not 7. A solver who visually follows the shorter-looking
`P->Q->T` chain, or who sums/averages predecessor finishes instead of
taking the max, will underestimate T's start (and therefore the project
finish). A submission that reports T's start as 7, or the critical path
as `P->Q->T->V` (sum 17, not 22), has fallen into this trap and fails
obj-2/obj-3/obj-4 regardless of how clearly it explains its (wrong)
reasoning.

### Example phrasings — obj-4, T's start correctly reflects the max over predecessors

PASSING:
- "T can't start until both Q and R are done — Q finishes at hour 7 but R
  runs until hour 12, so T is stuck waiting on R and starts at 12, not 7."
- "Even though the Q branch reaches T earlier, T has two predecessors and
  must wait for the slower one (R, finishing at 12), so T's start is 12."

FAILING:
- "T starts right after Q finishes, at hour 7, since that's the path that
  leads to T."
- "T's start is the sum of Q and R's finish times divided between them,
  giving roughly hour 9 or 10."

### Example phrasings — obj-3, naming the critical path correctly (max-of-predecessors logic, not a single-chain trace)

PASSING:
- "Walking the DAG, the chain P -> R -> T -> V is the one with zero slack
  end to end — every other root-to-sink path finishes earlier, so this is
  the path that actually sets the 22-hour project finish."
- "Comparing all four complete paths from a start stage to an end stage,
  only P -> R -> T -> V sums to 22; the others (17, 16, 15) finish
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
