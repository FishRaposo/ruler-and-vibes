---
id: reverse-02b-restock-ticket
category: reverse-engineering
title: Decode the VMX Restock Ticket
deliverables:
  - decoder.js
  - decoded.json
---

## Task

A fictional vending-machine fleet operator's controller emits fixed-size
binary "restock tickets" whenever a route driver refills a machine. You
have one ticket (32 bytes, hex below) and a PARTIAL spec pieced together
from an old wiki page — it describes the framing but leaves one field
undocumented. Work out the rest from the bytes themselves.

Ticket (hex, 32 bytes):

```
56 4d 58 03 07 04 03 09 06 15 00 07 04 00 20 40
85 06 63 6f 6c 61 2d 39 05 0c 04 2c 01 09 00 36
```

Partial spec:

- **Header:** 3-byte ASCII magic, then a 1-byte version, then a 2-byte
  machine id, then a 1-byte slot-record count.
- **Records** (one after another, immediately following the header):
  each record is a 1-byte slot id, a 1-byte payload length `n`, then
  `n` payload bytes, then **one further byte whose meaning is not
  documented** — figure out what it is and confirm your reading
  against all records.
- Slot ids less than `0x80` carry payload that is a sequence of 2-byte
  inventory counts (so `n` is always even for these slots). Slot ids
  `0x80` and above carry payload that is an ASCII product code (no
  trailing NUL).
- All multi-byte integers in this format are stored in a single
  consistent byte order — determine which one from the data (the
  machine id is a good place to check your assumption, since a wrong
  byte order will still produce a plausible-looking but different
  number).

The ticket contains exactly 3 records, and every byte in the 32-byte
ticket is accounted for by the header, the records, and their trailing
bytes — nothing is padding.

## Deliverables

- `decoder.js` — exports `decode(hexString)` via `module.exports`,
  returning a structured object with the decoded header fields and a
  `records` array (each record including its slot id, its decoded
  payload — counts array or product-code string as appropriate — and
  whatever you determine the undocumented trailing byte to mean).
  When run with `node decoder.js`, it decodes the ticket above and
  prints the resulting object (e.g. via
  `console.log(JSON.stringify(decode(HEX), null, 2))`), plus a line
  reporting how many of the 32 bytes were consumed.
- `decoded.json` — the fully decoded ticket, matching what
  `decoder.js` produces for the hex string above.

## Constraints

- Plain JavaScript, no dependencies, single file for `decoder.js`.
- The file must end with `module.exports = { decode }`; the judge's
  harness requires it.
