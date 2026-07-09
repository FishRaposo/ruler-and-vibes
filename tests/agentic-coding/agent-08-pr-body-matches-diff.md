---
id: agent-08-pr-body-matches-diff
category: agentic-coding
title: "Write a PR body that matches the actual patch"
deliverables:
  - util.js
  - PR.md
---

## Task

Implement this **exact** change in `util.js`:

```js
// before conceptually: function double(n) { return n + n; }
function double(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return null;
  return n * 2;
}
module.exports = { double };
```

Self-test when main:
```js
if (require.main === module) {
  const assert = (c, m) => { if (!c) { console.log('FAIL ' + m); process.exit(1); } };
  assert(double(3) === 6, '3');
  assert(double('x') === null, 'non-number');
  console.log('PASS');
}
```

Then write `PR.md` with headings:

## Title
## Summary
## Test plan

**Accuracy rules for PR.md:**

- Must mention non-number → null handling.
- Must mention doubling / *2 behavior for numbers.
- Must **not** claim any of: TypeScript migration, new CLI flag,
  caching layer, "rewrote the auth system", or database changes.

## Deliverables

- `util.js`
- `PR.md`

## Constraints

- util.js ≤ 30 lines, no deps.
- PR.md 60–180 words.

