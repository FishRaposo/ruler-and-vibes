---
id: debug-10b-fare-gate-pipe-feed
category: debugging
title: Shrink the feed to the one bad row
deliverables:
  - minimal.psv
  - fixed.js
  - MINIMIZE.md
---

## Task

**Corvain Transit**, a fictional fare-collection back office, totals a
pipe-delimited export of gate tap fares. Here is the summarizer as
currently shipped:

```js
// naive PSV summariser: splits each line on '|', sums the fare
// column (header stop_id|station|fare -- fare is column index 2)
const fs = require('fs');

function summarize(feedText) {
  const lines = feedText.trim().split('\n');
  let total = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('|');
    const amount = Number(cols[2]);
    if (Number.isNaN(amount)) {
      throw new Error('NaN fare on line ' + (i + 1) + ': ' + lines[i]);
    }
    total += amount;
  }
  return total;
}

module.exports = { summarize: summarize };

if (require.main === module) {
  const file = process.argv[2] || 'feed36.txt';
  const text = fs.readFileSync(file, 'utf8');
  console.log('total:', summarize(text));
}
```

Running it against the export below crashes with a `NaN fare`
error. The full export, `stop_id|station|fare`, 36 data rows:

```
stop_id|station|fare
1|Stop1|212
2|Stop2|219
3|Stop3|226
4|Stop4|233
5|Stop5|240
6|Stop6|247
7|"Espen Cross"|254
8|Stop8|261
9|Stop9|268
10|Stop10|275
11|Stop11|282
12|Stop12|289
13|Stop13|296
14|Stop14|303
15|Stop15|310
16|Stop16|317
17|Stop17|324
18|Stop18|331
19|"Ashen Halt"|338
20|Stop20|345
21|Stop21|352
22|"Vantar | East"|359
23|Stop23|366
24|Stop24|373
25|Stop25|380
26|Stop26|387
27|Stop27|394
28|Stop28|401
29|Stop29|408
30|Stop30|415
31|"Quillon Bay"|422
32|Stop32|429
33|Stop33|436
34|Stop34|443
35|Stop35|450
36|Stop36|457
```

Some rows wrap the station in double quotes (they look alike) but
that alone does not mean they crash the summarizer — only one row is
actually responsible for the crash. Your job is to find it, prove it
minimally, and fix the parser.

## Deliverables

- `minimal.psv` — the smallest possible input (header line plus
  exactly one data row) that still reproduces the crash when run
  through the buggy `summarize` shown above.
- `fixed.js` — a corrected summarizer that handles quoted fields
  containing the delimiter correctly (proper field parsing, not a
  naive `split('|')`), still exporting `summarize`, and runnable the
  same way (`node fixed.js <file>` prints `total: <n>`).
- `MINIMIZE.md` — names the root cause (naive pipe-splitting ignores
  quoted fields, so an embedded `|` shifts later columns) and explains
  why the row you kept is the minimal reproducer — i.e. why the other
  quoted-looking rows do NOT crash the parser.

## Constraints

- Plain JavaScript, no dependencies.
- `minimal.psv` must contain exactly two lines: the header, then one
  data row.
- `fixed.js` at most 90 lines.
- `fixed.js` must correctly total the full 36-row export above without
  throwing, and must still access the fare as column index 2 of a
  properly-parsed row (i.e. fix the parsing, not the column index).
