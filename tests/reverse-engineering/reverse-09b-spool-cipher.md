---
id: reverse-09b-spool-cipher
category: reverse-engineering
title: Invert the Embroidery Controller's Encoding Chain
deliverables:
  - invert.js
  - ANSWER.md
---

## Task

A fictional embroidery machine's controller firmware obfuscates the
design-name strings it sends to the embroidery head before transmitting
them over a legacy serial cable. You don't have the controller's
source, but you have two worked examples and a hint: the controller
applies exactly three ordered byte-level transforms — a per-byte XOR
with the constant `0x5A`, a whole-buffer byte-reversal, and a base64
encode.

Worked examples (plaintext -> encoded blob):

| Plaintext | Blob |
|---|---|
| `SPOOL` | `FhUVCgk=` |
| `hem` | `Nz8y` |

Infer the pipeline precisely enough to invert a fresh blob you've never
seen decoded:

```
Ymo3MzQ/Pg==
```

A note to keep this puzzle well-posed: a constant per-byte XOR commutes
with a whole-buffer byte-reversal — applying the XOR and then
reversing, or reversing and then applying the XOR, yields identical
bytes either way. So you don't need to pin down which of those two
happens first relative to the other — only that both stages occur, and
that base64 is the outermost layer (the last thing applied when
encoding, so it's the first thing you must undo when decoding).

## Deliverables

- `invert.js` — a generic staged decoder: given any base64 blob
  produced by this pipeline, it undoes base64 first, then applies the
  byte-reversal and the XOR (in either relative order) to recover the
  original design-name string. Do not build a lookup table mapping the
  known blobs to their answers — the decoder must actually perform the
  staged byte transforms on arbitrary input. Running `node invert.js`
  must:
  - decode both worked examples above and print the recovered
    plaintext for each, confirming they match `SPOOL` and `hem`;
  - print the intermediate byte representation (e.g. as hex) at each
    stage for at least one example, demonstrating the byte-reversal
    stage is genuinely applied and not skipped;
  - decode the challenge blob `Ymo3MzQ/Pg==` and print the recovered
    plaintext.
- `ANSWER.md` — names all three transforms in the pipeline and states
  which one is outermost (and therefore undone first when decoding);
  shows the intermediate bytes for at least one worked example to
  demonstrate the byte-reversal stage is present; and states the
  recovered plaintext for the challenge blob.

## Constraints

- Plain JavaScript, no dependencies, single file for `invert.js`.
