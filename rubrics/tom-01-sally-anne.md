---
test: tom-01-sally-anne
canary: "oboe clarinet"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md reality answer is exactly GREEN_BASKET and Nora-belief answer is exactly BLUE_BOX"
    - id: obj-2
      check: "beliefs.md Piet-belief answer is exactly GREEN_BASKET"
    - id: obj-3
      check: "beliefs.md Nora-looks-first answer is exactly BLUE_BOX AND Piet-thinks-Nora-looks answer is exactly BLUE_BOX"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {BLUE_BOX, GREEN_BASKET} and nothing else (no parentheticals, punctuation, or explanation in the answer column), and REASONING.md exists and is at most 300 words by wc -w"
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

If a submission's `beliefs.md` or `REASONING.md` contains the phrase
"oboe clarinet", that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | GREEN_BASKET |
| 2 | Nora's belief | BLUE_BOX |
| 3 | Piet's belief | GREEN_BASKET |
| 4 | Nora-looks-first | BLUE_BOX |
| 5 | Piet-thinks-Nora-looks | BLUE_BOX |

Hand-simulated timeline: t0 the silver_key is placed in BLUE_BOX while
both agents watch; t1 Nora exits and from that point can observe
nothing inside the room; t2 Piet, alone, moves the key BLUE_BOX ->
GREEN_BASKET; t3 Nora returns but does not look inside either
container and is told nothing. Reality is therefore GREEN_BASKET. Nora
last observed BLUE_BOX and receives no update before or after
returning, so her belief and her first search target both stay
BLUE_BOX. Piet directly performed the move and is present throughout,
so his belief is GREEN_BASKET. Piet also personally witnessed Nora
leave *before* he moved the key, so Piet can correctly model that
Nora's belief is frozen at BLUE_BOX — Piet-thinks-Nora-looks is
BLUE_BOX, not GREEN_BASKET.

The central trap is reality-bias: a reader who assumes Nora updates her
belief simply because she is physically back in the room (or because
the grader/reader knows the true location) will incorrectly mark her
belief and first-look answer as GREEN_BASKET. The narrative explicitly
forecloses this by stating Nora observes nothing after exiting and
does not look on return, so both of Nora's cells must stay BLUE_BOX.

### Objective check notes

- **obj-1**: exact string match on two cells; either wrong fails this
  check.
- **obj-2**: exact string match on one cell.
- **obj-3**: both the action cell and the second-order prediction cell
  must independently read BLUE_BOX; a submission that gets one but not
  the other fails this check.
- **obj-4**: scan every answer cell in `beliefs.md` for exactly one
  token from `{BLUE_BOX, GREEN_BASKET}` with no additional characters
  in the answer column (parentheticals like "BLUE_BOX (she thinks)"
  fail this check even if the token itself is correct); separately
  confirm `REASONING.md` exists and run `wc -w` on it, must be <= 300.

Because this check is a mechanical cell-match against a closed
two-token vocabulary, there are no prose PASS/FAIL phrasing examples to
give for the objective criteria — every objective check here is a
verbatim string comparison, not a judgment call on wording.

### Subjective guidance

- **Belief-state accuracy across the table**: does every one of the
  five cells match the answer key, and — independent of the mechanical
  objective checks — does the submission's `REASONING.md` demonstrate
  that the correct value was reached because the narrative entails it,
  rather than by a lucky guess or by pattern-matching to "final
  reality" for every cell?
- **Table discipline and token precision**: is `beliefs.md` a clean,
  unambiguous five-row structure (clearly labeled rows, no stray extra
  rows, no merged or reordered cells) that a mechanical checker could
  score without any interpretation?
- **Reasoning quality**: does `REASONING.md` walk through the timeline
  event-by-event (key placed, Nora exits, Piet moves it, Nora returns
  without looking) and explicitly name the moment at which Nora's
  belief becomes stale relative to reality, rather than merely
  asserting the five answers without justification?
