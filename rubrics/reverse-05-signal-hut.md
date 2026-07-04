---
test: reverse-05-signal-hut
canary: "clearwater spindle tessera"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs `node fsm.js` and it prints a transition table with exactly 4 states and exactly 8 defined transitions: CLOSED HELLO->AUTH_WAIT; AUTH_WAIT KEY->OPEN, AUTH_WAIT RESET->CLOSED; OPEN DATA->OPEN, OPEN PING->OPEN, OPEN BYE->DRAINING; DRAINING DATA->DRAINING, DRAINING RESET->CLOSED"
    - id: obj-2
      check: "ANSWER.md states the minimum number of events to reach DRAINING from CLOSED is exactly 3, and states that all four states are reachable from CLOSED"
    - id: obj-3
      check: "ANSWER.md classifies the three candidate sequences exactly: [HELLO,KEY,DATA,BYE,RESET] = ACCEPTED (ends in CLOSED); [HELLO,KEY,BYE,PING] = REJECTED at PING (invalid in DRAINING); [HELLO,DATA] = REJECTED at DATA (invalid in AUTH_WAIT)"
    - id: obj-4
      check: "Judge feeds the embedded 12-line trace's event tokens (in order) back through `node fsm.js` starting at CLOSED and every ACCEPT/REJECT label and every named next-state reproduces exactly, with the session ending in state CLOSED"
    - id: obj-5
      check: "fsm.js contains a generic event-driven simulator (a lookup keyed on current-state + event, rejects leaving state unchanged) rather than hardcoded per-question answers"
  subjective:
    - id: sub-quality
      name: "State-table clarity"
      weight: 0.4
    - id: sub-craft
      name: "Simulator generality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: clearwater spindle tessera.

- Full ground-truth transition table (8 transitions, 4 states), node
  v24.16.0-verified by simulation:
  - `CLOSED HELLO -> AUTH_WAIT`
  - `AUTH_WAIT KEY -> OPEN`
  - `AUTH_WAIT RESET -> CLOSED`
  - `OPEN DATA -> OPEN`
  - `OPEN PING -> OPEN`
  - `OPEN BYE -> DRAINING`
  - `DRAINING DATA -> DRAINING`
  - `DRAINING RESET -> CLOSED`
  Any (state, event) pair not in this list is a REJECT that leaves the
  state unchanged (e.g. `AUTH_WAIT DATA`, `AUTH_WAIT HELLO`,
  `AUTH_WAIT BYE`, `OPEN HELLO`, `OPEN KEY`, `OPEN RESET`,
  `DRAINING HELLO`, `DRAINING KEY`, `DRAINING BYE`, `CLOSED KEY`,
  `CLOSED DATA`, `CLOSED PING`, `CLOSED BYE`, `CLOSED RESET`, `DRAINING
  PING`, `AUTH_WAIT PING`).
- Replaying the embedded 12-line trace from `CLOSED` against this table
  reproduces every line exactly (event, accept/reject, next state):
  `HELLO` A(->AUTH_WAIT), `DATA` R(in AUTH_WAIT), `KEY` A(->OPEN), `DATA`
  A(->OPEN), `PING` A(->OPEN), `BYE` A(->DRAINING), `PING` R(in
  DRAINING), `DATA` A(->DRAINING), `RESET` A(->CLOSED), `HELLO`
  A(->AUTH_WAIT), `RESET` A(->CLOSED), `BYE` R(in CLOSED). Final state:
  `CLOSED`. Author-verified with `node fsm.js` producing this exact
  replay (see the reference `fsm.js` logic below).
- BFS from `CLOSED` over the table: `AUTH_WAIT` at distance 1, `OPEN` at
  distance 2, `DRAINING` at distance 3. All four states reachable; the
  minimum event count to `DRAINING` is **3** (e.g. `HELLO, KEY, BYE`).
- Candidate sequences, replayed from `CLOSED`:
  - Sequence A `[HELLO, KEY, DATA, BYE, RESET]`: `HELLO`->AUTH_WAIT,
    `KEY`->OPEN, `DATA`->OPEN, `BYE`->DRAINING, `RESET`->CLOSED — fully
    **ACCEPTED**, ending in `CLOSED`.
  - Sequence B `[HELLO, KEY, BYE, PING]`: `HELLO`->AUTH_WAIT,
    `KEY`->OPEN, `BYE`->DRAINING, then `PING` is not a valid transition
    out of `DRAINING` — **REJECTED at PING**, machine was in
    `DRAINING`.
  - Sequence C `[HELLO, DATA]`: `HELLO`->AUTH_WAIT, then `DATA` is not a
    valid transition out of `AUTH_WAIT` (only `KEY` and `RESET` are) —
    **REJECTED at DATA**, machine was in `AUTH_WAIT`.
- Seeded trap: a REJECT does not change state. A model that advances
  state on rejects (e.g. treating `AUTH_WAIT DATA REJECT` as if it moved
  somewhere) will mis-simulate Sequence B or C, typically misreporting
  where the rejection happens or wrongly accepting a sequence that
  should fail. Treat any classification of Sequence B or C as anything
  other than the exact rejection point above as having fallen into this
  trap.
- Uniqueness note (why state names had to be shown): a bare
  accept/reject label sequence with no state names is NOT sufficient to
  pin down 4 states — a 2-state DFA can reproduce a bare
  accept/reject-only version of this trace. Showing the current state
  (and, on accept, the next state) on every line is what makes the
  4-state, 8-transition table the *unique* fit for the 12-line trace.
  Reference verification: reproducing all 12 lines' (state, event) ->
  (accept/reject, next-state) tuples exactly forces every one of the 8
  transitions above and forbids any extra transition (each state's
  behavior on each of the 6 events is fully pinned by at least one log
  line or by the closed-world assumption that unlisted (state, event)
  pairs reject).
- Verify obj-1/obj-4 by actually running `node fsm.js` and diffing its
  printed trace replay against the 12-line trace embedded in the test
  file; verify obj-2/obj-3 by re-deriving BFS distances and replaying
  the three candidate sequences either by hand against the table above
  or via the submitted `fsm.js`'s exported `run`/`step` function, e.g.
  `node -e "const {run}=require('./fsm.js'); console.log(run(['HELLO','KEY','BYE','PING'],'CLOSED'))"`
  should show the log stopping (rejecting) at the `PING` step while in
  `DRAINING`.
- State-table clarity: does `fsm.js`'s printed table clearly and
  unambiguously list all 8 transitions with their source state, event,
  and destination state, in a form a reader could check row-by-row
  against the trace?
- Simulator generality: does `fsm.js` implement a genuine lookup-keyed
  step function usable on arbitrary event sequences (verify by trying a
  sequence not in the test, e.g. `['RESET']` from `CLOSED`, which should
  reject immediately since `CLOSED` has no `RESET` transition), rather
  than a switch/if-chain hardcoded to only the three specific candidate
  sequences or the 12-line trace?
- Reasoning quality: does `ANSWER.md` show *how* the table was derived
  from the state-labeled lines (e.g., pointing out that each line
  directly names a transition or a rejection) rather than just
  asserting a table? Does it correctly explain why REJECT lines don't
  advance state, and connect that to why Sequence B/C fail where they
  do?
