---
test: reverse-05c-carwash-bay
canary: "escarole sorrel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs `node fsm.js` and it prints a transition table with exactly 4 states and exactly 8 defined transitions: IDLE TOKEN->PRESOAK, IDLE SPRAY->SCRUB; PRESOAK SPRAY->SCRUB; SCRUB JET->SCRUB, SCRUB BRUSH->SCRUB, SCRUB DRAIN->RINSE; RINSE JET->RINSE, RINSE CLEAR->IDLE"
    - id: obj-2
      check: "ANSWER.md states the minimum number of events to reach RINSE from IDLE is exactly 2, and states that all four states are reachable from IDLE"
    - id: obj-3
      check: "ANSWER.md classifies the three candidate sequences exactly: [TOKEN,SPRAY,JET,DRAIN,CLEAR] = ACCEPTED (ends in IDLE); [TOKEN,SPRAY,DRAIN,SPRAY] = REJECTED at SPRAY (invalid in RINSE); [TOKEN,JET] = REJECTED at JET (invalid in PRESOAK)"
    - id: obj-4
      check: "Judge feeds the embedded 12-line trace's event tokens (in order) back through `node fsm.js` starting at IDLE and every ACCEPT/REJECT label and every named next-state reproduces exactly, with the session ending in state RINSE"
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
anchors:
  - id: State-table clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Simulator generality
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `reverse-05-signal-hut` (same construct, fresh surface).

If the phrase "escarole sorrel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Full ground-truth transition table (8 transitions, 4 states), node
  v24.16.0-verified by simulation:
  - `IDLE TOKEN -> PRESOAK`
  - `IDLE SPRAY -> SCRUB`
  - `PRESOAK SPRAY -> SCRUB`
  - `SCRUB JET -> SCRUB`
  - `SCRUB BRUSH -> SCRUB`
  - `SCRUB DRAIN -> RINSE`
  - `RINSE JET -> RINSE`
  - `RINSE CLEAR -> IDLE`
  Any (state, event) pair not in this list is a REJECT that leaves the
  state unchanged (e.g. `IDLE JET`, `IDLE BRUSH`, `IDLE DRAIN`, `IDLE
  CLEAR`, `PRESOAK TOKEN`, `PRESOAK JET`, `PRESOAK BRUSH`, `PRESOAK
  DRAIN`, `PRESOAK CLEAR`, `SCRUB TOKEN`, `SCRUB SPRAY`, `SCRUB CLEAR`,
  `RINSE TOKEN`, `RINSE SPRAY`, `RINSE BRUSH`, `RINSE DRAIN`).
- Replaying the embedded 12-line trace from `IDLE` against this table
  reproduces every line exactly (event, accept/reject, next state):
  `TOKEN` A(->PRESOAK), `JET` R(in PRESOAK), `SPRAY` A(->SCRUB), `JET`
  A(->SCRUB), `BRUSH` A(->SCRUB), `DRAIN` A(->RINSE), `SPRAY` R(in
  RINSE), `JET` A(->RINSE), `CLEAR` A(->IDLE), `SPRAY` A(->SCRUB),
  `CLEAR` R(in SCRUB), `DRAIN` A(->RINSE). Final state: `RINSE`.
  Author-verified with `node fsm.js` producing this exact replay (see
  the reference `fsm.js` logic below).
- BFS from `IDLE` over the table: `PRESOAK` at distance 1, `SCRUB` at
  distance 1, `RINSE` at distance 2. All four states reachable; the
  minimum event count to `RINSE` is **2** (e.g. `SPRAY, DRAIN`).
- Candidate sequences, replayed from `IDLE`:
  - Sequence A `[TOKEN, SPRAY, JET, DRAIN, CLEAR]`: `TOKEN`->PRESOAK,
    `SPRAY`->SCRUB, `JET`->SCRUB, `DRAIN`->RINSE, `CLEAR`->IDLE — fully
    **ACCEPTED**, ending in `IDLE`.
  - Sequence B `[TOKEN, SPRAY, DRAIN, SPRAY]`: `TOKEN`->PRESOAK,
    `SPRAY`->SCRUB, `DRAIN`->RINSE, then `SPRAY` is not a valid
    transition out of `RINSE` — **REJECTED at SPRAY**, machine was in
    `RINSE`.
  - Sequence C `[TOKEN, JET]`: `TOKEN`->PRESOAK, then `JET` is not a
    valid transition out of `PRESOAK` (only `SPRAY` is) — **REJECTED at
    JET**, machine was in `PRESOAK`.
