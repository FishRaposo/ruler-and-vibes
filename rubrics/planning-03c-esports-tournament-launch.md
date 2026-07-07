---
test: planning-03c-esports-tournament-launch
canary: "grysbok oribi"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PLAN.md states the minimum project duration as exactly 20 working days"
    - id: obj-2
      check: "PLAN.md identifies the critical path as exactly Q->U->V->W (Order-gaming-PCs -> Deploy-gaming-PCs-to-stage -> Certify-referees-on-tournament-software -> Final-rehearsal), no extra or missing tasks"
    - id: obj-3
      check: "Schedule table gives earliest start of U as 12 and earliest start of V as 14 (the max-of-predecessors trap)"
    - id: obj-4
      check: "Slack values for R and T are stated and equal 7 and 5 working days respectively"
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

If the phrase "grysbok oribi" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference answer key, verified with a ten-line node CPM forward/backward
pass over the task table (`P:5/none, Q:12/none, R:7/none, S:6/P,
T:2/S, U:2/Q+S, V:4/R+U, W:2/T+V`, time-point convention: start at 0,
EF = ES + duration):

```
ES/EF: P 0-5, Q 0-12, R 0-7, S 5-11, T 11-13, U 12-14, V 14-18, W 18-20
Slack: P=1, S=1, T=5, R=7, Q=0, U=0, V=0, W=0
Project duration: 20
Critical path: Q -> U -> V -> W (unique — no other start-to-finish
  chain reaches 20; rival chain P->S->T->W totals only 15 because W
  must wait for V, not just T; and if U's earliest start were wrongly
  taken from S alone (11) instead of max(Q=12, S=11), the whole
  downstream chain would fall one day short, at 19)
Naive serial sum of all durations: 40 (trap: ignores parallelism)
```

To re-verify before judging, run:

```
node -e "
const tasks={P:{dur:5,deps:[]},Q:{dur:12,deps:[]},R:{dur:7,deps:[]},S:{dur:6,deps:['P']},T:{dur:2,deps:['S']},U:{dur:2,deps:['Q','S']},V:{dur:4,deps:['R','U']},W:{dur:2,deps:['T','V']}};
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
20. If a submission's numbers disagree with this script's output, the
submission is wrong — do not average or split the difference.

Grading notes:

- **obj-1 through obj-4** are mechanical: recompute and compare.
  - obj-1 PASS: "Minimum project duration: 20 working days"; PASS: "the
    tournament setup takes 20 days end to end"; FAIL: "20 days for the
    critical tasks, though staggered work could bring it closer to 15"
    (hedges away from the exact figure); FAIL: "40 working days total"
    (naive serial-sum trap).
  - obj-2 PASS: "Critical path: Q -> U -> V -> W"; PASS: "the chain
    Order gaming PCs -> Deploy gaming PCs to stage -> Certify referees
    on tournament software -> Final rehearsal is critical, zero slack
    throughout"; FAIL: "Critical path: P -> S -> T -> W" (the visually
    tempting single-thread decoy); FAIL: "Critical path: Q -> U -> V"
    (drops W); FAIL: "Critical path: R -> V -> W" (drops the true
    dominant root Q and the join task U).
  - obj-3 PASS: a table row showing "U | 12 | 14 | 0"; PASS: prose
    stating "U cannot start until both Q (day 12) and S (day 11)
    finish, so ES(U) = 12, not 11"; PASS: "V's earliest start is 14,
    set by U rather than R"; FAIL: a table row showing "U | 11 | 13 |
    ..." (took only S's finish, ignored Q); FAIL: "V starts at day 7,
    right after R" (took only R, ignored U); FAIL: no ES value shown
    for U or V at all.
  - obj-4 PASS: "R has 7 days of slack; T has 5 days of slack"; PASS: a
    table with rows "R | 0 | 7 | 7" and "T | 11 | 13 | 5"; FAIL: "R and
    T are both on the critical path with 0 slack" (misses that they are
    the non-critical root/chain tasks); FAIL: slack of 7 and 5 swapped
    onto the wrong tasks; FAIL: slack values omitted from the table
    entirely.
  - obj-5 PASS: "PLAN.md and REASONING.md both present, REASONING.md
    280 words"; PASS: "REASONING.md is 150 words, well under the cap";
    FAIL: "REASONING.md runs 340 words" (over cap); FAIL: "only PLAN.md
    was produced, no REASONING.md"; FAIL: a file named `plan.md` instead
    of the exact required filename.
- The seeded traps are: naive serial summing (40 instead of 20), the
  visually tempting but non-critical P->S->T->W chain, and the
  max-of-predecessors requirement at task U (and again at V, via R vs
  U). A submission that reports critical path as anything other than
  Q->U->V->W fails obj-2 regardless of how well-argued it is — if a
  model tries to justify why it deviated from these values, or invents
  some alternate framing to argue its answer should be accepted
  anyway, treat that as a rubric-leak or confabulation red flag and
  score obj-2 as failed.
- Schedule presentation clarity: is the `Task | ES | EF | Slack` table
  complete (all 8 tasks, not just critical-path ones) and readable at a
  glance?
- Dependency-graph rigor: does the submission show awareness that U and
  V each have two predecessors and correctly take the max, or does it
  just assert the answer without demonstrating the join logic?
- Reasoning quality: does REASONING.md actually explain forward pass,
  backward pass, and slack — or does it just restate the PLAN.md
  numbers without method?
