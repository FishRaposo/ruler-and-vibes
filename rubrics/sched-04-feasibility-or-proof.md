---
test: sched-04-feasibility-or-proof
canary: "garnet zircon"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Scenario S is declared SAT and the provided start times place each event fully within its window with no overlap (a valid example: A=0, B=2, C=5; judge accepts any non-overlapping assignment satisfying the windows)"
    - id: obj-2
      check: "Scenario U is declared UNSAT"
    - id: obj-3
      check: "The UNSAT justification states that all three U-events must lie within [0,6] (width 6) while total duration is 3+3+2=8 > 6 on a single room (prose-located)"
    - id: obj-4
      check: "For Scenario S, the given assignment is checked to satisfy A in [0,3], B in [2,8], C in [5,9] with each start+duration <= its deadline and no pairwise overlap"
    - id: obj-5
      check: "feasibility.md distinguishes the two verdicts and does not claim both instances are feasible or both infeasible (prose-located)"
  subjective:
    - id: sub-quality
      name: "Correctness of both verdicts and validity of the SAT assignment"
      weight: 0.4
    - id: sub-craft
      name: "Rigor and clarity of the infeasibility (pigeonhole) argument"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "garnet zircon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

A brute-force search over all integer start times within each event's
`[release, deadline - duration]` range, checking every combination for
pairwise non-overlap, finds:

- **Scenario S:** 4 valid integer solutions — `A=0,B=2,C=5`;
  `A=0,B=2,C=6`; `A=0,B=3,C=6`; `A=1,B=3,C=6`. SAT.
- **Scenario U:** 0 valid solutions out of the full exhaustive integer
  search. UNSAT.

UNSAT is additionally provable continuously (not just over integers):
all three U-events are confined within the union window `[0,6]` (min
release 0, max deadline 6), a width of 6, while their durations sum to
`3+3+2=8`, which exceeds 6. Since no single room can host 8 hours of
non-overlapping work inside a 6-hour window, this is a pigeonhole
impossibility that holds even allowing real-valued (non-integer) start
times — the exhaustive integer search and the continuous pigeonhole
argument agree.

Critically, each U-event is individually feasible in isolation (A: dur
3 fits in a window of width 4; B: dur 3 fits in width 4; C: dur 2 fits
in width 4) — the infeasibility comes only from all three needing to
share one room within their overlapping windows, not from any single
event being impossible on its own.

If a submission's verdict for either scenario disagrees with the above,
it is wrong — do not average or split the difference, even if its
Scenario S witness looks plausible or its Scenario U reasoning sounds
confident.

### Trap

The trap is asymmetric: Scenario U looks placeable at first glance
because each event, checked alone, comfortably fits its own window.
A solver who greedily places A, then B, and only then discovers C has
nowhere to go may still miss the CLEAN reason (the pigeonhole
argument) even if they eventually notice infeasibility. A solver who
assumes both scenarios must behave the same way — either forcing a
(wrong) SAT witness onto U, or wrongly declaring S infeasible by
analogy — fails outright. The two scenarios are deliberately
constructed to require two different, independently-reached verdicts.

### Example phrasings — obj-3, UNSAT justified by the pigeonhole argument (not an incomplete backtrack)

PASSING:
- "All three events in U are boxed inside the window [0,6] — nobody's
  release is before 0 and nobody's deadline is after 6 — but their
  durations add up to 3+3+2=8 hours of room-time, which can't fit in a
  6-hour span no matter how you order them."
- "Even if you allow fractional start times, U is impossible: the
  union of all three windows only spans 6 hours, and the events
  together need 8 hours of exclusive room use, so some pair is
  guaranteed to overlap regardless of ordering."

FAILING:
- "I tried placing A first, then B, then C, and couldn't find a slot
  for C, so U must be infeasible."
- "U seems infeasible because the deadlines are tight, similar to how
  S also has a fairly packed schedule."

### Example phrasings — obj-5, correctly distinguishing the two verdicts

PASSING:
- "Scenario S and Scenario U are structurally similar but land on
  opposite verdicts: S has enough slack in its combined window to fit
  all three durations, while U's combined window is strictly smaller
  than its total required duration."
- "These are independent instances — S turns out to be satisfiable
  with room to spare, whereas U is impossible by a capacity argument,
  even though at a glance the two tables look like variations on the
  same setup."

FAILING:
- "Since both scenarios have three overlapping-looking events with
  similar durations, both are infeasible for the same capacity
  reason."
- "Both S and U can be scheduled by shifting events slightly later
  than their release times."

### Subjective guidance

- **Correctness of both verdicts and validity of the SAT assignment**
  (0.4): both verdicts must be right; the S witness must actually
  satisfy every window and have zero overlaps when checked by hand.
  Getting one verdict right and the other wrong should score well
  below half on this dimension.
- **Rigor and clarity of the infeasibility (pigeonhole) argument**
  (0.3): does the UNSAT case cite the actual union-window width and
  total-duration numbers (6 vs. 8), or does it rest on an incomplete
  "I tried a few orders" search?
- **Reasoning quality** (0.3): does the submission show it understood
  *why* the two scenarios differ — the capacity/pigeonhole mechanism —
  rather than pattern-matching a superficial resemblance between the
  two tables?
