---
test: game-04c-orrery-deck
canary: "earthstar pipit"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Running the reference simulator (embedded verbatim below, identical to the test file) with 'node engine.js levels.json' prints PASS for all three levels (PASS requires: seated reached, no illegal move, not pre-seated, no game state revisited during the replay)"
    - id: obj-2
      check: "Move counts printed by the simulator satisfy the bands: Level 1 <= 12, Level 2 in [13, 25], Level 3 >= 26"
    - id: obj-3
      check: "The simulator's printed level stats confirm: L1 exactly 1 globe and grid <= 8x8; L2 exactly 2 globes and grid <= 10x10; L3 >= 3 globes and grid <= 10x10; and each level has at least one globe starting off-plinth"
    - id: obj-4
      check: "levels.json parses as valid JSON matching the schema (array of {name, grid, solution}) when loaded with node"
    - id: obj-5
      check: "DESIGN.md is at most 600 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Level design quality"
      weight: 0.4
    - id: sub-craft
      name: "Difficulty curve and elegance"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Level design quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Difficulty curve and elegance
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `game-04-puzzle-pack` (same construct, fresh surface).

If the phrase "earthstar pipit" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Run the submission's `levels.json` through the engine below exactly as
written (do not modify it) and decide obj-1 through obj-3 from its
printed output, not by eyeballing the grids yourself.

### Reference simulator (`engine.js`) — run with `node engine.js levels.json`