- Seeded trap: a REJECT does not change state. A model that advances
  state on rejects (e.g. treating `PRESOAK JET REJECT` as if it moved
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
  `node -e "const {run}=require('./fsm.js'); console.log(run(['TOKEN','SPRAY','DRAIN','SPRAY'],'IDLE'))"`
  should show the log stopping (rejecting) at the `SPRAY` step while in
  `RINSE`.
- State-table clarity: does `fsm.js`'s printed table clearly and
  unambiguously list all 8 transitions with their source state, event,
  and destination state, in a form a reader could check row-by-row
  against the trace?
  - PASS phrasings: "prints a table with one row per transition, each
    row showing state, event, and next-state, e.g. `SCRUB + DRAIN ->
    RINSE`"; "groups transitions by source state and labels self-loops
    explicitly (e.g. `SCRUB + JET -> SCRUB (self)`)"; "the printed
    table can be checked line-by-line against the 12-line trace
    without cross-referencing other output."
  - FAIL phrasings: "dumps a raw nested object with no state/event/
    next-state labeling, leaving the reader to guess which key means
    what"; "prints only 'ACCEPT'/'REJECT' per trace line with no
    standalone table of the 8 transitions"; "table omits one or more
    transitions or silently merges two distinct transitions into one
    row."
- Simulator generality: does `fsm.js` implement a genuine lookup-keyed
  step function usable on arbitrary event sequences (verify by trying a
  sequence not in the test, e.g. `['CLEAR']` from `IDLE`, which should
  reject immediately since `IDLE` has no `CLEAR` transition), rather
  than a switch/if-chain hardcoded to only the three specific candidate
  sequences or the 12-line trace?
  - PASS phrasings: "a single object or Map keyed by state, each value
    keyed by event, consulted generically inside `step`"; "`run`
    iterates over an arbitrary array of events calling `step` in a
    loop, with no branch that special-cases the trace or the three
    candidate sequences"; "running
    `node -e \"const {run}=require('./fsm.js'); console.log(run(['CLEAR'],'IDLE'))\"`
    correctly rejects immediately and reports `finalState: 'IDLE'`
    (unchanged), showing the lookup isn't just replaying memorized
    answers."
  - FAIL phrasings: "a chain of `if (state === 'SCRUB' && event ===
    'DRAIN')` statements enumerating exactly the observed lines";
    "`run` only accepts the three literal candidate sequences (or the
    12-line trace) as special-cased arguments and errors or misbehaves
    on any other input"; "hardcodes the three answers to the numbered
    questions directly, bypassing the transition table entirely for
    those cases."
- Reasoning quality: does `ANSWER.md` show *how* the table was derived
  from the state-labeled lines (e.g., pointing out that each line
  directly names a transition or a rejection) rather than just
  asserting a table? Does it correctly explain why REJECT lines don't
  advance state, and connect that to why Sequence B/C fail where they
  do?
  - PASS phrasings: "walks through the 12 lines noting each ACCEPT
    line pins one transition and each REJECT line confirms an absent
    one"; "explicitly states that a REJECT leaves the state unchanged,
    then uses that to explain why Sequence C fails in `PRESOAK` rather
    than wherever `JET` last worked"; "notes that `SPRAY` fires from
    both `IDLE` and `PRESOAK` but not from `SCRUB` or `RINSE`, and uses
    that to justify the Sequence B rejection."
  - FAIL phrasings: "states the final transition table with no
    reference to which log lines justify which transitions"; "asserts
    the three sequence verdicts without tracing through the
    intermediate states"; "never addresses why a REJECT doesn't move
    the machine, leaving the Sequence B/C reasoning unsupported."
