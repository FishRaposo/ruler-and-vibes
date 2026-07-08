---
test: reverse-04-word-mill
canary: "persimmon unicycle picnic"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs transform.js on all 9 visible pairs from the test file — all 9 reproduce exactly"
    - id: obj-2
      check: "Held-back single words: transform('window') === 'indoww' and transform('planet') === 'lanetp' (both fail under the 'reverse every word' decoy rule)"
    - id: obj-3
      check: "Held-back multi-word: transform('torch gate') === 'hcrot ateg' and transform('grid map hut') === 'ridg pam tuh'"
    - id: obj-4
      check: "RULE.md states both clauses of the rule precisely: odd-length words are reversed, AND even-length words are rotated left by one position (first character moved to the end)"
    - id: obj-5
      check: "RULE.md explicitly names and rejects 'reverse every word' as a competing hypothesis, citing 'drum sky' -> 'rumd yks' (not 'murd yks') as the counterexample that rules it out"
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

If the phrase "persimmon unicycle picnic" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Ground truth rule: for each space-separated word independently — if
  the word has ODD length, reverse it; if the word has EVEN length,
  rotate it left by one character (move the first character to the
  end). Node v24.16.0-verified against all vectors below.
- Why the 9 visible examples don't by themselves nail the rule down:
  `cat`(3,odd)->`tac`, `hi`(2,even)->`ih`, `lemon`(5,odd)->`nomel`,
  `at`(2,even)->`ta`, `stone`(5,odd)->`enots`, `we`(2)->`ew`,
  `go`(2)->`og`, `a`(1,odd)->`a`, `red`(3,odd)->`der`,
  `fox`(3,odd)->`xof` are all consistent with "reverse every word",
  because for length-2 words reversal and left-rotate-by-1 produce the
  IDENTICAL result (swapping the only two characters), and length-1
  words are fixed points under both rules. The ONE visible example
  that breaks the tie is `drum`(4,even) in `drum sky`->`rumd yks`:
  reversing `drum` gives `murd`, but the actual output is `rumd`, which
  is `drum` rotated left by one (`d` moved to the end: `rum`+`d`). This
  is the sole visible decoy-breaker — a submission that didn't notice
  it likely implemented plain reversal.
- Held-back vectors, added specifically to make the rule airtight
  (node v24.16.0-verified): `window`(6)->`indoww` (rotate: `indow`+`w`),
  `planet`(6)->`lanetp` (rotate: `lanet`+`p`), `maple`(5)->`elpam`
  (reverse — coincides with what "reverse every word" would also give),
  `torch gate`->`hcrot ateg` (`torch` odd->reverse `hcrot`; `gate`(4)
  even->rotate `ateg`), `no`(2)->`on` (ambiguous between the two rules,
  like all length-2 words), `grid map hut`->`ridg pam tuh` (`grid`(4)
  even->rotate `ridg`; `map`(3) odd->reverse `pam`; `hut`(3) odd->
  reverse `tuh`). Note `maple` and `no` coincide under both the correct
  rule and the "reverse every word" decoy, so they do NOT discriminate
  — the decisive held-back checks (used in obj-2/obj-3) are `window`,
  `planet`, `torch gate`, and `grid map hut`, all of which defeat the
  decoy.
- Uniqueness adversarially confirmed: parity (odd/even length) is the
  ONLY property that separates the "reversed" words from the
  "rotated" words across the full vector set — every rotated-class
  word (`hi`, `at`, `we`, `go`, `drum`, `window`, `planet`, `no`,
  `grid`, `gate`, `map`... wait, `map`/`hut` are odd-length and thus
  reverse-class) is even-length, and every reverse-class word is
  odd-length, with no exceptions. Standard competing hypotheses were
  tested and all fail somewhere in the full vector set: "rotate every
  word left by 1" (fails on `cat`->`atc` instead of `tac`), "reverse
  every word" (fails on `drum sky`, `window`, `planet`, `torch gate`,
  `grid map hut`), "rotate right by 1 always" (fails broadly), "even ->
  rotate right by 1" (fails on `drum`, `window`, `planet`, `torch
  gate`, `grid map hut` — right-rotate and left-rotate differ for any
  word of length >= 3), "even -> swap first two characters" (fails on
  the same even-length words for length >= 3, since swap-first-two only
  coincides with rotate-left-1 at length 2).
- Verify obj-1 through obj-3 by actually running transform.js, e.g.
  `node -e "console.log(require('./transform.js').transform('drum sky'))"`
  should print `rumd yks`; similarly check `window` -> `indoww`,
  `planet` -> `lanetp`, `torch gate` -> `hcrot ateg`, `grid map hut` ->
  `ridg pam tuh`. Do not accept a transform.js that special-cases these
  exact held-back strings — probe it with a fresh word of your own
  choosing (count its length first, then check its output matches the
  parity rule: e.g. an even-length word like `cabin` is 5 letters and
  thus odd, so pick carefully — `plank`(5,odd) should reverse to
  `knalp`, while `bloom`(5,odd) reverses to `moolb`; a genuinely
  even-length fresh word such as `basket`(6,even) should rotate left
  to `asketb`).
- Hypothesis argumentation: does RULE.md walk through WHY the simpler
  "reverse everything" rule looked plausible for 8/9 examples and
  specifically flag `drum sky` as the example that broke it, rather
  than just asserting the final rule? Does it note that length-2 and
  length-1 words are uninformative for distinguishing the two rules?
- Transformer implementation quality: does transform.js implement the
  general parity rule (a length check plus a generic reverse/rotate
  operation), or does it hardcode outputs for the 9 known examples?
  Penalize any lookup-table implementation even if it passes obj-1.
- Reasoning quality: reward RULE.md that explicitly generalizes beyond
  the given examples (e.g., predicts behavior for a novel even-length
  word) and clearly explains the rotate-left mechanic (first character
  moved to the end, not last character moved to the front).
