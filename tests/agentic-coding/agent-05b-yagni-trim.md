---
id: agent-05b-yagni-trim
category: agentic-coding
title: Minimal fix: trim without framework
deliverables:
  - trim.js
---

## Task

`trim.js` should trim ASCII whitespace from both ends. Currently only
trims start.

```js
function trim(s) {
  return String(s).replace(/^\s+/, '');
}
module.exports = { trim };
```

Self-test with node trim.js: "  hi  " → "hi", "\tx\n" → "x", "a" → "a".
No lodash, no class wrappers, ≤ 15 lines.

## Deliverables

- `trim.js` with self-tests.

## Constraints

- ≤ 15 lines total. No deps.
