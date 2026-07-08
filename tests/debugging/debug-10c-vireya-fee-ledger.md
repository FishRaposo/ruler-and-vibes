---
id: debug-10c-vireya-fee-ledger
category: debugging
title: Shrink the ledger to the one bad row
deliverables:
  - minimal.csv
  - fixed.js
  - MINIMIZE.md
---

## Task

**Thornwood Herbarium**, a fictional cataloguing tool, tallies a CSV
export of pressing-mount fees. Here is the tally utility as currently
shipped:

```js
// naive CSV tally: splits each line on comma, sums the fee
// column (header id,cultivar,fee -- fee is column index 2)
const fs = require('fs');

function summarize(csvText) {
  const lines = csvText.trim().split('\n');
  let total = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const amount = Number(cols[2]);
    if (Number.isNaN(amount)) {
      throw new Error('NaN amount on line ' + (i + 1) + ': ' + lines[i]);
    }
    total += amount;
  }
  return total;
}

module.exports = { summarize: summarize };

if (require.main === module) {
  const file = process.argv[2] || 'data38.csv';
  const text = fs.readFileSync(file, 'utf8');
  console.log('total:', summarize(text));
}
```

Running it against the export below crashes with a `NaN amount`
error. The full export, `id,cultivar,fee`, 38 data rows:

```csv
id,cultivar,fee
1,Cultivar1,52
2,Cultivar2,57
3,Cultivar3,62
4,Cultivar4,67
5,Cultivar5,72
6,Cultivar6,77
7,"Vireya 7",82
8,Cultivar8,87
9,Cultivar9,92
10,Cultivar10,97
11,Cultivar11,102
12,Cultivar12,107
13,Cultivar13,112
14,Cultivar14,117
15,"Vireya 15",122
16,Cultivar16,127
17,Cultivar17,132
18,Cultivar18,137
19,Cultivar19,142
20,Cultivar20,147
21,Cultivar21,152
22,Cultivar22,157
23,"Vireya, Thornwood",162
24,Cultivar24,167
25,Cultivar25,172
26,Cultivar26,177
27,Cultivar27,182
28,Cultivar28,187
29,Cultivar29,192
30,"Vireya 30",197
31,Cultivar31,202
32,Cultivar32,207
33,Cultivar33,212
34,Cultivar34,217
35,Cultivar35,222
36,Cultivar36,227
37,Cultivar37,232
38,Cultivar38,237
```

Several rows use quoted cultivar names (visually similar to one
another) but that alone does not mean they crash the tally utility --
only one row is actually responsible for the crash. Your job is to
find it, prove it minimally, and fix the parser.

## Deliverables

- `minimal.csv` — the smallest possible input (header line plus
  exactly one data row) that still reproduces the crash when run
  through the buggy `summarize` shown above.
- `fixed.js` — a corrected tally utility that handles quoted fields
  containing commas correctly (proper CSV field parsing, not a naive
  `split(',')`), still exporting `summarize`, and runnable the same
  way (`node fixed.js <file>` prints `total: <n>`).
- `MINIMIZE.md` — names the root cause (naive comma-splitting ignores
  quoted fields, so an embedded comma shifts later columns) and
  explains why the row you kept is the minimal reproducer -- i.e. why
  the other quoted-looking rows do NOT crash the parser.

## Constraints

- Plain JavaScript, no dependencies.
- `minimal.csv` must contain exactly two lines: the header, then one
  data row.
- `fixed.js` at most 90 lines.
- `fixed.js` must correctly total the full 38-row export above without
  throwing, and must still access the fee as column index 2 of a
  properly-parsed row (i.e. fix the parsing, not the column index).
