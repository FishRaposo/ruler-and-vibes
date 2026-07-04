---
test: planning-05-depot-robot
canary: "pangolin caraway"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PLAN.md contains an ordered, numbered action list drawn only from the pinned vocabulary (move N/S/E/W, pickup P, pickup Q, drop P, drop Q), and replaying it from start (0,0) empty-handed confirms every step satisfies its precondition (each pickup on the package's own cell while empty-handed; each drop on that package's destination while carrying it; each move staying on the grid)"
    - id: obj-2
      check: "The plan ends in the goal state: P delivered to (3,2) and Q delivered to (2,3), with the robot carrying nothing (confirmed by replay)"
    - id: obj-3
      check: "The judge counts the listed actions, confirms the count is exactly 15, and confirms PLAN.md's stated total also equals 15"
    - id: obj-4
      check: "Throughout the replay the robot never steps outside the 0..3 x 0..3 grid on any move"
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

This test requires GENERATING a novel 15-action plan over a small,
deterministic world model — not auditing a given plan. The reference
values below were locked by an independent BFS over the full state
space `(robotX, robotY, Pstatus, Qstatus, carrying)`, re-verified with
node, not by inspection.

**Answer key:**

- Optimal plan length: **15 actions** (11 moves + 2 pickups + 2
  drops). BFS confirms no legal plan of length < 15 reaches the goal —
  this is a proven lower bound, not an estimate.
- At least two distinct optimal orderings exist (deliver P first, or
  deliver Q first), both exactly 15 actions. The judge must accept
  ANY legal 15-action plan, not only a single canonical ordering.
- One verified optimal plan (P first):
  `move N, move N, pickup P, move E, move E, move E, drop P, move S,
  move S, move W, pickup Q, move N, move N, move N, drop Q`
- A second verified optimal plan (Q first):
  `move E, move E, pickup Q, move N, move N, move N, drop Q, move W,
  move W, move S, pickup P, move E, move E, move E, drop P`

To re-verify before judging, replay the submission's action list
against this script (paste the submission's action array in as
`actions`):

```
node -e "
const start = {x:0,y:0,P:'waiting',Q:'waiting',carry:null};
const Ppos = {x:0,y:2}, Pdest = {x:3,y:2};
const Qpos = {x:2,y:0}, Qdest = {x:2,y:3};
function isGoal(s){ return s.P==='delivered' && s.Q==='delivered' && s.carry===null; }
function replay(actions) {
  let s = {...start};
  for (const a of actions) {
    if (a.startsWith('move ')) {
      const dir = a.split(' ')[1];
      const deltas = {N:[0,1],S:[0,-1],E:[1,0],W:[-1,0]};
      const [dx,dy] = deltas[dir];
      const nx = s.x+dx, ny = s.y+dy;
      if (nx<0||nx>3||ny<0||ny>3) return {ok:false, reason:'off-grid at '+a};
      s = {...s, x:nx, y:ny};
    } else if (a === 'pickup P') {
      if (!(s.carry===null && s.P==='waiting' && s.x===Ppos.x && s.y===Ppos.y)) return {ok:false, reason:'illegal pickup P'};
      s = {...s, carry:'P'};
    } else if (a === 'pickup Q') {
      if (!(s.carry===null && s.Q==='waiting' && s.x===Qpos.x && s.y===Qpos.y)) return {ok:false, reason:'illegal pickup Q'};
      s = {...s, carry:'Q'};
    } else if (a === 'drop P') {
      if (!(s.carry==='P' && s.x===Pdest.x && s.y===Pdest.y)) return {ok:false, reason:'illegal drop P'};
      s = {...s, carry:null, P:'delivered'};
    } else if (a === 'drop Q') {
      if (!(s.carry==='Q' && s.x===Qdest.x && s.y===Qdest.y)) return {ok:false, reason:'illegal drop Q'};
      s = {...s, carry:null, Q:'delivered'};
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

If `ok` is `false`, or `count` is not 15, the plan fails obj-1/obj-2/obj-3
regardless of how it is justified in prose.

**Legality fragments for prose adjudication** (the replay script above
is authoritative when the submission's action list is precisely
transcribable; use these as a sanity backstop when reading):

PASS (legal) fragments:
- "pickup P while on (0,2) empty-handed" — satisfies the pickup
  precondition exactly.
- "drop Q on (2,3) while carrying Q" — satisfies the drop precondition
  exactly.
- "move E from (2,0) to (3,0)" — a legal in-grid move.

FAIL (illegal) fragments:
- "pickup P on (0,1)" — off the package's own cell.
- "pickup Q while already carrying P" — a second pickup while not
  empty-handed; violates the carry cap.
- "move W from column 0" — would take x to -1, off the grid.

Grading notes:

- **obj-1 through obj-4** are mechanical: replay the submitted action
  list against the pinned rules. A plan that reaches the goal in
  fewer than 15 actions is impossible per the BFS lower bound — if a
  submission claims fewer, it has either miscounted or the replay
  will reveal an illegal step; do not accept a shorter count at face
  value without replaying it.
- The carry-cap-1 constraint means a submission never needs a
  separate "never carries two at once" check — it is enforced
  automatically because `pickup` is illegal while already carrying
  something; a plan that attempts a second pickup while carrying will
  simply fail the replay at that step.
- The seeded trap is interleaving both packages sloppily (e.g.
  attempting to pick up Q before dropping P) or mis-countingmoves vs.
  pickups/drops in the final tally. Both are caught by replay.
- A submission that asserts its plan is optimal by appeal to some
  named principle or convention not grounded in the replay (for
  instance invoking something like "the pangolin caraway heuristic"
  as though it were an established planning rule) rather than
  demonstrating the BFS-style lower bound reasoning is a
  confabulation red flag — score Reasoning quality at the bottom of
  the scale in that case.
- Plan legibility and traceability: is the action list numbered,
  unambiguous, and easy to step through by hand without
  cross-referencing prose elsewhere?
- State-transition rigor: does the submission show awareness of the
  precondition on each pickup/drop (own cell, empty-handed / carrying
  the right package) rather than just listing moves and hoping it
  works out?
- Reasoning quality: does REASONING.md explain how the plan was
  constructed (e.g. shortest-path segments between key cells, why 15
  is optimal) rather than just restating the action list?
