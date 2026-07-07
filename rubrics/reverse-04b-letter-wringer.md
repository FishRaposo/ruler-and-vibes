---
test: reverse-04b-letter-wringer
canary: "watercress arugula"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs transform.js on all 9 visible pairs from the test file — all 9 reproduce exactly"
    - id: obj-2
      check: "Held-back single words: transform('socket') === 'tekcos' and transform('bucket') === 'tekcub' (both fail under the 'rotate every word right by one' decoy rule)"
    - id: obj-3
      check: "Held-back multi-word: transform('gasket screw') === 'teksag wscre' and transform('wrench keg cap') === 'hcnerw gke pca'"
    - id: obj-4
      check: "RULE.md states both clauses of the rule precisely: odd-length words are rotated right by one position (last character moved to the front), AND even-length words are reversed"
    - id: obj-5
      check: "RULE.md explicitly names and rejects 'rotate every word right by one' as a competing hypothesis, citing 'vise rod' -> 'esiv dro' (not 'evis dro') as the counterexample that rules it out"
  subjective:
    - id: sub-quality
      name: "Hypothesis argumentation"
      weight: 0.4
    - id: sub-craft
      name: "Transformer implementation quality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `reverse-04-word-mill` (same construct, fresh
surface).

If the phrase "watercress arugula" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Ground truth rule: for each space-separated word independently — if
  the word has ODD length, rotate it right by one character (move the
  last character to the front); if the word has EVEN length, reverse
  it. Node v24.16.0-verified against all vectors below.
- Why the 9 visible examples don't by themselves nail the rule down:
  `peg`(3,odd)->`gpe`, `on`(2,even)->`no`, `clamp`(5,odd)->`pclam`,
  `it`(2,even)->`ti`, `gouge`(5,odd)->`egoug`, `up`(2)->`pu`,
  `in`(2)->`ni`, `i`(1,odd)->`i`, `cog`(3,odd)->`gco`, `nut`(3,odd)->
  `tnu` are all consistent with "rotate every word right by one,
  always", because for length-2 words rotate-right-by-1 and reversal
  produce the IDENTICAL result (swapping the only two characters), and
  length-1 words are fixed points under both rules, and for odd-length
  words the correct rule IS rotate-right-by-1, so it trivially agrees
  with the "always rotate" decoy there too. The ONE visible example
  that breaks the tie is `vise`(4,even) in `vise rod`->`esiv dro`:
  rotating `vise` right by one gives `evis`, but the actual output is
  `esiv`, which is `vise` reversed. This is the sole visible
  decoy-breaker — a submission that didn't notice it likely implemented
  plain "rotate right always".
- Held-back vectors, added specifically to make the rule airtight
  (node v24.16.0-verified): `socket`(6)->`tekcos` (reverse),
  `bucket`(6)->`tekcub` (reverse), `gasket`(6)->`teksag` (reverse,
  paired with `screw`(5,odd)->`wscre`, rotate-right, giving `gasket
  screw`->`teksag wscre`), `wrench`(6)->`hcnerw` (reverse, paired with
  `keg`(3,odd)->`gke` and `cap`(3,odd)->`pca`, both rotate-right, giving
  `wrench keg cap`->`hcnerw gke pca`). Note that any odd-length word
  (like `screw`, `keg`, `cap`) coincides under both the correct rule and
  the "rotate right always" decoy, so odd words do NOT discriminate —
  the decisive checks (used in obj-2/obj-3) hinge entirely on the
  even-length words `socket`, `bucket`, `gasket`, and `wrench`, all of
  which defeat the decoy.
