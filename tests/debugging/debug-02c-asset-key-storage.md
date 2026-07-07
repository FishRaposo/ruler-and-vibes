---
id: debug-02c-asset-key-storage
category: debugging
title: Fix the regression, keep the feature
deliverables:
  - fixed.js
  - REGRESSION.md
---

## Task

Version 1 of `assetKey` worked. Version 2 added a `maxLen` feature and
shipped — then the media-archive team reported that storage keys
regressed. Fix v2 so ALL v1 behavior is restored while the new `maxLen`
feature keeps working.

**v1 (correct, no maxLen):**

```js
function assetKey(caption) {
  return caption
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
```

**v2 (has maxLen, but regressed):**

```js
function assetKey(caption, maxLen) {
  var s = caption
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  if (maxLen) s = s.slice(0, maxLen);
  return s.replace(/^_+/g, "");
}
```

`maxLen` semantics: the result is at most `maxLen` characters and never
ends in an underscore.

## Deliverables

- `fixed.js` — the repaired function plus a self-test block runnable
  with `node fixed.js` printing one PASS/FAIL line per case, covering
  at least:
  1. `assetKey("Café Terrace")`
  2. `assetKey("Sunset, Overlook!")`
  3. `assetKey("__Draft__Frame__")`
  4. `assetKey("Harbor Lights", 7)`
  5. `assetKey("Málaga Rooftop Shots", 12)`
- `REGRESSION.md` — name exactly which edits between v1 and v2 broke
  which behaviors, and why your fix preserves the new feature.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
