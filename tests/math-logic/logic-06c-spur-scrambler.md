---
id: logic-06c-spur-scrambler
category: math-logic
title: Marshaling Yard Spur Scrambler
deliverables:
  - YARDLOG.md
---

## Task

A model-railway club's marshaling yard has a rotary track-selector disk
with 34 numbered spurs, 0 through 33. A safety-interlock box scrambles
the yard's true spur assignments before they are printed on the day's
ops sheet, using the affine formula:

```
S(x) = (5x + 9) mod 34
```

where `x` is the true spur number and the result is the printed
(scrambled) spur number. Today's ops sheet printed the four-spur
sequence `1, 9, 12, 23`, produced by this scrambler from an unknown
true routing sequence.

Answer all four questions, showing your modular working for Q1 and Q4:

- **Q1**: Compute the modular inverse of 5 mod 34 (the number `k` such
  that `5k ≡ 1 (mod 34)`). State it.
- **Q2**: Using that inverse, decode the printed sequence `1, 9, 12,
  23` and state the recovered true spur sequence, in order.
- **Q3**: A valid scrambler key on this 34-spur disk is a pair `(a, b)`
  where the multiplier `a` must be coprime with 34, and the shift `b`
  may be any of the 34 residues 0 through 33. How many distinct valid
  scrambler keys `(a, b)` exist in total on this disk?
- **Q4**: Determine whether any spur is a fixed point of `S` (a spur
  that scrambles to itself, i.e. `S(x) = x`). State your conclusion
  and justify it with the underlying congruence.

## Deliverables

- `YARDLOG.md` — must contain, in this order:
  - Q1's answer with the modular working (e.g. extended Euclid or a
    verification product) shown, not just the final number.
  - Q2's answer (the recovered true spur sequence).
  - Q3's answer (the total key count).
  - Q4's conclusion with the congruence that grounds it shown, not
    just a bare yes/no.

## Constraints

- At most 350 words (whole file, `wc -w`).
- Do not fabricate a fixed spur or a key count without showing the
  congruence or count reasoning that produced it.
