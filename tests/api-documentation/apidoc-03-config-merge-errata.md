---
id: apidoc-03-config-merge-errata
category: api-documentation
title: Reconcile drifted docs against a config-merge function
deliverables:
  - REFERENCE.md
  - errata.json
---

## Task

Below is the complete, verified source of `mergeConfig(base, override)`,
followed by the CURRENT documentation for it. The docs were written a
while ago and nobody has checked them against the code since. Some of
the claims below are wrong. Your job is to determine, by actually
running the code (not by trusting the prose), which claims are true
and which are false — then ship corrected documentation.

```js
function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function mergeConfig(base, override) {
  if (base == null) {
    throw new TypeError('base is required');
  }
  if (override == null) {
    return { ...base };
  }
  const out = { ...base };
  for (const key of Object.keys(override)) {
    const bv = out[key];
    const ov = override[key];
    if (Array.isArray(bv) && Array.isArray(ov)) {
      out[key] = bv.concat(ov);
    } else if (isPlainObject(bv) && isPlainObject(ov)) {
      out[key] = mergeConfig(bv, ov);
    } else {
      out[key] = ov;
    }
  }
  return out;
}

module.exports = { mergeConfig };
```

### Current documentation (may contain errors)

> `mergeConfig(base, override)` merges two configuration objects.
>
> - **c1**: When `override` is `null`, the function returns the SAME
>   `base` object reference (no copy is made).
> - **c2**: When both `base` and `override` have an array at the same
>   key, the `override` array REPLACES the `base` array entirely.
> - **c3**: When both `base` and `override` have a plain object at the
>   same key, the two objects are deep-merged recursively.
> - **c4**: If `override` has a scalar (e.g. a number) at a key where
>   `base` has an object, the function THROWS, since this is a
>   type mismatch.

## Deliverables

- `REFERENCE.md` — corrected reference documentation for
  `mergeConfig`, covering: the base/override parameters, the one
  thrown error (and its exact trigger), the null-override return
  value, how arrays at matching keys are combined, how nested plain
  objects are combined, and what happens when a scalar and an object
  collide at the same key. State each fact as it actually behaves —
  do not carry forward any claim you've determined is false.
- `errata.json` — a JSON object with keys `c1`, `c2`, `c3`, `c4`, each
  mapping to `{ "verdict": "true" | "false", "correction": "..." }`.
  For a claim you determine is `"true"`, `correction` may restate the
  claim. For a claim you determine is `"false"`, `correction` must
  describe the actual behavior you observed by running the code.

## Constraints

- Determine every verdict by actually running the given source (paste
  it into a scratch file and probe it with node) — do not reason about
  it purely from reading, and do not trust the current documentation
  block above.
- `errata.json` must be valid JSON, parseable with
  `JSON.parse(fs.readFileSync('errata.json', 'utf8'))`.
