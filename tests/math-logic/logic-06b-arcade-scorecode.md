---
id: logic-06b-arcade-scorecode
category: math-logic
title: Arcade High-Score Cipher
deliverables:
  - SCORECODE.md
---

## Task

A vintage arcade cabinet's leaderboard scrambles the top scorer's secret
four-symbol codename into a coded tag before it is shown on screen.
The scorecode alphabet has 32 symbols: the 26 letters A=0, B=1, ...,
Z=25, followed by six arcade digit-glyphs `0`=26, `1`=27, `2`=28,
`3`=29, `4`=30, `5`=31. The scrambling uses the affine formula:

```
E(x) = (5x + 9) mod 32
```

where `x` is the codename symbol's number and the result is the coded
tag's symbol number. Tonight the leaderboard displayed the four-symbol
coded tag `XJ4U` (letters X and J, digit-glyph `4`, letter U), produced
from an unknown codename.

Answer all four questions, showing your modular working for Q1 and Q4:

- **Q1**: Compute the modular inverse of 5 mod 32 (the number `k` such
  that `5k ≡ 1 (mod 32)`). State it.
- **Q2**: Using that inverse, decode `XJ4U` and state the recovered
  codename.
- **Q3**: A valid affine key on this 32-symbol alphabet is a pair
  `(a, b)` where the multiplier `a` must be coprime with 32, and the
  shift `b` may be any of the 32 residues 0 through 31. How many
  distinct valid affine keys `(a, b)` exist in total on this alphabet?
- **Q4**: Determine whether any symbol is a fixed point of `E` (a
  symbol that encodes to itself, i.e. `E(x) = x`). State your
  conclusion and justify it with the underlying congruence.

## Deliverables

- `SCORECODE.md` — must contain, in this order:
  - Q1's answer with the modular working (e.g. extended Euclid or a
    verification product) shown, not just the final number.
  - Q2's answer (the recovered codename).
  - Q3's answer (the total key count).
  - Q4's conclusion with the congruence that grounds it shown, not just
    a bare yes/no.

## Constraints

- At most 350 words (whole file, `wc -w`).
- Do not fabricate a fixed-point symbol or a key count without showing
  the congruence or count reasoning that produced it.
