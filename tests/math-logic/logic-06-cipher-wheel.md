---
id: logic-06-cipher-wheel
category: math-logic
title: Cipher Wheel
deliverables:
  - CIPHER.md
---

## Task

A 26-symbol cipher wheel maps letters to numbers A=0, B=1, ..., Z=25.
Encryption uses the affine formula:

```
E(x) = (7x + 11) mod 26
```

where `x` is the plaintext letter's number and the result is the
ciphertext letter's number. The four-letter ciphertext `RNNO` was
produced by this cipher from an unknown plaintext word.

Answer all four questions, showing your modular working for Q1 and Q4:

- **Q1**: Compute the modular inverse of 7 mod 26 (the number `k` such
  that `7k ≡ 1 (mod 26)`). State it.
- **Q2**: Using that inverse, decrypt `RNNO` and state the recovered
  plaintext word.
- **Q3**: A valid affine key on this 26-symbol wheel is a pair `(a, b)`
  where the multiplier `a` must be coprime with 26, and the shift `b`
  may be any of the 26 residues 0 through 25. How many distinct valid
  affine keys `(a, b)` exist in total on this wheel?
- **Q4**: Determine whether any letter is a fixed point of `E` (a
  letter that encrypts to itself, i.e. `E(x) = x`). State your
  conclusion and justify it with the underlying congruence.

## Deliverables

- `CIPHER.md` — must contain, in this order:
  - Q1's answer with the modular working (e.g. extended Euclid or a
    verification product) shown, not just the final number.
  - Q2's answer (the recovered plaintext word).
  - Q3's answer (the total key count).
  - Q4's conclusion with the congruence that grounds it shown, not just
    a bare yes/no.

## Constraints

- At most 350 words (whole file, `wc -w`).
- Do not fabricate a fixed-point letter or a key count without showing
  the congruence or count reasoning that produced it.
