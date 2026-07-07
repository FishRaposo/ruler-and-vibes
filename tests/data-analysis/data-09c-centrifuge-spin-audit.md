---
id: data-09c-centrifuge-spin-audit
category: data-analysis
title: Auditing the lab's spin-time stats script
deliverables:
  - AUDIT.md
  - fixed.js
---

## Task

A lab technician wrote a quick Node script to summarize a batch of
centrifuge spin times and a sample-rejection figure, and printed a
one-line summary. The dataset is 10 spin times in minutes; the rejection
figure is 48 rejected samples out of 300 processed. Something in the
script's output doesn't smell right. Find every statistical bug, then fix
it.

`spins.js` (the technician's script, verbatim):

```javascript
const durations = [8, 5, 13, 7, 128, 10, 3, 17, 6, 9];
const sorted = [...durations].sort();
const n = sorted.length;
const median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

const rejects = 48;
const processed = 300;
const contaminationRate = rejects / (processed - rejects);

console.log('Spin times (min):', durations.join(', '));
console.log('Median:', median);
console.log('Average: 19.5');
console.log('Contamination rate:', (contaminationRate * 100).toFixed(1) + '%');
```

Running it with `node spins.js` prints:

```
Spin times (min): 8, 5, 13, 7, 128, 10, 3, 17, 6, 9
Median: 4
Average: 19.5
Contamination rate: 19.0%
```

## Deliverables

- `AUDIT.md` (max 450 words): identify every distinct bug in `spins.js` —
  name the wrong value it produces, the correct value, and a one-line fix
  for each. Do not lump multiple bugs into one vague note.
- `fixed.js`: a corrected version of the script. Running `node fixed.js`
  must print a correct median and a correct contamination rate (labeling
  and exact wording are your choice, but the numbers must be right).

## Constraints

- `AUDIT.md` is at most 450 words (`wc -w` on the whole file).
- `fixed.js` must run standalone with `node fixed.js` with no external
  dependencies.
