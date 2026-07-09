---
test: game-07b-derelict-outpost-relay
canary: "brambling bishopbird"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Running the embedded reference validator with 'node validate.js quest.json' prints VALID and exits 0 (no unreachable nodes, no dangling choice ids, ending reachable, and NO soft-locked reachable node) — judge runs the validator exactly as embedded, does not hand-verify"
    - id: obj-2
      check: "quest.json parses as valid JSON matching the schema (object with start, ending, and nodes array of {id, choices} with optional grants/requires arrays) when loaded with node, and has at least 8 nodes"
    - id: obj-3
      check: "The validator prints a 'reachable N of M' line where N equals M (every declared node reachable from start) AND at least 2 nodes have 2+ entries in their choices array (genuine branch points)"
    - id: obj-4
      check: "quest.json contains at least one node with a non-empty requires array whose required item appears in some node's grants array that lies on a forward path into the gate (the validator's VALID verdict already guarantees the gate is reachable; judge confirms such a requires-gate exists)"
    - id: obj-5
      check: "STORY.md is at most 550 words (whole file, wc -w) and names the two distinct start-to-ending paths"
  subjective:
    - id: sub-quality
      name: "Narrative branching quality"
      weight: 0.4
    - id: sub-craft
      name: "Elegance of the gating and pacing"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Narrative branching quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Elegance of the gating and pacing
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `game-07-branching-quest` (same construct, fresh
surface).

If the phrase "brambling bishopbird" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Run the submission's `quest.json` through the validator below exactly
as written (do not modify it) and decide obj-1/obj-3 from its printed
stdout, not by eyeballing the graph yourself.

### Reference validator (`validate.js`) — run with `node validate.js quest.json`

```js
#!/usr/bin/env node
// Reference validator for branching quest graphs.
// Usage: node validate.js quest.json
//
// Algorithm: OPTIMISTIC forward reachability -- a node is "reachable" if
// there is some sequence of choices from start that reaches it, ASSUMING
// the player has picked up every grantable item available on any reachable
// node so far (global item accumulation, not per-path). This is optimistic
// because it does not check that a SPECIFIC single playthrough grants the
// item before the gate -- it only checks that the item is grantable
// somewhere upstream in the union of all reachable nodes.
//
// A graph is INVALID if:
//   - any declared node is unreachable from start (under optimistic item
//     accumulation), OR
//   - any choice points to a nonexistent node id, OR
//   - the ending is unreachable, OR
//   - any reachable node cannot reach the ending (a SOFT-LOCK).

const fs = require('fs');

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node validate.js quest.json');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { start, ending, nodes } = data;
  const byId = new Map(nodes.map(n => [n.id, n]));

  if (!byId.has(start)) {
    console.log(`INVALID: start node '${start}' does not exist`);
    process.exit(1);
  }
  if (!byId.has(ending)) {
    console.log(`INVALID: ending node '${ending}' does not exist`);
    process.exit(1);
  }

  let dangling = [];
  for (const n of nodes) {
    for (const ch of (n.choices || [])) {
      if (!byId.has(ch)) dangling.push(`${n.id} -> ${ch}`);
    }
  }
  if (dangling.length) {
    console.log(`INVALID: dangling choice id(s): ${dangling.join(', ')}`);
    process.exit(1);
  }

  let reachable = new Set([start]);
  let accumulatedItems = new Set(byId.get(start).grants || []);
  let changed = true;
  while (changed) {
    changed = false;
    for (const nodeId of Array.from(reachable)) {
      const node = byId.get(nodeId);
      for (const choice of (node.choices || [])) {
        const target = byId.get(choice);
        const requires = target.requires || [];
        const meetsReq = requires.every(item => accumulatedItems.has(item));
        if (meetsReq) {
          if (!reachable.has(choice)) {
            reachable.add(choice);
            changed = true;
          }
          for (const g of (target.grants || [])) {
            if (!accumulatedItems.has(g)) {
              accumulatedItems.add(g);
              changed = true;
            }
          }
        }
      }
    }
  }

  const total = nodes.length;
  const reachedCount = reachable.size;
  console.log(`reachable ${reachedCount} of ${total}`);

  const unreachableNodes = nodes.filter(n => !reachable.has(n.id)).map(n => n.id);
  if (unreachableNodes.length) {
    console.log(`INVALID: unreachable node(s): ${unreachableNodes.join(', ')}`);
    process.exit(1);
  }

  if (!reachable.has(ending)) {
    console.log(`INVALID: ending '${ending}' is unreachable`);
    process.exit(1);
  }

  const canReachEnding = new Set([ending]);
  changed = true;
  while (changed) {
    changed = false;
    for (const n of nodes) {
      if (canReachEnding.has(n.id)) continue;
      for (const ch of (n.choices || [])) {
        if (canReachEnding.has(ch)) {
          canReachEnding.add(n.id);
          changed = true;
          break;
        }
      }
    }
  }

  const softLocked = nodes.filter(n => reachable.has(n.id) && !canReachEnding.has(n.id)).map(n => n.id);
  if (softLocked.length) {
    console.log(`INVALID: soft-locked reachable node(s) (cannot reach ending): ${softLocked.join(', ')}`);
    process.exit(1);
  }

  console.log('VALID');
  process.exit(0);
}

main();
```

