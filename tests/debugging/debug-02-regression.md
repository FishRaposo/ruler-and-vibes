---
id: debug-02-regression
category: debugging
title: Fix the regression, keep the feature
deliverables:
  - fixed.js
  - REGRESSION.md
---

## Task

Version 1 of `slugify` worked. Version 2 added a `maxLen` feature and
shipped — then users reported that slugs regressed. Fix v2 so ALL v1
behavior is restored while the new `maxLen` feature keeps working.

**v1 (correct, no maxLen):**

```js
function slugify(title) {
  return title
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

**v2 (has maxLen, but regressed):**

```js
function slugify(title, maxLen) {
  var s = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  if (maxLen) s = s.slice(0, maxLen);
  return s.replace(/^-+/g, "");
}
```

`maxLen` semantics: the result is at most `maxLen` characters and never
ends in a hyphen.

## Deliverables

- `fixed.js` — the repaired function plus a self-test block runnable
  with `node fixed.js` printing one PASS/FAIL line per case, covering
  at least:
  1. `slugify("Café Menu")`
  2. `slugify("Hello, World!")`
  3. `slugify("  --Already--Slugged--  ")`
  4. `slugify("Hello World", 6)`
  5. `slugify("São Paulo Travel Guide", 10)`
- `REGRESSION.md` — name exactly which edits between v1 and v2 broke
  which behaviors, and why your fix preserves the new feature.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
