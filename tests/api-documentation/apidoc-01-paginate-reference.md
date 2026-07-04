---
id: apidoc-01-paginate-reference
category: api-documentation
title: Reference doc a pagination helper, edge cases and all
deliverables:
  - REFERENCE.md
  - examples.js
---

## Task

You are the documentation owner for a small internal utility library.
Below is the complete, verified source of `paginate(items, page,
perPage)`. Nobody has written reference docs for it yet. Write
accurate reference documentation from the source itself — do not
guess at behavior; read the code.

```js
function paginate(items, page, perPage = 20) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('page must be a positive integer');
  }
  if (!Number.isInteger(perPage) || perPage < 1) {
    throw new RangeError('perPage must be a positive integer');
  }
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const start = (page - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);
  const hasNext = page < totalPages;
  return {
    items: pageItems,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNext,
  };
}

module.exports = { paginate };
```

## Deliverables

- `REFERENCE.md` — reference documentation covering:
  - The parameters: `items`, `page`, `perPage` (including its default
    value when omitted).
  - The return object, field by field: `items`, `page`, `perPage`,
    `totalItems`, `totalPages`, `hasNext`.
  - Every condition under which the function throws, naming the exact
    error TYPE for each.
  - Any behavior at the boundaries of valid input that a caller ought
    to know before relying on this function (document it directly from
    what the code does, not from a general assumption about how
    pagination "usually" works).
- `examples.js` — paste the `paginate` source above verbatim, then
  append exactly these five `console.log(JSON.stringify(...))` calls,
  in this order, so the file is runnable standalone with
  `node examples.js`:
  1. `paginate([1,2,3,4,5], 1, 2)`
  2. `paginate([1,2,3,4,5], 3, 2)`
  3. `paginate([1,2,3,4,5], 9, 2)`
  4. `paginate([], 1)`
  5. `paginate([1,2,3,4,5], 1)`

## Constraints

- `examples.js` must run with plain `node examples.js` and print
  exactly five lines, one JSON object per line, in the order above —
  no extra output.
- Do not modify the given source when pasting it into `examples.js`.