### Calibration: a known-good 8-node graph and two confirmed rejections

A verified compliant design (author-run):

```json
{
  "start": "landing_bay",
  "ending": "relay_online",
  "nodes": [
    { "id": "landing_bay", "choices": ["supply_wing", "reactor_annex"] },
    { "id": "supply_wing", "grants": ["power_cell", "access_chip"], "choices": ["corridor_junction", "cryo_lab"] },
    { "id": "reactor_annex", "grants": ["power_cell", "access_chip"], "choices": ["corridor_junction"] },
    { "id": "cryo_lab", "choices": ["corridor_junction"] },
    { "id": "corridor_junction", "requires": ["access_chip"], "choices": ["sealed_vault", "observation_ring"] },
    { "id": "observation_ring", "choices": ["sealed_vault"] },
    { "id": "sealed_vault", "requires": ["power_cell"], "choices": ["relay_online"] },
    { "id": "relay_online", "choices": [] }
  ]
}
```

Running the validator against this prints `reachable 8 of 8` then
`VALID`, exit 0. It has 3 branch points (`landing_bay`, `supply_wing`,
`corridor_junction`), 6 structural start-to-ending paths, and both
gates (`corridor_junction` needs `access_chip`, `sealed_vault` needs
`power_cell`) are satisfied on every path.

Two confirmed REJECTIONS (author-run):
- **Dead-end branch**: changing `cryo_lab`'s `choices` to `[]`
  (a branch that never reconnects to the main path) makes the
  validator print `reachable 8 of 8` then
  `INVALID: soft-locked reachable node(s) (cannot reach ending):
  cryo_lab` — the node is reachable but can never reach the ending.
- **Never-granted gate**: removing `power_cell` from both `grants`
  arrays (so nothing ever grants it) while `sealed_vault` still
  requires it makes the validator print `reachable 6 of 8` then
  `INVALID: unreachable node(s): sealed_vault, relay_online`
  — the gate and everything downstream of it become unreachable.

Submissions do not need to match this sample graph — any `quest.json`
that the validator reports `VALID` for, with >=8 nodes and >=2 branch
points, passes obj-1 through obj-3.

### Per-check guidance

- **obj-1/obj-3**: decide purely from the validator's stdout — the
  `reachable N of M` line and the final `VALID`/`INVALID` line. Do not
  hand-trace the graph; that is the point of embedding the validator.
- **obj-2**: `JSON.parse(fs.readFileSync('quest.json'))` should
  succeed; confirm `nodes.length >= 8` and the schema shape.
- **obj-4**: find at least one node with a non-empty `requires`; then
  confirm the required item name appears in some node's `grants`. The
  validator's `VALID` verdict already proves that gate is reachable
  under the optimistic semantics — this check just confirms a genuine
  gate exists in the design (not merely 8 ungated nodes in a line).
- **obj-5**: run `wc -w STORY.md`; confirm two distinct start-to-ending
  node sequences are named in prose (they need not be node ids
  verbatim — named locations/events corresponding to two different
  routes is sufficient). PASS phrasings: "Path one runs landing bay →
  supply wing → corridor junction → sealed vault → relay; path two runs
  landing bay → reactor annex → observation ring → the vault to the
  relay"; "One playthrough goes through the supply wing and cryo lab,
  another drops via the reactor annex and the observation ring, and both
  finish at the relay"; "The cautious route detours through the cryo
  lab while the direct route swings past the observation ring — two
  ways to the same relit relay." FAIL phrasings: "The drone explores the
  station and eventually brings the relay online" (no routes named at
  all); "There are many possible paths through Marrowvale" (asserts
  branching but names zero concrete routes); "Path one goes supply wing
  → corridor junction → relay" (only ONE path named, second missing);
  STORY.md is 612 words (over the 550-word cap, fails on length
  regardless of paths).

### Subjective guidance

- **Narrative branching quality**: do the branches feel like real
  narrative choices (different tone, different risk, different
  content) rather than cosmetic reskins of the same path?
- **Elegance of the gating and pacing**: is the item-gate placement
  motivated by the story (a chip or cell that makes sense to need)
  rather than an arbitrary requires-tag bolted onto a schema for its
  own sake? Does the branch-and-rejoin structure feel deliberate rather
  than padded with filler nodes purely to hit the 8-node minimum?
- **Reasoning quality**: does REASONING.md describe actually running
  the validator (or a careful manual reachability trace) rather than
  asserting the graph is sound without evidence?
