---
id: cplx-02-linear-dedupe
category: algorithmic-complexity
title: Cut the Quadratic
deliverables:
  - fast.js
  - ANALYSIS.md
---

## Task

A fictional log-processing tool ("Brackenline") has a correct but slow
utility that finds the first element in an array whose value has
already appeared earlier in the array:

```js
// Existing implementation (Brackenline log-dedupe module) — correct, O(n^2)
function firstRepeat(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] === arr[i]) return arr[i];
    }
  }
  return null;
}
```

`firstRepeat` returns the value of the first element whose value
recurs earlier in the array, or `null` if every element is unique.
This double-loop version is correct but quadratic. Your job is to
reimplement it with the same externally observable behavior but
asymptotically faster — O(n) time.

Because wall-clock timing is not a reliable single-machine judge
signal, complexity is verified mechanically via an **operation
counter** you must wire in yourself, with this exact counting rule:

- Increment a module-level integer `probes` **once for every array
  read performed while scanning for a match** (i.e., every time a
  previously-seen or candidate element is examined/compared against
  the current element) **and once for every `Set` `has`/`add` call**
  if your solution uses a `Set`.
- The read of the "current" element `arr[i]` that starts a given
  iteration is not itself a probe — only the accesses spent searching
  count.

## Deliverables

- `fast.js` — must:
  - Export `firstRepeat(arr)` via `module.exports`, behaviorally
    identical to the reference above for every input.
  - Export `reset()` (zeroes `probes` to 0) and `getProbes()` (returns
    the current `probes` value) via the same `module.exports`.
  - Run in O(n) time using a hash-based technique (e.g. a `Set` of
    seen values), instrumented per the counting rule above.
  - When run with `node fast.js`, print the probe count after running
    `firstRepeat` once on the pinned 1000-element input
    `[0, 1, ..., 999]` (all-distinct), following a `reset()` call
    immediately before.
- `ANALYSIS.md` (max 250 words, whole file) — must name the O(n)
  technique used (e.g. hash set / seen-map) and state **both** the
  original time complexity (O(n^2)) and the new time complexity
  (O(n)) explicitly.

## Constraints

- Plain JavaScript, no dependencies, single file for `fast.js`.
- `module.exports` must expose `firstRepeat`, `reset`, and `getProbes`
  together, e.g. `module.exports = { firstRepeat, reset, getProbes }`.
- Behavior parity is graded on these vectors (evaluate all four):
  `firstRepeat([3,1,4,1,5])`, `firstRepeat([1,2,3,4])`,
  `firstRepeat([7,7])`, `firstRepeat([])`.
