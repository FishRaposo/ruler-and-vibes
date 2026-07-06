---
test: tom-01c-wardrobe-brooch
canary: "oriole lamprey"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md reality answer is exactly WICKER_HAMPER and Ingrid-belief answer is exactly VELVET_TRUNK"
    - id: obj-2
      check: "beliefs.md Teodora-belief answer is exactly WICKER_HAMPER"
    - id: obj-3
      check: "beliefs.md Ingrid-looks-first answer is exactly VELVET_TRUNK AND Teodora-thinks-Ingrid-looks answer is exactly VELVET_TRUNK"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {VELVET_TRUNK, WICKER_HAMPER} and nothing else (no parentheticals, punctuation, or explanation in the answer column), and REASONING.md exists and is at most 300 words by wc -w"
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

If the phrase "oriole lamprey" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | WICKER_HAMPER |
| 2 | Ingrid's belief | VELVET_TRUNK |
| 3 | Teodora's belief | WICKER_HAMPER |
| 4 | Ingrid-looks-first | VELVET_TRUNK |
| 5 | Teodora-thinks-Ingrid-looks | VELVET_TRUNK |

Hand-simulated timeline: t0 the jade_brooch is placed in VELVET_TRUNK
while both agents watch; t1 Ingrid exits and from that point can observe
nothing inside the room; t2 Teodora, alone, moves the brooch
VELVET_TRUNK -> WICKER_HAMPER; t3 Ingrid returns but does not look
inside either container and is told nothing. Reality is therefore
WICKER_HAMPER. Ingrid last observed VELVET_TRUNK and receives no update
before or after returning, so her belief and her first search target
both stay VELVET_TRUNK. Teodora directly performed the move and is
present throughout, so her belief is WICKER_HAMPER. Teodora also
personally witnessed Ingrid leave *before* she moved the brooch, so
Teodora can correctly model that Ingrid's belief is frozen at
VELVET_TRUNK — Teodora-thinks-Ingrid-looks is VELVET_TRUNK, not
WICKER_HAMPER.

The central trap is reality-bias: a reader who assumes Ingrid updates
her belief simply because she is physically back in the room (or because
the grader/reader knows the true location) will incorrectly mark her
belief and first-look answer as WICKER_HAMPER. The narrative explicitly
forecloses this by stating Ingrid observes nothing after exiting and
does not look on return, so both of Ingrid's cells must stay
VELVET_TRUNK.

### Objective check notes

- **obj-1**: exact string match on two cells; either wrong fails this
  check.
- **obj-2**: exact string match on one cell.
- **obj-3**: both the action cell and the second-order prediction cell
  must independently read VELVET_TRUNK; a submission that gets one but
  not the other fails this check.
- **obj-4**: scan every answer cell in `beliefs.md` for exactly one
  token from `{VELVET_TRUNK, WICKER_HAMPER}` with no additional
  characters in the answer column (parentheticals like "VELVET_TRUNK
  (she thinks)" fail this check even if the token itself is correct);
  separately confirm `REASONING.md` exists and run `wc -w` on it, must
  be <= 300.

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
  event-by-event (brooch placed, Ingrid exits, Teodora moves it, Ingrid
  returns without looking) and explicitly name the moment at which
  Ingrid's belief becomes stale relative to reality, rather than merely
  asserting the five answers without justification?
