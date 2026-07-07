---
test: reverse-07b-greenkeep-zone-frame
canary: "gust flurry"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs `node decode.js` and it prints: magic 0xC7F2, version 4, count 4"
    - id: obj-2
      check: "decode.js output reports the four records exactly: FLOW id=23 value=2.25; ZONE id=22 value=\"ECHO\"; MOIST id=21 value=-19; MOIST id=24 value=42"
    - id: obj-3
      check: "ANSWER.md states the buffer is big-endian and that the magic bytes appear in the stream as c7 f2 (high byte first), and that the MOIST value -19 is stored as two's-complement ff ff ff ed"
    - id: obj-4
      check: "decode.js consumes exactly 33 bytes with no leftover and no overrun (it reports bytes-consumed = 33, or the judge confirms the last record ends the buffer)"
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

Parallel form of `reverse-07-crate-manifest` (same construct, fresh
surface).

If the phrase "gust flurry" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Author built and node v24.16.0-verified the buffer: hex
  `c7f20404021740020000000000000316044543484f0115ffffffed01180000002a`
  (33 bytes). `readUInt16BE` on bytes 0-1 gives `0xC7F2`; byte 2 =
  version `4`; byte 3 = count `4`.
- Record layout, each row `[tag u8][id u8][payload]`:
  - Bytes 4-13: `02 17 40 02 00 00 00 00 00 00` -> tag `2` (FLOW), id
    `23` (`0x17`), payload `40 02 00 00 00 00 00 00` read as a
    big-endian IEEE-754 double = **2.25**.
  - Bytes 14-20: `03 16 04 45 43 48 4f` -> tag `3` (ZONE), id `22`
    (`0x16`), length-prefix `4`, payload `45 43 48 4f` = ASCII
    **"ECHO"**.
  - Bytes 21-26: `01 15 ff ff ff ed` -> tag `1` (MOIST), id `21`
    (`0x15`), payload `ff ff ff ed` read as a signed 32-bit big-endian
    integer = **-19** (two's complement of `0xFFFFFFED`).
  - Bytes 27-32: `01 18 00 00 00 2a` -> tag `1` (MOIST), id `24`
    (`0x18`), payload `00 00 00 2a` read as a signed 32-bit big-endian
    integer = **42**.
  - Total consumed: 4 (header) + 10 (FLOW record: 2+8) + 7 (ZONE
    record: 2+1+4) + 6 (MOIST record: 2+4) + 6 (MOIST record: 2+4) =
    4 + 10 + 7 + 6 + 6 = 33. All 33 bytes consumed, no padding, no
    overrun.
- Endianness trap: reading the magic bytes `c7 f2` as little-endian
  gives `0xF2C7` (62151), a plausible-looking but wrong number; the
  correct big-endian read gives `0xC7F2` (51186). The `ff ff ff ed`
  MOIST payload read as little-endian would be `-301989889` (a huge
  negative number), not `-19`, and the `00 00 00 2a` MOIST payload read
  as little-endian would be `704643072` instead of `42` — a
  wrong-endianness reader gets the magic AND both signed integers wrong
  simultaneously, which is a reliable tell.
- Verify by actually running the embedded hex through a reference
  decode, e.g. paste the hex string into `decode.js`'s own invocation
  (`node decode.js`) and inspect its printed output, or run:
  `node -e "const {decode}=require('./decode.js'); console.log(JSON.stringify(decode('c7f20404021740020000000000000316044543484f0115ffffffed01180000002a')))"`
  and confirm magic `0xC7F2`/51186, version 4, count 4, and the four
  records' values.
- Judge tip: don't accept a magic value of `0xF2C7`/62151 (the
  little-endian misread), and don't accept any MOIST value other than
  exactly `-19` or `42` (a common bug reads the four payload bytes as
  unsigned, reporting `4294967277` instead of recognizing two's
  complement for the id=21 record).
- Layout exposition: does ANSWER.md explain HOW big-endian was
  determined (e.g., by checking that the byte order matches expectation
  for the magic constant, or reasoning about the two's-complement MOIST
  value), rather than just asserting "it's big-endian"? Does it clearly
  show the byte-level encoding of the magic and the negative integer,
  not just their final values?
  - PASS phrasings: "confirms big-endian by showing `c7 f2` reads as
    `0xC7F2` and noting the little-endian alternative `0xF2C7` is a
    different, only-superficially-plausible value"; "walks through
    `ff ff ff ed` as the two's-complement encoding of -19 byte by
    byte before stating the final value"; "points at the specific
    header bytes (0-1) and payload bytes (23-26) rather than describing
    them in the abstract".
  - FAIL phrasings: "just says 'it's big-endian' with no byte
    evidence"; "states the MOIST value is -19 without ever mentioning
    two's complement or showing the payload bytes"; "describes the
    magic number only by its decoded value, never showing how the raw
    stream bytes map to it".
- Parser correctness: does decode.js generalize (loop over `count`,
  branch on the tag byte for each of the three tag values) rather than
  hardcode fixed offsets for exactly this buffer's four-record
  sequence? Penalize a decoder that only works for this one buffer's
  specific tag ordering (FLOW, ZONE, MOIST, MOIST) and would break if
  the same format encoded records in a different order or count.
  - PASS phrasings: "loops `count` times, reading tag/id/payload
    generically and branching on the tag value inside the loop";
    "computes each record's offset from a running cursor rather than
    literal byte indices"; "handles two MOIST records back-to-back
    without any special-casing for repeated tags".
  - FAIL phrasings: "hardcodes `bytes[4]`, `bytes[14]`, `bytes[21]`,
    `bytes[27]` for the four record starts"; "special-cases exactly
    four records with no loop"; "assumes the record order is always
    FLOW, ZONE, MOIST, MOIST rather than reading the tag byte to
    decide".
- Reasoning quality: look for explicit reasoning about why big-endian
  fits (not little-endian) and why the MOIST payloads decode to -19 and
  42 via two's complement rather than an unsigned or sign-magnitude
  interpretation.
  - PASS phrasings: "explicitly rules out little-endian by showing the
    swapped magic value `0xF2C7` doesn't match any other consistency
    check, then commits to big-endian"; "traces the two's-complement
    bit pattern for `-19` and shows why it's negative rather than a
    large unsigned value"; "cross-checks byte order using both the
    magic number and the sign of a MOIST record before concluding".
  - FAIL phrasings: "asserts big-endian with no derivation"; "reports
    -19 without ever discussing two's complement or an unsigned
    alternative"; "guesses the byte order from convention ('most
    formats are big-endian') rather than from the data".
