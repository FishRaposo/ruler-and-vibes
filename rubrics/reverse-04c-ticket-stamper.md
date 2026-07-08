---
test: reverse-04c-ticket-stamper
canary: "endive radicchio"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs transform.js on all 9 visible pairs from the test file — all 9 reproduce exactly"
    - id: obj-2
      check: "Held-back single words: transform('spring') === 'gnirps' and transform('anchor') === 'rohcna' (both fail under the 'rotate every word right by one' decoy rule)"
    - id: obj-3
      check: "Held-back multi-word: transform('handle rivet') === 'eldnah trive' and transform('coil screw hinge') === 'lioc wscre ehing'"
    - id: obj-4
      check: "RULE.md states both clauses of the rule precisely: odd-length words are rotated right by one position (last character moved to the front), AND even-length words are reversed"
    - id: obj-5
      check: "RULE.md explicitly names and rejects 'rotate every word right by one' as a competing hypothesis, citing 'gear peg' -> 'raeg gpe' (not 'rgea gpe') as the counterexample that rules it out"
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

Parallel form of `reverse-04-word-mill` (same construct, fresh surface).

If the phrase "endive radicchio" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Ground truth rule: for each space-separated word independently — if
  the word has ODD length, rotate it right by one character (move the
  last character to the front); if the word has EVEN length, reverse it.
  Node v24.16.0-verified against all vectors below.
- Why the 9 visible examples don't by themselves nail the rule down:
  `cog`(3,odd)->`gco`, `in`(2,even)->`ni`, `latch`(5,odd)->`hlatc`,
  `up`(2,even)->`pu`, `crank`(5,odd)->`kcran`, `on`(2)->`no`,
  `if`(2)->`fi`, `i`(1,odd)->`i`, `peg`(3,odd, inside `gear peg`)->`gpe`,
  `rod`(3,odd)->`dro`, `nut`(3,odd)->`tnu` are all consistent with
  "rotate every word right by one", because for length-2 words rotating
  right by one and reversing produce the IDENTICAL result (swapping the
  only two characters), and length-1 words are fixed points under both
  rules. The ONE visible example that breaks the tie is `gear`(4,even)
  in `gear peg`->`raeg gpe`: rotating `gear` right by one gives `rgea`,
  but the actual output is `raeg`, which is `gear` reversed. This is the
  sole visible decoy-breaker — a submission that didn't notice it likely
  implemented plain rotate-right-always.
- Held-back vectors, added specifically to make the rule airtight (node
  v24.16.0-verified): `spring`(6)->`gnirps` (reverse; rotate-right would
  give `gsprin`), `anchor`(6)->`rohcna` (reverse; rotate-right would give
  `rancho`), `handle rivet`->`eldnah trive` (`handle`(6) even->reverse
  `eldnah`; `rivet`(5) odd->rotate-right `trive`), `coil screw hinge`->
  `lioc wscre ehing` (`coil`(4) even->reverse `lioc`; `screw`(5)
  odd->rotate-right `wscre`; `hinge`(5) odd->rotate-right `ehing`). Two
  additional held-back words illustrate the near-miss without
  discriminating: `am`(2)->`ma` (ambiguous between the two rules, like
  all length-2 words) and `keg`(3)->`gke` (coincides under both the
  correct rule and the "rotate every word right by one" decoy, since
  `keg` is odd and both rules agree on odd words) — so they do NOT
  discriminate; the decisive held-back checks (used in obj-2/obj-3) are
  `spring`, `anchor`, `handle rivet`, and `coil screw hinge`, all of
  which defeat the decoy.
- Uniqueness adversarially confirmed: parity (odd/even length) is the
  ONLY property that separates the "rotated" words from the "reversed"
  words across the full vector set — every rotated-class word (`cog`,
  `latch`, `crank`, `i`, `peg`, `rod`, `nut`, `rivet`, `screw`, `hinge`)
  is odd-length, and every reversed-class word (`in`, `up`, `on`, `if`,
  `gear`, `spring`, `anchor`, `handle`, `coil`) is even-length, with no
  exceptions. Standard competing hypotheses were tested and all fail
  somewhere in the full vector set: "always reverse" (fails on
  `cog`->`goc` instead of `gco` — caught by the very first visible
  example), "always rotate left" (fails on `cog`->`ogc` instead of
  `gco`), "even -> rotate left by 1, odd -> rotate right by 1" (fails on
  `gear`->`earg` instead of `raeg`), "even -> swap last two characters,
  odd -> rotate right by 1" (fails on `gear`->`gera` instead of `raeg`),
  "even -> rotate right by 1, odd -> reverse" i.e. the parity assignment
  swapped (fails on `cog`->`goc` instead of `gco`, same failure as
  "always reverse" for odd words).
