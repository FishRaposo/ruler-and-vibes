---
test: reverse-02-capsule-log
canary: "damson kazoo tundra"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "decoded.json contains magic 'PLQ', version 2, station id exactly 769 (fails if 259, the big-endian misread), and record count 3"
    - id: obj-2
      check: "Record 1: channel 17 (0x11) with readings exactly [42, 769, 4096]"
    - id: obj-3
      check: "Record 2: channel 130 (0x82) with label exactly 'pump-4'; record 3: channel 7 with readings exactly [500, 5]"
    - id: obj-4
      check: "REASONING.md (or decoded.json) identifies the undocumented trailing byte as the sum of that record's payload bytes mod 256 (a checksum), and reports all three trailing bytes as valid checksums: 0x3e (62) for record 1, 0x23 (35) for record 2, 0xfa (250) for record 3"
    - id: obj-5
      check: "Judge runs decoder.js on the embedded 32-byte hex string — its output values match decoded.json (structure/key names may differ, but values must agree), and the decoder reports all 32 bytes consumed"
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

If the phrase "damson kazoo tundra" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Full ground-truth decode of the 32-byte capsule (node
  v24.16.0-verified), byte-by-byte:
  - Bytes 0-2: `50 4c 51` = ASCII `"PLQ"` (magic).
  - Byte 3: `02` = version 2.
  - Bytes 4-5: `01 03`, little-endian = `0x0301` = **769** (a
    big-endian read of the same two bytes gives 259 — that's the
    trap; the giveaway is that the identical byte pair `01 03`
    reappears inside record 1's payload as the LE reading 769, so a
    consistent endianness choice must read both the same way).
  - Byte 6: `03` = record count 3.
  - **Record 1** starts at byte 7: channel `11` (0x11, < 0x80, numeric
    readings), length `06`, payload bytes 9-14 = `2a 00 01 03 00 10`,
    decoded as three little-endian u16 readings: `2a 00` = 42,
    `01 03` = 769, `00 10` = 4096 -> `[42, 769, 4096]`. Byte 15 = `3e`
    (62) is the trailing byte; payload sum = 0x2a+0x00+0x01+0x03+0x00+0x10
    = 62 = 0x3e mod 256 - matches.
  - **Record 2** starts at byte 16: channel `82` (0x82, >= 0x80, ASCII
    label), length `06`, payload bytes 18-23 = `70 75 6d 70 2d 34` =
    ASCII `"pump-4"`. Byte 24 = `23` (35) trailing; payload sum =
    0x70+0x75+0x6d+0x70+0x2d+0x34 = 0x223, mod 256 = 0x23 - matches.
  - **Record 3** starts at byte 25: channel `07` (< 0x80, numeric
    readings), length `04`, payload bytes 27-30 = `f4 01 05 00`,
    decoded as two LE u16 readings: `f4 01` = 500, `05 00` = 5 ->
    `[500, 5]` (the trailing `00` here is the HIGH byte of the second
    reading, not padding - a decoder that treats length-4 payload as
    "2 readings then a stray zero" instead of an honest 2-reading pair
    will get the second reading wrong). Byte 31 = `fa` (250) trailing;
    payload sum = 0xf4+0x01+0x05+0x00 = 0xfa = 250 - matches.
  - Total: 3 (magic) + 1 (version) + 2 (station) + 1 (count) + 3x(2
    header + payload + 1 trailer) bytes = 7 + (2+6+1) + (2+6+1) +
    (2+4+1) = 7 + 9 + 9 + 7 = 32. All 32 bytes consumed, no padding.
  - Checksum uniqueness (adversarially confirmed): payload-sum-mod-256
    is the ONLY interpretation of the trailing byte that matches all
    three trailers. XOR of payload bytes gives 0x38/0x01/0xf0 for the
    three records respectively — matches none of 0x3e/0x23/0xfa.
    Including the channel and length bytes in the sum (mod 256) gives
    0x55/0xab/0x05 — also matches none. Only the plain payload-byte
    sum mod 256 lines up for all three records simultaneously.
- Verify by actually running the embedded bytes through a reference
  decode, e.g.
  `node -e "const b=Buffer.from('504c5102010303110 62a0001030 0103e82067075...'.replace(/ /g,''),'hex'); console.log(b.length)"`
  (or more simply: paste the hex string into decoder.js's own
  invocation and inspect its printed output) — confirm station 769,
  the three records' readings/label, and all three trailers checksum-OK.
- Judge tip: don't accept "260" or "259" for station id, and don't
  accept a record-3 second reading of anything other than exactly 5
  (a common bug reads only `05` as a lone byte and calls the trailing
  `00` padding, silently getting a 1-byte "reading" wrong or miscounting
  the record's length).
- Clarity of the format write-up: does REASONING.md explain HOW the
  endianness was determined (not just assert it), e.g. by pointing at
  the recurring `01 03` byte pair? Does it clearly justify the checksum
  reading rather than just asserting "it's probably a checksum"?
  - PASS phrasings: "confirms little-endian by noting the same `01 03`
    bytes appear as the station id and again as record 1's second
    reading, both consistently decoding to 769"; "shows the payload
    sum for each record and states explicitly that it equals the
    trailing byte mod 256"; "walks through all three records' byte
    ranges before naming the trailer as a checksum".
  - FAIL phrasings: "just says 'little-endian seems right' with no byte
    evidence"; "calls the trailing byte 'probably a checksum or magic
    number' without computing a sum"; "never explains why 769 is
    chosen over 259".
- Decoder robustness: does decoder.js generalize (loop over
  `recordCount`, branch on `channel < 0x80`) rather than hardcode
  offsets 7/16/25 and the three record shapes directly? Penalize a
  decoder that only works for exactly this one capsule's byte layout.
  - PASS phrasings: "loops `recordCount` times, reading channel/length/
    payload/trailer generically and branching on `channel < 0x80`";
    "computes each record's offset from the running cursor rather
    than literal byte indices"; "handles an arbitrary number of
    2-byte readings per numeric payload, not just three".
  - FAIL phrasings: "hardcodes `bytes[7]`, `bytes[16]`, `bytes[25]` for
    the three record starts"; "special-cases exactly 3 records with no
    loop"; "assumes payload length is always 6 or 4 rather than reading
    the length byte".
- Reasoning quality: look for explicit falsification of the
  alternative checksum hypotheses (XOR, sum-including-header-bytes) or
  at least a clear statement of why the payload-sum reading was chosen
  over an unexamined guess.
  - PASS phrasings: "tests XOR-of-payload against all three trailers
    and shows it fails for all three records"; "tests sum-including-
    channel-and-length-bytes and shows it matches none of the three
    trailers"; "states the payload-sum-mod-256 hypothesis is the only
    one consistent across all three records, with the arithmetic
    shown".
  - FAIL phrasings: "asserts 'it's a checksum' with no alternative
    considered"; "checks the hypothesis against only one record and
    stops"; "shows the sum for record 1 but never verifies records 2
    and 3 line up too".
