---
id: game-04b-bogtrot-warren
category: game-design
title: Simulator-verified fen-drain plug puzzle with a difficulty curve
deliverables:
  - levels.json
  - DESIGN.md
---

## Task

Design three original levels for **Bogtrot Warren**, a Sokoban-like
plug-shoving puzzle, with an escalating difficulty curve.

**Grid characters**: `#` bank, `.` mudflat, `D` digger start, `O`
turf-plug, `~` drain-sink, `Q` plug already on a sink, `&` digger start
standing on a sink.

**Rules**: the digger moves one cell at a time (N/S/E/W = north/south/
east/west). Moving into a plug shoves it one cell further in the same
direction, provided the cell beyond the plug is empty mudflat or an
empty sink (not a bank and not another plug) — otherwise the move is
illegal. The warren is cleared when every plug sits on a sink.

Your levels will be checked by running them through the reference
simulator below (plain Node, no dependencies) against a `levels.json`
file you provide together with a solution string for each level.

### Reference simulator (`engine.js`)

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

Save this exact script as `engine.js` in your working area to
self-verify (it is not one of your required deliverables, but you
should run it yourself before submitting). It prints, for each level,
either `PASS (<moves> moves) [<rows>x<cols> grid, <n> plug(s), <k>
pre-placed]` or `FAIL (<reason>) [...]`.

**Why the anti-padding (state-revisit) rule is sound**: if a solution
ever returns to a game state (same digger position and same set of plug
positions) it has already visited, the moves between the two visits
accomplished nothing net and could be deleted entirely without changing
the outcome. So this rule can never reject a level that has a genuine
solution — it only ever rejects move sequences that waste moves. Your
solutions must therefore never revisit a state.

## Deliverables

- `levels.json` — a JSON array of exactly three objects, each
  `{ "name": string, "grid": string[], "solution": string }`, where
  `grid` is an array of equal-or-shorter row strings using the grid
  characters above, and `solution` is a string of N/S/E/W characters.
- `DESIGN.md` (at most 600 words) explaining the intended difficulty
  curve and the key obstacle idea behind each level.

## Constraints

- **Level 1**: exactly 1 plug, grid at most 8x8, a solution of at most
  12 moves.
- **Level 2**: exactly 2 plugs, grid at most 10x10, a solution of 13-25
  moves.
- **Level 3**: at least 3 plugs, grid at most 10x10, a solution of at
  least 26 moves.
- In every level, at least one plug must start off a sink (a level where
  all plugs start already on sinks is invalid).
- Every level's solution must actually clear it (ends with all plugs on
  sinks), contain only legal moves, and never revisit a game state, when
  replayed by the reference simulator above.
- `DESIGN.md` must be at most 600 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you verified each level's solvability.
