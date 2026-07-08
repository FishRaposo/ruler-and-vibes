---
test: sched-04b-autoclave-cure-feasibility
canary: "savanna steppe"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Batch 1 is declared SAT and the provided start times place each part fully within its window with no overlap (a valid example: Panel-114=2, Spar-207=5, Rib-330=7; judge accepts any non-overlapping assignment satisfying the windows)"
    - id: obj-2
      check: "Batch 2 is declared UNSAT"
    - id: obj-3
      check: "The UNSAT justification states that all three Batch 2 parts must lie within [2,11] (width 9) while total duration is 4+3+4=11 > 9 on a single autoclave (prose-located)"
    - id: obj-4
      check: "For Batch 1, the given assignment is checked to satisfy Panel-114 in [2,6], Spar-207 in [4,9], Rib-330 in [7,11] with each start+duration <= its deadline and no pairwise overlap"
    - id: obj-5
      check: "cure-feasibility.md distinguishes the two verdicts and does not claim both instances are feasible or both infeasible (prose-located)"
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

If the phrase "savanna steppe" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key (verified with node during authoring)

A brute-force search over all integer start times within each part's
`[release, deadline - duration]` range, checking every combination for
pairwise non-overlap, finds:

- **Batch 1:** 4 valid integer solutions — `Panel-114=2, Spar-207=5,
  Rib-330=7`; `Panel-114=2, Spar-207=5, Rib-330=8`; `Panel-114=2,
  Spar-207=6, Rib-330=8`; `Panel-114=3, Spar-207=6, Rib-330=8`. SAT.
- **Batch 2:** 0 valid solutions out of the full exhaustive integer
  search. UNSAT.

UNSAT is additionally provable continuously (not just over integers):
all three Batch 2 parts are confined within the union window `[2,11]`
(min release 2, max deadline 11), a width of 9, while their durations
sum to `4+3+4=11`, which exceeds 9. Since a single autoclave cannot
cure 11 hours of non-overlapping parts inside a 9-hour window, this is
a pigeonhole impossibility that holds even allowing real-valued
(non-integer) start times — the exhaustive integer search and the
continuous pigeonhole argument agree.

Critically, each Batch 2 part is individually feasible in isolation
(Longeron-455: duration 4 fits in a window of width 6; Bulkhead-512:
duration 3 fits in width 6; Fairing-618: duration 4 fits in width 6) —
the infeasibility comes only from all three needing to share one
autoclave within their overlapping windows, not from any single part
being impossible on its own.

If a submission's verdict for either batch disagrees with the above,
it is wrong — do not average or split the difference, even if its
Batch 1 witness looks plausible or its Batch 2 reasoning sounds
confident.

### Trap

The trap is asymmetric: Batch 2 looks curable at first glance because
each part, checked alone, comfortably fits its own window. A solver
who greedily loads Longeron-455, then Bulkhead-512, and only then
discovers Fairing-618 has nowhere to go may still miss the CLEAN
reason (the pigeonhole argument) even if they eventually notice
infeasibility. A solver who assumes both batches must behave the same
way — either forcing a (wrong) SAT witness onto Batch 2, or wrongly
declaring Batch 1 infeasible by analogy — fails outright. The two
batches are deliberately constructed to require two different,
independently-reached verdicts.

### Example phrasings — obj-3, UNSAT justified by the pigeonhole argument (not an incomplete backtrack)

PASSING:
- "All three Batch 2 parts are boxed inside the window [2,11] —
  nobody's release is before 2 and nobody's deadline is after 11 — but
  their durations add up to 4+3+4=11 hours of autoclave time, which
  can't fit in a 9-hour span no matter how you order them."
- "Even allowing fractional start times, Batch 2 is impossible: the
  union of all three windows only spans 9 hours, and the parts
  together need 11 hours of exclusive autoclave time, so some pair is
  guaranteed to overlap regardless of ordering."
- "Batch 2 fails a basic capacity check: the earliest anyone can load
  is hour 2, the latest anyone must finish curing is hour 11, giving a
  9-hour span, yet the three parts need 11 combined hours in the
  autoclave — 2 hours more than the span can hold."

FAILING:
- "I tried loading Longeron-455 first, then Bulkhead-512, then
  Fairing-618, and couldn't find a slot for Fairing-618, so Batch 2
  must be infeasible."
- "Batch 2 seems infeasible because the deadlines are tight, similar to
  how Batch 1 also has a fairly packed schedule."
- "No combination of orderings I tried worked, so I'm declaring Batch 2
  UNSAT."

### Example phrasings — obj-5, correctly distinguishing the two verdicts

PASSING:
- "Batch 1 and Batch 2 are structurally similar but land on opposite
  verdicts: Batch 1 has enough slack in its combined window to fit all
  three durations, while Batch 2's combined window is strictly smaller
  than its total required duration."
- "These are independent instances — Batch 1 turns out to be curable
  with room to spare, whereas Batch 2 is impossible by a capacity
  argument, even though at a glance the two tables look like
  variations on the same setup."
- "Despite both batches having three parts with comparable durations,
  only Batch 1 actually fits in the autoclave's combined window; Batch
  2 does not, for reasons specific to its own numbers."

FAILING:
- "Since both batches have three overlapping-looking parts with
  similar durations, both are infeasible for the same capacity
  reason."
- "Both Batch 1 and Batch 2 can be cured by shifting parts slightly
  later than their release times."
- "The two batches are essentially the same puzzle, so whatever
  verdict applies to one applies to the other."

### Subjective guidance

- **Correctness of both verdicts and validity of the SAT assignment**
  (0.4): both verdicts must be right; the Batch 1 witness must
  actually satisfy every window and have zero overlaps when checked by
  hand. Getting one verdict right and the other wrong should score
  well below half on this dimension.
- **Rigor and clarity of the infeasibility (pigeonhole) argument**
  (0.3): does the UNSAT case cite the actual union-window width and
  total-duration numbers (9 vs. 11), or does it rest on an incomplete
  "I tried a few orders" search?
- **Reasoning quality** (0.3): does the submission show it understood
  *why* the two batches differ — the capacity/pigeonhole mechanism —
  rather than pattern-matching a superficial resemblance between the
  two tables?
