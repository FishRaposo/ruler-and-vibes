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

If the phrase "sallow catkin wharf" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

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
- obj-3 phrasing guide (byte order, magic bytes, two's-complement):
  - PASS phrasings: "states explicitly 'the format is little-endian' and
    points to the magic bytes appearing as `31 5a` in the stream (low
    byte first) decoding to `0x5A31`, plus explains `-7` is stored as
    two's complement `f9 ff ff ff`"; "shows the determination method —
    reading `31 5a` as little-endian yields the header's own magic
    constant `0x5A31`, confirming the byte order — and separately calls
    out that the negative INT payload `f9 ff ff ff` is the 32-bit
    two's-complement encoding of `-7`"; "reasons that reading the same
    bytes big-endian would give a different, wrong 16-bit value
    (`0x315A`), using that mismatch to justify little-endian, and states
    the two's-complement byte pattern for `-7`".
  - FAIL phrasings: "asserts 'the format is big-endian', or never names
    a byte order at all and just presents the decoded values"; "states
    little-endian correctly but never shows the byte-level evidence
    (never quotes `31 5a` or `f9 ff ff ff`), just asserts the final
    decoded numbers"; "describes the negative value only as 'a negative
    number' or 'stored as -7' without describing the two's-complement
    byte encoding".
- obj-5 phrasing guide (generic tag dispatch):
  - PASS phrasings: "decode.js loops `for (let i = 0; i < count; i++)`
    and branches on the tag byte read that iteration, so it would
    decode a differently-ordered or differently-sized record stream
    correctly"; "tag dispatch is switch- or if-chain-driven off the tag
    byte value, with no fixed byte offsets baked in for this specific
    buffer's three records"; "correctly decodes the STR record's
    length-prefix generically, not assuming a fixed 3-byte payload".
  - FAIL phrasings: "decode.js hardcodes three fixed-offset reads (e.g.
    `buf.readInt32LE(6)`, `buf.readUInt8(14)`...) tied to this exact
    buffer's layout, breaking on any other record order or count"; "only
    handles exactly one record of each type in a fixed position,
    silently breaking if two records shared a tag"; "uses an if/else
    keyed on record *position* (`if (i === 0) ...`) rather than the tag
    *byte value*, so reordering the records would decode them
    incorrectly even though the tag byte is present".
- Layout exposition: does ANSWER.md explain HOW little-endian was
  determined (e.g., by checking that the byte order matches expectation
  for the magic constant, or reasoning about the two's-complement INT),
  rather than just asserting "it's little-endian"? Does it clearly show
  the byte-level encoding of the magic and the negative integer, not
  just their final values?
  - PASS phrasings: "confirms little-endian by showing `31 5a` reads as
    `0x5A31` and noting the big-endian alternative `0x315A` is a
    different, only-superficially-plausible value"; "walks through
    `f9 ff ff ff` as the two's-complement encoding of -7 byte by byte
    before stating the final value"; "points at the specific header
    bytes (0-1) and payload bytes (4-9) rather than describing them in
    the abstract".
  - FAIL phrasings: "just says 'it's little-endian' with no byte
    evidence"; "states the INT value is -7 without ever mentioning
    two's complement or showing the payload bytes"; "describes the
    magic number only by its decoded value, never showing how the raw
    stream bytes map to it".
- Parser correctness: does decode.js generalize (loop over `count`,
  branch on the tag byte for each of the three tag values) rather than
  hardcode fixed offsets for exactly this buffer's three-record
  sequence? Penalize a decoder that only works for this one buffer's
  specific tag ordering (INT, STR, FLOAT) and would break if the same
  format encoded records in a different order or count.
  - PASS phrasings: "loops `count` times, reading tag/id/payload
    generically and branching on the tag value inside the loop";
    "computes each record's offset from a running cursor rather than
    literal byte indices"; "handles the length-prefixed STR payload by
    reading the length byte and advancing `1 + length`, not by assuming
    a fixed 3-byte string".
  - FAIL phrasings: "hardcodes `bytes[4]`, `bytes[10]`, `bytes[17]` for
    the three record starts"; "special-cases exactly three records with
    no loop"; "assumes the record order is always INT, STR, FLOAT
    rather than reading the tag byte to decide".
- Reasoning quality: look for explicit reasoning about why little-endian
  fits (not big-endian) and why the INT payload decodes to -7 via
  two's complement rather than an unsigned or sign-magnitude
  interpretation.
  - PASS phrasings: "explicitly rules out big-endian by showing the
    swapped magic value `0x315A` doesn't match any other consistency
    check, then commits to little-endian"; "traces the two's-complement
    bit pattern for `-7` and shows why it's negative rather than a large
    unsigned value"; "cross-checks byte order using both the magic
    number and the sign of the INT record before concluding".
  - FAIL phrasings: "asserts little-endian with no derivation"; "reports
    -7 without ever discussing two's complement or an unsigned
    alternative"; "guesses the byte order from convention ('most formats
    are big-endian') rather than from the data".
