---
id: reverse-07c-greenhouse-telemetry
category: reverse-engineering
title: Reconstruct the Greenhouse Telemetry Frame
deliverables:
  - decode.js
  - ANSWER.md
---

## Task

A fictional smart-greenhouse controller serializes sensor telemetry into
a compact binary buffer. You have one 33-byte buffer and a field-layout
spec. Work out every field's value.

Buffer (hex, 33 bytes):

```
9c e2 04 04 02 06 ff ff ff ee 01 0d 04 6b 61 6c 65 03 15 40 89 64 00 00 00 00 00 02 22 00 00 00 2a
```

**Layout spec:**

- **Header:** a 2-byte magic number `0x9CE2`, then a 1-byte version,
  then a 1-byte record count.
- **Records** (one after another, immediately following the header,
  `count` of them total): each record is a 1-byte tag, then a 1-byte
  id, then a tag-specific payload:
  - tag `1` = `STR` — payload is a 1-byte length prefix `n`, followed
    by `n` bytes of ASCII text (no trailing NUL).
  - tag `2` = `INT` — payload is a 4-byte signed integer.
  - tag `3` = `FLOAT` — payload is an 8-byte floating-point number.
- **Byte order:** every multi-byte field in this format (the magic
  number, and every multi-byte payload) is stored in a single
  consistent byte order. Determine which one from the data — the magic
  number is a good place to check your assumption, since reading it in
  the wrong byte order still produces a plausible-looking but different
  16-bit value, and getting the sign of an `INT` record wrong is
  another tell if you pick the wrong order.

The buffer contains exactly 4 records, and every one of the 33 bytes is
accounted for by the header and the four records — nothing is padding.

## Deliverables

- `decode.js` — exports `decode(hexString)` via `module.exports`,
  returning a structured object with the decoded header fields (magic,
  version, count) and a `records` array (each with its tag, id, and
  decoded value — string, integer, or float as appropriate). The
  decoder must parse the tag byte to dispatch record type generically
  (handling all three tag values via the layout above), not hardcode
  this specific buffer's record sequence. When run with
  `node decode.js`, it must decode the buffer above and print the
  header fields, each record's tag/id/value, and a line reporting how
  many of the 33 bytes were consumed.
- `ANSWER.md` — states which byte order the format uses and how you
  determined it (point at specific bytes, don't just assert it); states
  the magic number's byte representation in the stream versus its
  decoded value; and states how the negative `INT` record's value is
  encoded at the byte level.

## Constraints

- Plain JavaScript, no dependencies, single file for `decode.js`.
- The file must end with `module.exports = { decode }`; the judge's
  harness requires it.
