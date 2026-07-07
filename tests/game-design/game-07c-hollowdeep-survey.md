---
id: game-07c-hollowdeep-survey
category: game-design
title: Cave-survey quest graph with no soft-locks
deliverables:
  - quest.json
  - STORY.md
---

## Task

Design a branching quest for a fictional interactive story, **The
Survey of Hollowdeep**, as a machine-readable choice graph plus prose.

### Schema

```
{
  "start": <nodeId>,
  "ending": <nodeId>,
  "nodes": [
    { "id": <nodeId>, "grants"?: [<item>], "requires"?: [<item>], "choices": [<nodeId>, ...] }
  ]
}
```

- `grants` (optional): items the player picks up by reaching this
  node.
- `requires` (optional): items that must already be held to enter this
  node — a gate.
- `choices`: the node ids reachable directly from this node (0 or
  more; 0 means a dead end unless it IS the ending).

### Reference validator (`validate.js`) — save and run yourself first

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

Save this exact script as `validate.js` and run
`node validate.js quest.json` against your own design before
submitting. It prints `reachable N of M` then either `VALID` (exit 0)
or an `INVALID: ...` line describing the first problem found (exit 1).

**Design guidance for the trap this validator catches**: because the
validator uses optimistic (global) item accumulation, it will only
ever flag a gate as unreachable if that gate's required item is never
granted by ANY node upstream of it on any path — not merely "not
granted on one specific path." To be safe, make sure every gate's
granting node lies on a path that actually reaches the gate; do not
rely on the validator's optimism to paper over a design where the item
is genuinely never available before the gate.

## Deliverables

- `quest.json` matching the schema above, with **at least 8 nodes, at
  least 2 genuine branch points** (nodes with 2 or more entries in
  `choices`), **at least one item gate** (a node with a non-empty
  `requires`) whose required item is actually grantable on a path that
  reaches it, and **at least 2 distinct start-to-ending paths**.
- `STORY.md` (at most 550 words) narrating the quest in prose, and
  explicitly naming two distinct start-to-ending paths through your
  graph.

## Constraints

- `node validate.js quest.json` must print `VALID` and exit 0 against
  your submitted `quest.json`.
- `quest.json` must be valid JSON matching the schema, loadable with
  `node`.
- `STORY.md` must be at most 550 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you verified reachability (running the validator,
tracing paths by hand, or both).
