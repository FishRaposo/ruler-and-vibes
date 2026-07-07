---
id: reverse-05c-carwash-bay
category: reverse-engineering
title: Recover the Car Wash Bay State Machine
deliverables:
  - fsm.js
  - ANSWER.md
---

## Task

A fictional automated car-wash bay runs a small deterministic finite-state
machine that controls its wash cycle. Nobody kept the original design doc,
but you have a session log captured from a real bay, starting in state
`IDLE`. Each line shows the state the machine was in when it received an
event, then either the transition it took or that it was rejected:

```
IDLE TOKEN -> PRESOAK ACCEPT
PRESOAK JET REJECT
PRESOAK SPRAY -> SCRUB ACCEPT
SCRUB JET -> SCRUB ACCEPT
SCRUB BRUSH -> SCRUB ACCEPT
SCRUB DRAIN -> RINSE ACCEPT
RINSE SPRAY REJECT
RINSE JET -> RINSE ACCEPT
RINSE CLEAR -> IDLE ACCEPT
IDLE SPRAY -> SCRUB ACCEPT
SCRUB CLEAR REJECT
SCRUB DRAIN -> RINSE ACCEPT
```

Each line has the form `<CURRENT_STATE> <EVENT> -> <NEXT_STATE> ACCEPT`
(the event is valid in that state, and the machine moves to the named
next state) or `<CURRENT_STATE> <EVENT> REJECT` (the event is invalid in
that state — no next state is shown, because a rejected event does not
change the machine's state at all; it stays exactly where it was).

The event tokens that appear anywhere in the log are exactly: `TOKEN`,
`SPRAY`, `JET`, `BRUSH`, `DRAIN`, `CLEAR`. No other event ever occurs.
Every line in the log names the state the machine was actually in at that
moment, so the log is not just a bare accept/reject sequence — the state
labels pin down a specific transition table. Work out that table from
the 12 lines above, then use it to answer questions about states and
sequences the log itself never shows.

Once you have the table, answer:

1. Starting from `IDLE`, what is the minimum number of events needed
   to reach `RINSE`?
2. Is every state reachable from `IDLE` (by some sequence of valid
   events)?
3. For each of the following candidate event sequences, replayed from
   `IDLE`, is it fully accepted or does it get rejected partway
   through? If rejected, name the first event that fails and the state
   the machine was in when it failed.
   - Sequence A: `[TOKEN, SPRAY, JET, DRAIN, CLEAR]`
   - Sequence B: `[TOKEN, SPRAY, DRAIN, SPRAY]`
   - Sequence C: `[TOKEN, JET]`

## Deliverables

- `fsm.js` — a generic event-driven simulator: a lookup table keyed on
  (current state, event) that gives the next state on a valid
  transition, and treats any other (state, event) pair as a rejection
  that leaves the state unchanged. Do not hardcode answers to the three
  questions above as special cases; the simulator must derive them by
  actually stepping through events. Running `node fsm.js` must:
  - print the reconstructed transition table (4 states, 8 transitions,
    in any clear listing format);
  - replay the embedded 12-line trace above, starting from `IDLE`,
    and print each line's state/event/outcome/next-state so it can be
    compared line-by-line against the trace above;
  - print the final state after the full 12-event replay.
- `ANSWER.md` — states the minimum event count to reach `RINSE` from
  `IDLE`; states whether all four states are reachable from `IDLE`;
  and classifies each of the three candidate sequences (accepted, or
  rejected with the failing event and state named).

## Constraints

- Plain JavaScript, no dependencies, single file for `fsm.js`.
- The file must export its simulator via `module.exports` (at minimum
  a `step` or `run` function operating on the transition table), so the
  judge can drive it programmatically as well as via `node fsm.js`.
