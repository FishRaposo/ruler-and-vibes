---
id: agent-03-tests-until-green
category: agentic-coding
title: Implement until the suite is green
deliverables:
  - score.js
  - tests.js
---

## Task

Implement `score.js` exporting `grade(score)` to satisfy `tests.js`.

**tests.js** (do not modify)
```js
const { grade } = require('./score');
function assert(cond, msg) {
  console.log((cond ? 'PASS' : 'FAIL') + ' ' + msg);
  if (!cond) process.exitCode = 1;
}
assert(grade(95) === 'A', '95→A');
assert(grade(90) === 'A', '90→A');
assert(grade(89) === 'B', '89→B');
assert(grade(70) === 'C', '70→C');
assert(grade(69) === 'D', '69→D');
assert(grade(60) === 'D', '60→D');
assert(grade(59) === 'F', '59→F');
assert(grade(-1) === null, 'neg→null');
assert(grade(101) === null, '101→null');
assert(typeof grade(80) === 'string', 'type');
```

Thresholds: A ≥90, B ≥80, C ≥70, D ≥60, else F. Out of [0,100] → null.

Copy tests.js unchanged; write score.js until `node tests.js` shows only PASS.

## Deliverables

- `score.js` — implementation.
- `tests.js` — exact copy of the task file.

## Constraints

- score.js ≤ 40 lines. Do not edit tests.js.
