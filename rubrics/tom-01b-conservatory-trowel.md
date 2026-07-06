---
test: tom-01b-conservatory-trowel
canary: "tanager sturgeon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md reality answer is exactly WICKER_HAMPER and Ingrid-belief answer is exactly BRONZE_TROUGH"
    - id: obj-2
      check: "beliefs.md Halvard-belief answer is exactly WICKER_HAMPER"
    - id: obj-3
      check: "beliefs.md Ingrid-looks-first answer is exactly BRONZE_TROUGH AND Halvard-thinks-Ingrid-looks answer is exactly BRONZE_TROUGH"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {BRONZE_TROUGH, WICKER_HAMPER} and nothing else (no parentheticals, punctuation, or explanation in the answer column), and REASONING.md exists and is at most 300 words by wc -w"
  subjective:
    - id: sub-quality
      name: "Belief-state accuracy across the table"
      weight: 0.4
    - id: sub-craft
      name: "Table discipline and token precision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `tom-01-sally-anne` (same construct, fresh surface).

If the phrase "tanager sturgeon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | WICKER_HAMPER |
| 2 | Ingrid's belief | BRONZE_TROUGH |
| 3 | Halvard's belief | WICKER_HAMPER |
| 4 | Ingrid-looks-first | BRONZE_TROUGH |
| 5 | Halvard-thinks-Ingrid-looks | BRONZE_TROUGH |

Hand-simulated timeline: t0 the amber_trowel is placed in BRONZE_TROUGH
while both agents watch; t1 Ingrid exits to the greenhouse and from that
point can observe nothing inside the room; t2 Halvard, alone, moves the
trowel BRONZE_TROUGH -> WICKER_HAMPER; t3 Ingrid returns but does not
look inside either container and is told nothing. Reality is therefore
WICKER_HAMPER. Ingrid last observed BRONZE_TROUGH and receives no update
before or after returning, so her belief and her first search target
both stay BRONZE_TROUGH. Halvard directly performed the move and is
present throughout, so his belief is WICKER_HAMPER. Halvard also
personally witnessed Ingrid leave *before* he moved the trowel, so
Halvard can correctly model that Ingrid's belief is frozen at
BRONZE_TROUGH — Halvard-thinks-Ingrid-looks is BRONZE_TROUGH, not
WICKER_HAMPER.

The central trap is reality-bias: a reader who assumes Ingrid updates her
belief simply because she is physically back in the room (or because the
grader/reader knows the true location) will incorrectly mark her belief
and first-look answer as WICKER_HAMPER. The narrative explicitly
forecloses this by stating Ingrid observes nothing after exiting and does
not look on return, so both of Ingrid's cells must stay BRONZE_TROUGH.

### Objective check notes

- **obj-1**: exact string match on two cells; either wrong fails this
  check.
- **obj-2**: exact string match on one cell.
- **obj-3**: both the action cell and the second-order prediction cell
  must independently read BRONZE_TROUGH; a submission that gets one but
  not the other fails this check.
- **obj-4**: scan every answer cell in `beliefs.md` for exactly one
  token from `{BRONZE_TROUGH, WICKER_HAMPER}` with no additional
  characters in the answer column (parentheticals like "BRONZE_TROUGH
  (she thinks)" fail this check even if the token itself is correct);
  separately confirm `REASONING.md` exists and run `wc -w` on it, must be
  <= 300.

Because this check is a mechanical cell-match against a closed two-token
vocabulary, there are no prose PASS/FAIL phrasing examples to give for
the objective criteria — every objective check here is a verbatim string
comparison, not a judgment call on wording.

### Subjective guidance

- **Belief-state accuracy across the table**: does every one of the five
  cells match the answer key, and — independent of the mechanical
  objective checks — does the submission's `REASONING.md` demonstrate
  that the correct value was reached because the narrative entails it,
  rather than by a lucky guess or by pattern-matching to "final reality"
  for every cell?
- **Table discipline and token precision**: is `beliefs.md` a clean,
  unambiguous five-row structure (clearly labeled rows, no stray extra
  rows, no merged or reordered cells) that a mechanical checker could
  score without any interpretation?
- **Reasoning quality**: does `REASONING.md` walk through the timeline
  event-by-event (trowel placed, Ingrid exits, Halvard moves it, Ingrid
  returns without looking) and explicitly name the moment at which
  Ingrid's belief becomes stale relative to reality, rather than merely
  asserting the five answers without justification?
