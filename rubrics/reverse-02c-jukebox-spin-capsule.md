---
test: reverse-02c-jukebox-spin-capsule
canary: "kohlrabi celeriac"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "decoded.json contains magic 'JBX', version 1, jukebox id exactly 298 (fails if 10753, the big-endian misread), and spin count 3"
    - id: obj-2
      check: "Record 1: spin code 13 (0x0d) with readings exactly [298, 1800, 50]"
    - id: obj-3
      check: "Record 2: spin code 156 (0x9c) with label exactly 'vinyl-45'; record 3: spin code 2 with readings exactly [900, 6]"
    - id: obj-4
      check: "REASONING.md (or decoded.json) identifies the undocumented trailing byte as the sum of that record's payload bytes mod 256 (a checksum), and reports all three trailing bytes as valid checksums: 0x6c (108) for record 1, 0xc8 (200) for record 2, 0x8d (141) for record 3"
    - id: obj-5
      check: "Judge runs decoder.js on the embedded 34-byte hex string — its output values match decoded.json (structure/key names may differ, but values must agree), and the decoder reports all 34 bytes consumed"
  subjective:
    - id: sub-quality
      name: "Clarity of the format write-up"
      weight: 0.4
    - id: sub-craft
      name: "Decoder robustness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Clarity of the format write-up
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Decoder robustness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `reverse-02-capsule-log` (same construct, fresh surface).

If the phrase "kohlrabi celeriac" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Full ground-truth decode of the 34-byte capsule (node v24.16.0
  verified), byte-by-byte:
  - Bytes 0-2: `4a 42 58` = ASCII `"JBX"` (magic).
  - Byte 3: `01` = version 1.
  - Bytes 4-5: `2a 01`, little-endian = `0x012a` = **298** (a
    big-endian read of the same two bytes gives 10753 — that's the
    trap; the giveaway is that the identical byte pair `2a 01`
    reappears inside record 1's payload as the LE reading 298, so a
    consistent endianness choice must read both the same way).
  - Byte 6: `03` = spin count 3.
  - **Record 1** starts at byte 7: spin code `0d` (0x0d, < 0x80, numeric
    readings), length `06`, payload bytes 9-14 = `2a 01 08 07 32 00`,
    decoded as three little-endian u16 readings: `2a 01` = 298,
    `08 07` = 1800, `32 00` = 50 -> `[298, 1800, 50]`. Byte 15 = `6c`
    (108) is the trailing byte; payload sum =
    0x2a+0x01+0x08+0x07+0x32+0x00 = 108 = 0x6c mod 256 - matches.
  - **Record 2** starts at byte 16: spin code `9c` (0x9c, >= 0x80,
    ASCII label), length `08`, payload bytes 18-25 =
    `76 69 6e 79 6c 2d 34 35` = ASCII `"vinyl-45"`. Byte 26 = `c8`
    (200) trailing; payload sum =
    0x76+0x69+0x6e+0x79+0x6c+0x2d+0x34+0x35 = 0x2c8, mod 256 = 0xc8 -
    matches.
  - **Record 3** starts at byte 27: spin code `02` (< 0x80, numeric
    readings), length `04`, payload bytes 29-32 = `84 03 06 00`,
    decoded as two LE u16 readings: `84 03` = 900, `06 00` = 6 ->
    `[900, 6]` (the trailing `00` here is the HIGH byte of the second
    reading, not padding - a decoder that treats a length-4 payload as
    "one paired reading plus a lone significant byte and a stray zero"
    instead of an honest 2-reading pair will get the second reading
    wrong). Byte 33 = `8d` (141) trailing; payload sum =
    0x84+0x03+0x06+0x00 = 0x8d = 141 - matches.
  - Total: 3 (magic) + 1 (version) + 2 (jukebox id) + 1 (spin count) +
    3x(2 header + payload + 1 trailer) bytes = 7 + (2+6+1) + (2+8+1) +
    (2+4+1) = 7 + 9 + 11 + 7 = 34. All 34 bytes consumed, no padding.
  - Checksum uniqueness (adversarially confirmed): payload-sum-mod-256
    is the ONLY interpretation of the trailing byte that matches all
    three trailers. XOR of payload bytes gives 0x16/0x48/0x81 for the
    three records respectively — matches none of 0x6c/0xc8/0x8d.
    Including the spin-code and length bytes in the sum (mod 256) gives
    127/108/147 — also matches none (note 108 collides with record 1's
    *correct* trailer only by coincidence of a different record's
    value, not its own — it is still not equal to record 2's own
    trailer of 200). Only the plain payload-byte sum mod 256 lines up
    for all three records simultaneously.
- Verify by actually running the embedded bytes through a reference
  decode, e.g. paste the hex string into `decoder.js`'s own invocation
  and inspect its printed output — confirm jukebox id 298, the three
  records' readings/label, and all three trailers checksum-OK.
- Judge tip: don't accept "10753" or "10 753" for jukebox id, and don't
  accept a record-3 second reading of anything other than exactly 6
  (a common bug reads only `06` as a lone byte and calls the trailing
  `00` padding, silently getting a 1-byte "reading" wrong or
  miscounting the record's length).
- Clarity of the format write-up: does REASONING.md explain HOW the
  endianness was determined (not just assert it), e.g. by pointing at
  the recurring `2a 01` byte pair? Does it clearly justify the checksum
  reading rather than just asserting "it's probably a checksum"?
  - PASS phrasings: "explains little-endian was chosen because the
    jukebox-id byte pair `2a 01` reappears as record 1's first
    reading, which only reads as 298 both times under LE"; "shows the
    payload-sum arithmetic for each record's trailing byte rather than
    asserting the checksum"; "walks through header, then each record
    in byte order, citing concrete offsets".
  - FAIL phrasings: "asserts little-endian with no justification beyond
    'it looked right'"; "glosses over why the trailing byte is a
    checksum, just says 'looks like one'"; "jumps straight to code
    with no prose explanation of the format at all".
- Decoder robustness: does decoder.js generalize (loop over
  `spinCount`, branch on `code < 0x80`) rather than hardcode offsets
  7/16/27 and the three record shapes directly? Penalize a decoder
  that only works for exactly this one capsule's byte layout.
  - PASS phrasings: "loops over spinCount and derives each record's
    boundaries from its own length byte"; "computes reading count as
    payload length divided by 2 instead of hardcoding 3, 4, 2"; "would
    still decode correctly if a fourth record were appended".
  - FAIL phrasings: "hardcodes byte offsets 7, 16, 27 for the three
    records instead of walking the buffer"; "special-cases exactly
    3 records and would break if spinCount were different"; "hardcodes
    the three specific reading counts instead of deriving them from
    length ÷ 2".
- Reasoning quality: look for explicit falsification of the
  alternative checksum hypotheses (XOR, sum-including-header-bytes) or
  at least a clear statement of why the payload-sum reading was chosen
  over an unexamined guess.
  - PASS phrasings: "computes the XOR hypothesis, shows it fails on
    all three records, and only then settles on payload-sum"; "tests
    sum-including-the-header-bytes and demonstrates it doesn't match
    any trailer"; "states plainly why payload-sum-mod-256 beats the
    alternatives instead of guessing".
  - FAIL phrasings: "never considers any alternative to the checksum
    guess"; "asserts the checksum formula with no attempt to rule out
    alternatives"; "shows the formula working for one record and
    doesn't check the other two before concluding".
