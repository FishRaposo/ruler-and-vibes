---
test: reverse-07c-greenhouse-telemetry
canary: "blizzard whiteout"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs `node decode.js` and it prints: magic 0x9CE2, version 4, count 4"
    - id: obj-2
      check: "decode.js output reports the four records exactly: INT id=6 value=-18; STR id=13 value=\"kale\"; FLOAT id=21 value=812.5; INT id=34 value=42"
    - id: obj-3
      check: "ANSWER.md states the buffer is big-endian and that the magic bytes appear in the stream as 9c e2 (high byte first), and that the INT value -18 is stored as two's-complement ff ff ff ee"
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
anchors:
  - id: Layout exposition
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Parser correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `reverse-07-crate-manifest` (same construct, fresh
surface).

If the phrase "blizzard whiteout" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author built and node v24.16.0-verified the buffer: hex
  `9ce204040206ffffffee010d046b616c650315408964000000000002220000002a`
  (33 bytes). `readUInt16BE` on bytes 0-1 gives `0x9CE2`; byte 2 =
  version `4`; byte 3 = count `4`.
- Record layout, each row `[tag u8][id u8][payload]`, tag `1`=STR,
  tag `2`=INT, tag `3`=FLOAT (note: this tag-to-type numbering is
  different from other forms of this test — don't assume tag `1` is
  always `INT`):
  - Bytes 4-9: `02 06 ff ff ff ee` -> tag `2` (INT), id `6`, payload
    `ff ff ff ee` read as a signed 32-bit big-endian integer =
    **-18** (two's complement of `0xFFFFFFEE`).
  - Bytes 10-16: `01 0d 04 6b 61 6c 65` -> tag `1` (STR), id `13`
    (`0x0d`), length-prefix `4`, payload `6b 61 6c 65` = ASCII
    **"kale"**.
  - Bytes 17-26: `03 15 40 89 64 00 00 00 00 00` -> tag `3` (FLOAT), id
    `21` (`0x15`), payload `40 89 64 00 00 00 00 00` read as a
    big-endian IEEE-754 double = **812.5**.
  - Bytes 27-32: `02 22 00 00 00 2a` -> tag `2` (INT), id `34`
    (`0x22`), payload `00 00 00 2a` read as a signed 32-bit big-endian
    integer = **42**.
  - Total consumed: 4 (header) + 6 (INT record: 2+4) + 7 (STR record:
    2+1+4) + 10 (FLOAT record: 2+8) + 6 (INT record: 2+4) =
    4 + 6 + 7 + 10 + 6 = 33. All 33 bytes consumed, no padding, no
    overrun.
- Endianness trap: reading the magic bytes `9c e2` as little-endian
  gives `0xE29C` (58012), a plausible-looking but wrong number; the
  correct big-endian read gives `0x9CE2` (40162). The `ff ff ff ee` INT
  payload (first INT record) read as little-endian would decode to
  `-285212673`, wildly different from the correct `-18` — a
  wrong-endianness reader gets both the magic AND the signed integer
  wrong simultaneously, which is a reliable tell. (Verified with
  `Buffer.from('ffffffee','hex').readInt32LE(0) === -285212673` versus
  `.readInt32BE(0) === -18`.)
- Verify by actually running the embedded hex through a reference
  decode, e.g. paste the hex string into `decode.js`'s own invocation
  (`node decode.js`) and inspect its printed output, or run:
  `node -e "const {decode}=require('./decode.js'); console.log(JSON.stringify(decode('9ce204040206ffffffee010d046b616c650315408964000000000002220000002a')))"`
  and confirm magic `0x9CE2`/40162, version 4, count 4, and the four
  records' values.
- Judge tip: don't accept a magic value of `0xE29C`/58012 (the
  little-endian misread), and don't accept any INT value other than
  exactly `-18` for id=6 or `42` for id=34 (a common bug reads the
  four payload bytes as unsigned, reporting a large positive number
  instead of recognizing two's complement for the negative one).
- obj-3 phrasing guide (byte order, magic bytes, two's-complement):
  - PASS phrasings: "states explicitly 'the format is big-endian' and
    points to the magic bytes appearing as `9c e2` in the stream (high
    byte first) decoding to `0x9CE2`, plus explains `-18` is stored as
    two's complement `ff ff ff ee`"; "shows the determination method —
    reading `9c e2` as big-endian yields the header's own magic
    constant `0x9CE2`, confirming the byte order — and separately
    calls out that the negative INT payload `ff ff ff ee` is the
    32-bit two's-complement encoding of `-18`"; "reasons that reading
    the same bytes little-endian would give a different, wrong 16-bit
    value, using that mismatch to justify big-endian, and states the
    two's-complement byte pattern for `-18`".
  - FAIL phrasings: "asserts 'the format is little-endian', or never
    names a byte order at all and just presents the decoded values";
    "states big-endian correctly but never shows the byte-level
    evidence (never quotes `9c e2` or `ff ff ff ee`), just asserts the
    final decoded numbers"; "describes the negative value only as 'a
    negative number' or 'stored as -18' without describing the
    two's-complement byte encoding".
- obj-5 phrasing guide (generic tag dispatch):
  - PASS phrasings: "decode.js loops `for (let i = 0; i < count; i++)`
    and branches on the tag byte read that iteration, so it would
    decode a differently-ordered or differently-sized record stream
    correctly"; "tag dispatch is switch- or if-chain-driven off the
    tag byte value, with no fixed byte offsets baked in for this
    specific buffer's four records"; "correctly re-decodes both INT
    records (id=6 and id=34) via the same branch, proving the dispatch
    isn't special-cased per record position".
  - FAIL phrasings: "decode.js hardcodes four fixed-offset reads (e.g.
    `buf.readInt32BE(6)`, `buf.readUInt8(13)`...) tied to this exact
    buffer's layout, breaking on any other record order or count";
    "only handles three record slots or assumes one of each type,
    silently dropping or mis-parsing the second INT record"; "uses an
    if/else keyed on record *position* (`if (i === 0) ...`) rather
    than the tag *byte value*, so reordering the records would decode
    them incorrectly even though the tag byte is present".
- Layout exposition: does ANSWER.md explain HOW big-endian was
  determined (e.g., by checking that the byte order matches
  expectation for the magic constant, or reasoning about the
  two's-complement INT), rather than just asserting "it's big-endian"?
  Does it clearly show the byte-level encoding of the magic and the
  negative integer, not just their final values?
  - PASS phrasings: "walks through the byte-level evidence for
    big-endian (matching the magic constant) before stating the
    conclusion, and separately explains the two's-complement negative
    encoding with the actual hex bytes"; "clearly distinguishes 'byte
    representation in the stream' from 'decoded value' for both the
    magic number and the INT payload"; "reads as a mini derivation:
    tries the byte order against the known magic, confirms it, then
    applies that order consistently to the INT record".
  - FAIL phrasings: "just states the final decoded fields (magic
    `0x9CE2`, version 4, count 4) with no explanation of how byte
    order was determined"; "conflates the stream bytes and the decoded
    value into one sentence without distinguishing them"; "describes
    the layout only in generic terms ('the header has a magic number
    and version') without engaging with this buffer's specific bytes
    at all".
- Parser correctness: does decode.js generalize (loop over `count`,
  branch on the tag byte for each of the three tag values) rather than
  hardcode fixed offsets for exactly this buffer's four-record
  sequence? Penalize a decoder that only works for this one buffer's
  specific tag ordering (INT, STR, FLOAT, INT) and would break if the
  same format encoded records in a different order or count.
  - PASS phrasings: "decode.js's loop and tag dispatch correctly
    reproduce all four records' tag/id/value with no off-by-one in
    the running offset, and would generalize to a reordered or larger
    record set"; "uses a switch (or equivalent) on the tag byte rather
    than assuming a fixed record shape, and the length-prefixed STR
    payload correctly advances the offset by `1 + length`"; "handles
    the repeated INT tag (two separate records) via the same code
    path, not two special cases".
  - FAIL phrasings: "decoder works only because it re-derives this
    exact buffer's byte offsets by hand, not because it dispatches on
    the tag byte"; "STR length-prefix handling is off by one (misses
    the length byte itself when advancing the offset), which would
    desync every record after a variable-length one"; "silently
    truncates or ignores the fourth record (the second INT), reporting
    only three records even though `count` says 4".
- Reasoning quality: look for explicit reasoning about why big-endian
  fits (not little-endian) and why the INT payloads decode via two's
  complement rather than an unsigned or sign-magnitude interpretation.
  - PASS phrasings: "explains why big-endian (not little-endian) is
    the consistent reading, using the magic-number cross-check as
    evidence, and separately reasons why the INT payloads must be
    interpreted as two's complement rather than sign-magnitude or
    unsigned"; "shows the elimination of the wrong byte order
    explicitly (e.g., 'reading little-endian would give `0xE29C`,
    which isn't the fixed magic, so big-endian is correct') rather
    than asserting the answer"; "connects the byte-order conclusion to
    both the header (magic) and the payload (INT sign) as two
    independent checks that agree".
  - FAIL phrasings: "states the byte order and the INT values with no
    supporting argument, as if self-evident"; "only checks the magic
    number consistency but never mentions the INT sign as a second
    confirmation (or vice versa)"; "reasons about the STR or FLOAT
    fields instead of using the actual decisive evidence (magic
    mismatch, INT two's complement) to justify the byte order choice".
