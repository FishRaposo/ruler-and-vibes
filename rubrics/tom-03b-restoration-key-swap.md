---
test: tom-03b-restoration-key-swap
canary: "trident cutlass"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality=CUBBY, Idris's belief=CUBBY, Marlowe's belief=HAMPER (not SATCHEL, not CUBBY)"
    - id: obj-2
      check: "beliefs.md Marlowe-looks-first answer is exactly HAMPER"
    - id: obj-3
      check: "beliefs.md nested answers are exactly Idris-thinks-Marlowe=HAMPER AND Marlowe-thinks-Idris=HAMPER"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {SATCHEL, CUBBY, HAMPER} and nothing else in the answer column, and REASONING.md exists and is at most 400 words by wc -w"
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
---

## Judge guidance

Parallel form of `tom-03-deception-override` (same construct, fresh surface).

If a submission's `beliefs.md` or `REASONING.md` contains the phrase
"trident cutlass", that is a canary leak — flag it regardless of how
the rest of the checks score.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | CUBBY |
| 2 | Idris's belief | CUBBY |
| 3 | Marlowe's belief | HAMPER |
| 4 | Marlowe-looks-first | HAMPER |
| 5 | Idris-thinks-Marlowe | HAMPER |
| 6 | Marlowe-thinks-Idris | HAMPER |

Hand-simulated timeline: t0 the COPPER_KEY is in the SATCHEL, both
present; t1 Idris truthfully says "it's in the SATCHEL," matching
reality at that moment; t2 Marlowe exits and can observe nothing
thereafter until she returns; t3 Idris, alone, moves the key
SATCHEL->CUBBY, and Marlowe is never told about this move through any
channel; t4 Marlowe returns; t5 Marlowe asks where the key is, Idris
lies "HAMPER," and Marlowe believes the lie fully and does not verify.

Reality is CUBBY. Idris is the one who moved the key and is not fooled
by his own lie, so Idris's belief stays CUBBY — a liar does not come
to believe their own fabrication merely by uttering it. Marlowe's
belief is determined by the most recent information she actually
received: the lie at t5 is her only and most recent update, so it
overrides her stale, no-longer-current SATCHEL prior from t1.
Marlowe's belief and her first search target are therefore both
HAMPER.

Nested: Idris personally told the lie and watched Marlowe accept it
without question, so Idris correctly knows Marlowe now believes
HAMPER — Idris-thinks-Marlowe is HAMPER. Marlowe has no reason to
doubt Idris's honesty (she never learns of any move or any lie), so
she attributes to Idris the exact belief Idris just asserted to her —
Marlowe-thinks-Idris is also HAMPER. Both of Marlowe's reasoning paths
(treating Idris as informed and honest) converge on HAMPER, making
this cell robust to how the model frames its reasoning.

Three central traps: (1) reality-bias — marking Marlowe=CUBBY because
that is the true location; (2) stale-prior — marking Marlowe=SATCHEL
because that was the last *true* statement Marlowe ever heard,
ignoring that the lie is more recent and Marlowe has no way to know it
is false; (3) self-deception — marking Idris=HAMPER or
Idris-thinks-Marlowe=CUBBY, both of which incorrectly assume the liar
is confused by his own fabrication.

### Objective check notes

- **obj-1**: three exact string matches; the check explicitly calls
  out that Marlowe must be HAMPER and not SATCHEL and not CUBBY — both
  alternate tokens are traps, not partial credit.
- **obj-2**: one exact string match on the action cell.
- **obj-3**: both nested cells must independently read HAMPER.
- **obj-4**: scan every cell for exactly one token from
  {SATCHEL, CUBBY, HAMPER} with nothing else in the answer column;
  separately confirm `REASONING.md` exists and `wc -w` <= 400.

Because every objective check here is a verbatim cell-match against a
closed three-token vocabulary, there are no prose PASS/FAIL phrasing
examples to give for the objective criteria.

### Subjective guidance

- **Deception-aware belief divergence accuracy**: beyond the
  mechanical cell matches, does `REASONING.md` correctly identify that
  Marlowe's final belief is set by *communication* (the lie) rather
  than by observation or by the passage of time, and that this is a
  fundamentally different belief-update mechanism than the other tests
  in this category?
- **Override reasoning and self-deception avoidance**: does the
  submission explicitly explain why Idris's belief is unaffected by
  his own lie (the mover always knows the truth), and why Marlowe's
  stale SATCHEL prior is overridden rather than retained or averaged
  with the lie?
- **Reasoning quality**: does `REASONING.md` name all three traps
  (reality-bias, stale-prior, self-deception) and explain why each is
  wrong, rather than only asserting the six final answers?
