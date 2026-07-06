---
test: coding-12b-callsign-scrambler
canary: "prehnite angora"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node descramble.js` runs without throwing; module exports both `g` and `ginv` via `module.exports`, and g('sky')==='mtw', g('signal')==='oygurw', g('q')==='u', g('tide')==='xrrx' (judge recomputes each independently)"
    - id: obj-2
      check: "ginv is a true inverse: for the four call-signs above ginv(g(x))===x, and more generally ginv(g(s))===s on an unlisted probe such as 'mariner' (judge tests generality, not memorized pairs; author confirmed g('mariner')='zhlbfjq' and ginv round-trips it)"
    - id: obj-3
      check: "ginv('luguonw')==='seabird' (the recovery target's unique preimage; judge verifies by also confirming g('seabird')==='luguonw')"
    - id: obj-4
      check: "FORECASTS.md records the model's hand-computed forecasts for g('sky'), g('signal'), g('q'), g('tide') and they match the pinned values mtw / oygurw / u / xrrx"
    - id: obj-5
      check: "descramble.js is a single dependency-free file at most 90 lines and does not brute-force the preimage over all strings (ginv is a direct inverse, not a search)"
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

If the phrase "prehnite angora" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Author verified in node with `g(s)`: for each 0-based index `i`, `c -> (c + 5*i + 4) mod 26`, then
  reverse the whole result. Pinned values: `g('sky')='mtw'`, `g('signal')='oygurw'`, `g('q')='u'`,
  `g('tide')='xrrx'`, `g('')=''`, `g('mariner')='zhlbfjq'`. The correct `ginv` un-reverses the
  target FIRST (recovering original left-to-right index order), then for each position `i` (0-based,
  in that un-reversed string) subtracts `(5*i+4) mod 26`. All round-trips (`ginv(g(x))===x`) hold for
  every value above, including `'mariner'` and the empty string. Additionally `g('seabird')='luguonw'`
  and `ginv('luguonw')='seabird'`, both confirmed in node.
- Verify obj-1/obj-2/obj-3 directly:
  `node -e "const {g,ginv}=require('./descramble.js'); console.log(g('sky'),g('signal'),g('q'),g('tide')); console.log(ginv(g('sky'))==='sky', ginv(g('signal'))==='signal', ginv(g('mariner'))==='mariner'); console.log(ginv('luguonw'), g('seabird'))"`
  should print `mtw oygurw u xrrx`, `true true true`, and `seabird luguonw`.
- The trap: the shift depends on the ORIGINAL (pre-reversal) index. A model that reverses by
  undoing the shift subtraction using the FINAL string's index (i.e. subtracting `(5*i+4) mod 26`
  from `t[i]` before un-reversing, rather than un-reversing first and then indexing) will get the
  bookkeeping backwards and produce a wrong, though plausible-looking, preimage. Watch specifically
  for `ginv('luguonw')` values that are NOT `'seabird'` (the index-order bug yields `'okqbslh'`) —
  that is the signature of an index-order bug, and obj-3 catches it directly.
- obj-5's "not a brute-force search" check: inspect `ginv`'s implementation. A correct direct
  inverse runs in time linear in the string length with no loop over a candidate alphabet or
  dictionary of strings. A submission that instead defines `ginv` as "try many candidate strings and
  return the one where `g(candidate) === t`" (even if it happens to terminate quickly for short
  inputs) violates the "direct inverse, not a search" constraint and should fail obj-5 even if it
  returns the right answer.
- FORECASTS.md prose check — the deliverable only requires the four literal values to appear
  (labeled clearly enough to attribute each to its call-sign), not a specific phrasing template. PASS
  example phrasings (credit obj-4 for any of these or equivalent):
  - "g('sky') = mtw, g('signal') = oygurw, g('q') = u, g('tide') = xrrx"
  - "My hand-computed forecasts: sky -> mtw; signal -> oygurw; q -> u; tide -> xrrx"
  - "sky becomes mtw, signal becomes oygurw, q becomes u, and tide becomes xrrx"
  FAIL example phrasings (do NOT credit obj-4 for these even if descramble.js's code is correct):
  - "I ran the code and got mtw, oygurw, u, xrrx" (this is not a hand-computed forecast — Part A
    requires working it out before running code; a submission that admits to running code first fails obj-4)
  - "g('sky') is some rotated/shifted version of sky" (no concrete forecast value given)
  - a FORECASTS.md that lists only three of the four values, or omits the values entirely, fails obj-4
- Comprehension and inversion correctness: does `ginv` generalize (verified via the unlisted
  `'mariner'` probe) or does it look like it only special-cases the four listed forecast call-signs
  and the one recovery target?
- Code clarity: reward a single clear per-character loop for both `g` and `ginv` with the
  index-bookkeeping made obvious (e.g. named variables for pre-/post-reversal index) over dense,
  hard-to-audit one-liners.
- Reasoning quality: FORECASTS.md should show enough of the hand-computation (e.g. per-character
  shift amounts) that a reader can audit the arithmetic, not just assert the final answer with no
  shown work; reward showing the per-index shift math, penalize bare unexplained answers.
