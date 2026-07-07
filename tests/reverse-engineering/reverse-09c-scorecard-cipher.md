---
id: reverse-09c-scorecard-cipher
category: reverse-engineering
title: Invert the Scorecard Printer's Encoding Chain
deliverables:
  - invert.js
  - ANSWER.md
---

## Task

A fictional scorecard printer at a miniature-golf course obfuscates each
hole's nickname before embedding it in the day's printed ticket roll.
You don't have the printer firmware's source, but you have two worked
examples and a hint: the firmware applies exactly three ordered
byte-level transforms — a per-byte XOR with the constant `0x4B`, a
whole-buffer byte-reversal, and a base64 encode.

Worked examples (plaintext -> encoded blob):

| Plaintext | Blob |
|---|---|
| `GATOR` | `GQQfCgw=` |
| `tee` | `Li4/` |

Infer the pipeline precisely enough to invert a fresh blob you've never
seen decoded:

```
fHsuLC8uPA==
```

One note to keep the puzzle well-posed: a constant per-byte XOR and a
whole-buffer byte-reversal commute with each other — running the XOR
before the reversal or after it produces byte-identical results either
way. So you never need to pin down which of those two happens first
relative to the other; you only need to confirm both stages genuinely
occur, and that base64 is the outermost layer (the last operation
applied when encoding, so it is the first one you must peel off when
decoding).

## Deliverables

- `invert.js` — a generic staged decoder: given any base64 blob
  produced by this pipeline, it undoes base64 first, then applies the
  byte-reversal and the XOR (in either relative order) to recover the
  original hole nickname. Do not build a lookup table mapping the
  known blobs to their answers — the decoder must actually perform the
  staged byte transforms on arbitrary input. Running `node invert.js`
  must:
  - decode both worked examples above and print the recovered
    plaintext for each, confirming they match `GATOR` and `tee`;
  - print the intermediate byte representation (e.g. as hex) at each
    stage for at least one example, demonstrating the byte-reversal
    stage is genuinely applied and not skipped;
  - decode the challenge blob `fHsuLC8uPA==` and print the recovered
    plaintext.
- `ANSWER.md` — names all three transforms in the pipeline and states
  which one is outermost (and therefore undone first when decoding);
  shows the intermediate bytes for at least one worked example to
  demonstrate the byte-reversal stage is present; and states the
  recovered plaintext for the challenge blob.

## Constraints

- Plain JavaScript, no dependencies, single file for `invert.js`.
