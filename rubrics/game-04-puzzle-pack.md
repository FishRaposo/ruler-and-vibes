---
test: game-04-puzzle-pack
canary: "gingham matador"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Running the reference simulator (embedded verbatim below, identical to the test file) with 'node engine.js levels.json' prints PASS for all three levels (PASS requires: win reached, no illegal move, not pre-solved, no game state revisited during the replay)"
    - id: obj-2
      check: "Move counts printed by the simulator satisfy the bands: Level 1 <= 12, Level 2 in [13, 25], Level 3 >= 26"
    - id: obj-3
      check: "The simulator's printed level stats confirm: L1 exactly 1 crate and grid <= 8x8; L2 exactly 2 crates and grid <= 10x10; L3 >= 3 crates and grid <= 10x10; and each level has at least one crate starting off-target"
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

If the phrase "gingham matador" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Run the submission's `levels.json` through the engine below exactly as
written (do not modify it) and decide obj-1 through obj-3 from its
printed output, not by eyeballing the grids yourself.

### Reference simulator (`engine.js`) — run with `node engine.js levels.json`

```js
#!/usr/bin/env node
// Crate Courier reference simulator.
// Usage: node engine.js levels.json
//
// Grid chars: # wall, . floor, P player, C crate, X target,
//             * crate-on-target, @ player-on-target
// Moves: U/D/L/R (up/down/left/right). Pushing one crate at a time is
// allowed; a move that would push two crates in a row, or push a crate
// into a wall, is illegal. Win = every crate sits on a target.
//
// A level FAILS if:
//   - the solution string does not end with all crates on targets, OR
//   - any move in the solution is illegal (player walks into a wall,
//     or pushes a crate into a wall or another crate), OR
//   - the level is "pre-solved": ALL crates start on targets (some
//     crates starting on targets is legal; at least one must start
//     off-target), OR
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
  const walls = new Set();
  const targets = new Set();
  let crates = new Set();
  let player = null;

  for (let r = 0; r < rows; r++) {
    const line = gridLines[r];
    for (let c = 0; c < cols; c++) {
      const ch = line[c] || ' ';
      const key = `${r},${c}`;
      switch (ch) {
        case '#':
          walls.add(key);
          break;
        case '.':
          break;
        case 'P':
          player = [r, c];
          break;
        case 'C':
          crates.add(key);
          break;
        case 'X':
          targets.add(key);
          break;
        case '*':
          crates.add(key);
          targets.add(key);
          break;
        case '@':
          player = [r, c];
          targets.add(key);
          break;
        default:
          break; // treat unknown/space as void (outside playable area)
      }
    }
  }

  if (!player) throw new Error('No player start (P or @) found in grid');

  return { rows, cols, walls, targets, crates, player };
}

function stateKey(player, crates) {
  const sortedCrates = Array.from(crates).sort().join('|');
  return `${player[0]},${player[1]}:${sortedCrates}`;
}

function inBounds(r, c, rows, cols) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function runLevel(level) {
  const { name, grid, solution } = level;
  const parsed = parseGrid(grid);
  const { rows, cols, walls, targets } = parsed;
  let { player, crates } = parsed;

  const crateCount = crates.size;
  const preplacedCount = Array.from(crates).filter(k => targets.has(k)).length;

  const result = {
    name,
    pass: false,
    reason: null,
    moves: 0,
    rows,
    cols,
    crateCount,
    preplacedCount,
  };

  // Pre-solved trap: ALL crates already on targets at the start is illegal.
  if (crateCount > 0 && preplacedCount === crateCount) {
    result.reason = 'pre-solved (all crates start on targets)';
    return result;
  }

  const seenStates = new Set();
  seenStates.add(stateKey(player, crates));

  for (let i = 0; i < solution.length; i++) {
    const move = solution[i];
    const delta = DELTA[move];
    if (!delta) {
      result.reason = `illegal move token '${move}' at index ${i}`;
      return result;
    }
    const [dr, dc] = delta;
    const [pr, pc] = player;
    const nr = pr + dr, nc = pc + dc;
    const nextKey = `${nr},${nc}`;

    if (!inBounds(nr, nc, rows, cols) || walls.has(nextKey)) {
      result.reason = `move ${i} (${move}) walks into a wall`;
      return result;
    }

    if (crates.has(nextKey)) {
      // Attempt to push the crate one further in the same direction.
      const cr = nr + dr, cc = nc + dc;
      const crateDestKey = `${cr},${cc}`;
      if (!inBounds(cr, cc, rows, cols) || walls.has(crateDestKey)) {
        result.reason = `move ${i} (${move}) pushes a crate into a wall`;
        return result;
      }
      if (crates.has(crateDestKey)) {
        result.reason = `move ${i} (${move}) pushes a crate into another crate`;
        return result;
      }
      // Perform push: move crate, then player.
      const newCrates = new Set(crates);
      newCrates.delete(nextKey);
      newCrates.add(crateDestKey);
      crates = newCrates;
    }

    player = [nr, nc];

    const key = stateKey(player, crates);
    if (seenStates.has(key)) {
      result.reason = `move ${i} (${move}) revisits a previously seen state (anti-padding rule)`;
      return result;
    }
    seenStates.add(key);
    result.moves = i + 1;
  }

  // Check win condition: every crate sits on a target.
  const allOnTarget = Array.from(crates).every(k => targets.has(k));
  if (!allOnTarget) {
    result.reason = 'solution did not end with all crates on targets';
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
      console.log(`${label}: PASS (${r.moves} moves) [${r.rows}x${r.cols} grid, ${r.crateCount} crate${r.crateCount === 1 ? '' : 's'}, ${r.preplacedCount} pre-placed]`);
    } else {
      allPass = false;
      console.log(`${label}: FAIL (${r.reason}) [${r.rows}x${r.cols} grid, ${r.crateCount} crate${r.crateCount === 1 ? '' : 's'}, ${r.preplacedCount} pre-placed]`);
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
    "grid": ["######", "#P...#", "#.C..#", "#..X.#", "######"],
    "solution": "RDLDR"
  },
  {
    "name": "Level 2",
    "grid": ["########", "#P.....#", "#.C....#", "#......#", "#....C.#", "#..X..X#", "#......#", "########"],
    "solution": "RDDDLDRDRRRRUUULDLDR"
  },
  {
    "name": "Level 3",
    "grid": ["##########", "#P.......#", "#.C......#", "#........#", "#....C...#", "#..X..X..#", "#........#", "#......C.#", "#.....X..#", "##########"],
    "solution": "RDDDLDRDRRRRUUULDLDRDRRDRDL"
  }
]
```

