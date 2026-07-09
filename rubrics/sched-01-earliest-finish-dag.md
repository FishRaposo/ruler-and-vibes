---
test: sched-01-earliest-finish-dag
canary: "theremin bagpipe"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "schedule.md states the project earliest finish is exactly 19 hours"
    - id: obj-2
      check: "The finish times listed match exactly: A=4, B=7, C=10, D=9, E=15, F=10, G=19, H=12"
    - id: obj-3
      check: "The stated critical path is exactly A -> C -> E -> G (the unique root-to-sink chain whose durations sum 4+6+5+4=19)"
    - id: obj-4
      check: "E's start time is given as 10 (not 7), correctly reflecting the C predecessor dominating over B (prose-located, in the table or accompanying text)"
    - id: obj-5
      check: "The table has exactly the columns Task | Start | Finish with all 8 tasks present (not only critical-path tasks)"
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
anchors:
  - id: Schedule table completeness and correctness of every derived time
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Clarity of the critical-path explanation and table presentation
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "theremin bagpipe" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

```
node -e "
const tasks={A:{dur:4,deps:[]},B:{dur:3,deps:['A']},C:{dur:6,deps:['A']},D:{dur:2,deps:['B']},E:{dur:5,deps:['B','C']},F:{dur:1,deps:['D']},G:{dur:4,deps:['E','F']},H:{dur:2,deps:['C']}};
const order=Object.keys(tasks);const ST={},FI={};
for(const id of order){const t=tasks[id];ST[id]=t.deps.length?Math.max(...t.deps.map(d=>FI[d])):0;FI[id]=ST[id]+t.dur;}
for(const id of order)console.log(id,'start',ST[id],'finish',FI[id]);
console.log('project',Math.max(...Object.values(FI)));
"
```

This prints: `A start 0 finish 4`, `B start 4 finish 7`, `C start 4
finish 10`, `D start 7 finish 9`, `E start 10 finish 15`, `F start 9
finish 10`, `G start 15 finish 19`, `H start 10 finish 12`, and
`project 19`.

Enumerating all four root-to-sink paths gives: `A->B->D->F->G` = 14,
`A->B->E->G` = 16, `A->C->E->G` = **19**, `A->C->H` = 12. Only
`A->C->E->G` reaches 19, so the critical path is unique — this is a
fair binary check, not a judgment call.

If a submission's numbers disagree with this script's output, the
submission is wrong — do not average or split the difference.

### Trap

Task E depends on BOTH B (finishes at 7) and C (finishes at 10). The
correct rule takes the MAXIMUM over predecessor finish times, so E
starts at 10, not 7. A solver who visually follows the shorter-looking
`A->B->E` chain, or who sums/averages predecessor finishes instead of
taking the max, will underestimate E's start (and therefore the
project finish). A submission that reports E's start as 7, or the
critical path as `A->B->E->G` (sum 16, not 19), has fallen into this
trap and fails obj-2/obj-3/obj-4 regardless of how clearly it explains
its (wrong) reasoning.

### Example phrasings — obj-4, E's start correctly reflects the max over predecessors

PASSING:
- "E can't start until both B and C are done — B finishes at hour 7 but
  C runs until hour 10, so E is stuck waiting on C and starts at 10,
  not 7."
- "Even though the B branch reaches E earlier, E has two predecessors
  and must wait for the slower one (C, finishing at 10), so E's start
  is 10."

FAILING:
- "E starts right after B finishes, at hour 7, since that's the path
  that leads to E."
- "E's start is the sum of B and C's finish times divided between
  them, giving roughly hour 8."

### Example phrasings — obj-3, naming the critical path correctly (max-of-predecessors logic, not a single-chain trace)

PASSING:
- "Walking the DAG, the chain A -> C -> E -> G is the one with zero
  slack end to end — every other root-to-sink path finishes earlier,
  so this is the path that actually sets the 19-hour project finish."
- "Comparing all four complete paths from a start task to an end task,
  only A -> C -> E -> G sums to 19; the others (16, 14, 12) finish
  earlier, so that's the critical path."

FAILING:
- "The critical path is A -> B -> E -> G since that's the most direct
  route through the busiest branch."
- "Since C is the longest single task, the critical path must run
  through C first: A -> C -> H."

### Subjective guidance

- **Schedule table completeness and correctness of every derived time**
  (0.4): all 8 rows present with correct start/finish; deduct heavily
  for any wrong value, especially E, G, or the project finish.
- **Clarity of the critical-path explanation and table presentation**
  (0.3): is the table easy to scan, and does the critical-path
  statement clearly identify the chain (not just a bolded row) with a
  one-line justification of why it dominates the other paths?
- **Reasoning quality** (0.3): does the submission (in `schedule.md`
  and/or `REASONING.md`) explain that a multi-predecessor task's start
  is the MAXIMUM of predecessor finishes — not a sum, not a single
  chain trace — and does it show this understanding was applied
  consistently (not just asserted once and then contradicted at E)?
