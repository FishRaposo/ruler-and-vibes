---
id: agent-06c-repair-titlecase
category: agentic-coding
title: "Repair a near-miss titleCase from failing feedback"
deliverables:
  - title.js
---

## Task

Copy this starting `title.js`, then repair it from feedback.

```js
function titleCase(s) {
  s = String(s).toLowerCase();
  // BUG: only capitalizes first character of whole string
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
module.exports = { titleCase };

if (require.main === module) {
  const cases = [
    ['hello world', 'Hello World'],
    ['a', 'A'],
    ['ALREADY', 'Already'],
  ];
  let ok = true;
  for (const [inp, exp] of cases) {
    const g = titleCase(inp);
    const p = g === exp;
    console.log((p ? 'PASS' : 'FAIL') + ' ' + JSON.stringify(inp));
    if (!p) ok = false;
  }
  process.exit(ok ? 0 : 1);
}
```

**Feedback:**

1. Each whitespace-separated word must be title-cased (`Hello World`).
2. Keep export `titleCase`.
3. Prefer a small fix.

## Deliverables

- `title.js`

## Constraints

- ≤ 40 lines, no deps, keep export name.

