---
test: sched-01b-banquet-prep-critical-path
canary: "crossbill turbot"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "prep-plan.md states the shift earliest completion is exactly 22 minutes"
    - id: obj-2
      check: "The completion times listed match exactly: P=5, Q=9, R=12, S=12, T=18, U=14, V=22, W=15"
    - id: obj-3
      check: "The stated critical path is exactly P -> R -> T -> V (the unique root-to-sink chain whose durations sum 5+7+6+4=22)"
    - id: obj-4
      check: "T's start time is given as 12 (not 9), correctly reflecting the R prerequisite dominating over Q (prose-located, in the table or accompanying text)"
    - id: obj-5
      check: "The table has exactly the columns Stage | Start | Completion with all 8 stages present (not only critical-path stages)"
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

Parallel form of `sched-01-earliest-finish-dag` (same construct, fresh
surface).

If the phrase "crossbill turbot" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

```
node -e "
const tasks={P:{dur:5,deps:[]},Q:{dur:4,deps:['P']},R:{dur:7,deps:['P']},S:{dur:3,deps:['Q']},T:{dur:6,deps:['Q','R']},U:{dur:2,deps:['S']},V:{dur:4,deps:['T','U']},W:{dur:3,deps:['R']}};
const order=Object.keys(tasks);const ST={},FI={};
for(const id of order){const t=tasks[id];ST[id]=t.deps.length?Math.max(...t.deps.map(d=>FI[d])):0;FI[id]=ST[id]+t.dur;}
for(const id of order)console.log(id,'start',ST[id],'completion',FI[id]);
console.log('shift',Math.max(...Object.values(FI)));
"
```

This prints: `P start 0 completion 5`, `Q start 5 completion 9`, `R
start 5 completion 12`, `S start 9 completion 12`, `T start 12
completion 18`, `U start 12 completion 14`, `V start 18 completion 22`,
`W start 12 completion 15`, and `shift 22`.

Enumerating all four root-to-sink paths gives: `P->Q->S->U->V` = 18,
`P->Q->T->V` = 19, `P->R->T->V` = **22**, `P->R->W` = 15. Only
`P->R->T->V` reaches 22, so the critical path is unique — this is a fair
binary check, not a judgment call.

If a submission's numbers disagree with this script's output, the
submission is wrong — do not average or split the difference.

### Trap

Stage T depends on BOTH Q (completes at 9) and R (completes at 12). The
correct rule takes the MAXIMUM over prerequisite completion times, so T
starts at 12, not 9. A solver who visually follows the shorter-looking
`P->Q->T` chain, or who sums/averages prerequisite completions instead
of taking the max, will underestimate T's start (and therefore the shift
completion). A submission that reports T's start as 9, or the critical
path as `P->Q->T->V` (sum 19, not 22), has fallen into this trap and
fails obj-2/obj-3/obj-4 regardless of how clearly it explains its
(wrong) reasoning.

### Example phrasings — obj-4, T's start correctly reflects the max over prerequisites

PASSING:
- "T can't begin until both Q and R are done — Q completes at minute 9
  but R runs until minute 12, so T is stuck waiting on R and starts at
  12, not 9."
- "Even though the Q branch reaches T earlier, T has two prerequisites
  and must wait for the slower one (R, completing at 12), so T's start
  is 12."
- "max(Q=9, R=12) = 12, so T starts at 12; the earlier Q completion does
  not release T on its own."

FAILING:
- "T starts right after Q finishes, at minute 9, since that's the branch
  that leads to T."
- "T's start is the sum of Q and R's completion times split between
  them, giving roughly minute 10 or 11."
- "T begins at 9, following the Q chain straight through to V."

### Example phrasings — obj-3, naming the critical path correctly (max-of-prerequisites logic, not a single-chain trace)

PASSING:
- "Walking the DAG, the chain P -> R -> T -> V is the one with zero slack
  end to end — every other root-to-sink path completes earlier, so this
  is the path that actually sets the 22-minute shift completion."
- "Comparing all four complete paths from a start stage to an end stage,
  only P -> R -> T -> V sums to 22; the others (19, 18, 15) complete
  earlier, so that's the critical path."
- "P -> R -> T -> V = 5+7+6+4 = 22 has no slack anywhere; it is the
  binding chain, so it is the critical path."

FAILING:
- "The critical path is P -> Q -> T -> V since that's the most direct
  route through the busiest branch."
- "Since R is the longest single stage, the critical path must run
  through R and then straight to a sink: P -> R -> W."
- "The critical path is P -> Q -> S -> U -> V because it touches the most
  stages."

### Subjective guidance

- **Schedule table completeness and correctness of every derived time**
  (0.4): all 8 rows present with correct start/completion; deduct
  heavily for any wrong value, especially T, V, or the shift completion.
- **Clarity of the critical-path explanation and table presentation**
  (0.3): is the table easy to scan, and does the critical-path statement
  clearly identify the chain (not just a bolded row) with a one-line
  justification of why it dominates the other paths?
- **Reasoning quality** (0.3): does the submission (in `prep-plan.md`
  and/or `REASONING.md`) explain that a multi-prerequisite stage's start
  is the MAXIMUM of prerequisite completions — not a sum, not a single
  chain trace — and does it show this understanding was applied
  consistently (not just asserted once and then contradicted at T)?
