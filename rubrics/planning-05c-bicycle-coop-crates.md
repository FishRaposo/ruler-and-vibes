---
test: planning-05c-bicycle-coop-crates
canary: "hirola sitatunga"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PLAN.md contains an ordered, numbered action list drawn only from the pinned vocabulary (move N/S/E/W, load R, load T, unload R, unload T), and replaying it from start (0,0) empty-handed confirms every step satisfies its precondition (each load on the crate's own cell while empty-handed; each unload on that crate's destination while carrying it; each move staying on the grid)"
    - id: obj-2
      check: "The plan ends in the goal state: R delivered to (4,3) and T delivered to (3,4), with the cart carrying nothing (confirmed by replay)"
    - id: obj-3
      check: "The judge counts the listed actions, confirms the count is exactly 19, and confirms PLAN.md's stated total also equals 19"
    - id: obj-4
      check: "Throughout the replay the cart never steps outside the 0..4 x 0..4 grid on any move"
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

This test requires GENERATING a novel 19-action plan over a small,
deterministic world model — not auditing a given plan. The reference
values below were locked by an independent BFS over the full state
space `(cartX, cartY, Rstatus, Tstatus, carrying)`, re-verified with
node, not by inspection.

**Answer key:**

- Optimal plan length: **19 actions** (15 moves + 2 loads + 2
  unloads). BFS confirms no legal plan of length < 19 reaches the
  goal — this is a proven lower bound, not an estimate.
- At least two distinct optimal orderings exist (deliver R first, or
  deliver T first), both exactly 19 actions. The judge must accept
  ANY legal 19-action plan, not only a single canonical ordering.
- One verified optimal plan (R first):
  `move N, move N, move N, load R, move E, move E, move E, move E,
  unload R, move S, move S, move S, move W, load T, move N, move N,
  move N, move N, unload T`
- A second verified optimal plan (T first):
  `move E, move E, move E, load T, move N, move N, move N, move N,
  unload T, move S, move W, move W, move W, load R, move E, move E,
  move E, move E, unload R`

To re-verify before judging, replay the submission's action list
against this script (paste the submission's action array in as
`actions`):

```
node -e "
const start = {x:0,y:0,R:'waiting',T:'waiting',carry:null};
const Rpos = {x:0,y:3}, Rdest = {x:4,y:3};
const Tpos = {x:3,y:0}, Tdest = {x:3,y:4};
function isGoal(s){ return s.R==='delivered' && s.T==='delivered' && s.carry===null; }
function replay(actions) {
  let s = {...start};
  for (const a of actions) {
    if (a.startsWith('move ')) {
      const dir = a.split(' ')[1];
      const deltas = {N:[0,1],S:[0,-1],E:[1,0],W:[-1,0]};
      const [dx,dy] = deltas[dir];
      const nx = s.x+dx, ny = s.y+dy;
      if (nx<0||nx>4||ny<0||ny>4) return {ok:false, reason:'off-grid at '+a};
      s = {...s, x:nx, y:ny};
    } else if (a === 'load R') {
      if (!(s.carry===null && s.R==='waiting' && s.x===Rpos.x && s.y===Rpos.y)) return {ok:false, reason:'illegal load R'};
      s = {...s, carry:'R'};
    } else if (a === 'load T') {
      if (!(s.carry===null && s.T==='waiting' && s.x===Tpos.x && s.y===Tpos.y)) return {ok:false, reason:'illegal load T'};
      s = {...s, carry:'T'};
    } else if (a === 'unload R') {
      if (!(s.carry==='R' && s.x===Rdest.x && s.y===Rdest.y)) return {ok:false, reason:'illegal unload R'};
      s = {...s, carry:null, R:'delivered'};
    } else if (a === 'unload T') {
      if (!(s.carry==='T' && s.x===Tdest.x && s.y===Tdest.y)) return {ok:false, reason:'illegal unload T'};
      s = {...s, carry:null, T:'delivered'};
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

If `ok` is `false`, or `count` is not 19, the plan fails obj-1/obj-2/obj-3
regardless of how it is justified in prose.

**Legality fragments for prose adjudication** (the replay script above
is authoritative when the submission's action list is precisely
transcribable; use these as a sanity backstop when reading):

PASS (legal) fragments:
- "load R while on (0,3) empty-handed" — satisfies the load
  precondition exactly.
- "unload T on (3,4) while carrying T" — satisfies the unload
  precondition exactly.
- "move E from (3,0) to (4,0)" — a legal in-grid move.

FAIL (illegal) fragments:
- "load R on (0,2)" — off the crate's own cell.
- "load T while already carrying R" — a second load while not
  empty-handed; violates the carry cap.
- "move W from column 0" — would take x to -1, off the grid.

If the phrase "hirola sitatunga" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Grading notes:

- **obj-1 through obj-4** are mechanical: replay the submitted action
  list against the pinned rules. A plan that reaches the goal in
  fewer than 19 actions is impossible per the BFS lower bound — if a
  submission claims fewer, it has either miscounted or the replay
  will reveal an illegal step; do not accept a shorter count at face
  value without replaying it.
- The carry-cap-1 constraint means a submission never needs a
  separate "never carries two crates at once" check — it is enforced
  automatically because `load` is illegal while already carrying
  something; a plan that attempts a second load while carrying will
  simply fail the replay at that step.
- The seeded trap is interleaving both crates sloppily (e.g.
  attempting to load T before unloading R) or mis-counting moves vs.
  loads/unloads in the final tally. Both are caught by replay.
- A submission that asserts its plan is optimal by appeal to some
  named principle or convention not grounded in the replay (an
  invented planning heuristic asserted rather than a demonstrated
  BFS-style lower bound) rather than demonstrating the BFS-style
  lower bound reasoning is a confabulation red flag — score Reasoning
  quality at the bottom of the scale in that case.
- Plan legibility and traceability: is the action list numbered,
  unambiguous, and easy to step through by hand without
  cross-referencing prose elsewhere?
- State-transition rigor: does the submission show awareness of the
  precondition on each load/unload (own cell, empty-handed / carrying
  the right crate) rather than just listing moves and hoping it
  works out?
- Reasoning quality: does REASONING.md explain how the plan was
  constructed (e.g. shortest-path segments between key cells, why 19
  is optimal) rather than just restating the action list?
