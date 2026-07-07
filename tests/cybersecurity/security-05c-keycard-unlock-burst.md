---
id: security-05c-keycard-unlock-burst
category: cybersecurity
title: Unlock-burst detector for Ravensgate access control
deliverables:
  - detect.js
  - RULE.md
---

## Task

Ravensgate is a fictional secure facility whose door controllers write a
keycard access log. The log is a plain array of events, already loaded
for you below — each event is `{ ts, user, action }`, where `ts` is a
relative integer number of seconds (not a wall-clock date) and `action`
is one of `BADGE_IN`, `BADGE_OUT`, `UNLOCK`.

Security wants a **credential-abuse detector**: alert a cardholder if
and only if they perform **5 or more `UNLOCK` actions within any
45-second sliding window**. "Within any 45-second window" means there
exists some window of 45 seconds (not clock-aligned, not just one fixed
window — any contiguous 45-second span) that contains 5+ of that
cardholder's `UNLOCK` events.

Here is the labeled event log, complete and ready to use:

```js
const EVENTS = [
  // holloway
  { ts: 0,  user: 'holloway', action: 'BADGE_IN' },
  { ts: 3,  user: 'holloway', action: 'UNLOCK' },
  { ts: 9,  user: 'holloway', action: 'UNLOCK' },
  { ts: 14, user: 'holloway', action: 'BADGE_OUT' },
  { ts: 18, user: 'holloway', action: 'UNLOCK' },
  { ts: 25, user: 'holloway', action: 'UNLOCK' },
  { ts: 40, user: 'holloway', action: 'UNLOCK' },
  { ts: 52, user: 'holloway', action: 'BADGE_IN' },
  { ts: 60, user: 'holloway', action: 'UNLOCK' },

  // drayton
  { ts: 0,   user: 'drayton', action: 'UNLOCK' },
  { ts: 90,  user: 'drayton', action: 'UNLOCK' },
  { ts: 180, user: 'drayton', action: 'UNLOCK' },
  { ts: 270, user: 'drayton', action: 'UNLOCK' },
  { ts: 360, user: 'drayton', action: 'UNLOCK' },

  // cobbett
  { ts: 100, user: 'cobbett', action: 'UNLOCK' },
  { ts: 108, user: 'cobbett', action: 'BADGE_IN' },
  { ts: 116, user: 'cobbett', action: 'UNLOCK' },
  { ts: 124, user: 'cobbett', action: 'BADGE_OUT' },
  { ts: 130, user: 'cobbett', action: 'UNLOCK' },
  { ts: 136, user: 'cobbett', action: 'BADGE_IN' },
  { ts: 140, user: 'cobbett', action: 'UNLOCK' },

  // grindle
  { ts: 200, user: 'grindle', action: 'UNLOCK' },
  { ts: 210, user: 'grindle', action: 'UNLOCK' },
  { ts: 220, user: 'grindle', action: 'UNLOCK' },
  { ts: 230, user: 'grindle', action: 'UNLOCK' },
];

module.exports = { EVENTS };
```

This is defensive detection-engineering work only: you are writing
detection logic to flag suspicious behavior, not producing any exploit,
bypass, or attack code.

## Deliverables

- `detect.js` — a plain dependency-free Node module exporting a single
  pure function `detect(events)` that returns an array of usernames to
  alert on (order does not matter; the judge compares as a set). Embed
  the `EVENTS` array above (or `require` it from a sibling file you also
  include) so the module is self-contained and runnable with plain
  `node`.
- `RULE.md` — state the rule in plain English: the exact numeric
  threshold, the exact time-window bound, and which action type it
  counts. Explain why a naive rule that just counts total `UNLOCK`
  events (ignoring the time window) would incorrectly alert on at least
  one cardholder in this log, and why that cardholder's behavior is
  actually benign.

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- `detect` must be a pure function: no I/O, no reliance on wall-clock
  time, deterministic on the same input array.
- `detect` must count `UNLOCK` actions only — a cardholder with many
  `BADGE_IN`/`BADGE_OUT` events but fewer than 5 in-window `UNLOCK`s
  must not be alerted.
- Do not weaken or alter the embedded event data to make your rule look
  correct; the log above is fixed.
