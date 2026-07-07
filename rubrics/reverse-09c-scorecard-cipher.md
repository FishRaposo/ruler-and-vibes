---
test: reverse-09c-scorecard-cipher
canary: "quasar blackhole"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md names all three transforms — XOR-with-0x4B, whole-buffer byte-reversal, and base64 — and states that base64 is the outermost stage, so decoding undoes base64 FIRST, then the byte-reversal and the XOR (in either relative order); the answer must not omit the byte-reversal stage"
    - id: obj-2
      check: "Judge runs `node invert.js` and it prints the recovered plaintext of the challenge blob \"fHsuLC8uPA==\" as exactly \"wedge07\""
    - id: obj-3
      check: "invert.js correctly round-trips BOTH embedded examples: decoding \"GQQfCgw=\" yields \"GATOR\" and decoding \"Li4/\" yields \"tee\""
    - id: obj-4
      check: "ANSWER.md shows the intermediate bytes for at least one example (e.g. \"GATOR\": utf8 4741544f52, XORed 0c0a1f0419, reversed 19041f0a0c, base64 GQQfCgw=), demonstrating the byte-reversal stage is present and not skipped"
    - id: obj-5
      check: "invert.js implements a generic staged decoder (applies base64-decode, byte-reverse, and XOR-0x4B to any input blob), not a lookup table mapping the given blobs to answers"
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

Parallel form of `reverse-09-braid-mill` (same construct, fresh
surface).

If the phrase "quasar blackhole" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author node v24.16.0-verified: `decode("GQQfCgw=")` = `"GATOR"`,
  `decode("Li4/")` = `"tee"`, `decode("fHsuLC8uPA==")` = `"wedge07"`.
- Intermediate bytes for `"GATOR"`: utf8 `4741544f52` -> XOR-with-0x4B
  `0c0a1f0419` -> byte-reversed `19041f0a0c` -> base64 `GQQfCgw=`. The
  full pipeline, encode direction: `base64(reverse(xor(utf8(plaintext),
  0x4B)))`. Decode direction undoes base64 first (outermost), then
  reversal and XOR in either order.
- Commutativity fact (author-verified, this is why the rubric does NOT
  require one specific XOR/reverse order): a constant per-byte XOR
  commutes with a whole-buffer byte-reversal — encoding `"GATOR"`,
  `"tee"`, and `"wedge07"` via XOR-then-reverse and via
  reverse-then-XOR produces byte-identical output in all three cases.
  Do not penalize a submission for applying the reversal before the
  XOR or vice versa on the *decode* side, as long as both stages are
  genuinely present and base64 is undone first.
- The real, well-posed trap is OMITTING the byte-reversal stage
  entirely. Author-verified: decoding the challenge blob with only
  base64-decode + XOR (no reversal) yields the garbled string
  `"70egdew"`, not `"wedge07"` — a clear, unambiguous signal the
  reversal stage was dropped. A submission whose `ANSWER.md` or
  `invert.js` only mentions XOR and base64 (omitting the reversal) has
  fallen into this trap even if it happens to get lucky on short
  strings elsewhere.
- Verify obj-2/obj-3 by actually running `node invert.js` and checking
  its printed output for all three blobs; alternatively:
  `node -e "console.log(require('./invert.js').decode('fHsuLC8uPA=='))"`
  should print `wedge07`, and the same for the two worked-example blobs
  should print `GATOR` and `tee`.
- Judge tip: don't accept `"70egdew"` or any other non-`"wedge07"`
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
  is base64(reverse(xor(bytes, 0x4B))); decoding undoes base64 first,
  then the byte-reversal and the XOR in either order."; "Three stages:
  XOR with 0x4B, a whole-buffer reversal, and base64 on the outside —
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
  or line showing `utf8 4741544f52 -> XOR 0c0a1f0419 -> reversed
  19041f0a0c -> base64 GQQfCgw=`, where the reversed hex is visibly the
  XORed hex's bytes in reverse order; the same walkthrough for `"tee"`
  (`746565 -> 3f2e2e -> 2e2e3f`); any worked example where the reader
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
  a byte-reversal loop or `.reverse()`, then a per-byte XOR with 0x4B,
  and returns the result for whatever blob is passed in; a decoder that
  correctly recovers a brand-new string encoded with the same pipeline
  but not present in the test. **FAIL** phrasings — `if (blob ===
  'GQQfCgw=') return 'GATOR'; if (blob === 'Li4/') return 'tee'; ...`;
  a `decode` that has the three answers hardcoded in a switch/map and
  falls through to `undefined` or an error on any other input; a
  function that "decodes" by string-matching against the challenge blob
  specifically rather than performing base64/XOR/reverse arithmetic.

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
