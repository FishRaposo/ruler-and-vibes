---
id: agent-06b-repair-trim
category: agentic-coding
title: "Repair a near-miss trim from failing feedback"
deliverables:
  - trim.js
---

## Task

Copy this starting `trim.js`, then repair it from feedback.

```js
function trimBoth(s) {
  s = String(s);
  // BUG: only trims leading spaces
  return s.replace(/^\s+/, '');
}
module.exports = { trimBoth };

if (require.main === module) {
  const cases = [
    ['  hi  ', 'hi'],
    ['\tx\n', 'x'],
    ['ok', 'ok'],
  ];
  let ok = true;
  for (const [inp, exp] of cases) {
    const g = trimBoth(inp);
    const p = g === exp;
    console.log((p ? 'PASS' : 'FAIL') + ' ' + JSON.stringify(inp) + ' -> ' + JSON.stringify(g));
    if (!p) ok = false;
  }
  process.exit(ok ? 0 : 1);
}
```

**Feedback:**

1. Trailing whitespace must be removed too (`"  hi  "` → `"hi"`).
2. Keep export name `trimBoth`.
3. Prefer a **small** fix.

## Deliverables

- `trim.js`

## Constraints

- Single file, no deps, ≤ 40 lines.
- Do not rename the export.

