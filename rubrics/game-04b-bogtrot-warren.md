---
test: game-04b-bogtrot-warren
canary: "waxcap wagtail"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Running the reference simulator (embedded verbatim below, identical to the test file) with 'node engine.js levels.json' prints PASS for all three levels (PASS requires: cleared reached, no illegal move, not pre-cleared, no game state revisited during the replay)"
    - id: obj-2
      check: "Move counts printed by the simulator satisfy the bands: Level 1 <= 12, Level 2 in [13, 25], Level 3 >= 26"
    - id: obj-3
      check: "The simulator's printed level stats confirm: L1 exactly 1 plug and grid <= 8x8; L2 exactly 2 plugs and grid <= 10x10; L3 >= 3 plugs and grid <= 10x10; and each level has at least one plug starting off-sink"
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
---

## Judge guidance

Parallel form of `game-04-puzzle-pack` (same construct, fresh surface).

If the phrase "waxcap wagtail" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Run the submission's `levels.json` through the engine below exactly as
written (do not modify it) and decide obj-1 through obj-3 from its
printed output, not by eyeballing the grids yourself.

### Reference simulator (`engine.js`) — run with `node engine.js levels.json`

```js
#!/usr/bin/env node
// Bogtrot Warren reference simulator.
// Usage: node engine.js levels.json
//
// Grid chars: # bank, . mudflat, D digger, O turf-plug, ~ drain-sink,
//             Q plug-on-sink, & digger-on-sink
// Moves: N/S/E/W (north/south/east/west). Shoving one plug at a time is
// allowed; a move that would shove two plugs in a row, or shove a plug
// into a bank, is illegal. Cleared = every plug sits on a sink.
//
// A level FAILS if:
//   - the solution string does not end with all plugs on sinks, OR
//   - any move in the solution is illegal (digger walks into a bank,
//     or shoves a plug into a bank or another plug), OR
//   - the level is "pre-cleared": ALL plugs start on sinks (some plugs
//     starting on sinks is legal; at least one must start off-sink), OR
//   - the replay ever revisits a previously-seen game state (anti-padding
//     rule: any solution that revisits a state can be shortened by
//     cutting the loop between the two visits, so this rule never
//     excludes a genuinely solvable level, but it mechanically rejects
//     wander-loop padding of move counts).

const fs = require('fs');

const DELTA = {
  N: [-1, 0],
  S: [1, 0],
  W: [0, -1],
  E: [0, 1],
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
        case 'D':
          player = [r, c];
          break;
        case 'O':
          crates.add(key);
          break;
        case '~':
          targets.add(key);
          break;
        case 'Q':
          crates.add(key);
          targets.add(key);
          break;
        case '&':
          player = [r, c];
          targets.add(key);
          break;
        default:
          break; // treat unknown/space as void (outside playable area)
      }
    }
  }

  if (!player) throw new Error('No digger start (D or &) found in grid');

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

  // Pre-cleared trap: ALL plugs already on sinks at the start is illegal.
  if (crateCount > 0 && preplacedCount === crateCount) {
    result.reason = 'pre-cleared (all plugs start on sinks)';
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
      result.reason = `move ${i} (${move}) walks into a bank`;
      return result;
    }

    if (crates.has(nextKey)) {
      // Attempt to shove the plug one further in the same direction.
      const cr = nr + dr, cc = nc + dc;
      const crateDestKey = `${cr},${cc}`;
      if (!inBounds(cr, cc, rows, cols) || walls.has(crateDestKey)) {
        result.reason = `move ${i} (${move}) shoves a plug into a bank`;
        return result;
      }
      if (crates.has(crateDestKey)) {
        result.reason = `move ${i} (${move}) shoves a plug into another plug`;
        return result;
      }
      // Perform shove: move plug, then digger.
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

  // Check cleared condition: every plug sits on a sink.
  const allOnTarget = Array.from(crates).every(k => targets.has(k));
  if (!allOnTarget) {
    result.reason = 'solution did not end with all plugs on sinks';
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
      console.log(`${label}: PASS (${r.moves} moves) [${r.rows}x${r.cols} grid, ${r.crateCount} plug${r.crateCount === 1 ? '' : 's'}, ${r.preplacedCount} pre-placed]`);
    } else {
      allPass = false;
      console.log(`${label}: FAIL (${r.reason}) [${r.rows}x${r.cols} grid, ${r.crateCount} plug${r.crateCount === 1 ? '' : 's'}, ${r.preplacedCount} pre-placed]`);
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
    "grid": ["#######", "#D....#", "#.O...#", "#..#..#", "#...~.#", "#######"],
    "solution": "ESSWSEE"
  },
  {
    "name": "Level 2",
    "grid": ["#########", "#D......#", "#.O.....#", "#....#..#", "#..~....#", "#.....O.#", "#...~...#", "#########"],
    "solution": "SENESSESEESESWW"
  },
  {
    "name": "Level 3",
    "grid": ["##########", "#D.......#", "#.OO.O...#", "#........#", "#..#.##..#", "#........#", "#..~.~.~.#", "#........#", "##########"],
    "solution": "ESSNENESSNEENESSSSNNWWWSSWSENNNWWSSWSE"
  }
]
```

