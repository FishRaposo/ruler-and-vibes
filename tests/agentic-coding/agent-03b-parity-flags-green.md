---
id: agent-03b-parity-flags-green
category: agentic-coding
title: Implement flags until tests green
deliverables:
  - bits.js
  - tests.js
---

## Task

**tests.js**
```js
const { flags } = require('./bits');
function assert(c,m){console.log((c?'PASS':'FAIL')+' '+m); if(!c) process.exitCode=1;}
assert(flags(0).join(',') === '', '0');
assert(flags(1).join(',') === '1', '1');
assert(flags(2).join(',') === '2', '2');
assert(flags(3).join(',') === '1,2', '3');
assert(flags(8).join(',') === '8', '8');
assert(flags(13).join(',') === '1,4,8', '13');
```

`flags(n)` returns ascending powers of two that sum to n (n≥0 integer).

Implement bits.js; leave tests.js unchanged.

## Deliverables

- `bits.js`, `tests.js`.

## Constraints

- bits.js ≤ 40 lines.
