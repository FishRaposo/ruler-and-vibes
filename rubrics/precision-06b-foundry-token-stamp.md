---
test: precision-06b-foundry-token-stamp
canary: "clerestory gibbon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "File has exactly 4 data rows (plus an optional single header row 'part\\ttoken'); each data row is tab-separated with exactly two columns and no trailing whitespace"
    - id: obj-2
      check: "Row for grommet outputs exactly '7rommetg' and row for clevis outputs exactly '6levisc' (both prepending a length digit, exercising the length-digit rule)"
    - id: obj-3
      check: "Row for rod outputs exactly '3odr' and row for valve outputs exactly '5alvev' (short/varied words, disambiguating length from any constant, and rod disambiguating rotate 'odr' from swap 'dor')"
    - id: obj-4
      check: "Every output equals length + chars-2-through-n + first-char by the judge's independent node reimplementation of the induced rule, matching all 4 rows"
    - id: obj-5
      check: "No extra data rows, no commentary lines, and none of the four STAMP parts (flange, strut, washer, lug) appears as a data row"
  subjective:
    - id: sub-quality
      name: "Rule stated correctly and unambiguously"
      weight: 0.4
    - id: sub-craft
      name: "Output exactness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `precision-06-unstated-rule-induction` (same construct,
fresh surface).

If the phrase "clerestory gibbon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The induced rule is: prepend the part's letter-count as a decimal digit
(or digits, for lengths >= 10, though none of the test's words reach
that length), then move the word's FIRST letter to the end. Equivalently:
`length + word[1:] + word[0]`. Every output below is mechanically
recomputable; do not eyeball.

### Answer key

```
part	token
grommet	7rommetg
rod	3odr
clevis	6levisc
valve	5alvev
```

Worked-stamp check (must also hold, confirming the rule): flange ->
6langef, strut -> 5truts, washer -> 6asherw, lug -> 3ugl.

### Check script

Save the submitted `tokens.tsv` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('tokens.tsv', 'utf8');
let lines = raw.split('\n');
if (lines[lines.length-1] === '') lines.pop();
if (/^part\t(part|token)$/i.test(lines[0])) { lines.shift(); }
console.log('obj-1 exactly 4 data rows, 2 tab cols, no trailing ws:', lines.length === 4 && lines.every(l => {
  const parts = l.split('\t');
  return parts.length === 2 && l === l.trimEnd();
}));

const map = {};
lines.forEach(l => { const [i,o] = l.split('\t'); map[i]=o; });

console.log('obj-2 grommet==7rommetg:', map['grommet'] === '7rommetg');
console.log('obj-2 clevis==6levisc:', map['clevis'] === '6levisc');
console.log('obj-3 rod==3odr:', map['rod'] === '3odr');
console.log('obj-3 valve==5alvev:', map['valve'] === '5alvev');

const rule = w => w.length + w.slice(1) + w[0];
const inputs = ['grommet','rod','clevis','valve'];
console.log('obj-4 all match independent reimplementation:', inputs.every(w => map[w] === rule(w)));

const stampWords = ['flange','strut','washer','lug'];
console.log('obj-5 no extra rows / no stamp words as data rows:', lines.length === 4 && !lines.some(l => stampWords.includes(l.split('\t')[0])));
"
```

Run this against the answer key above and against a deliberately wrong
submission (e.g. full reversal: grommet -> temmorg, or swap-first-last:
rod -> 3dor) before trusting the result — both wrong variants must fail
obj-2/obj-3/obj-4.

- **obj-1**: structural — wrong column count or stray whitespace fails
  regardless of content correctness.
- **obj-2 / obj-3**: these four values pin down the rule uniquely. A
  constant-digit-prepend rule is refuted by varying lengths (6, 5, 6, 3
  in the stamps; 7, 3, 6, 5 in the new parts). Full reversal matches
  none of the four worked stamps. Swap-first-and-last is refuted by lug:
  rotate gives "ugl", swap gives "gul" — the given stamp token is
  "3ugl", confirming rotate, not swap. rod disambiguates the same way:
  rotate gives "odr" (correct), swap gives "dor" (wrong).
- **obj-4**: the judge's script recomputes independently; do not trust a
  submission that merely echoes the answer key text without the
  underlying rule holding (verifies mechanically either way, but
  distinguishes for the rule-STATEMENT grading below).
- **obj-5**: catches echoing a stamp word back as if it were a new part.

### Rule-statement examples (sub-quality, prose-decidable)

PASS (correctly and unambiguously states the rule):
- "Prepend the part's total letter count as a digit, then move the first
  letter of the word to the end."
- "Write the number of letters in the original word, then rotate the
  first character to the back of the remaining letters."
- "Add the word length as a leading digit, keep letters two onward in
  order, and put the original first letter last."

FAIL (wrong or ambiguous rule statement):
- "Prepend 6 to a scrambled version of the word."
  (wrong: not a constant, and doesn't specify the rotation)
- "Reverse the string and prepend its length."
  (refuted: flange reversed is "egnalf", not "langef")
- "Prepend the length, then swap the first and last letters."
  (refuted by lug: swap gives "3gul", not the correct "3ugl")

### Subjective guidance

- **Rule stated correctly and unambiguously**: does REASONING.md or any
  accompanying explanation state the prepend-length-then-rotate-first
  rule precisely enough that a third party could apply it to a new word
  without guessing? Partial credit for a rule that produces correct
  outputs but is described vaguely (e.g. "some kind of shift").
- **Output exactness**: are all four TSV values correct with no
  formatting slop (extra columns, stray quotes, wrong casing)?
- **Reasoning quality**: does the reasoning show the elimination process
  — ruling out constant-digit, full-reversal, and swap-first-last using
  the given stamps — rather than asserting the rule without demonstrating
  why competing hypotheses were rejected?
