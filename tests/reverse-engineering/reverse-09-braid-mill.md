---
id: reverse-09-braid-mill
category: reverse-engineering
title: Invert the Layered Encoding Pipeline
deliverables:
  - invert.js
  - ANSWER.md
---

## Task

A fictional logging tool obfuscates its output with a small layered
encoding pipeline before writing it to disk. You don't have the
encoder's source, but you have two worked examples and a hint: the
encoder applies exactly three ordered byte-level transforms — a
per-byte XOR with the constant `0x2A`, a whole-buffer byte-reversal, and
a base64 encode.

Worked examples (plaintext -> encoded blob):

| Plaintext | Blob |
|---|---|
| `MODEL` | `Zm9uZWc=` |
| `abc` | `SUhL` |

Infer the pipeline precisely enough to invert a fresh blob you've never
seen decoded:

```
GB5CSURPSA==
```

One note to keep the puzzle well-posed: because a constant per-byte XOR
commutes with a whole-buffer byte-reversal (XOR-then-reverse and
reverse-then-XOR produce byte-identical results), you do not need to
determine which of the XOR or the reversal happens first relative to
each other — only that both happen, and that base64 is the outermost
layer (applied last when encoding, so it must be undone first when
decoding).

## Deliverables

- `invert.js` — a generic staged decoder: given any base64 blob
  produced by this pipeline, it undoes base64 first, then applies the
  byte-reversal and the XOR (in either relative order) to recover the
  original plaintext. Do not build a lookup table mapping the known
  blobs to their answers — the decoder must actually perform the staged
  byte transforms on arbitrary input. Running `node invert.js` must:
  - decode both worked examples above and print the recovered
    plaintext for each, confirming they match `MODEL` and `abc`;
  - print the intermediate byte representation (e.g. as hex) at each
    stage for at least one example, demonstrating the byte-reversal
    stage is genuinely applied and not skipped;
  - decode the challenge blob `GB5CSURPSA==` and print the recovered
    plaintext.
- `ANSWER.md` — names all three transforms in the pipeline and states
  which one is outermost (and therefore undone first when decoding);
  shows the intermediate bytes for at least one worked example to
  demonstrate the byte-reversal stage is present; and states the
  recovered plaintext for the challenge blob.

## Constraints

- Plain JavaScript, no dependencies, single file for `invert.js`.
