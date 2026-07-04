---
test: reverse-07-crate-manifest
canary: "sallow catkin wharf"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs `node decode.js` and it prints: magic 0x5A31, version 2, count 3"
    - id: obj-2
      check: "decode.js output reports the three records exactly: INT id=10 value=-7; STR id=20 value=\"hex\"; FLOAT id=30 value=1.5"
    - id: obj-3
      check: "ANSWER.md states the buffer is little-endian and that the magic bytes appear in the stream as 31 5a (low byte first), and that the INT value -7 is stored as two's-complement f9 ff ff ff"
    - id: obj-4
      check: "decode.js consumes exactly 26 bytes with no leftover and no overrun (it reports bytes-consumed = 26, or the judge confirms the last record ends the buffer)"
    - id: obj-5
      check: "decode.js parses the tag byte to dispatch record type generically (handles all three tag values via the layout), not hardcoding this buffer's specific record sequence"
  subjective:
    - id: sub-quality
      name: "Layout exposition"
      weight: 0.4
    - id: sub-craft
      name: "Parser correctness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: sallow catkin wharf.

- Author built and node v24.16.0-verified the buffer: hex
  `315a0203010af9ffffff031403686578021e000000000000f83f` (26 bytes).
  `readUInt16LE` on bytes 0-1 gives `0x5A31`; byte 2 = version `2`; byte
  3 = count `3`.
- Record layout, each row `[tag u8][id u8][payload]`:
  - Bytes 4-9: `01 0a f9 ff ff ff` -> tag `1` (INT), id `10`, payload
    `f9 ff ff ff` read as a signed 32-bit little-endian integer =
    **-7** (two's complement of `0xFFFFFFF9`).
  - Bytes 10-16: `03 14 03 68 65 78` -> tag `3` (STR), id `20`
    (`0x14`), length-prefix `3`, payload `68 65 78` = ASCII **"hex"**.
  - Bytes 17-25: `02 1e 00 00 00 00 00 00 f8 3f` -> tag `2` (FLOAT), id
    `30` (`0x1e`), payload `00 00 00 00 00 00 f8 3f` read as a
    little-endian IEEE-754 double = **1.5**.
  - Total consumed: 4 (header) + 6 (INT record: 2+4) + 6 (STR record:
    2+1+3) + 10 (FLOAT record: 2+8) = 4 + 6 + 6 + 10 = 26. All 26 bytes
    consumed, no padding, no overrun.
- Endianness trap: reading the magic bytes `31 5a` as big-endian gives
  `0x315A` (12634), a plausible-looking but wrong number; the correct
  little-endian read gives `0x5A31` (23089). The `f9 ff ff ff` INT
  payload read as big-endian would be a huge positive number
  (`0xF9FFFFFF` = 4194304000-ish unsigned, or a different negative value
  interpreted as signed), not `-7` — a wrong-endianness reader gets both
  the magic AND the signed integer wrong simultaneously, which is a
  reliable tell.
- Verify by actually running the embedded hex through a reference
  decode, e.g. paste the hex string into `decode.js`'s own invocation
  (`node decode.js`) and inspect its printed output, or run:
  `node -e "const {decode}=require('./decode.js'); console.log(JSON.stringify(decode('315a0203010af9ffffff031403686578021e000000000000f83f')))"`
  and confirm magic `0x5A31`/23089, version 2, count 3, and the three
  records' values.
- Judge tip: don't accept a magic value of `0x315A`/12634 (the
  big-endian misread), and don't accept any INT value other than
  exactly `-7` (a common bug reads the four payload bytes as unsigned,
  reporting a large positive number instead of recognizing two's
  complement).
- Layout exposition: does ANSWER.md explain HOW little-endian was
  determined (e.g., by checking that the byte order matches expectation
  for the magic constant, or reasoning about the two's-complement INT),
  rather than just asserting "it's little-endian"? Does it clearly show
  the byte-level encoding of the magic and the negative integer, not
  just their final values?
- Parser correctness: does decode.js generalize (loop over `count`,
  branch on the tag byte for each of the three tag values) rather than
  hardcode fixed offsets for exactly this buffer's three-record
  sequence? Penalize a decoder that only works for this one buffer's
  specific tag ordering (INT, STR, FLOAT) and would break if the same
  format encoded records in a different order or count.
- Reasoning quality: look for explicit reasoning about why little-endian
  fits (not big-endian) and why the INT payload decodes to -7 via
  two's complement rather than an unsigned or sign-magnitude
  interpretation.
