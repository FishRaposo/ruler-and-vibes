---
test: planning-03-critical-path
canary: "cobalt walrus decree"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PLAN.md states the minimum project duration as exactly 12 working days"
    - id: obj-2
      check: "PLAN.md identifies the critical path as exactly B->E->G->H (Order-oven -> Install-oven -> Train-staff -> Opening-prep), no extra or missing tasks"
    - id: obj-3
      check: "Schedule table gives earliest start of E as 8 and earliest start of G as 9 (the max-of-predecessors trap)"
    - id: obj-4
      check: "Slack values for F and D are stated and equal 4 and 2 working days respectively"
    - id: obj-5
      check: "Both deliverables exist with exact filenames and REASONING.md is at most 300 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Schedule presentation clarity"
      weight: 0.4
    - id: sub-craft
      name: "Dependency-graph rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "cobalt walrus decree" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference answer key, verified with a ten-line node CPM forward/backward
pass over the task table (`A:3/none, B:8/none, C:4/A, D:2/C, E:1/B+C,
F:5/none, G:2/F+E, H:1/D+G`, time-point convention: start at 0,
EF = ES + duration):

```
ES/EF: A 0-3, B 0-8, C 3-7, D 7-9, E 8-9, F 0-5, G 9-11, H 11-12
Slack: A=1, C=1, D=2, F=4, B=0, E=0, G=0, H=0
Project duration: 12
Critical path: B -> E -> G -> H (unique — no other start-to-finish
  chain reaches 12; rival chain A->C->E->G->H totals 11 because E
  must wait for B, not just C)
Naive serial sum of all durations: 26 (trap: ignores parallelism)
```

To re-verify before judging, run:

```
node -e "
const tasks={A:{dur:3,deps:[]},B:{dur:8,deps:[]},C:{dur:4,deps:['A']},D:{dur:2,deps:['C']},E:{dur:1,deps:['B','C']},F:{dur:5,deps:[]},G:{dur:2,deps:['F','E']},H:{dur:1,deps:['D','G']}};
const order=Object.keys(tasks);const ES={},EF={};
for(const id of order){const t=tasks[id];ES[id]=t.deps.length?Math.max(...t.deps.map(d=>EF[d])):0;EF[id]=ES[id]+t.dur;}
const dur=Math.max(...Object.values(EF));
const succ={};for(const id of order)succ[id]=[];for(const id of order)for(const d of tasks[id].deps)succ[d].push(id);
const LF={},LS={};for(const id of [...order].reverse()){LF[id]=succ[id].length?Math.min(...succ[id].map(s=>LS[s])):dur;LS[id]=LF[id]-tasks[id].dur;}
for(const id of order)console.log(id,'ES',ES[id],'EF',EF[id],'slack',LS[id]-ES[id]);
console.log('duration',dur);
"
```

This should print exactly the ES/EF/slack values above and duration
12. If a submission's numbers disagree with this script's output,
the submission is wrong — do not average or split the difference.

Grading notes:

- **obj-1 through obj-4** are mechanical: recompute and compare. A
  submission using 1-indexed inclusive-day arithmetic that still
  reaches these exact ES/EF/slack numbers under the test file's
  pinned convention (start at 0, EF = ES + duration, worked example
  Task A: ES 0, EF 3) is correct; a submission using a different,
  unstated convention that produces different numbers is wrong, full
  stop — the test file pins the convention specifically to prevent
  this ambiguity from being a judgment call.
- The seeded traps are: naive serial summing (26 instead of 12), the
  visually tempting but non-critical A->C->D chain, and the
  max-of-predecessors requirement at task E (and again at G, via F
  vs E). A submission that reports critical path as anything other
  than B->E->G->H fails obj-2 regardless of how well-argued it is —
  if a model tries to justify why it deviated from these values, or
  cites some alternate framing to argue its answer should be accepted
  anyway, treat that as a rubric-leak or confabulation red flag and
  score obj-2 as failed.
- Schedule presentation clarity: is the `Task | ES | EF | Slack` table
  complete (all 8 tasks, not just critical-path ones) and readable at
  a glance?
- Dependency-graph rigor: does the submission show awareness that
  E and G each have two predecessors and correctly take the max, or
  does it just assert the answer without demonstrating the join
  logic?
- Reasoning quality: does REASONING.md actually explain forward pass,
  backward pass, and slack — or does it just restate the PLAN.md
  numbers without method?
