---
id: reverse-07b-greenkeep-zone-frame
category: reverse-engineering
title: Reconstruct the Tagged Zone-Cycle Frame
deliverables:
  - decode.js
  - ANSWER.md
---

## Task

A fictional irrigation controller ("GreenKeep") logs each watering-cycle
event into a compact binary buffer before writing it to flash. You have
one 33-byte buffer and a field-layout spec. Work out every field's value.

Buffer (hex, 33 bytes):

```
c7 f2 04 04 02 17 40 02 00 00 00 00 00 00 03 16 04 45 43 48 4f 01 15 ff ff ff ed 01 18 00 00 00 2a
```

**Layout spec:**

- **Header:** a 2-byte magic number `0xC7F2`, then a 1-byte version,
  then a 1-byte record count.
- **Records** (one after another, immediately following the header,
  `count` of them total): each record is a 1-byte tag, then a 1-byte
  id, then a tag-specific payload:
  - tag `1` = `MOIST` — payload is a 4-byte signed integer (a
    moisture-delta reading).
  - tag `2` = `FLOW` — payload is an 8-byte floating-point number (a
    flow-rate reading).
  - tag `3` = `ZONE` — payload is a 1-byte length prefix `n`, followed
    by `n` bytes of ASCII text (no trailing NUL) (a zone code).
- **Byte order:** every multi-byte field in this format (the magic
  number, and every multi-byte payload) is stored in a single
  consistent byte order. Determine which one from the data — the magic
  number is a good place to check your assumption, since reading it in
  the wrong byte order still produces a plausible-looking but different
  16-bit value, and getting the sign of a `MOIST` record wrong is
  another tell if you pick the wrong order.

The buffer contains exactly 4 records, and every one of the 33 bytes is
accounted for by the header and the four records — nothing is padding.

## Deliverables

- `decode.js` — exports `decode(hexString)` via `module.exports`,
  returning a structured object with the decoded header fields (magic,
  version, count) and a `records` array (each with its tag, id, and
  decoded value — integer, float, or string as appropriate). The
  decoder must parse the tag byte to dispatch record type generically
  (handling all three tag values via the layout above), not hardcode
  this specific buffer's record sequence. When run with
  `node decode.js`, it must decode the buffer above and print the
  header fields, each record's tag/id/value, and a line reporting how
  many of the 33 bytes were consumed.
- `ANSWER.md` — states which byte order the format uses and how you
  determined it (point at specific bytes, don't just assert it); states
  the magic number's byte representation in the stream versus its
  decoded value; and states how the negative `MOIST` record's value is
  encoded at the byte level.

## Constraints

- Plain JavaScript, no dependencies, single file for `decode.js`.
- The file must end with `module.exports = { decode }`; the judge's
  harness requires it.
