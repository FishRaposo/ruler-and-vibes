---
id: debug-02b-sku-shelf-code
category: debugging
title: Fix the regression, keep the feature
deliverables:
  - fixed.js
  - REGRESSION.md
---

## Task

Version 1 of `skuCode` worked. Version 2 added a `maxLen` feature and
shipped — then the warehouse team reported that shelf codes regressed.
Fix v2 so ALL v1 behavior is restored while the new `maxLen` feature
keeps working.

**v1 (correct, no maxLen):**

```js
function skuCode(name) {
  return name
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}
```

**v2 (has maxLen, but regressed):**

```js
function skuCode(name, maxLen) {
  var s = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ".");
  if (maxLen) s = s.slice(0, maxLen);
  return s.replace(/^\.+/g, "");
}
```

`maxLen` semantics: the result is at most `maxLen` characters and never
ends in a dot.

## Deliverables

- `fixed.js` — the repaired function plus a self-test block runnable
  with `node fixed.js` printing one PASS/FAIL line per case, covering
  at least:
  1. `skuCode("Rosé Barware")`
  2. `skuCode("Deluxe, Boxed!")`
  3. `skuCode("..Pre..Coded..")`
  4. `skuCode("Steel Frame", 5)`
  5. `skuCode("Crème Storage Bins", 11)`
- `REGRESSION.md` — name exactly which edits between v1 and v2 broke
  which behaviors, and why your fix preserves the new feature.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
