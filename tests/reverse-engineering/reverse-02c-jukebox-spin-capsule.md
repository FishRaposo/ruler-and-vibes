---
id: reverse-02c-jukebox-spin-capsule
category: reverse-engineering
title: Decode the Jukebox Spin Capsule
deliverables:
  - decoder.js
  - decoded.json
---

## Task

A fictional coin-operated jukebox emits fixed-size binary "spin
capsules" logging its play activity. You have one capsule (34 bytes,
hex below) and a PARTIAL spec someone wrote from memory — it describes
the framing but leaves one field undocumented. Work out the rest from
the bytes themselves.

Capsule (hex, 34 bytes):

```
4a 42 58 01 2a 01 03 0d 06 2a 01 08 07 32 00 6c 9c 08 76 69
6e 79 6c 2d 34 35 c8 02 04 84 03 06 00 8d
```

Partial spec:

- **Header:** 3-byte ASCII magic, then a 1-byte format version, then a
  2-byte jukebox id, then a 1-byte spin count.
- **Records** (one after another, immediately following the header):
  each record is a 1-byte spin code, a 1-byte payload length `n`,
  then `n` payload bytes, then **one further byte whose meaning is not
  documented** — figure out what it is and confirm your reading
  against all records.
- Spin codes less than `0x80` carry payload that is a sequence of
  2-byte play-duration readings (so `n` is always even for these
  codes). Spin codes `0x80` and above carry payload that is an ASCII
  song-code label (no trailing NUL).
- All multi-byte integers in this format are stored in a single
  consistent byte order — determine which one from the data (the
  jukebox id is a good place to check your assumption, since a
  wrong byte order will still produce a plausible-looking but
  different number).

The capsule contains exactly 3 records, and every byte in the 34-byte
capsule is accounted for by the header, the records, and their trailing
bytes — nothing is padding.

## Deliverables

- `decoder.js` — exports `decode(hexString)` via `module.exports`,
  returning a structured object with the decoded header fields and a
  `records` array (each record including its spin code, its decoded
  payload — readings array or label string as appropriate — and
  whatever you determine the undocumented trailing byte to mean).
  When run with `node decoder.js`, it decodes the capsule above and
  prints the resulting object (e.g. via
  `console.log(JSON.stringify(decode(HEX), null, 2))`), plus a line
  reporting how many of the 34 bytes were consumed.
- `decoded.json` — the fully decoded capsule, matching what
  `decoder.js` produces for the hex string above.

## Constraints

- Plain JavaScript, no dependencies, single file for `decoder.js`.
- The file must end with `module.exports = { decode }`; the judge's
  harness requires it.
