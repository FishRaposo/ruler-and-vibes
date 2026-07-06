---
id: cplx-02c-belt-serial-scan
category: algorithmic-complexity
title: Halve the Belt Scan
deliverables:
  - fast.js
  - ANALYSIS.md
---

## Task

A fictional factory quality-control tool ("Harrowbeck Instruments
belt-audit") has a correct but slow utility that finds the first unit
on the conveyor whose serial has **already passed the scanner earlier**
in the same belt run:

```js
// Existing implementation (Harrowbeck belt-audit module) — correct, O(n^2)
function firstDuplicateSerial(serials) {
  for (let i = 0; i < serials.length; i++) {
    for (let j = 0; j < i; j++) {
      if (serials[j] === serials[i]) return serials[i];
    }
  }
  return null;
}
```

`firstDuplicateSerial` returns the serial value of the first unit whose
serial recurs earlier in the belt stream, or `null` if every serial is
unique. This double-loop version is correct but quadratic. Your job is
to reimplement it with the same externally observable behavior but
asymptotically faster — O(n) time.

Because wall-clock timing is not a reliable single-machine judge
signal, complexity is verified mechanically via an **operation
counter** you must wire in yourself, with this exact counting rule:

- Increment a module-level integer `probes` **once for every serial
  read performed while scanning for a match** (i.e., every time a
  previously-seen or candidate serial is examined/compared against the
  current serial) **and once for every `Set` `has`/`add` call** if your
  solution uses a `Set`.
- The read of the "current" serial `serials[i]` that starts a given
  iteration is not itself a probe — only the accesses spent searching
  count.

## Deliverables

- `fast.js` — must:
  - Export `firstDuplicateSerial(serials)` via `module.exports`,
    behaviorally identical to the reference above for every input.
  - Export `reset()` (zeroes `probes` to 0) and `getProbes()` (returns
    the current `probes` value) via the same `module.exports`.
  - Run in O(n) time using a hash-based technique (e.g. a `Set` of seen
    serials), instrumented per the counting rule above.
  - When run with `node fast.js`, print the probe count after running
    `firstDuplicateSerial` once on the pinned 1200-element input
    `[100, 101, ..., 1299]` (all-distinct), following a `reset()` call
    immediately before.
- `ANALYSIS.md` (max 250 words, whole file) — must name the O(n)
  technique used (e.g. hash set / seen-set) and state **both** the
  original time complexity (O(n^2)) and the new time complexity (O(n))
  explicitly.

## Constraints

- Plain JavaScript, no dependencies, single file for `fast.js`.
- `module.exports` must expose `firstDuplicateSerial`, `reset`, and
  `getProbes` together, e.g.
  `module.exports = { firstDuplicateSerial, reset, getProbes }`.
- Behavior parity is graded on these vectors (evaluate all four):
  `firstDuplicateSerial([8,2,5,2,9])`,
  `firstDuplicateSerial([4,6,1,3])`, `firstDuplicateSerial([5,5])`,
  `firstDuplicateSerial([])`.