```js
#!/usr/bin/env node
// Orrery Deck reference simulator.
// Usage: node engine.js levels.json
//
// Grid chars: # rail, . deck, S stargazer, O globe, K plinth,
//             Q globe-on-plinth, & stargazer-on-plinth
// Moves: U/D/L/R (up/down/left/right). Rolling one globe at a time is
// allowed; a move that would roll two globes in a row, or roll a globe
// into a rail, is illegal. Seated = every globe sits on a plinth.
//
// A level FAILS if:
//   - the solution string does not end with all globes on plinths, OR
//   - any move in the solution is illegal (stargazer walks into a rail,
//     or rolls a globe into a rail or another globe), OR
//   - the level is "pre-seated": ALL globes start on plinths (some
//     globes starting on plinths is legal; at least one must start
//     off-plinth), OR
//   - the replay ever revisits a previously-seen game state (anti-padding
//     rule: any solution that revisits a state can be shortened by
//     cutting the loop between the two visits, so this rule never
//     excludes a genuinely solvable level, but it mechanically rejects
//     wander-loop padding of move counts).

const fs = require('fs');

const DELTA = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

function parseGrid(gridLines) {
  const rows = gridLines.length;
  const cols = Math.max(...gridLines.map(r => r.length));
  const rails = new Set();
  const plinths = new Set();
  let globes = new Set();
  let stargazer = null;

  for (let r = 0; r < rows; r++) {
    const line = gridLines[r];
    for (let c = 0; c < cols; c++) {
      const ch = line[c] || ' ';
      const key = `${r},${c}`;
      switch (ch) {
        case '#':
          rails.add(key);
          break;
        case '.':
          break;
        case 'S':
          stargazer = [r, c];
          break;
        case 'O':
          globes.add(key);
          break;
        case 'K':
          plinths.add(key);
          break;
        case 'Q':
          globes.add(key);
          plinths.add(key);
          break;
        case '&':
          stargazer = [r, c];
          plinths.add(key);
          break;
        default:
          break; // treat unknown/space as void (outside playable area)
      }
    }
  }

  if (!stargazer) throw new Error('No stargazer start (S or &) found in grid');

  return { rows, cols, rails, plinths, globes, stargazer };
}

function stateKey(stargazer, globes) {
  const sortedGlobes = Array.from(globes).sort().join('|');
  return `${stargazer[0]},${stargazer[1]}:${sortedGlobes}`;
}

function inBounds(r, c, rows, cols) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function runLevel(level) {
  const { name, grid, solution } = level;
  const parsed = parseGrid(grid);
  const { rows, cols, rails, plinths } = parsed;
  let { stargazer, globes } = parsed;

  const globeCount = globes.size;
  const preplacedCount = Array.from(globes).filter(k => plinths.has(k)).length;

  const result = {
    name,
    pass: false,
    reason: null,
    moves: 0,
    rows,
    cols,
    globeCount,
    preplacedCount,
  };

  // Pre-seated trap: ALL globes already on plinths at the start is illegal.
  if (globeCount > 0 && preplacedCount === globeCount) {
    result.reason = 'pre-seated (all globes start on plinths)';
    return result;
  }

  const seenStates = new Set();
  seenStates.add(stateKey(stargazer, globes));

  for (let i = 0; i < solution.length; i++) {
    const move = solution[i];
    const delta = DELTA[move];
    if (!delta) {
      result.reason = `illegal move token '${move}' at index ${i}`;
      return result;
    }
    const [dr, dc] = delta;
    const [pr, pc] = stargazer;
    const nr = pr + dr, nc = pc + dc;
    const nextKey = `${nr},${nc}`;

    if (!inBounds(nr, nc, rows, cols) || rails.has(nextKey)) {
      result.reason = `move ${i} (${move}) walks into a rail`;
      return result;
    }

    if (globes.has(nextKey)) {
      // Attempt to roll the globe one further in the same direction.
      const cr = nr + dr, cc = nc + dc;
      const globeDestKey = `${cr},${cc}`;
      if (!inBounds(cr, cc, rows, cols) || rails.has(globeDestKey)) {
        result.reason = `move ${i} (${move}) rolls a globe into a rail`;
        return result;
      }
      if (globes.has(globeDestKey)) {
        result.reason = `move ${i} (${move}) rolls a globe into another globe`;
        return result;
      }
      // Perform roll: move globe, then stargazer.
      const newGlobes = new Set(globes);
      newGlobes.delete(nextKey);
      newGlobes.add(globeDestKey);
      globes = newGlobes;
    }

    stargazer = [nr, nc];

    const key = stateKey(stargazer, globes);
    if (seenStates.has(key)) {
      result.reason = `move ${i} (${move}) revisits a previously seen state (anti-padding rule)`;
      return result;
    }
    seenStates.add(key);
    result.moves = i + 1;
  }

  // Check seated condition: every globe sits on a plinth.
  const allOnPlinth = Array.from(globes).every(k => plinths.has(k));
  if (!allOnPlinth) {
    result.reason = 'solution did not end with all globes on plinths';
    return result;
  }

  result.pass = true;
  return result;
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node engine.js levels.json');
    process.exit(1);
  }
  const levels = JSON.parse(fs.readFileSync(file, 'utf8'));
  let allPass = true;
  levels.forEach((level, idx) => {
    const r = runLevel(level);
    const label = r.name || `Level ${idx + 1}`;
    if (r.pass) {
      console.log(`${label}: PASS (${r.moves} moves) [${r.rows}x${r.cols} grid, ${r.globeCount} globe${r.globeCount === 1 ? '' : 's'}, ${r.preplacedCount} pre-placed]`);
    } else {
      allPass = false;
      console.log(`${label}: FAIL (${r.reason}) [${r.rows}x${r.cols} grid, ${r.globeCount} globe${r.globeCount === 1 ? '' : 's'}, ${r.preplacedCount} pre-placed]`);
    }
  });
  process.exit(allPass ? 0 : 1);
}

main();
```

### Answer key — sample known-good pack (one per band, for calibration)

```json
[
  {
    "name": "Level 1",
    "grid": ["########", "#......#", "#.S....#", "#..O...#", "#.....K#", "#......#", "########"],
    "solution": "DRRRURD"
  },
  {
    "name": "Level 2",
    "grid": ["#########", "#.....K.#", "#.S.....#", "#..O....#", "#.......#", "#....O..#", "#.K.....#", "#.......#", "#########"],
    "solution": "RDDDRDLURRDRUUUU"
  },
  {
    "name": "Level 3",
    "grid": ["##########", "#........#", "#.S.O....#", "#....##..#", "#.O..#.K.#", "#..K.#...#", "#....O...#", "#.K....O.#", "#....K...#", "##########"],
    "solution": "RRRRURDDRDDDDLLULDULLUUULDLDRD"
  }
]
```

Running the engine against this sample pack prints:

```
Level 1: PASS (7 moves) [7x8 grid, 1 globe, 0 pre-placed]
Level 2: PASS (16 moves) [9x9 grid, 2 globes, 0 pre-placed]
Level 3: PASS (30 moves) [10x10 grid, 4 globes, 0 pre-placed]
```

