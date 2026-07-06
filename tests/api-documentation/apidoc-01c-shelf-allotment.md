---
id: apidoc-01c-shelf-allotment
category: api-documentation
title: Reference doc a shelf-allotment helper, edge cases and all
deliverables:
  - REFERENCE.md
  - examples.js
---

## Task

You are the documentation owner for a small internal warehouse
utility library. Below is the complete, verified source of
`allotShelf(crates, shelf, perShelf)`. Nobody has written reference
docs for it yet. Write accurate reference documentation from the
source itself — do not guess at behavior; read the code.

```js
function allotShelf(crates, shelf, perShelf = 12) {
  if (!Array.isArray(crates)) {
    throw new TypeError('crates must be an array');
  }
  if (!Number.isInteger(shelf) || shelf < 1) {
    throw new RangeError('shelf must be a positive integer');
  }
  if (!Number.isInteger(perShelf) || perShelf < 1) {
    throw new RangeError('perShelf must be a positive integer');
  }
  const totalCrates = crates.length;
  const totalShelves = Math.max(1, Math.ceil(totalCrates / perShelf));
  const start = (shelf - 1) * perShelf;
  const shelfCrates = crates.slice(start, start + perShelf);
  const hasMore = shelf < totalShelves;
  return {
    crates: shelfCrates,
    shelf,
    perShelf,
    totalCrates,
    totalShelves,
    hasMore,
  };
}

module.exports = { allotShelf };
```

## Deliverables

- `REFERENCE.md` — reference documentation covering:
  - The parameters: `crates`, `shelf`, `perShelf` (including its
    default value when omitted).
  - The return object, field by field: `crates`, `shelf`, `perShelf`,
    `totalCrates`, `totalShelves`, `hasMore`.
  - Every condition under which the function throws, naming the exact
    error TYPE for each.
  - Any behavior at the boundaries of valid input that a caller ought
    to know before relying on this function (document it directly from
    what the code does, not from a general assumption about how
    shelf allotment "usually" works).
- `examples.js` — paste the `allotShelf` source above verbatim, then
  append exactly these five `console.log(JSON.stringify(...))` calls,
  in this order, so the file is runnable standalone with
  `node examples.js`:
  1. `allotShelf(['a','b','c','d','e','f','g'], 1, 3)`
  2. `allotShelf(['a','b','c','d','e','f','g'], 3, 3)`
  3. `allotShelf(['a','b','c','d','e','f','g'], 8, 3)`
  4. `allotShelf([], 1)`
  5. `allotShelf(['a','b','c','d','e','f','g'], 1)`

## Constraints

- `examples.js` must run with plain `node examples.js` and print
  exactly five lines, one JSON object per line, in the order above —
  no extra output.
- Do not modify the given source when pasting it into `examples.js`.
