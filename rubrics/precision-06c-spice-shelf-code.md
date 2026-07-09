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
      check: "Row for cinnamon outputs exactly '8ncinnamo' and row for turmeric outputs exactly '8cturmeri' (both length-8, exercising the length-digit rule)"
    - id: obj-3
      check: "Row for dill outputs exactly '4ldil' and row for clove outputs exactly '5eclov' (short words, disambiguating length from any constant, and dill disambiguating rotate 'ldil' from swap 'lild')"
    - id: obj-4
      check: "Every output equals n + last-letter-moved-to-front + remaining chars in order by the judge's independent node reimplementation of the induced rule, matching all 4 rows"
    - id: obj-5
      check: "No extra data rows, no commentary lines, and none of the four EXAMPLE items (thyme, saffron, chive, bay) appears as a data row"
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
anchors:
  - id: Rule stated correctly and unambiguously
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Output exactness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `precision-06-unstated-rule-induction` (same construct,
fresh surface).

If the phrase "transept macaque" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The induced rule is: move the word's LAST letter to the FRONT (keeping
the remaining letters in their original order), then prepend the word's
letter-count as a decimal digit (or digits, for lengths >= 10, though
none of the test's words reach that length) to the front of that
rotated result. Equivalently: `n + word[-1] + word[:-1]`. Every output
below is mechanically recomputable; do not eyeball.

### Answer key

```
input	output
cinnamon	8ncinnamo
dill	4ldil
turmeric	8cturmeri
clove	5eclov
```

Worked-example check (must also hold, confirming the rule): thyme ->
5ethym, saffron -> 7nsaffro, chive -> 5echiv, bay -> 3yba.

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

console.log('obj-2 cinnamon==8ncinnamo:', map['cinnamon'] === '8ncinnamo');
console.log('obj-2 turmeric==8cturmeri:', map['turmeric'] === '8cturmeri');
console.log('obj-3 dill==4ldil:', map['dill'] === '4ldil');
console.log('obj-3 clove==5eclov:', map['clove'] === '5eclov');

const rule = w => w.length + w[w.length-1] + w.slice(0,-1);
const inputs = ['cinnamon','dill','turmeric','clove'];
console.log('obj-4 all match independent reimplementation:', inputs.every(w => map[w] === rule(w)));

const exampleWords = ['thyme','saffron','chive','bay'];
console.log('obj-5 no extra rows / no example words as data rows:', lines.length === 4 && !lines.some(l => exampleWords.includes(l.split('\t')[0])));
"
```

Run this against the answer key above and against a deliberately wrong
submission (e.g. full reversal: cinnamon -> nomannic, or swap-first-last:
dill -> lild) before trusting the result — both wrong variants must fail
obj-2/obj-3/obj-4.

- **obj-1**: structural — wrong column count or stray whitespace fails
  regardless of content correctness.
- **obj-2 / obj-3**: these four values pin down the rule uniquely. A
  constant-digit-prepend rule is refuted by varying lengths (5, 7, 5, 3
  in the examples; 8, 4, 8, 5 in the new items). Full reversal matches
  none of the four worked examples. Swap-first-and-last is refuted by
  bay: rotate gives "yba", swap gives "yab" — the given example output
  is "3yba", confirming rotate, not swap. dill disambiguates the same
  way: rotate gives "ldil" (correct), swap gives "lild" (wrong).
- **obj-4**: the judge's script recomputes independently; do not trust
  a submission that merely echoes the answer key text without the
  underlying rule holding (verifies mechanically either way, but
  distinguishes for the rule-STATEMENT grading below).
- **obj-5**: catches echoing an example item back as if it were a new
  input.

### Rule-statement examples (sub-quality, prose-decidable)

PASS (correctly and unambiguously states the rule):
- "Move the last letter of the word to the front, then prepend the
  word's total letter count as a digit before that."
- "Rotate the last character to the start of the remaining letters, and
  prefix the whole thing with the number of letters in the original
  word."
- "Take the last letter, put it first, keep the rest of the letters in
  original order, then add the word length as a leading digit."

FAIL (wrong or ambiguous rule statement):
- "Prepend 5 to a scrambled version of the word."
  (wrong: not a constant, and doesn't specify the rotation)
- "Reverse the string and prepend its length."
  (refuted: thyme reversed is "emyht", not "ethym")
- "Prepend the length, then swap the first and last letters."
  (refuted by bay: swap gives "3yab", not the correct "3yba")

### Subjective guidance

- **Rule stated correctly and unambiguously**: does REASONING.md or
  any accompanying explanation state the prepend-length-then-rotate-
  last-to-front rule precisely enough that a third party could apply
  it to a new word without guessing? Partial credit for a rule that
  produces correct outputs but is described vaguely (e.g. "some kind
  of shift").
- **Output exactness**: are all four TSV values correct with no
  formatting slop (extra columns, stray quotes, wrong casing)?
- **Reasoning quality**: does the reasoning show the elimination
  process — ruling out constant-digit, full-reversal, and swap-first-
  last using the given examples — rather than asserting the rule
  without demonstrating why competing hypotheses were rejected?
