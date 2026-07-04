---
test: reverse-09-braid-mill
canary: "whortleberry vireo plume"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md names all three transforms — XOR-with-0x2A, whole-buffer byte-reversal, and base64 — and states that base64 is the outermost stage, so decoding undoes base64 FIRST, then the byte-reversal and the XOR (in either relative order); the answer must not omit the byte-reversal stage"
    - id: obj-2
      check: "Judge runs `node invert.js` and it prints the recovered plaintext of the challenge blob \"GB5CSURPSA==\" as exactly \"bench42\""
    - id: obj-3
      check: "invert.js correctly round-trips BOTH embedded examples: decoding \"Zm9uZWc=\" yields \"MODEL\" and decoding \"SUhL\" yields \"abc\""
    - id: obj-4
      check: "ANSWER.md shows the intermediate bytes for at least one example (e.g. \"MODEL\": utf8 4d4f44454c, XORed 67656e6f66, reversed 666f6e6567, base64 Zm9uZWc=), demonstrating the byte-reversal stage is present and not skipped"
    - id: obj-5
      check: "invert.js implements a generic staged decoder (applies base64-decode, byte-reverse, and XOR-0x2A to any input blob), not a lookup table mapping the given blobs to answers"
  subjective:
    - id: sub-quality
      name: "Pipeline exposition"
      weight: 0.4
    - id: sub-craft
      name: "Inversion correctness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: whortleberry vireo plume.

- Author node v24.16.0-verified: `decode("Zm9uZWc=")` = `"MODEL"`,
  `decode("SUhL")` = `"abc"`, `decode("GB5CSURPSA==")` = `"bench42"`.
- Intermediate bytes for `"MODEL"`: utf8 `4d4f44454c` -> XOR-with-0x2A
  `67656e6f66` -> byte-reversed `666f6e6567` -> base64 `Zm9uZWc=`. The
  full pipeline, encode direction: `base64(reverse(xor(utf8(plaintext),
  0x2A)))`. Decode direction undoes base64 first (outermost), then
  reversal and XOR in either order.
- Commutativity fact (author-verified, this is why the rubric does NOT
  require one specific XOR/reverse order): a constant per-byte XOR
  commutes with a whole-buffer byte-reversal — encoding `"MODEL"`,
  `"abc"`, and `"bench42"` via XOR-then-reverse and via
  reverse-then-XOR produces byte-identical output in all three cases.
  Do not penalize a submission for applying the reversal before the
  XOR or vice versa on the *decode* side, as long as both stages are
  genuinely present and base64 is undone first.
- The real, well-posed trap is OMITTING the byte-reversal stage
  entirely. Author-verified: decoding the challenge blob with only
  base64-decode + XOR (no reversal) yields the garbled string
  `"24hcneb"`, not `"bench42"` — a clear, unambiguous signal the
  reversal stage was dropped. A submission whose `ANSWER.md` or
  `invert.js` only mentions XOR and base64 (omitting the reversal) has
  fallen into this trap even if it happens to get lucky on short
  strings elsewhere.
- Verify obj-2/obj-3 by actually running `node invert.js` and checking
  its printed output for all three blobs; alternatively:
  `node -e "console.log(require('./invert.js').decode('GB5CSURPSA=='))"`
  should print `bench42`, and the same for the two worked-example blobs
  should print `MODEL` and `abc`.
- Judge tip: don't accept `"24hcneb"` or any other non-`"bench42"`
  string as the challenge answer — that specific garbled string is the
  fingerprint of the dropped-reversal bug. Also don't accept an
  `invert.js` that only "works" via an if/switch mapping the three
  known blobs to their known plaintexts — probe genericity by trying a
  blob not in the test, e.g. encoding a fresh string with the reference
  pipeline above and confirming the submission's `decode` recovers it
  (or, at minimum, confirming the file contains base64/XOR/reverse
  operations applied generally rather than a lookup table).
- Pipeline exposition: does ANSWER.md clearly name all three stages and
  correctly identify base64 as outermost (undone first), rather than
  vaguely describing "some encoding"?
- Inversion correctness: does invert.js's `decode` function generalize
  to arbitrary blobs produced by the stated pipeline, applying real
  base64-decode, byte-reversal, and XOR operations rather than
  hardcoding the three given blob-to-plaintext pairs?
- Reasoning quality: does ANSWER.md's intermediate-byte walkthrough
  actually show the reversal changing the byte order (compare the XORed
  hex to the reversed hex and confirm they're reverses of each other),
  proving the stage wasn't just claimed but genuinely traced?
