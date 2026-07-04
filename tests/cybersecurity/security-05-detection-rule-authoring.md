---
id: security-05-detection-rule-authoring
category: cybersecurity
title: Export-burst detector for Meadowlark Archive
deliverables:
  - detect.js
  - RULE.md
---

## Task

Meadowlark Archive is a fictional document archive. Its access log is a
plain array of events, already loaded for you below — each event is
`{ ts, user, action }`, where `ts` is a relative integer number of
seconds (not a wall-clock date) and `action` is one of `VIEW`,
`EXPORT`, `SHARE`.

Security wants a **bulk-exfiltration detector**: alert a user if and
only if they perform **6 or more `EXPORT` actions within any 60-second
sliding window**. "Within any 60-second window" means there exists
some window of 60 seconds (not calendar-aligned, not just one fixed
window — any contiguous 60-second span) that contains 6+ of that
user's `EXPORT` events.

Here is the labeled event log, complete and ready to use:

```js
const EVENTS = [
  // mallory
  { ts: 0,  user: 'mallory', action: 'VIEW' },
  { ts: 2,  user: 'mallory', action: 'EXPORT' },
  { ts: 12, user: 'mallory', action: 'EXPORT' },
  { ts: 20, user: 'mallory', action: 'SHARE' },
  { ts: 24, user: 'mallory', action: 'EXPORT' },
  { ts: 30, user: 'mallory', action: 'EXPORT' },
  { ts: 38, user: 'mallory', action: 'EXPORT' },
  { ts: 45, user: 'mallory', action: 'VIEW' },
  { ts: 50, user: 'mallory', action: 'EXPORT' },

  // peggy
  { ts: 0,   user: 'peggy', action: 'EXPORT' },
  { ts: 120, user: 'peggy', action: 'EXPORT' },
  { ts: 240, user: 'peggy', action: 'EXPORT' },
  { ts: 360, user: 'peggy', action: 'EXPORT' },
  { ts: 480, user: 'peggy', action: 'EXPORT' },
  { ts: 600, user: 'peggy', action: 'EXPORT' },

  // trent
  { ts: 100, user: 'trent', action: 'EXPORT' },
  { ts: 110, user: 'trent', action: 'VIEW' },
  { ts: 120, user: 'trent', action: 'EXPORT' },
  { ts: 130, user: 'trent', action: 'SHARE' },
  { ts: 140, user: 'trent', action: 'EXPORT' },
  { ts: 145, user: 'trent', action: 'VIEW' },
  { ts: 150, user: 'trent', action: 'EXPORT' },

  // oscar
  { ts: 200, user: 'oscar', action: 'EXPORT' },
  { ts: 210, user: 'oscar', action: 'EXPORT' },
  { ts: 220, user: 'oscar', action: 'EXPORT' },
  { ts: 230, user: 'oscar', action: 'EXPORT' },
  { ts: 240, user: 'oscar', action: 'EXPORT' },
];

module.exports = { EVENTS };
```

This is defensive detection-engineering work only: you are writing
detection logic to flag suspicious behavior, not producing any
exploit, bypass, or attack code.

## Deliverables

- `detect.js` — a plain dependency-free Node module exporting a single
  pure function `detect(events)` that returns an array of usernames to
  alert on (order does not matter; the judge compares as a set). Embed
  the `EVENTS` array above (or `require` it from a sibling file you
  also include) so the module is self-contained and runnable with
  plain `node`.
- `RULE.md` — state the rule in plain English: the exact numeric
  threshold, the exact time-window bound, and which action type it
  counts. Explain why a naive rule that just counts total `EXPORT`
  events (ignoring the time window) would incorrectly alert on at
  least one user in this log, and why that user's behavior is actually
  benign.

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- `detect` must be a pure function: no I/O, no reliance on wall-clock
  time, deterministic on the same input array.
- `detect` must count `EXPORT` actions only — a user with many
  `VIEW`/`SHARE` events but fewer than 6 in-window `EXPORT`s must not
  be alerted.
- Do not weaken or alter the embedded event data to make your rule
  look correct; the log above is fixed.
