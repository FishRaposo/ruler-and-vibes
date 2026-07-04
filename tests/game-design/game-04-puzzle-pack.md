---
id: game-04-puzzle-pack
category: game-design
title: Simulator-verified puzzle level pack with a difficulty curve
deliverables:
  - levels.json
  - DESIGN.md
---

## Task

Design three original levels for **Crate Courier**, a Sokoban-like
crate-pushing puzzle, with an escalating difficulty curve.

**Grid characters**: `#` wall, `.` floor, `P` player start, `C` crate,
`X` target, `*` crate already on a target, `@` player start standing on
a target.

**Rules**: the player moves one cell at a time (U/D/L/R = up/down/
left/right). Moving into a crate pushes it one cell further in the
same direction, provided the cell beyond the crate is empty floor or
an empty target (not a wall and not another crate) — otherwise the
move is illegal. The puzzle is won when every crate sits on a target.

Your levels will be checked by running them through the reference
simulator below (plain Node, no dependencies) against a `levels.json`
file you provide together with a solution string for each level.

### Reference simulator (`engine.js`)

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

Save this exact script as `engine.js` in your working area to
self-verify (it is not one of your required deliverables, but you
should run it yourself before submitting). It prints, for each level,
either `PASS (<moves> moves) [<rows>x<cols> grid, <n> crate(s), <k>
pre-placed]` or `FAIL (<reason>) [...]`.

**Why the anti-padding (state-revisit) rule is sound**: if a solution
ever returns to a game state (same player position and same set of
crate positions) it has already visited, the moves between the two
visits accomplished nothing net and could be deleted entirely without
changing the outcome. So this rule can never reject a level that has a
genuine solution — it only ever rejects move sequences that waste
moves. Your solutions must therefore never revisit a state.

## Deliverables

- `levels.json` — a JSON array of exactly three objects, each
  `{ "name": string, "grid": string[], "solution": string }`, where
  `grid` is an array of equal-or-shorter row strings using the grid
  characters above, and `solution` is a string of U/D/L/R characters.
- `DESIGN.md` (at most 600 words) explaining the intended difficulty
  curve and the key obstacle idea behind each level.

## Constraints

- **Level 1**: exactly 1 crate, grid at most 8x8, a solution of at
  most 12 moves.
- **Level 2**: exactly 2 crates, grid at most 10x10, a solution of
  13-25 moves.
- **Level 3**: at least 3 crates, grid at most 10x10, a solution of at
  least 26 moves.
- In every level, at least one crate must start off a target (a level
  where all crates start already on targets is invalid).
- Every level's solution must actually solve it (ends with all crates
  on targets), contain only legal moves, and never revisit a game
  state, when replayed by the reference simulator above.
- `DESIGN.md` must be at most 600 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you verified each level's solvability.
