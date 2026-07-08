---
id: agent-02b-minimal-pad-right
category: agentic-coding
title: Minimal patch: padEnd width
deliverables:
  - pad.js
---

## Task

`pad.js` should left-justify pad with spaces to width w.

```js
function padRight(s, w) {
  s = String(s);
  if (s.length >= w) return s;
  return s + ' '.repeat(w - s.length - 1); // BUG: off-by-one
}
module.exports = { padRight };
```

Fix minimally. Self-test with node pad.js: "hi" width 5 → "hi   " (3 spaces),
"hello" width 3 → "hello", "" width 2 → "  ".

## Deliverables

- `pad.js`.

## Constraints

- ≤ 35 lines. Keep export name padRight.
