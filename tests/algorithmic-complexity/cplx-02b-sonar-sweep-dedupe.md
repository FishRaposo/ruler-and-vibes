---
id: cplx-02b-sonar-sweep-dedupe
category: algorithmic-complexity
title: Flatten the Quadratic Sweep
deliverables:
  - fast.js
  - ANALYSIS.md
---

## Task

A fictional seabed-mapping tool ("Trawlwake") has a correct but slow
utility that scans a sonar sweep and finds the first ping whose
depth reading has already appeared earlier in the sweep:

```js
// Existing implementation (Trawlwake sonar-dedupe module) — correct, O(n^2)
function firstEcho(sweep) {
  for (let i = 0; i < sweep.length; i++) {
    for (let j = 0; j < i; j++) {
      if (sweep[j] === sweep[i]) return sweep[i];
    }
  }
  return null;
}
```

`firstEcho` returns the depth value of the first ping whose reading
recurs earlier in the sweep, or `null` if every reading is unique.
This double-loop version is correct but quadratic. Your job is to
reimplement it with the same externally observable behavior but
asymptotically faster — O(n) time.

Because wall-clock timing is not a reliable single-machine judge
signal, complexity is verified mechanically via an **operation
counter** you must wire in yourself, with this exact counting rule:

- Increment a module-level integer `probes` **once for every sweep
  read performed while searching for a match** (i.e., every time a
  previously-seen or candidate reading is examined/compared against
  the current reading) **and once for every `Set` `has`/`add` call**
  if your solution uses a `Set`.
- The read of the "current" reading `sweep[i]` that starts a given
  iteration is not itself a probe — only the accesses spent searching
  count.

## Deliverables

- `fast.js` — must:
  - Export `firstEcho(sweep)` via `module.exports`, behaviorally
    identical to the reference above for every input.
  - Export `reset()` (zeroes `probes` to 0) and `getProbes()` (returns
    the current `probes` value) via the same `module.exports`.
  - Run in O(n) time using a hash-based technique (e.g. a `Set` of
    seen readings), instrumented per the counting rule above.
  - When run with `node fast.js`, print the probe count after running
    `firstEcho` once on the pinned 1200-element input
    `[0, 1, ..., 1199]` (all-distinct), following a `reset()` call
    immediately before.
- `ANALYSIS.md` (max 250 words, whole file) — must name the O(n)
  technique used (e.g. hash set / seen-map) and state **both** the
  original time complexity (O(n^2)) and the new time complexity
  (O(n)) explicitly.

## Constraints

- Plain JavaScript, no dependencies, single file for `fast.js`.
- `module.exports` must expose `firstEcho`, `reset`, and `getProbes`
  together, e.g. `module.exports = { firstEcho, reset, getProbes }`.
- Behavior parity is graded on these vectors (evaluate all four):
  `firstEcho([8,2,5,2,9,5])`, `firstEcho([4,6,1,9])`,
  `firstEcho([3,3])`, `firstEcho([])`.
