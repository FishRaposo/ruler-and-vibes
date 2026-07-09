---
test: reverse-02b-restock-ticket
canary: "rutabaga swede"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "decoded.json contains magic 'VMX', version 3, machine id exactly 1031 (fails if 1796, the big-endian misread), and record count 3"
    - id: obj-2
      check: "Record 1: slot 9 (0x09) with counts exactly [21, 1031, 8192]"
    - id: obj-3
      check: "Record 2: slot 133 (0x85) with product code exactly 'cola-9'; record 3: slot 12 with counts exactly [300, 9]"
    - id: obj-4
      check: "REASONING.md (or decoded.json) identifies the undocumented trailing byte as the sum of that record's payload bytes mod 256 (a checksum), and reports all three trailing bytes as valid checksums: 0x40 (64) for record 1, 0x05 (5) for record 2, 0x36 (54) for record 3"
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

Parallel form of `reverse-02-capsule-log` (same construct, fresh surface).

If the phrase "rutabaga swede" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Full ground-truth decode of the 32-byte ticket (node v24-verified),
  byte-by-byte:
  - Bytes 0-2: `56 4d 58` = ASCII `"VMX"` (magic).
  - Byte 3: `03` = version 3.
  - Bytes 4-5: `07 04`, little-endian = `0x0407` = **1031** (a
    big-endian read of the same two bytes gives 1796 — that's the
    trap; the giveaway is that the identical byte pair `07 04`
    reappears inside record 1's payload as the LE reading 1031, so a
    consistent endianness choice must read both the same way).
  - Byte 6: `03` = slot-record count 3.
  - **Record 1** starts at byte 7: slot `09` (< 0x80, numeric counts),
    length `06`, payload bytes 9-14 = `15 00 07 04 00 20`, decoded as
    three little-endian u16 counts: `15 00` = 21, `07 04` = 1031,
    `00 20` = 8192 -> `[21, 1031, 8192]`. Byte 15 = `40` (64) is the
    trailing byte; payload sum =
    0x15+0x00+0x07+0x04+0x00+0x20 = 64 = 0x40 mod 256 - matches.
  - **Record 2** starts at byte 16: slot `85` (0x85, >= 0x80, ASCII
    product code), length `06`, payload bytes 18-23 = `63 6f 6c 61
    2d 39` = ASCII `"cola-9"`. Byte 24 = `05` (5) trailing; payload
    sum = 0x63+0x6f+0x6c+0x61+0x2d+0x39 = 0x205, mod 256 = 0x05 -
    matches.
  - **Record 3** starts at byte 25: slot `0c` (< 0x80, numeric
    counts), length `04`, payload bytes 27-30 = `2c 01 09 00`,
    decoded as two LE u16 counts: `2c 01` = 300, `09 00` = 9 ->
    `[300, 9]` (the trailing `00` here is the HIGH byte of the second
    count, not padding - a decoder that treats the length-4 payload
    as "one full 2-byte count plus two stray bytes", or reads only
    the lone `09` and calls the final `00` padding, will drop or
    corrupt the second count instead of reporting an honest
    2-count pair). Byte 31 = `36` (54) trailing; payload sum =
    0x2c+0x01+0x09+0x00 = 0x36 = 54 - matches.
  - Total: 3 (magic) + 1 (version) + 2 (machine id) + 1 (count) + 3x(2
    header + payload + 1 trailer) bytes = 7 + (2+6+1) + (2+6+1) +
    (2+4+1) = 7 + 9 + 9 + 7 = 32. All 32 bytes consumed, no padding.
  - Checksum uniqueness (adversarially confirmed): payload-sum-mod-256
    is the ONLY interpretation of the trailing byte that matches all
    three trailers. XOR of payload bytes gives 54/21/36 (decimal) for
    the three records respectively — none of these match the actual
    trailers 64/5/54 (record 3's XOR of 36 is close to but not the
    same as its trailer of 54). Including the slot and length bytes in
    the sum (mod 256) gives 79/144/70 for the three records — also
    matches none of 64/5/54. Only the plain payload-byte sum mod 256
    lines up for all three records at once.
  - Verify by actually running the embedded bytes through a reference
    decode, e.g.
    `node -e "const b=Buffer.from('564d580307040309061500070400204085066 3 6f6c612d3905 0c 042c010900 36'.replace(/ /g,''),'hex'); console.log(b.length)"`
    (or more simply: paste the hex string into decoder.js's own
    invocation and inspect its printed output) — confirm machine id
    1031, the three records' counts/product code, and all three
    trailers checksum-OK.
  - Judge tip: don't accept "1796" or "1797" for machine id (both are
    variants of the big-endian misread), and don't accept a record-3
    second count of anything other than exactly 9 (a common bug reads
    only `09` as a lone byte and calls the trailing `00` padding,
    which coincidentally can still print `9` in isolation but tends to
    also miscount the record's total length or drop a byte elsewhere
    — check that the decoder reports 32 bytes consumed overall, not
    31).
- Clarity of the format write-up: does REASONING.md explain HOW the
  endianness was determined (not just assert it), e.g. by pointing at
  the recurring `07 04` byte pair? Does it clearly justify the
  checksum reading rather than just asserting "it's probably a
  checksum"?
  - PASS phrasings: "confirms little-endian by noting the same `07 04`
    bytes appear as the machine id and again as record 1's second
    reading, both consistently decoding to 1031"; "shows the payload
    sum for each record and states explicitly that it equals the
    trailing byte mod 256"; "walks through all three records' byte
    ranges before naming the trailer as a checksum".
  - FAIL phrasings: "just says 'little-endian seems right' with no byte
    evidence"; "calls the trailing byte 'probably a checksum or magic
    number' without computing a sum"; "never explains why 1031 is
    chosen over 1796".
- Decoder robustness: does decoder.js generalize (loop over the
  slot-record count, branch on `slot < 0x80`) rather than hardcode
  offsets 7/16/25 and the three record shapes directly? Penalize a
  decoder that only works for exactly this one ticket's byte layout.
  - PASS phrasings: "loops `recordCount` times, reading slot/length/
    payload/trailer generically and branching on `slot < 0x80`";
    "computes each record's offset from the running cursor rather
    than literal byte indices"; "handles an arbitrary number of
    2-byte counts per numeric payload, not just three".
  - FAIL phrasings: "hardcodes `bytes[7]`, `bytes[16]`, `bytes[25]` for
    the three record starts"; "special-cases exactly 3 records with no
    loop"; "assumes payload length is always 6 or 4 rather than reading
    the length byte".
- Reasoning quality: look for explicit falsification of the
  alternative checksum hypotheses (XOR, sum-including-header-bytes) or
  at least a clear statement of why the payload-sum reading was chosen
  over an unexamined guess.
  - PASS phrasings: "tests XOR-of-payload against all three trailers
    and shows it fails for all three records"; "tests sum-including-slot-
    and-length-bytes and shows it matches none of the three trailers";
    "states the payload-sum-mod-256 hypothesis is the only one
    consistent across all three records, with the arithmetic shown".
  - FAIL phrasings: "asserts 'it's a checksum' with no alternative
    considered"; "checks the hypothesis against only one record and
    stops"; "shows the sum for record 1 but never verifies records 2
    and 3 line up too".
