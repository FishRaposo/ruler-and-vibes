---
id: reverse-02-capsule-log
category: reverse-engineering
title: Decode the PLQ Sensor Capsule
deliverables:
  - decoder.js
  - decoded.json
---

## Task

A fictional environmental-monitoring device emits fixed-size binary
"capsules." You have one capsule (32 bytes, hex below) and a PARTIAL
spec someone wrote from memory — it describes the framing but leaves
one field undocumented. Work out the rest from the bytes themselves.

Capsule (hex, 32 bytes):

```
50 4c 51 02 01 03 03 11 06 2a 00 01 03 00 10 3e
82 06 70 75 6d 70 2d 34 23 07 04 f4 01 05 00 fa
```

Partial spec:

- **Header:** 3-byte ASCII magic, then a 1-byte version, then a 2-byte
  station id, then a 1-byte record count.
- **Records** (one after another, immediately following the header):
  each record is a 1-byte channel id, a 1-byte payload length `n`,
  then `n` payload bytes, then **one further byte whose meaning is not
  documented** — figure out what it is and confirm your reading
  against all records.
- Channel ids less than `0x80` carry payload that is a sequence of
  2-byte sensor readings (so `n` is always even for these channels).
  Channel ids `0x80` and above carry payload that is an ASCII text
  label (no trailing NUL).
- All multi-byte integers in this format are stored in a single
  consistent byte order — determine which one from the data (the
  station id is a good place to check your assumption, since a
  wrong byte order will still produce a plausible-looking but
  different number).

The capsule contains exactly 3 records, and every byte in the 32-byte
capsule is accounted for by the header, the records, and their trailing
bytes — nothing is padding.

## Deliverables

- `decoder.js` — exports `decode(hexString)` via `module.exports`,
  returning a structured object with the decoded header fields and a
  `records` array (each record including its channel, its decoded
  payload — readings array or label string as appropriate — and
  whatever you determine the undocumented trailing byte to mean).
  When run with `node decoder.js`, it decodes the capsule above and
  prints the resulting object (e.g. via
  `console.log(JSON.stringify(decode(HEX), null, 2))`), plus a line
  reporting how many of the 32 bytes were consumed.
- `decoded.json` — the fully decoded capsule, matching what
  `decoder.js` produces for the hex string above.

## Constraints

- Plain JavaScript, no dependencies, single file for `decoder.js`.
- The file must end with `module.exports = { decode }`; the judge's
  harness requires it.
