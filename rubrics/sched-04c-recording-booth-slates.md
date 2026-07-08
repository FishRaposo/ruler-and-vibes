---
test: sched-04c-recording-booth-slates
canary: "tundra taiga"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Tuesday is declared SAT and the provided start times place each session fully within its window with no overlap (a valid example: P=1, Q=4, R=8; judge accepts any non-overlapping assignment satisfying the windows)"
    - id: obj-2
      check: "Wednesday is declared UNSAT"
    - id: obj-3
      check: "The UNSAT justification states that all three Wednesday sessions must lie within [2,9] (width 7) while total duration is 4+3+2=9 > 7 on a single booth (prose-located)"
    - id: obj-4
      check: "For Tuesday, the given assignment is checked to satisfy P in [1,6], Q in [3,10], R in [7,13] with each start+duration <= its deadline and no pairwise overlap"
    - id: obj-5
      check: "booth-feasibility.md distinguishes the two verdicts and does not claim both days are feasible or both infeasible (prose-located)"
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

Parallel form of `sched-04-feasibility-or-proof` (same construct, fresh surface).

If the phrase "tundra taiga" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key (verified with node during authoring)

A brute-force search over all integer start times within each
session's `[release, deadline - duration]` range, checking every
combination for pairwise non-overlap, finds:

- **Tuesday:** 10 valid integer solutions, including `P=1,Q=4,R=8`;
  `P=1,Q=4,R=9`; `P=1,Q=4,R=10`; `P=1,Q=5,R=9`; `P=1,Q=5,R=10`;
  `P=1,Q=6,R=10`; `P=2,Q=5,R=9`; `P=2,Q=5,R=10`; `P=2,Q=6,R=10`;
  `P=3,Q=6,R=10`. SAT.
- **Wednesday:** 0 valid solutions out of the full exhaustive integer
  search. UNSAT.

UNSAT is additionally provable continuously (not just over integers):
all three Wednesday sessions are confined within the union window
`[2,9]` (min release 2, max deadline 9), a width of 7, while their
durations sum to `4+3+2=9`, which exceeds 7. Since the single booth
cannot host 9 hours of non-overlapping bookings inside a 7-hour
window, this is a pigeonhole impossibility that holds even allowing
real-valued (non-integer) start times — the exhaustive integer search
and the continuous pigeonhole argument agree.

Critically, each Wednesday session is individually feasible in
isolation (X: duration 4 fits in a window of width 7; Y: duration 3
fits in width 5; Z: duration 2 fits in width 5) — the infeasibility
comes only from all three needing to share one booth within their
overlapping windows, not from any single session being impossible on
its own.

If a submission's verdict for either day disagrees with the above, it
is wrong — do not average or split the difference, even if its
Tuesday witness looks plausible or its Wednesday reasoning sounds
confident.

### Trap

The trap is asymmetric: Wednesday looks bookable at first glance
because each session, checked alone, comfortably fits its own window.
A solver who greedily places X, then Y, and only then discovers Y (or
Z) has nowhere to go may still miss the CLEAN reason (the pigeonhole
argument) even if they eventually notice infeasibility — a naive
greedy attempt (earliest release first) places X at 2 but then cannot
fit Y before its deadline, yet a submission might report only that the
"greedy order didn't work" rather than the union-window/total-duration
mismatch. A solver who assumes both days must behave the same way —
either forcing a (wrong) SAT witness onto Wednesday, or wrongly
declaring Tuesday infeasible by analogy — fails outright. The two days
are deliberately constructed to require two different,
independently-reached verdicts.

### Example phrasings — obj-3, UNSAT justified by the pigeonhole argument (not an incomplete backtrack)

PASSING:
- "All three Wednesday sessions are boxed inside the window [2,9] —
  nobody's release is before 2 and nobody's deadline is after 9 — but
  their durations add up to 4+3+2=9 hours of booth-time, which can't
  fit in a 7-hour span no matter how you order them."
- "Even if you allow fractional start times, Wednesday is impossible:
  the union of all three windows only spans 7 hours, and the sessions
  together need 9 hours of exclusive booth use, so some pair is
  guaranteed to overlap regardless of ordering."
- "Wednesday fails a basic capacity check: the earliest anyone can
  start is hour 2, the latest anyone must finish is hour 9, giving a
  7-hour span, yet the three sessions need 9 combined hours in the
  booth — 2 hours more than the span can hold."

FAILING:
- "I tried placing X first, then Y, then Z, and couldn't find a slot
  for Y, so Wednesday must be infeasible."
- "Wednesday seems infeasible because the deadlines are tight, similar
  to how Tuesday also has a fairly packed schedule."
- "No combination of orderings I tried worked, so I'm declaring
  Wednesday UNSAT."

### Example phrasings — obj-5, correctly distinguishing the two verdicts

PASSING:
- "Tuesday and Wednesday are structurally similar but land on opposite
  verdicts: Tuesday has enough slack in its combined window to fit all
  three durations, while Wednesday's combined window is strictly
  smaller than its total required duration."
- "These are independent days — Tuesday turns out to be bookable with
  room to spare, whereas Wednesday is impossible by a capacity
  argument, even though at a glance the two tables look like
  variations on the same setup."
- "Despite both days having three sessions with comparable durations,
  only Tuesday actually fits in its booth window; Wednesday does not,
  for reasons specific to its own numbers."

FAILING:
- "Since both days have three overlapping-looking sessions with
  similar durations, both are infeasible for the same capacity
  reason."
- "Both Tuesday and Wednesday can be booked by shifting sessions
  slightly later than their release times."
- "The two days are essentially the same puzzle, so whatever verdict
  applies to one applies to the other."

### Subjective guidance

- **Correctness of both verdicts and validity of the SAT assignment**
  (0.4): both verdicts must be right; the Tuesday witness must
  actually satisfy every window and have zero overlaps when checked by
  hand. Getting one verdict right and the other wrong should score
  well below half on this dimension.
- **Rigor and clarity of the infeasibility (pigeonhole) argument**
  (0.3): does the UNSAT case cite the actual union-window width and
  total-duration numbers (7 vs. 9), or does it rest on an incomplete
  "I tried a few orders" search?
- **Reasoning quality** (0.3): does the submission show it understood
  *why* the two days differ — the capacity/pigeonhole mechanism —
  rather than pattern-matching a superficial resemblance between the
  two tables?
