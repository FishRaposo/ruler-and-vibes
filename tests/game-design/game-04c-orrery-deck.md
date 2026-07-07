---
id: game-04c-orrery-deck
category: game-design
title: Simulator-verified globe-seating level pack with a difficulty curve
deliverables:
  - levels.json
  - DESIGN.md
---

## Task

Design three original levels for **Orrery Deck**, a Sokoban-like
globe-rolling puzzle, with an escalating difficulty curve.

**Grid characters**: `#` rail, `.` deck, `S` stargazer start, `O` globe,
`K` plinth, `Q` globe already on a plinth, `&` stargazer start standing
on a plinth.

**Rules**: the stargazer moves one cell at a time (U/D/L/R = up/down/
left/right). Moving into a globe rolls it one cell further in the
same direction, provided the cell beyond the globe is empty deck or
an empty plinth (not a rail and not another globe) — otherwise the
move is illegal. The deck is seated when every globe sits on a plinth.

Your levels will be checked by running them through the reference
simulator below (plain Node, no dependencies) against a `levels.json`
file you provide together with a solution string for each level.

### Reference simulator (`engine.js`)

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

Save this exact script as `engine.js` in your working area to
self-verify (it is not one of your required deliverables, but you
should run it yourself before submitting). It prints, for each level,
either `PASS (<moves> moves) [<rows>x<cols> grid, <n> globe(s), <k>
pre-placed]` or `FAIL (<reason>) [...]`.

**Why the anti-padding (state-revisit) rule is sound**: if a solution
ever returns to a game state (same stargazer position and same set of
globe positions) it has already visited, the moves between the two
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

- **Level 1**: exactly 1 globe, grid at most 8x8, a solution of at
  most 12 moves.
- **Level 2**: exactly 2 globes, grid at most 10x10, a solution of
  13-25 moves.
- **Level 3**: at least 3 globes, grid at most 10x10, a solution of at
  least 26 moves.
- In every level, at least one globe must start off a plinth (a level
  where all globes start already on plinths is invalid).
- Every level's solution must actually seat it (ends with all globes
  on plinths), contain only legal moves, and never revisit a game
  state, when replayed by the reference simulator above.
- `DESIGN.md` must be at most 600 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you verified each level's solvability.
