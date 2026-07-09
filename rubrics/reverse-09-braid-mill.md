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
anchors:
  - id: Pipeline exposition
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Inversion correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "whortleberry vireo plume" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

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

Prose-decidable check exemplars:

- obj-1 (naming + outermost stage): **PASS** phrasings — "The pipeline
  is base64(reverse(xor(bytes, 0x2A))); decoding undoes base64 first,
  then the byte-reversal and the XOR in either order."; "Three stages:
  XOR with 0x2A, a whole-buffer reversal, and base64 on the outside —
  so decode strips base64, then reverses, then XORs."; "Base64 is
  applied last during encoding, so it must be removed first when
  decoding, followed by undoing the reversal and the XOR." **FAIL**
  phrasings — "The blob is just base64 of an XORed string." (drops the
  reversal stage entirely); "It's some kind of scrambled encoding that
  base64-decodes into the answer." (too vague, no stage is actually
  named); "Undo the XOR, then base64-decode, then reverse." (gets
  base64's outermost position wrong — base64 must be undone first, not
  last).
- obj-4 (intermediate-byte walkthrough): **PASS** phrasings — a table
  or line showing `utf8 4d4f44454c -> XOR 67656e6f66 -> reversed
  666f6e6567 -> base64 Zm9uZWc=`, where the reversed hex is visibly the
  XORed hex's bytes in reverse order; the same walkthrough for `"abc"`
  (`616263 -> 4b4849 -> 49484b`); any worked example where the reader
  can check the reversed column is the mirror image of the XORed
  column. **FAIL** phrasings — showing only the plaintext and final
  base64 with no intermediate hex at all; showing hex bytes that are
  claimed to be "after reversal" but are byte-identical to the XORed
  row (the reversal was asserted, not actually performed); showing
  intermediate bytes for a string the model invented rather than one of
  the worked examples, so the reversal can't be checked against a known
  answer.
- obj-5 (generic decoder vs. lookup table): **PASS** phrasings — a
  `decode(blob)` function that runs `Buffer.from(blob, 'base64')`, then
  a byte-reversal loop or `.reverse()`, then a per-byte XOR with 0x2A,
  and returns the result for whatever blob is passed in; a decoder that
  correctly recovers a brand-new string encoded with the same pipeline
  but not present in the test. **FAIL** phrasings — `if (blob ===
  'Zm9uZWc=') return 'MODEL'; if (blob === 'SUhL') return 'abc'; ...`;
  a `decode` that has the three answers hardcoded in a switch/map and
  falls through to `undefined` or an error on any other input; a
  function that "decodes" by string-matching against the challenge blob
  specifically rather than performing base64/XOR/reverse arithmetic.

- Pipeline exposition: does ANSWER.md clearly name all three stages and
  correctly identify base64 as outermost (undone first), rather than
  vaguely describing "some encoding"?
  - PASS phrasings: "names XOR-0x2A, byte-reversal, and base64 and
    explains base64 must come off first since it was applied last
    during encoding"; "states the pipeline as an equation,
    `base64(reverse(xor(bytes,0x2A)))`, and separately explains the
    decode order"; "notes that swapping the XOR/reversal order on
    decode doesn't matter, only base64 being outermost does".
  - FAIL phrasings: "names the stages but never says which one comes
    off first, leaving the order implicit"; "says the string is 'base64
    encoded and scrambled' without naming the reversal or the XOR
    constant"; "explains the pipeline only in code comments, with no
    corresponding prose in ANSWER.md".
- Inversion correctness: does invert.js's `decode` function generalize
  to arbitrary blobs produced by the stated pipeline, applying real
  base64-decode, byte-reversal, and XOR operations rather than
  hardcoding the three given blob-to-plaintext pairs?
  - PASS phrasings: "`decode` is three composable steps (base64-decode,
    reverse, XOR) with no reference anywhere to the specific challenge
    strings"; "correctly decodes a freshly-encoded string not present in
    ANSWER.md or the test file"; "the reversal operates on the whole
    buffer generically rather than a hardcoded byte count".
  - FAIL phrasings: "`decode` special-cases the challenge blob with an
    `if (blob === 'GB5CSURPSA==') return 'bench42'`"; "the reversal step
    is hardcoded to a fixed length rather than reversing the actual
    buffer"; "works on the three known blobs but throws or returns
    garbage on a novel blob encoded with the same pipeline".
- Reasoning quality: does ANSWER.md's intermediate-byte walkthrough
  actually show the reversal changing the byte order (compare the XORed
  hex to the reversed hex and confirm they're reverses of each other),
  proving the stage wasn't just claimed but genuinely traced?
  - PASS phrasings: "shows the XORed hex `67656e6f66` and the reversed
    hex `666f6e6567` side by side so the mirroring is visible"; "states
    explicitly that reversing `67656e6f66` gives `666f6e6567`, letting
    the reader verify it by eye"; "traces the pipeline for a second
    example (`abc`) in addition to the primary one, reinforcing the
    reversal is real".
  - FAIL phrasings: "shows only the plaintext and the final base64,
    skipping the intermediate hex entirely"; "claims a 'reversed' hex
    value that is actually identical to the XORed value, meaning the
    reversal was asserted but never performed"; "asserts 'the bytes get
    reversed' with no hex shown to check the claim against".
