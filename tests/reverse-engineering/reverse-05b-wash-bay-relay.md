---
id: reverse-05b-wash-bay-relay
category: reverse-engineering
title: Recover the Wash-Bay Control Sequence
deliverables:
  - fsm.js
  - ANSWER.md
---

## Task

A fictional automated car-wash bay controller runs a small deterministic
finite-state machine. Nobody kept the design doc, but you have a session
log captured from a real bay controller's maintenance bus, starting in
state `QUEUED`. Each line shows the state the machine was in when it
received an event, then either the transition it took or that it was
rejected:

```
QUEUED PULSE -> ARMED ACCEPT
ARMED SPIN -> WASHING ACCEPT
WASHING SNAP REJECT
WASHING HOLD -> WASHING ACCEPT
WASHING TAG -> QUEUED ACCEPT
QUEUED PULSE -> ARMED ACCEPT
ARMED SNAP -> RINSING ACCEPT
RINSING PULSE REJECT
RINSING HOLD -> RINSING ACCEPT
RINSING DRIP -> QUEUED ACCEPT
QUEUED PULSE -> ARMED ACCEPT
ARMED DRIP -> QUEUED ACCEPT
```

Each line has the form `<CURRENT_STATE> <EVENT> -> <NEXT_STATE> ACCEPT`
(the event is valid in that state, and the machine moves to the named
next state) or `<CURRENT_STATE> <EVENT> REJECT` (the event is invalid in
that state — no next state is shown, because a rejected event does not
change the machine's state at all; it stays exactly where it was).

The event tokens that appear anywhere in the log are exactly: `PULSE`,
`SPIN`, `SNAP`, `DRIP`, `HOLD`, `TAG`. No other event ever occurs. Every
line in the log names the state the machine was actually in at that
moment, so the log is not just a bare accept/reject sequence — the state
labels pin down a specific transition table. Work out that table from
the 12 lines above, then use it to answer questions about states and
sequences the log itself never shows.

Once you have the table, answer:

1. Starting from `QUEUED`, what is the minimum number of events needed
   to reach `RINSING`?
2. Is every state reachable from `QUEUED` (by some sequence of valid
   events)?
3. For each of the following candidate event sequences, replayed from
   `QUEUED`, is it fully accepted or does it get rejected partway
   through? If rejected, name the first event that fails and the state
   the machine was in when it failed.
   - Sequence A: `[PULSE, SNAP, HOLD, DRIP, PULSE]`
   - Sequence B: `[PULSE, SNAP, SPIN]`
   - Sequence C: `[PULSE, HOLD]`

## Deliverables

- `fsm.js` — a generic event-driven simulator: a lookup table keyed on
  (current state, event) that gives the next state on a valid
  transition, and treats any other (state, event) pair as a rejection
  that leaves the state unchanged. Do not hardcode answers to the three
  questions above as special cases; the simulator must derive them by
  actually stepping through events. Running `node fsm.js` must:
  - print the reconstructed transition table (4 states, 8 transitions,
    in any clear listing format);
  - replay the embedded 12-line trace above, starting from `QUEUED`,
    and print each line's state/event/outcome/next-state so it can be
    compared line-by-line against the trace above;
  - print the final state after the full 12-event replay.
- `ANSWER.md` — states the minimum event count to reach `RINSING` from
  `QUEUED`; states whether all four states are reachable from `QUEUED`;
  and classifies each of the three candidate sequences (accepted, or
  rejected with the failing event and state named).

## Constraints

- Plain JavaScript, no dependencies, single file for `fsm.js`.
- The file must export its simulator via `module.exports` (at minimum
  a `step` or `run` function operating on the transition table), so the
  judge can drive it programmatically as well as via `node fsm.js`.