- A hardcoded lookup table for the 9 visible examples plus a "reverse
  everything else" fallback will pass obj-1 and, coincidentally, obj-2
  (since the fallback happens to match the correct even-length rule) —
  but it fails obj-3, because `rivet`, `screw`, and `hinge` are
  odd-length and a blind reverse-fallback gets them wrong (e.g. `rivet`
  reversed is `tevir`, not the correct `trive`). This is exactly why
  obj-3 mixes both parities in a single check: don't let a submission
  pass on obj-1/obj-2 alone convince you the rule generalizes — confirm
  obj-3 too.
- Verify obj-1 through obj-3 by actually running transform.js, e.g.
  `node -e "console.log(require('./transform.js').transform('gear peg'))"`
  should print `raeg gpe`; similarly check `spring` -> `gnirps`,
  `anchor` -> `rohcna`, `handle rivet` -> `eldnah trive`, `coil screw
  hinge` -> `lioc wscre ehing`. Do not accept a transform.js that
  special-cases these exact held-back strings — probe it with a fresh
  word of your own choosing (count its length first, then check its
  output matches the parity rule: e.g. `lever`(5,odd) should rotate
  right to `rleve`, while `crate`(5,odd) rotates right to `ecrat`; a
  genuinely even-length fresh word such as `basket`(6,even) should
  reverse to `teksab`).
- Hypothesis argumentation: does RULE.md walk through WHY the simpler
  "rotate everything right by one" rule looked plausible for 8/9
  examples and specifically flag `gear peg` as the example that broke
  it, rather than just asserting the final rule? Does it note that
  length-2 and length-1 words are uninformative for distinguishing the
  two rules?
  - PASS phrasings: "notes that `cog`, `latch`, `crank`, `peg`, `rod`,
    `nut` are all odd-length so rotate-right and the final rule agree
    trivially, and that `in`, `up`, `on`, `if` are length-2 so
    rotate-right and reverse coincide there too — only `gear` (even,
    length 4) forces a choice, and it points to reverse"; "walks through
    why 'always rotate-right' fits 8 of 9 rows and names `gear peg` as
    the row that breaks it"; "explicitly says length-1 and length-2
    words can't distinguish rotate-right from reverse".
  - FAIL phrasings: "just states the final rule with no discussion of
    why a simpler rule looked plausible"; "mentions `gear` only as one
    example among many with no explanation of why it matters"; "never
    says which examples are ambiguous versus decisive".
- Transformer implementation quality: does transform.js implement the
  general parity rule (a length check plus a generic reverse/rotate
  operation), or does it hardcode outputs for the 9 known examples?
  Penalize any lookup-table implementation even if it passes obj-1.
  - PASS phrasings: "computes `s.length % 2` and branches into a generic
    reverse (`split('').reverse().join('')`) or a generic rotate-right
    (moving the last character to the front) with no reference to
    specific words"; "one small function handles any word of any
    length, visible or not"; "no hardcoded example strings anywhere in
    transform.js".
  - FAIL phrasings: "a switch/if-else keyed on the literal known input
    words"; "a lookup object mapping known inputs to known outputs";
    "works for the given examples but throws or returns garbage on an
    unseen word".
- Reasoning quality: reward RULE.md that explicitly generalizes beyond
  the given examples (e.g., predicts behavior for a novel word of each
  parity) and clearly explains the rotate-right mechanic (last character
  moved to the front, not first character moved to the end).
  - PASS phrasings: "predicts that a fresh odd-length word like `plank`
    would rotate right to `kplan`, and a fresh even-length word like
    `basket` would reverse to `teksab`, before being told the answer";
    "explicitly says the LAST character moves to the FRONT, contrasting
    it with rotate-left"; "walks through the parity rule generalizing to
    arbitrary lengths, not just the given examples".
  - FAIL phrasings: "only restates the 9 given examples with no
    generalization"; "describes the rotate as 'shifting characters'
    without saying which character moves where"; "confuses rotate-right
    with rotate-left in the written description".
