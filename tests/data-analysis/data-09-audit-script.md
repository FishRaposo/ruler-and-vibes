---
id: data-09-audit-script
category: data-analysis
title: Auditing the analyst's stats script
deliverables:
  - AUDIT.md
  - fixed.js
---

## Task

An analyst wrote a quick Node script to summarize a support-ticket
resolution dataset and a conversion figure, and printed a one-line
summary. The dataset is 10 resolution times in hours; the conversion
figure is 30 conversions out of 200 visits. Something in the script's
output doesn't smell right. Find every statistical bug, then fix it.

`summary.js` (the analyst's script, verbatim):

```javascript
const data = [5, 3, 12, 8, 100, 7, 9, 11, 6, 4];
const sorted = [...data].sort();
const n = sorted.length;
const median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

const conversions = 30;
const visits = 200;
const conversionRate = conversions / (visits - conversions);

console.log('Dataset:', data.join(', '));
console.log('Median:', median);
console.log('Average: 15.6');
console.log('Conversion rate:', (conversionRate * 100).toFixed(1) + '%');
```

Running it with `node summary.js` prints:

```
Dataset: 5, 3, 12, 8, 100, 7, 9, 11, 6, 4
Median: 4.5
Average: 15.6
Conversion rate: 17.6%
```

## Deliverables

- `AUDIT.md` (max 450 words): identify every distinct bug in
  `summary.js` — name the wrong value it produces, the correct value,
  and a one-line fix for each. Do not lump multiple bugs into one
  vague note.
- `fixed.js`: a corrected version of the script. Running
  `node fixed.js` must print a correct median and a correct
  conversion rate (labeling and exact wording are your choice, but the
  numbers must be right).

## Constraints

- `AUDIT.md` is at most 450 words (`wc -w` on the whole file).
- `fixed.js` must run standalone with `node fixed.js` with no
  external dependencies.
