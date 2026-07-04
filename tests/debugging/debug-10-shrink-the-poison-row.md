---
id: debug-10-shrink-the-poison-row
category: debugging
title: Shrink the file to the one bad row
deliverables:
  - minimal.csv
  - fixed.js
  - MINIMIZE.md
---

## Task

**Farrowfield Payroll**, a fictional back-office tool, summarizes a
CSV export of bonus payments. Here is the summarizer as currently
shipped:

```js
// naive CSV summariser: splits each line on comma, sums the amount
// column (header id,name,amount -- amount is column index 2)
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
  const file = process.argv[2] || 'data40.csv';
  const text = fs.readFileSync(file, 'utf8');
  console.log('total:', summarize(text));
}
```

Running it against the export below crashes with a `NaN amount`
error. The full export, `id,name,amount`, 40 data rows:

```csv
id,name,amount
1,Person1,103
2,Person2,106
3,Person3,109
4,Person4,112
5,Person5,115
6,Person6,118
7,Person7,121
8,Person8,124
9,"OBrien 9",127
10,Person10,130
11,Person11,133
12,Person12,136
13,Person13,139
14,Person14,142
15,Person15,145
16,Person16,148
17,"Smith, Co",151
18,Person18,154
19,Person19,157
20,Person20,160
21,Person21,163
22,Person22,166
23,Person23,169
24,"OBrien 24",172
25,Person25,175
26,Person26,178
27,Person27,181
28,Person28,184
29,Person29,187
30,Person30,190
31,Person31,193
32,Person32,196
33,"OBrien 33",199
34,Person34,202
35,Person35,205
36,Person36,208
37,Person37,211
38,Person38,214
39,Person39,217
40,Person40,220
```

Some rows use quoted names (visually similar to each other) but that
alone does not mean they crash the summarizer — only one row is
actually responsible for the crash. Your job is to find it, prove it
minimally, and fix the parser.

## Deliverables

- `minimal.csv` — the smallest possible input (header line plus
  exactly one data row) that still reproduces the crash when run
  through the buggy `summarize` shown above.
- `fixed.js` — a corrected summarizer that handles quoted fields
  containing commas correctly (proper CSV field parsing, not a naive
  `split(',')`), still exporting `summarize`, and runnable the same
  way (`node fixed.js <file>` prints `total: <n>`).
- `MINIMIZE.md` — names the root cause (naive comma-splitting ignores
  quoted fields, so an embedded comma shifts later columns) and
  explains why the row you kept is the minimal reproducer — i.e. why
  the other quoted-looking rows do NOT crash the parser.

## Constraints

- Plain JavaScript, no dependencies.
- `minimal.csv` must contain exactly two lines: the header, then one
  data row.
- `fixed.js` at most 90 lines.
- `fixed.js` must correctly total the full 40-row export above without
  throwing, and must still access the amount as column index 2 of a
  properly-parsed row (i.e. fix the parsing, not the column index).
