---
test: precision-06c-spice-shelf-code
canary: "transept macaque"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "File has exactly 4 data rows (plus an optional single header row 'input\\toutput'); each data row is tab-separated with exactly two columns and no trailing whitespace"
    - id: obj-2
      check: "Row for apricot outputs exactly 'pricota7' and row for custard outputs exactly 'ustardc7' (both length-7, exercising the length-digit rule)"
    - id: obj-3
      check: "Row for fig outputs exactly 'igf3' and row for mint outputs exactly 'intm4' (short words, disambiguating length from any constant, and fig disambiguating rotate 'igf' from swap 'gif')"
    - id: obj-4
      check: "Every output equals first-letter-moved-to-end + remaining chars in order + n by the judge's independent node reimplementation of the induced rule, matching all 4 rows"
    - id: obj-5
      check: "No extra data rows, no commentary lines, and none of the four EXAMPLE items (nutmeg, sage, walnut, oat) appears as a data row"
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

If the phrase "transept macaque" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The induced rule is: move the word's FIRST letter to the END (keeping the
remaining letters in their original order), then append the word's
letter-count as a decimal digit (or digits, for lengths >= 10, though
none of the test's words reach that length). Every output below is
mechanically recomputable; do not eyeball.

### Answer key

```
input	output
apricot	pricota7
fig	igf3
custard	ustardc7
mint	intm4
```

Worked-example check (must also hold, confirming the rule): nutmeg ->
utmegn6, sage -> ages4, walnut -> alnutw6, oat -> ato3.

### Check script

Save the submitted `shelfcodes.tsv` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('shelfcodes.tsv', 'utf8');
let lines = raw.split('\n');
if (lines[lines.length-1] === '') lines.pop();
if (/^input\t(input|output)$/i.test(lines[0])) { lines.shift(); }
console.log('obj-1 exactly 4 data rows, 2 tab cols, no trailing ws:', lines.length === 4 && lines.every(l => {
  const parts = l.split('\t');
  return parts.length === 2 && l === l.trimEnd();
}));

const map = {};
lines.forEach(l => { const [i,o] = l.split('\t'); map[i]=o; });

console.log('obj-2 apricot==pricota7:', map['apricot'] === 'pricota7');
console.log('obj-2 custard==ustardc7:', map['custard'] === 'ustardc7');
console.log('obj-3 fig==igf3:', map['fig'] === 'igf3');
console.log('obj-3 mint==intm4:', map['mint'] === 'intm4');

const rule = w => w.slice(1) + w[0] + w.length;
const inputs = ['apricot','fig','custard','mint'];
console.log('obj-4 all match independent reimplementation:', inputs.every(w => map[w] === rule(w)));

const exampleWords = ['nutmeg','sage','walnut','oat'];
console.log('obj-5 no extra rows / no example words as data rows:', lines.length === 4 && !lines.some(l => exampleWords.includes(l.split('\t')[0])));
"
```

Run this against the answer key above and against a deliberately wrong
submission (e.g. full reversal: apricot -> tocirpa, or swap-first-last:
fig -> gif) before trusting the result — both wrong variants must fail
obj-2/obj-3/obj-4.

- **obj-1**: structural — wrong column count or stray whitespace fails
  regardless of content correctness.
- **obj-2 / obj-3**: these four values pin down the rule uniquely. A
  constant-digit-append rule is refuted by varying lengths (6, 4, 6, 3
  in the examples; 7, 3, 7, 4 in the new inputs). Full reversal matches
  none of the four worked examples. Swap-first-and-last is refuted by
  oat: rotate gives "ato", swap gives "tao" — the given example output
  is "ato3", confirming rotate, not swap. fig disambiguates the same
  way: rotate gives "igf" (correct), swap gives "gif" (wrong).
- **obj-4**: the judge's script recomputes independently; do not trust
  a submission that merely echoes the answer key text without the
  underlying rule holding (verifies mechanically either way, but
  distinguishes for the rule-STATEMENT grading below).
- **obj-5**: catches echoing an example item back as if it were a new
  input.

### Rule-statement examples (sub-quality, prose-decidable)

PASS (correctly and unambiguously states the rule):
- "Move the first letter of the word to the end, then append the word's
  total letter count as a digit at the end."
- "Rotate the first character to the back of the word, and suffix the
  result with the number of letters in the original word."
- "Take the first letter, put it last, keep the rest of the letters in
  original order, then add the word length as a trailing digit."

FAIL (wrong or ambiguous rule statement):
- "Append 5 to the end of a scrambled version of the word."
  (wrong: not a constant, and doesn't specify the rotation)
- "Reverse the string and add its length."
  (refuted: nutmeg reversed is "gemtun", not "utmegn")
- "Swap the first and last letters, then add the length."
  (refuted by oat: swap gives "tao3", not the correct "ato3")

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
