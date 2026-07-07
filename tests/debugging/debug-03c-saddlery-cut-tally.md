---
id: debug-03c-saddlery-cut-tally
category: debugging
title: Read the Trace, Fix the Crash
deliverables:
  - cuts.js
---

## Task

The **Harnett & Roe** saddlery cut-tally function below is crashing in
production. Here is the file as currently shipped:

```js
// Harnett & Roe saddlery daily cut tally
// count = number of order tickets (NOT summed panels);
// area = sum(panels*areaEachSqcm), integer square centimetres
function tallyCuts(tickets) {
  var count = 0;
  var area = 0;
  for (var i = 0; i <= tickets.length; i++) {
    var t = tickets[i];
    count += 1;
    area += t.panels * t.areaEachSqcm;
  }
  return { count: count, area: area };
}

module.exports = { tallyCuts: tallyCuts };
```

Here is the crash log from the error tracker:

```
TypeError: Cannot read properties of undefined (reading 'panels')
    at tallyCuts (cuts.js:9)
```

Each order ticket has the shape `{sku, panels, areaEachSqcm}` (a ticket
cuts `panels` identical pieces, each of area `areaEachSqcm` square
centimetres). Per the header comment, `count` must be the number of
order tickets (NOT the sum of `panels`), and `area` must be the sum of
`panels * areaEachSqcm` in integer square centimetres.

Fix the crash and ship a working `cuts.js`.

## Deliverables

- `cuts.js` — the fixed function, exporting `tallyCuts` the same way the
  original does. It must correctly handle these three cases (do not
  merely stop it from throwing — the totals must be correct):
  1. `[{sku:'halter',panels:2,areaEachSqcm:640},{sku:'rein',panels:3,areaEachSqcm:210}]`
  2. `[{sku:'girth',panels:4,areaEachSqcm:900}]`
  3. `[]` (the day with no tickets)
## Constraints

- Plain JavaScript, no dependencies, `cuts.js` at most 40 lines.
- The file must end with `module.exports = { tallyCuts }`; the judge's
  harness requires it.