Running the engine against this sample pack prints:

```
Level 1: PASS (7 moves) [6x7 grid, 1 plug, 0 pre-placed]
Level 2: PASS (15 moves) [8x9 grid, 2 plugs, 0 pre-placed]
Level 3: PASS (38 moves) [9x10 grid, 3 plugs, 0 pre-placed]
```

This satisfies every band (L1 7<=12; L2 15 in [13,25]; L3 38>=26) and
every size/plug-count cap. Submissions do not need to match this pack —
any levels.json that the engine reports PASS for, with move counts and
stats in the required bands, passes obj-1 through obj-3.

The engine was also confirmed to correctly REJECT invalid submissions:
padding Level 1's solution with an immediate back-and-forth (`EW` before
the real route, i.e. `EWESSWSEE`) produces `FAIL (... revisits a
previously seen state (anti-padding rule))`, and truncating Level 2's
solution to `SENE` produces `FAIL (solution did not end with all plugs
on sinks)`. A grid whose only plug starts on its sink (a `Q` with no
off-sink plug) produces `FAIL (pre-cleared (all plugs start on sinks))`,
and shoving a plug into a bank produces `FAIL (... shoves a plug into a
bank)`.

### Per-check guidance

- **obj-1/obj-2/obj-3**: run the engine exactly as given against the
  submission's `levels.json`; read the PASS/FAIL and the bracketed stats
  directly off its stdout. Do not hand-verify grids yourself — the whole
  point of this test is that the simulator decides correctness.
  - PASS example: stdout shows `Level 1: PASS (7 moves) [6x7 grid, 1
    plug, 0 pre-placed]`, `Level 2: PASS (15 moves) [8x9 grid, 2 plugs,
    0 pre-placed]`, `Level 3: PASS (38 moves) [9x10 grid, 3 plugs, 0
    pre-placed]` — all three PASS, every band met, every cap met.
  - PASS example: a different valid pack where L1 prints `PASS (10
    moves) [8x8 grid, 1 plug, 0 pre-placed]`, L2 `PASS (22 moves)
    [10x10 grid, 2 plugs, 1 pre-placed]`, L3 `PASS (30 moves) [10x10
    grid, 4 plugs, 0 pre-placed]` — bands and caps satisfied, extra
    plug and a legal pre-placed plug are both fine.
  - FAIL example (obj-1): any level prints `FAIL (...)` — e.g. `FAIL
    (move 6 (S) shoves a plug into a bank)` or `FAIL (... revisits a
    previously seen state ...)`.
  - FAIL example (obj-2): the engine PASSes all three but a move count
    is out of band, e.g. `Level 2: PASS (11 moves)` (below 13) or
    `Level 3: PASS (24 moves)` (below 26).
  - FAIL example (obj-3): stats out of spec, e.g. `Level 1: PASS (...)
    [9x8 grid, ...]` (9 rows exceeds 8x8), or `Level 3: PASS (...) [...,
    2 plugs, ...]` (fewer than 3 plugs), or a level whose printed
    pre-placed count equals its plug count (no plug off-sink — this
    actually surfaces as a `FAIL (pre-cleared ...)` from the engine).
- **obj-4**: `JSON.parse(fs.readFileSync('levels.json'))` should succeed
  and yield an array of exactly three objects each with `name`, `grid`
  (array of strings), and `solution` (string).
  - PASS example: the file loads and is an array of three well-formed
    level objects.
  - PASS example: loads cleanly even with extra whitespace or a
    trailing newline; schema shape is what matters.
  - FAIL example: the file has a trailing comma or unquoted key and
    `JSON.parse` throws.
  - FAIL example: it parses but contains two levels, or a level missing
    `solution`, or `grid` given as one big string instead of an array
    of row strings.
- **obj-5**: run `wc -w DESIGN.md` on the whole file.
  - PASS example: `wc -w` reports 512 (<= 600).
  - PASS example: `wc -w` reports exactly 600.
  - FAIL example: `wc -w` reports 640 (> 600).
  - FAIL example: `wc -w` reports 720 because the design notes ran long.

### Subjective guidance

- **Level design quality**: do the levels feel like real puzzles
  (meaningful plug-sink assignment, at least one non-trivial approach
  angle) rather than a straight corridor with a plug dropped in it?
- **Difficulty curve and elegance**: is there a genuine escalation in
  obstacle complexity across the three levels, not just bigger numbers
  bolted onto the same idea? Penalize move-count inflation achieved via
  long trivial corridors or meandering (revisit-free but pointless)
  routes rather than genuine added complexity — a Level 3 that is just
  Level 2 with a long empty channel tacked on should score low here even
  if it passes the objective checks.
- **Reasoning quality**: does REASONING.md credibly describe a
  verification process (hand-tracing or running the engine) rather than
  asserting solvability without evidence?