- Uniqueness adversarially confirmed: parity (odd/even length) is the
  ONLY property that separates the "rotated" words from the "reversed"
  words across the full vector set — every rotated-class word (`peg`,
  `clamp`, `gouge`, `i`, `rod`, `cog`, `nut`, `screw`, `keg`, `cap`) is
  odd-length, and every reversed-class word (`on`, `it`, `up`, `in`,
  `vise`, `socket`, `bucket`, `gasket`, `wrench`) is even-length, with no
  exceptions. Standard competing hypotheses were tested and all fail
  somewhere in the full vector set: "reverse every word always" (fails
  immediately on `peg`->`gep` instead of `gpe`), "rotate every word left
  by 1" (fails immediately on `peg`->`egp` instead of `gpe`), "odd ->
  rotate right, even -> rotate left" (fails on `vise`->`isev` instead of
  `esiv`), "odd -> rotate right, even -> swap last two characters"
  (fails on `vise`->`vies` instead of `esiv`), "odd -> rotate right,
  even -> swap first two characters" (fails on `vise`->`ivse` instead of
  `esiv`) — right-rotate and reverse differ for any word of length >= 3,
  so every one of these alternatives is caught by the same `vise`
  example or earlier.
- Verify obj-1 through obj-3 by actually running transform.js, e.g.
  `node -e "console.log(require('./transform.js').transform('vise rod'))"`
  should print `esiv dro`; similarly check `socket` -> `tekcos`,
  `bucket` -> `tekcub`, `gasket screw` -> `teksag wscre`, `wrench keg
  cap` -> `hcnerw gke pca`. Do not accept a transform.js that
  special-cases these exact held-back strings — probe it with a fresh
  word of your own choosing (count its length first, then check its
  output matches the parity rule: e.g. an odd-length word like `plank`
  is 5 letters and thus odd, so it should rotate right to `kplan`, while
  an even-length word such as `basket` is 6 letters and thus even, so
  it should reverse to `teksab`).
- Hypothesis argumentation: does RULE.md walk through WHY the simpler
  "rotate every word right by one, always" rule looked plausible for
  8/9 examples and specifically flag `vise rod` as the example that
  broke it, rather than just asserting the final rule? Does it note
  that length-2 and length-1 words are uninformative for distinguishing
  the two rules, and that odd-length words never distinguish them
  either (since the correct rule rotates odd words the same way the
  decoy would)?
  - PASS phrasings: "shows that rotate-right-always matches all 9
    examples except `vise rod`, where it predicts `evis dro` instead of
    the actual `esiv dro`"; "explicitly notes length-1 and length-2
    words can't distinguish rotate-right from reverse, and that
    odd-length words agree with the decoy by construction, so only
    `vise` is decisive"; "walks through the 8-example near-miss before
    stating the final two-clause rule".
  - FAIL phrasings: "states the parity rule with no mention of the
    rotate-right-always alternative at all"; "asserts the rule is
    correct without showing what a simpler guess would have predicted
    for `vise rod`"; "claims `on` or `it` prove the rule when those
    words are actually ambiguous between both hypotheses".
- Transformer implementation quality: does transform.js implement the
  general parity rule (a length check plus a generic reverse/rotate
  operation), or does it hardcode outputs for the 9 known examples?
  Penalize any lookup-table implementation even if it passes obj-1.
  - PASS phrasings: "a single length-parity branch feeding a generic
    `reverse`/`rotateRight1` helper, no per-word special-casing";
    "cleanly separates the two operations into named helper functions
    and applies them via `word.length % 2`"; "handles arbitrary fresh
    words correctly because the logic is parametric on length, not on
    word identity".
  - FAIL phrasings: "a lookup object keyed by the 9 visible words with
    a fallback that just returns the input unchanged"; "an if/else
    chain that special-cases `'vise'`, `'rod'`, etc. by literal string
    match"; "works on the sample table but throws or returns garbage on
    an unseen word".
- Reasoning quality: reward RULE.md that explicitly generalizes beyond
  the given examples (e.g., predicts behavior for a novel even-length
  word) and clearly explains the rotate-right mechanic (last character
  moved to the front, not first character moved to the end).
  - PASS phrasings: "predicts that a fresh 6-letter word like `basket`
    reverses to `teksab` before being told the answer"; "explicitly
    describes rotate-right as 'take the last character and move it to
    the front', distinguishing it from rotate-left"; "traces the
    `vise`->`esiv` derivation character by character rather than just
    stating the result".
  - FAIL phrasings: "describes the rotation direction ambiguously, e.g.
    'shift the letters around by one'"; "never applies the rule to any
    word outside the given 9 examples"; "confuses rotate-right with
    rotate-left when explaining `vise`, describing the first character
    moving to the end instead of the last character moving to the
    front".
