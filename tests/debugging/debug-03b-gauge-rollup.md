---
id: debug-03b-gauge-rollup
category: debugging
title: Read the Trace, Fix the Crash
deliverables:
  - rollup.js
---

## Task

The **Windloft ridge** weather-station daily rollup function below is
crashing in production. Here is the file as currently shipped:

```js
// Windloft ridge station daily gauge rollup
// stations = number of gauge readings (NOT summed tips);
// rainfall = sum(tipCount*mmPerTip), integer tenths of a millimetre
function rollupGauges(readings) {
  var stations = 0;
  var rainfall = 0;
  for (var i = 0; i <= readings.length; i++) {
    var r = readings[i];
    stations += 1;
    rainfall += r.tipCount * r.mmPerTip;
  }
  return { stations: stations, rainfall: rainfall };
}

module.exports = { rollupGauges: rollupGauges };
```

Here is the crash log from the error tracker:

```
TypeError: Cannot read properties of undefined (reading 'tipCount')
    at rollupGauges (rollup.js:10)
```

Each reading has the shape `{gaugeId, tipCount, mmPerTip}` (a
tipping-bucket gauge records `tipCount` tips, each worth `mmPerTip`
tenths of a millimetre). Per the header comment, `stations` must be the
number of gauge readings (NOT the sum of `tipCount`), and `rainfall`
must be the sum of `tipCount * mmPerTip` in integer tenths of a
millimetre.

Fix the crash and ship a working `rollup.js`.

## Deliverables

- `rollup.js` — the fixed function, exporting `rollupGauges` the same
  way the original does. It must correctly handle these three cases
  (do not merely stop it from throwing — the totals must be correct):
  1. `[{gaugeId:'W1',tipCount:6,mmPerTip:2},{gaugeId:'W2',tipCount:4,mmPerTip:5},{gaugeId:'W3',tipCount:1,mmPerTip:2}]`
  2. `[{gaugeId:'R7',tipCount:9,mmPerTip:5}]`
  3. `[]` (the day with no readings)
## Constraints

- Plain JavaScript, no dependencies, `rollup.js` at most 40 lines.
- The file must end with `module.exports = { rollupGauges }`; the
  judge's harness requires it.
