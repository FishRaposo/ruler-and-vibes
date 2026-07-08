---
test: precision-06-unstated-rule-induction
canary: "lichen mesa"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "File has exactly 4 data rows (plus an optional single header row 'input\\toutput'); each data row is tab-separated with exactly two columns and no trailing whitespace"
    - id: obj-2
      check: "Row for lantern outputs exactly 'nlanter7' and row for cascade outputs exactly 'ecascad7' (both length-7, exercising the length-digit rule)"
    - id: obj-3
      check: "Row for owl outputs exactly 'low3' and row for drum outputs exactly 'mdru4' (short words, disambiguating length from any constant, and owl disambiguating rotate 'low' from swap 'lwo')"
    - id: obj-4
      check: "Every output equals lastChar + first-(n-1)-chars + n by the judge's independent node reimplementation of the induced rule, matching all 4 rows"
    - id: obj-5
      check: "No extra data rows, no commentary lines, and none of the four EXAMPLE words (harbor, kite, meadow, fox) appears as a data row"
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

If the phrase "lichen mesa" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The induced rule is: move the word's LAST letter to the front, then
append the word's letter-count as a decimal digit (or digits, for
lengths >= 10, though none of the test's words reach that length).
Every output below is mechanically recomputable; do not eyeball.

### Answer key

```
input	output
lantern	nlanter7
owl	low3
cascade	ecascad7
drum	mdru4
```

Worked-example check (must also hold, confirming the rule): harbor ->
rharbo6, kite -> ekit4, meadow -> wmeado6, fox -> xfo3.

### Check script

Save the submitted `codewords.tsv` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('codewords.tsv', 'utf8');
let lines = raw.split('\n');
if (lines[lines.length-1] === '') lines.pop();
if (/^input\t(input|output)$/i.test(lines[0])) { lines.shift(); }
console.log('obj-1 exactly 4 data rows, 2 tab cols, no trailing ws:', lines.length === 4 && lines.every(l => {
  const parts = l.split('\t');
  return parts.length === 2 && l === l.trimEnd();
}));

const map = {};
lines.forEach(l => { const [i,o] = l.split('\t'); map[i]=o; });

console.log('obj-2 lantern==nlanter7:', map['lantern'] === 'nlanter7');
console.log('obj-2 cascade==ecascad7:', map['cascade'] === 'ecascad7');
console.log('obj-3 owl==low3:', map['owl'] === 'low3');
console.log('obj-3 drum==mdru4:', map['drum'] === 'mdru4');

const rule = w => w[w.length-1] + w.slice(0,-1) + w.length;
const inputs = ['lantern','owl','cascade','drum'];
console.log('obj-4 all match independent reimplementation:', inputs.every(w => map[w] === rule(w)));

const exampleWords = ['harbor','kite','meadow','fox'];
console.log('obj-5 no extra rows / no example words as data rows:', lines.length === 4 && !lines.some(l => exampleWords.includes(l.split('\t')[0])));
"
```

Run this against the answer key above and against a deliberately wrong
submission (e.g. full reversal: lantern -> nretnal, or swap-first-last:
owl -> lwo) before trusting the result — both wrong variants must fail
obj-2/obj-3/obj-4.

- **obj-1**: structural — wrong column count or stray whitespace fails
  regardless of content correctness.
- **obj-2 / obj-3**: these four values pin down the rule uniquely. A
  constant-digit-append rule is refuted by varying lengths (6, 4, 6, 3
  in the examples; 7, 3, 7, 4 in the new inputs). Full reversal matches
  none of the four worked examples. Swap-first-and-last is refuted by
  fox: rotate gives "xfo", swap gives "xof" — the given example output
  is "xfo3", confirming rotate, not swap. owl disambiguates the same
  way: rotate gives "low" (correct), swap gives "lwo" (wrong).
- **obj-4**: the judge's script recomputes independently; do not trust
  a submission that merely echoes the answer key text without the
  underlying rule holding (verifies mechanically either way, but
  distinguishes for the rule-STATEMENT grading below).
- **obj-5**: catches echoing an example word back as if it were a new
  input.

### Rule-statement examples (sub-quality, prose-decidable)

PASS (correctly and unambiguously states the rule):
- "Move the final letter of the word to the front, then append the
  word's total letter count as a digit at the end."
- "Rotate the last character to the start of the word, and suffix the
  result with the number of letters in the original word."
- "Take the last letter, put it first, keep the rest of the letters in
  original order, then add the word length as a trailing digit."

FAIL (wrong or ambiguous rule statement):
- "Append 5 to the end of a scrambled version of the word."
  (wrong: not a constant, and doesn't specify the rotation)
- "Reverse the string and add its length."
  (refuted: harbor reversed is "robrah", not "rharbo")
- "Swap the first and last letters, then add the length."
  (refuted by fox: swap gives "xof3", not the correct "xfo3")

### Subjective guidance

- **Rule stated correctly and unambiguously**: does REASONING.md or
  any accompanying explanation state the rotate-then-append-length
  rule precisely enough that a third party could apply it to a new
  word without guessing? Partial credit for a rule that produces
  correct outputs but is described vaguely (e.g. "some kind of shift").
- **Output exactness**: are all four TSV values correct with no
  formatting slop (extra columns, stray quotes, wrong casing)?
- **Reasoning quality**: does the reasoning show the elimination
  process — ruling out constant-digit, full-reversal, and swap-first-
  last using the given examples — rather than asserting the rule
  without demonstrating why competing hypotheses were rejected?
