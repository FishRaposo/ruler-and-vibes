---
id: agent-08b-pr-body-slugify
category: agentic-coding
title: "PR body must match a slugify patch"
deliverables:
  - slug.js
  - PR.md
---

## Task

Implement this **exact** behavior in `slug.js`:

```js
function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
module.exports = { slugify };

if (require.main === module) {
  const assert = (c, m) => { if (!c) { console.log('FAIL ' + m); process.exit(1); } };
  assert(slugify('Hello World') === 'hello-world', 'hw');
  assert(slugify('  A--B  ') === 'a-b', 'ab');
  console.log('PASS');
}
```

Write `PR.md` with `## Title`, `## Summary`, `## Test plan`.

**Accuracy rules:**

- Must mention lowercasing and hyphenating non-alphanumerics.
- Must **not** claim: database migration, auth rewrite, TypeScript, Redis cache, or GraphQL.

## Deliverables

- `slug.js`, `PR.md`

## Constraints

- slug.js ≤ 30 lines, no deps. PR.md 60–180 words.

