---
test: tom-03-deception-override
canary: "euphonium ukulele"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality=JAR, Wren=JAR, Vale=POUCH (not TIN, not JAR)"
    - id: obj-2
      check: "beliefs.md Vale-looks-first answer is exactly POUCH"
    - id: obj-3
      check: "beliefs.md nested answers are exactly Wren-thinks-Vale=POUCH AND Vale-thinks-Wren=POUCH"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {TIN, JAR, POUCH} and nothing else in the answer column, and REASONING.md exists and is at most 400 words by wc -w"
  subjective:
    - id: sub-quality
      name: "Deception-aware belief divergence accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Override reasoning and self-deception avoidance"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Deception-aware belief divergence accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Override reasoning and self-deception avoidance
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "euphonium ukulele" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | JAR |
| 2 | Wren's belief | JAR |
| 3 | Vale's belief | POUCH |
| 4 | Vale-looks-first | POUCH |
| 5 | Wren-thinks-Vale | POUCH |
| 6 | Vale-thinks-Wren | POUCH |

Hand-simulated timeline: t0 the BRASS_COIN is in the TIN, both present;
t1 Wren truthfully says "it's in the TIN," matching reality at that
moment; t2 Vale exits and can observe nothing thereafter until she
returns; t3 Wren, alone, moves the coin TIN->JAR, and Vale is never
told about this move through any channel; t4 Vale returns; t5 Vale asks
where the coin is, Wren lies "POUCH," and Vale believes the lie fully
and does not verify.

Reality is JAR. Wren is the one who moved the coin and is not fooled by
his own lie, so Wren's belief stays JAR — a liar does not come to
believe their own fabrication merely by uttering it. Vale's belief is
determined by the most recent information she actually received: the
lie at t5 is her only and most recent update, so it overrides her
stale, no-longer-current TIN prior from t1. Vale's belief and her
first search target are therefore both POUCH.

Nested: Wren personally told the lie and watched Vale accept it without
question, so Wren correctly knows Vale now believes POUCH —
Wren-thinks-Vale is POUCH. Vale has no reason to doubt Wren's honesty
(she never learns of any move or any lie), so she attributes to Wren
the exact belief Wren just asserted to her — Vale-thinks-Wren is also
POUCH. Both of Vale's reasoning paths (treating Wren as informed and
honest) converge on POUCH, making this cell robust to how the model
frames its reasoning.

Three central traps: (1) reality-bias — marking Vale=JAR because that
is the true location; (2) stale-prior — marking Vale=TIN because that
was the last *true* statement Vale ever heard, ignoring that the lie is
more recent and Vale has no way to know it is false; (3)
self-deception — marking Wren=POUCH or Wren-thinks-Vale=JAR, both of
which incorrectly assume the liar is confused by his own fabrication.

### Objective check notes

- **obj-1**: three exact string matches; the check explicitly calls out
  that Vale must be POUCH and not TIN and not JAR — both alternate
  tokens are traps, not partial credit.
- **obj-2**: one exact string match on the action cell.
- **obj-3**: both nested cells must independently read POUCH.
- **obj-4**: scan every cell for exactly one token from {TIN, JAR,
  POUCH} with nothing else in the answer column; separately confirm
  `REASONING.md` exists and `wc -w` <= 400.

Because every objective check here is a verbatim cell-match against a
closed three-token vocabulary, there are no prose PASS/FAIL phrasing
examples to give for the objective criteria.

### Subjective guidance

- **Deception-aware belief divergence accuracy**: beyond the
  mechanical cell matches, does `REASONING.md` correctly identify that
  Vale's final belief is set by *communication* (the lie) rather than
  by observation or by the passage of time, and that this is a
  fundamentally different belief-update mechanism than the other tests
  in this category?
- **Override reasoning and self-deception avoidance**: does the
  submission explicitly explain why Wren's belief is unaffected by his
  own lie (the mover always knows the truth), and why Vale's stale TIN
  prior is overridden rather than retained or averaged with the lie?
- **Reasoning quality**: does `REASONING.md` name all three traps
  (reality-bias, stale-prior, self-deception) and explain why each is
  wrong, rather than only asserting the six final answers?