Running the engine against this sample pack prints:

```
Level 1: PASS (5 moves) [5x6 grid, 1 crate, 0 pre-placed]
Level 2: PASS (20 moves) [8x8 grid, 2 crates, 0 pre-placed]
Level 3: PASS (27 moves) [10x10 grid, 3 crates, 0 pre-placed]
```

This satisfies every band (L1 5<=12; L2 20 in [13,25]; L3 27>=26) and
every size/crate-count cap. Submissions do not need to match this pack
— any levels.json that the engine reports PASS for, with move counts
and stats in the required bands, passes obj-1 through obj-3.

The engine was also confirmed to correctly REJECT invalid submissions:
padding Level 1's solution with an immediate back-and-forth
(`RLRDLDR`) produces `FAIL (... revisits a previously seen state
(anti-padding rule))`, and truncating Level 2's solution to `RDDD`
produces `FAIL (solution did not end with all crates on targets)`.

### Per-check guidance

- **obj-1/obj-2/obj-3**: run the engine exactly as given against the
  submission's `levels.json`; read the PASS/FAIL and the bracketed
  stats directly off its stdout. Do not hand-verify grids yourself —
  the whole point of this test is that the simulator decides
  correctness.
- **obj-4**: `JSON.parse(fs.readFileSync('levels.json'))` should
  succeed and yield an array of exactly three objects each with
  `name`, `grid` (array of strings), and `solution` (string).
- **obj-5**: run `wc -w DESIGN.md` on the whole file.

### Subjective guidance

- **Level design quality**: do the levels feel like real puzzles
  (meaningful crate-target assignment, at least one non-trivial
  approach angle) rather than a straight corridor with a crate dropped
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
