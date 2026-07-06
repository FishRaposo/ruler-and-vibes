---
id: apidoc-01b-shelve-books-reference
category: api-documentation
title: Reference doc a shelving helper, edge cases and all
deliverables:
  - REFERENCE.md
  - examples.js
---

## Task

You are the documentation owner for a small internal utility library
used by a bookshop's stockroom tooling. Below is the complete, verified
source of `shelveBooks(books, shelfIndex, perShelf)`. Nobody has written
reference docs for it yet. Write accurate reference documentation from
the source itself — do not guess at behavior; read the code.

```js
function shelveBooks(books, shelfIndex, perShelf = 12) {
  if (!Array.isArray(books)) {
    throw new TypeError('books must be an array');
  }
  if (!Number.isInteger(shelfIndex) || shelfIndex < 1) {
    throw new RangeError('shelfIndex must be a positive integer');
  }
  if (!Number.isInteger(perShelf) || perShelf < 1) {
    throw new RangeError('perShelf must be a positive integer');
  }
  const totalBooks = books.length;
  const totalShelves = Math.max(1, Math.ceil(totalBooks / perShelf));
  const start = (shelfIndex - 1) * perShelf;
  const shelfBooks = books.slice(start, start + perShelf);
  const hasMore = shelfIndex < totalShelves;
  return {
    books: shelfBooks,
    shelfIndex,
    perShelf,
    totalBooks,
    totalShelves,
    hasMore,
  };
}

module.exports = { shelveBooks };
```

## Deliverables

- `REFERENCE.md` — reference documentation covering:
  - The parameters: `books`, `shelfIndex`, `perShelf` (including its
    default value when omitted).
  - The return object, field by field: `books`, `shelfIndex`,
    `perShelf`, `totalBooks`, `totalShelves`, `hasMore`.
  - Every condition under which the function throws, naming the exact
    error TYPE for each.
  - Any behavior at the boundaries of valid input that a caller ought
    to know before relying on this function (document it directly from
    what the code does, not from a general assumption about how
    shelving or windowing "usually" works).
- `examples.js` — paste the `shelveBooks` source above verbatim, then
  append exactly these five `console.log(JSON.stringify(...))` calls,
  in this order, so the file is runnable standalone with
  `node examples.js`:
  1. `shelveBooks([10,20,30,40,50,60,70], 1, 3)`
  2. `shelveBooks([10,20,30,40,50,60,70], 3, 3)`
  3. `shelveBooks([10,20,30,40,50,60,70], 8, 3)`
  4. `shelveBooks([], 1)`
  5. `shelveBooks([10,20,30,40,50,60,70], 1)`

## Constraints

- `examples.js` must run with plain `node examples.js` and print
  exactly five lines, one JSON object per line, in the order above —
  no extra output.
- Do not modify the given source when pasting it into `examples.js`.
