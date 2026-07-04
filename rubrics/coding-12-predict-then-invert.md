---
test: coding-12-predict-then-invert
canary: "cindershore whistle"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node invert.js` runs without throwing; module exports both `f` and `finv` via `module.exports`, and f('abc')==='tld', f('hello')==='tjcok', f('z')==='c', f('code')==='cuyf' (judge recomputes each independently)"
    - id: obj-2
      check: "finv is a true inverse: for the four inputs above finv(f(x))===x, and more generally finv(f(s))===s on an unlisted probe such as 'benchmark' (judge tests generality, not memorized pairs; author confirmed f('benchmark')='rrtymaeoe' and finv round-trips it)"
    - id: obj-3
      check: "finv('rmbckkj')==='gateway' (the recovery target's unique preimage; judge verifies by also confirming f('gateway')==='rmbckkj')"
    - id: obj-4
      check: "PREDICTIONS.md records the model's hand-computed predictions for f('abc'), f('hello'), f('z'), f('code') and they match the pinned values tld / tjcok / c / cuyf"
    - id: obj-5
      check: "invert.js is a single dependency-free file at most 90 lines and does not brute-force the preimage over all strings (finv is a direct inverse, not a search)"
  subjective:
    - id: sub-quality
      name: "Comprehension and inversion correctness"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning trace quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: cindershore whistle.

- Author verified in node with `f(s)`: for each 0-based index `i`, `c -> (c + 7*i + 3) mod 26`, then
  reverse the whole result. Pinned values: `f('abc')='tld'`, `f('hello')='tjcok'`, `f('z')='c'`,
  `f('code')='cuyf'`, `f('')=''`, `f('benchmark')='rrtymaeoe'`. The correct `finv` un-reverses the
  target FIRST (recovering original left-to-right index order), then for each position `i` (0-based,
  in that un-reversed string) subtracts `(7*i+3) mod 26`. All round-trips (`finv(f(x))===x`) hold for
  every value above, including `'benchmark'` and the empty string. Additionally `f('gateway')='rmbckkj'`
  and `finv('rmbckkj')='gateway'`, both confirmed in node.
- Verify obj-1/obj-2/obj-3 directly:
  `node -e "const {f,finv}=require('./invert.js'); console.log(f('abc'),f('hello'),f('z'),f('code')); console.log(finv(f('abc'))==='abc', finv(f('hello'))==='hello', finv(f('benchmark'))==='benchmark'); console.log(finv('rmbckkj'), f('gateway'))"`
  should print `tld tjcok c cuyf`, `true true true`, and `gateway rmbckkj`.
- The trap: the shift depends on the ORIGINAL (pre-reversal) index. A model that inverts by
  reversing the shift subtraction using the FINAL string's index (i.e. subtracting `(7*i+3) mod 26`
  from `t[i]` before un-reversing, rather than un-reversing first and then indexing) will get the
  bookkeeping backwards and produce a wrong, though plausible-looking, preimage. Watch specifically
  for `finv('rmbckkj')` values that are NOT `'gateway'` — that is the signature of an
  index-order bug, and obj-3 catches it directly.
- obj-5's "not a brute-force search" check: inspect `finv`'s implementation. A correct direct
  inverse runs in time linear in the string length with no loop over a candidate alphabet or
  dictionary of strings. A submission that instead defines `finv` as "try many candidate strings and
  return the one where `f(candidate) === t`" (even if it happens to terminate quickly for short
  inputs) violates the "direct inverse, not a search" constraint and should fail obj-5 even if it
  returns the right answer.
- PREDICTIONS.md prose check — the deliverable only requires the four literal values to appear
  (labeled clearly enough to attribute each to its input), not a specific phrasing template. PASS
  example phrasings (credit obj-4 for any of these or equivalent):
  - "f('abc') = tld, f('hello') = tjcok, f('z') = c, f('code') = cuyf"
  - "My hand-computed predictions: abc -> tld; hello -> tjcok; z -> c; code -> cuyf"
  FAIL example phrasings (do NOT credit obj-4 for these even if invert.js's code is correct):
  - "I ran the code and got tld, tjcok, c, cuyf" (this is not a hand-computed prediction — Part A
    requires working it out before running code; a submission that admits to running code first,
    or that only lists three of the four values, or omits values entirely, fails obj-4)
  - "f('abc') is some rotated/shifted version of abc" (no concrete predicted value given)
- Comprehension and inversion correctness: does `finv` generalize (verified via the unlisted
  `'benchmark'` probe) or does it look like it only special-cases the four listed predict-inputs
  and the one recovery target?
- Code clarity: reward a single clear per-character loop for both `f` and `finv` with the
  index-bookkeeping made obvious (e.g. named variables for pre-/post-reversal index) over dense,
  hard-to-audit one-liners.
- Reasoning trace quality: PREDICTIONS.md should show enough of the hand-computation (e.g. per-character
  shift amounts) that a reader can audit the arithmetic, not just assert the final answer with no
  shown work; reward showing the per-index shift math, penalize bare unexplained answers.
