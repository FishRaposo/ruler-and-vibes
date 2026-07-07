---
test: planning-05b-archive-cart
canary: "tsessebe wildebeest"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PLAN.md contains an ordered, numbered action list drawn only from the pinned vocabulary (move N/S/E/W, load periodicals, load manuscripts, unload periodicals, unload manuscripts), and replaying it from start (1,3) empty-handed confirms every step satisfies its precondition (each load on the crate's own bay while empty-handed; each unload on that crate's destination while carrying it; each move staying on the grid)"
    - id: obj-2
      check: "The plan ends in the goal state: periodicals crate delivered to (1,0) and manuscripts crate delivered to (4,3), with the cart carrying nothing (confirmed by replay)"
    - id: obj-3
      check: "The judge counts the listed actions, confirms the count is exactly 17, and confirms PLAN.md's stated total also equals 17"
    - id: obj-4
      check: "Throughout the replay the cart never steps outside the 0..4 x 0..3 grid on any move"
    - id: obj-5
      check: "PLAN.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 300 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Plan legibility and traceability"
      weight: 0.4
    - id: sub-craft
      name: "State-transition rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `planning-05-depot-robot` (same construct, fresh
surface).

If the phrase "tsessebe wildebeest" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test requires GENERATING a novel 17-action plan over a small,
deterministic world model — not auditing a given plan. The reference
values below were locked by an independent BFS over the full state
space `(cartX, cartY, periodicalsStatus, manuscriptsStatus, carrying)`,
re-verified with node, not by inspection.

**Answer key:**

- Optimal plan length: **17 actions** (13 moves + 2 loads + 2
  unloads). BFS confirms no legal plan of length < 17 reaches the
  goal — this is a proven lower bound, not an estimate.
- At least two distinct optimal orderings exist (deliver the
  periodicals crate first, or deliver the manuscripts crate first),
  both exactly 17 actions. The judge must accept ANY legal 17-action
  plan, not only a single canonical ordering.
- One verified optimal plan (periodicals first):
  `move E, move E, move S, load periodicals, move W, move W, move S,
  move S, unload periodicals, move E, move N, load manuscripts, move
  E, move E, move N, move N, unload manuscripts`
- A second verified optimal plan (manuscripts first):
  `move E, move S, move S, load manuscripts, move E, move E, move N,
  move N, unload manuscripts, move W, move S, load periodicals, move
  W, move W, move S, move S, unload periodicals`

To re-verify before judging, replay the submission's action list
against this script (paste the submission's action array in as
`actions`):

```
node -e "
const start = {x:1,y:3,periodicals:'waiting',manuscripts:'waiting',carry:null};
const Ppos = {x:3,y:2}, Pdest = {x:1,y:0};
const Qpos = {x:2,y:1}, Qdest = {x:4,y:3};
function isGoal(s){ return s.periodicals==='delivered' && s.manuscripts==='delivered' && s.carry===null; }
function replay(actions) {
  let s = {...start};
  for (const a of actions) {
    if (a.startsWith('move ')) {
      const dir = a.split(' ')[1];
      const deltas = {N:[0,1],S:[0,-1],E:[1,0],W:[-1,0]};
      const [dx,dy] = deltas[dir];
      const nx = s.x+dx, ny = s.y+dy;
      if (nx<0||nx>4||ny<0||ny>3) return {ok:false, reason:'off-grid at '+a};
      s = {...s, x:nx, y:ny};
    } else if (a === 'load periodicals') {
      if (!(s.carry===null && s.periodicals==='waiting' && s.x===Ppos.x && s.y===Ppos.y)) return {ok:false, reason:'illegal load periodicals'};
      s = {...s, carry:'periodicals'};
    } else if (a === 'load manuscripts') {
      if (!(s.carry===null && s.manuscripts==='waiting' && s.x===Qpos.x && s.y===Qpos.y)) return {ok:false, reason:'illegal load manuscripts'};
      s = {...s, carry:'manuscripts'};
    } else if (a === 'unload periodicals') {
      if (!(s.carry==='periodicals' && s.x===Pdest.x && s.y===Pdest.y)) return {ok:false, reason:'illegal unload periodicals'};
      s = {...s, carry:null, periodicals:'delivered'};
    } else if (a === 'unload manuscripts') {
      if (!(s.carry==='manuscripts' && s.x===Qdest.x && s.y===Qdest.y)) return {ok:false, reason:'illegal unload manuscripts'};
      s = {...s, carry:null, manuscripts:'delivered'};
    } else {
      return {ok:false, reason:'unknown action: '+a};
    }
  }
  return {ok:isGoal(s), reason: isGoal(s)?'goal reached':'not at goal', count:actions.length};
}
const actions = [/* paste submission's actions here as quoted strings */];
console.log(replay(actions));
"
```

If `ok` is `false`, or `count` is not 17, the plan fails obj-1/obj-2/obj-3
regardless of how it is justified in prose.

**Legality fragments for prose adjudication** (the replay script above
is authoritative when the submission's action list is precisely
transcribable; use these as a sanity backstop when reading):

PASS (legal) fragments:
- "load periodicals while on (3,2) empty-handed" — satisfies the load
  precondition exactly.
- "unload manuscripts on (4,3) while carrying the manuscripts crate" —
  satisfies the unload precondition exactly.
- "move E from (1,1) to (2,1)" — a legal in-grid move.

FAIL (illegal) fragments:
- "load periodicals on (3,1)" — off the crate's own bay.
- "load manuscripts while already carrying the periodicals crate" — a
  second load while not empty-handed; violates the carry cap.
- "move W from column 0" — would take x to -1, off the grid.

Grading notes:

- **obj-1 through obj-4** are mechanical: replay the submitted action
  list against the pinned rules. A plan that reaches the goal in
  fewer than 17 actions is impossible per the BFS lower bound — if a
  submission claims fewer, it has either miscounted or the replay
  will reveal an illegal step; do not accept a shorter count at face
  value without replaying it.
- The carry-cap-1 constraint means a submission never needs a
  separate "never carries two crates at once" check — it is enforced
  automatically because `load` is illegal while already carrying
  something; a plan that attempts a second load while carrying will
  simply fail the replay at that step.
- The seeded trap is interleaving both crates sloppily (e.g.
  attempting to load the manuscripts crate before unloading the
  periodicals crate) or miscounting moves vs. loads/unloads in the
  final tally. Both are caught by replay.
- A submission that asserts its plan is optimal by appeal to some
  named principle or convention not grounded in the replay (for
  instance invoking something like "the corridor-shortcut heuristic"
  as though it were an established planning rule) rather than
  demonstrating the BFS-style lower bound reasoning is a confabulation
  red flag — score Reasoning quality at the bottom of the scale in
  that case.
- Plan legibility and traceability: is the action list numbered,
  unambiguous, and easy to step through by hand without
  cross-referencing prose elsewhere?
- State-transition rigor: does the submission show awareness of the
  precondition on each load/unload (own bay, empty-handed / carrying
  the right crate) rather than just listing moves and hoping it works
  out?
- Reasoning quality: does REASONING.md explain how the plan was
  constructed (e.g. shortest-path segments between key bays, why 17
  is optimal) rather than just restating the action list?
