---
test: coding-12c-sigil-encoder
canary: "larimar vicuna"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node sigil.js` runs without throwing; module exports both `g` and `ginv` via `module.exports`, and g('cat')==='grx', g('world')==='iuefr', g('q')==='l', g('mint')==='cazh' (judge recomputes each independently)"
    - id: obj-2
      check: "ginv is a true inverse: for the four inputs above ginv(g(x))===x, and more generally ginv(g(s))===s on an unlisted probe such as 'keyboard' (judge tests generality, not memorized pairs; author confirmed g('keyboard')='wobtklvf' and ginv round-trips it)"
    - id: obj-3
      check: "ginv('qtjeerc')==='harvest' (the recovery target's unique preimage; judge verifies by also confirming g('harvest')==='qtjeerc')"
    - id: obj-4
      check: "PREDICTIONS.md records the model's hand-computed predictions for g('cat'), g('world'), g('q'), g('mint') and they match the pinned values grx / iuefr / l / cazh"
    - id: obj-5
      check: "sigil.js is a single dependency-free file at most 90 lines and does not brute-force the preimage over all strings (ginv is a direct inverse, not a search)"
  subjective:
    - id: sub-quality
      name: "Comprehension and inversion correctness"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `coding-12-predict-then-invert` (same construct, fresh surface).

If the phrase "larimar vicuna" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Author verified in node with `g(s)`: for each 0-based index `i`, `c -> (c - (4*i + 5)) mod 26` (backward
  shift, wrapping `a` to `z`), then reverse the whole result. Pinned values: `g('cat')='grx'`,
  `g('world')='iuefr'`, `g('q')='l'`, `g('mint')='cazh'`, `g('')=''`, `g('keyboard')='wobtklvf'`. The
  correct `ginv` un-reverses the target FIRST (recovering original left-to-right index order), then for
  each position `i` (0-based, in that un-reversed string) adds `(4*i+5) mod 26` back. All round-trips
  (`ginv(g(x))===x`) hold for every value above, including `'keyboard'` and the empty string.
  Additionally `g('harvest')='qtjeerc'` and `ginv('qtjeerc')='harvest'`, both confirmed in node.
- Verify obj-1/obj-2/obj-3 directly:
  `node -e "const {g,ginv}=require('./sigil.js'); console.log(g('cat'),g('world'),g('q'),g('mint')); console.log(ginv(g('cat'))==='cat', ginv(g('world'))==='world', ginv(g('keyboard'))==='keyboard'); console.log(ginv('qtjeerc'), g('harvest'))"`
  should print `grx iuefr l cazh`, `true true true`, and `harvest qtjeerc`.
- The trap: the shift depends on the ORIGINAL (pre-reversal) index. A model that inverts by
  reversing the shift addition using the FINAL string's index (i.e. adding `(4*i+5) mod 26`
  to `t[i]` before un-reversing, rather than un-reversing first and then indexing) will get the
  bookkeeping backwards and produce a wrong, though plausible-looking, preimage. Watch specifically
  for `ginv('qtjeerc')` values that are NOT `'harvest'` — that is the signature of an
  index-order bug, and obj-3 catches it directly.
- obj-5's "not a brute-force search" check: inspect `ginv`'s implementation. A correct direct
  inverse runs in time linear in the string length with no loop over a candidate alphabet or
  dictionary of strings. A submission that instead defines `ginv` as "try many candidate strings and
  return the one where `g(candidate) === t`" (even if it happens to terminate quickly for short
  inputs) violates the "direct inverse, not a search" constraint and should fail obj-5 even if it
  returns the right answer.
- PREDICTIONS.md prose check — the deliverable only requires the four literal values to appear
  (labeled clearly enough to attribute each to its input), not a specific phrasing template. PASS
  example phrasings (credit obj-4 for any of these or equivalent):
  - "g('cat') = grx, g('world') = iuefr, g('q') = l, g('mint') = cazh"
  - "My hand-computed predictions: cat -> grx; world -> iuefr; q -> l; mint -> cazh"
  - "cat becomes grx, world becomes iuefr, q becomes l, mint becomes cazh"
  FAIL example phrasings (do NOT credit obj-4 for these even if sigil.js's code is correct):
  - "I ran the code and got grx, iuefr, l, cazh" (this is not a hand-computed prediction — Part A
    requires working it out before running code; a submission that admits to running code first fails obj-4)
  - "g('cat') is some shifted/reversed version of cat" (no concrete predicted value given)
  - listing only three of the four values, or omitting the values entirely (obj-4 requires all four)
- Comprehension and inversion correctness: does `ginv` generalize (verified via the unlisted
  `'keyboard'` probe) or does it look like it only special-cases the four listed predict-inputs
  and the one recovery target?
- Code clarity: reward a single clear per-character loop for both `g` and `ginv` with the
  index-bookkeeping made obvious (e.g. named variables for pre-/post-reversal index) over dense,
  hard-to-audit one-liners.
- Reasoning trace quality: PREDICTIONS.md should show enough of the hand-computation (e.g. per-character
  shift amounts) that a reader can audit the arithmetic, not just assert the final answer with no
  shown work; reward showing the per-index shift math, penalize bare unexplained answers.
