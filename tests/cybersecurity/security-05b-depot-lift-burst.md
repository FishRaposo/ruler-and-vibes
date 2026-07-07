---
id: security-05b-depot-lift-burst
category: cybersecurity
title: Shrinkage-burst detector for Harrowgate Depot
deliverables:
  - detect.js
  - RULE.md
---

## Task

Harrowgate Depot is a fictional fulfillment warehouse. Each handheld
pick-scanner writes to a shared activity log — a plain array of events,
already loaded for you below. Each event is `{ ts, scanner, action }`,
where `ts` is a relative integer number of seconds (not a wall-clock
date) and `action` is one of `WAND` (a barcode wand read), `LIFT` (an
item taken off the shelf), or `TALLY` (an audit count).

Loss prevention wants a **bulk-shrinkage detector**: alert a scanner if
and only if it performs **5 or more `LIFT` actions within any 90-second
sliding window**. "Within any 90-second window" means there exists some
window of 90 seconds (not shift-aligned, not just one fixed window — any
contiguous 90-second span) that contains 5+ of that scanner's `LIFT`
events.

Here is the labeled activity log, complete and ready to use:

```js
const EVENTS = [
  // wexford
  { ts: 0,   scanner: 'wexford', action: 'WAND' },
  { ts: 3,   scanner: 'wexford', action: 'LIFT' },
  { ts: 14,  scanner: 'wexford', action: 'LIFT' },
  { ts: 22,  scanner: 'wexford', action: 'TALLY' },
  { ts: 31,  scanner: 'wexford', action: 'LIFT' },
  { ts: 60,  scanner: 'wexford', action: 'LIFT' },
  { ts: 70,  scanner: 'wexford', action: 'WAND' },
  { ts: 88,  scanner: 'wexford', action: 'LIFT' },

  // tolliver
  { ts: 0,   scanner: 'tolliver', action: 'LIFT' },
  { ts: 200, scanner: 'tolliver', action: 'LIFT' },
  { ts: 400, scanner: 'tolliver', action: 'LIFT' },
  { ts: 600, scanner: 'tolliver', action: 'LIFT' },
  { ts: 800, scanner: 'tolliver', action: 'LIFT' },

  // osgood
  { ts: 100, scanner: 'osgood', action: 'LIFT' },
  { ts: 108, scanner: 'osgood', action: 'WAND' },
  { ts: 116, scanner: 'osgood', action: 'LIFT' },
  { ts: 124, scanner: 'osgood', action: 'TALLY' },
  { ts: 132, scanner: 'osgood', action: 'WAND' },
  { ts: 140, scanner: 'osgood', action: 'LIFT' },
  { ts: 150, scanner: 'osgood', action: 'TALLY' },

  // brackley
  { ts: 300, scanner: 'brackley', action: 'LIFT' },
  { ts: 315, scanner: 'brackley', action: 'LIFT' },
  { ts: 330, scanner: 'brackley', action: 'LIFT' },
  { ts: 345, scanner: 'brackley', action: 'LIFT' },
];

module.exports = { EVENTS };
```

This is defensive detection-engineering work only: you are writing
detection logic to flag suspicious behavior, not producing any exploit,
bypass, or attack code.

## Deliverables

- `detect.js` — a plain dependency-free Node module exporting a single
  pure function `detect(events)` that returns an array of scanner names
  to alert on (order does not matter; the judge compares as a set).
  Embed the `EVENTS` array above (or `require` it from a sibling file
  you also include) so the module is self-contained and runnable with
  plain `node`.
- `RULE.md` — state the rule in plain English: the exact numeric
  threshold, the exact time-window bound, and which action type it
  counts. Explain why a naive rule that just counts total `LIFT` events
  (ignoring the time window) would incorrectly alert on at least one
  scanner in this log, and why that scanner's behavior is actually
  benign.

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- `detect` must be a pure function: no I/O, no reliance on wall-clock
  time, deterministic on the same input array.
- `detect` must count `LIFT` actions only — a scanner with many
  `WAND`/`TALLY` events but fewer than 5 in-window `LIFT`s must not be
  alerted.
- Do not weaken or alter the embedded event data to make your rule look
  correct; the log above is fixed.