This satisfies every band (L1 7<=12; L2 16 in [13,25]; L3 30>=26) and
every size/globe-count cap. Submissions do not need to match this pack
— any levels.json that the engine reports PASS for, with move counts
and stats in the required bands, passes obj-1 through obj-3.

The engine was also confirmed to correctly REJECT invalid submissions.
Two representative wrong answers, decided the same way (run the engine,
read stdout):

- Padding Level 1's solution with an immediate back-and-forth
  (`RLDRRRURD`) produces `FAIL (... revisits a previously seen state
  (anti-padding rule))` — this is the fate of any wander-loop padding
  used to inflate a move count into a band.
- Truncating Level 1's solution to `DRR` produces `FAIL (solution did
  not end with all globes on plinths)` — the seated condition is not
  met.

A submission that instead passes the engine but violates a band or a
count is caught by obj-2 / obj-3, not obj-1: e.g. a valid but circuitous
17-move Level 1 (`URRRRDDLULLDLDRRR`) prints `PASS (17 moves)` yet fails
obj-2 (L1 must be <= 12); a Level 2 built with only one globe prints
`... 1 globe ...` and fails obj-3 (L2 must have exactly 2 globes).

### Per-check guidance

- **obj-1/obj-2/obj-3**: run the engine exactly as given against the
  submission's `levels.json`; read the PASS/FAIL and the bracketed
  stats directly off its stdout. Do not hand-verify grids yourself —
  the whole point of this test is that the simulator decides
  correctness.
  - PASS examples: all three lines print `PASS` and the bracketed
    move counts / globe counts / grid sizes all sit inside the bands
    (obj-1 PASS, obj-2 PASS, obj-3 PASS); a pack whose Level 2 solves
    in exactly 13 or exactly 25 moves still passes obj-2 (band is
    inclusive); a level whose grid rows are shorter than the widest row
    (ragged but valid) still passes so long as the engine prints PASS.
  - FAIL examples: any line prints `FAIL (...)` (obj-1 fails); every
    line prints `PASS` but Level 3 shows `(24 moves)` (obj-2 fails, 24
    < 26); every line prints `PASS` but Level 1's bracket reads
    `9x8 grid` (obj-3 fails, 9 rows > 8); a level whose bracket reads
    `1 globe, 1 pre-placed` — the sole globe starts on its plinth so no
    globe starts off-plinth (obj-3 fails).

- **obj-4**: `JSON.parse(fs.readFileSync('levels.json'))` should
  succeed and yield an array of exactly three objects each with
  `name`, `grid` (array of strings), and `solution` (string).
  - PASS examples: a clean three-object array parses and each object
    has all three keys of the right types; extra harmless keys (e.g. a
    `notes` field) alongside the three required ones still parse and
    still expose `name`/`grid`/`solution`.
  - FAIL examples: the file has a trailing comma or a comment so
    `JSON.parse` throws; the array holds only two objects (not three);
    an object's `grid` is a single newline-joined string rather than an
    array of strings.

- **obj-5**: run `wc -w DESIGN.md` on the whole file.
  - PASS examples: `wc -w` reports 403; `wc -w` reports exactly 600
    (cap is inclusive).
  - FAIL examples: `wc -w` reports 601 (over cap); `wc -w` reports 742;
    the design write-up was placed in REASONING.md and DESIGN.md is
    missing or empty.

### Subjective guidance

- **Level design quality**: do the levels feel like real puzzles
  (meaningful globe-plinth assignment, at least one non-trivial
  approach angle) rather than a straight corridor with a globe dropped
  in it?
- **Difficulty curve and elegance**: is there a genuine escalation in
  obstacle complexity across the three levels, not just bigger numbers
  bolted onto the same idea? Penalize move-count inflation achieved via
  long trivial corridors or meandering (revisit-free but pointless)
  routes rather than genuine added complexity — a Level 3 that is just
  Level 2 with a long empty hallway tacked on should score low here
  even if it passes the objective checks.
- **Reasoning quality**: does REASONING.md credibly describe a
  verification process (hand-tracing or running the engine) rather
  than asserting solvability without evidence?
