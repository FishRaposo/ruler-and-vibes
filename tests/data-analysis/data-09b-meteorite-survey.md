---
id: data-09b-meteorite-survey
category: data-analysis
title: Auditing the meteorite-survey stats script
deliverables:
  - AUDIT.md
  - fixed.js
---

## Task

A field volunteer wrote a quick Node script to summarize the fragment
masses recovered on a strewnfield survey and a metal-detector
false-alarm figure, and printed a one-line summary. The dataset is 10
fragment masses in grams; the false-alarm figure is 21 junk hits out of
150 detector hits. Something in the script's output doesn't smell right.
Find every statistical bug, then fix it.

`survey.js` (the volunteer's script, verbatim):

```javascript
const masses = [9, 7, 24, 13, 150, 6, 16, 8, 5, 19];
const sorted = [...masses].sort();
const n = sorted.length;
const median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

const falseAlarms = 21;
const hits = 150;
const falseAlarmRate = falseAlarms / (hits - falseAlarms);

console.log('Masses (g):', masses.join(', '));
console.log('Median mass (g):', median);
console.log('Mean mass (g): 24.8');
console.log('False-alarm rate:', (falseAlarmRate * 100).toFixed(1) + '%');
```

Running it with `node survey.js` prints:

```
Masses (g): 9, 7, 24, 13, 150, 6, 16, 8, 5, 19
Median mass (g): 14.5
Mean mass (g): 24.8
False-alarm rate: 16.3%
```

## Deliverables

- `AUDIT.md` (max 450 words): identify every distinct bug in
  `survey.js` — name the wrong value it produces, the correct value,
  and a one-line fix for each. Do not lump multiple bugs into one
  vague note.
- `fixed.js`: a corrected version of the script. Running
  `node fixed.js` must print a correct median and a correct
  false-alarm rate (labeling and exact wording are your choice, but the
  numbers must be right).

## Constraints

- `AUDIT.md` is at most 450 words (`wc -w` on the whole file).
- `fixed.js` must run standalone with `node fixed.js` with no
  external dependencies.
