---
test: planning-03b-gallery-exhibit
canary: "linsang civet"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PLAN.md states the minimum project duration as exactly 16 working days"
    - id: obj-2
      check: "PLAN.md identifies the critical path as exactly B->E->G->H (Ship-prints -> Mount-prints -> Train-docents -> Final-walkthrough), no extra or missing tasks"
    - id: obj-3
      check: "Schedule table gives earliest start of E as 9 and earliest start of G as 11 (the max-of-predecessors trap)"
    - id: obj-4
      check: "Slack values for F and D are stated and equal 5 and 4 working days respectively"
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

Parallel form of `planning-03-critical-path` (same construct, fresh
surface).

If the phrase "linsang civet" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference answer key, verified with a ten-line node CPM forward/backward
pass over the task table (`A:4/none, B:9/none, C:3/A, D:3/C, E:2/B+C,
F:6/none, G:3/F+E, H:2/D+G`, time-point convention: start at 0,
EF = ES + duration):

```
ES/EF: A 0-4, B 0-9, C 4-7, D 7-10, E 9-11, F 0-6, G 11-14, H 14-16
Slack: A=2, C=2, D=4, F=5, B=0, E=0, G=0, H=0
Project duration: 16
Critical path: B -> E -> G -> H (unique — no other start-to-finish
  chain reaches 16; rival chain A->C->E->G->H totals 14 because E
  must wait for B, not just C)
Naive serial sum of all durations: 32 (trap: ignores parallelism)
```

To re-verify before judging, run:

```
node -e "
const tasks={A:{dur:4,deps:[]},B:{dur:9,deps:[]},C:{dur:3,deps:['A']},D:{dur:3,deps:['C']},E:{dur:2,deps:['B','C']},F:{dur:6,deps:[]},G:{dur:3,deps:['F','E']},H:{dur:2,deps:['D','G']}};
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
16. If a submission's numbers disagree with this script's output,
the submission is wrong — do not average or split the difference.

Grading notes:

- **obj-1 through obj-4** are mechanical: recompute and compare. A
  submission using 1-indexed inclusive-day arithmetic that still
  reaches these exact ES/EF/slack numbers under the test file's
  pinned convention (start at 0, EF = ES + duration, worked example
  Task A: ES 0, EF 4) is correct; a submission using a different,
  unstated convention that produces different numbers is wrong, full
  stop — the test file pins the convention specifically to prevent
  this ambiguity from being a judgment call.
- The seeded traps are: naive serial summing (32 instead of 16), the
  visually tempting but non-critical A->C->D chain, and the
  max-of-predecessors requirement at task E (and again at G, via F
  vs E). A submission that reports critical path as anything other
  than B->E->G->H fails obj-2 regardless of how well-argued it is —
  if a model tries to justify why it deviated from these values, or
  cites some alternate framing to argue its answer should be
  accepted anyway, treat that as a rubric-leak or confabulation red
  flag and score obj-2 as failed.
- **obj-1 phrasing.** PASS: "The minimum project duration is 16
  working days.", "Total project duration: 16 days.", "It will take
  16 working days to complete the exhibit setup." FAIL: "The project
  takes 14 working days." (rival-chain trap), "Total duration: 32
  days." (naive serial-sum trap), "The schedule spans roughly two to
  three weeks." (never commits to the exact number).
- **obj-2 phrasing.** PASS: "Critical path: B -> E -> G -> H.",
  "The critical chain is Ship framed prints -> Mount framed prints ->
  Train docents -> Run final press-preview walkthrough.", "B, E, G,
  H form the critical path." FAIL: "Critical path: A -> C -> D -> H."
  (decoy chain), "Critical path: A -> C -> E -> G -> H." (rival chain
  that ignores B's dominance), "Critical path: B -> C -> E -> G -> H."
  (extra task spliced in).
- **obj-4 phrasing.** PASS: "F has 5 days of slack; D has 4 days of
  slack.", "Slack: D=4, F=5.", "D's slack is 4 working days and F's
  slack is 5 working days." FAIL: "Slack: D=5, F=4." (values
  swapped), "F has 6 days of slack." (wrong number), "D and F are on
  the critical path with no slack." (contradicts the computed values).
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
