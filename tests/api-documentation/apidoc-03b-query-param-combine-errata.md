---
id: apidoc-03b-query-param-combine-errata
category: api-documentation
title: Reconcile drifted docs against a query-param combine function
deliverables:
  - REFERENCE.md
  - errata.json
---

## Task

Below is the complete, verified source of `combineParams(base, extra)`,
followed by the CURRENT documentation for it. The docs were written a
while ago and nobody has checked them against the code since. Some of
the claims below are wrong. Your job is to determine, by actually
running the code (not by trusting the prose), which claims are true
and which are false — then ship corrected documentation.

```js
function isMultiValue(v) {
  return Array.isArray(v);
}

function isGroup(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function combineParams(base, extra) {
  if (base == null) {
    throw new TypeError('base params are required');
  }
  if (extra == null) {
    return { ...base };
  }
  const out = { ...base };
  for (const key of Object.keys(extra)) {
    const bv = out[key];
    const ev = extra[key];
    if (isMultiValue(bv) && isMultiValue(ev)) {
      out[key] = bv.concat(ev);
    } else if (isGroup(bv) && isGroup(ev)) {
      out[key] = combineParams(bv, ev);
    } else {
      out[key] = ev;
    }
  }
  return out;
}

module.exports = { combineParams };
```

### Current documentation (may contain errors)

> `combineParams(base, extra)` merges two query-parameter objects.
>
> - **c1**: When `extra` is `null`, the function returns the SAME
>   `base` object reference (no copy is made).
> - **c2**: When both `base` and `extra` have an array (repeated
>   values) at the same key, the `extra` array REPLACES the `base`
>   array entirely.
> - **c3**: When both `base` and `extra` have a nested plain-object
>   group at the same key, the two groups are combined recursively.
> - **c4**: If `extra` has a scalar (e.g. a number) at a key where
>   `base` has a group, the function THROWS, since this is a
>   type mismatch.

## Deliverables

- `REFERENCE.md` — corrected reference documentation for
  `combineParams`, covering: the base/extra parameters, the one
  thrown error (and its exact trigger), the null-extra return
  value, how arrays at matching keys are combined, how nested
  plain-object groups are combined, and what happens when a scalar
  and a group collide at the same key. State each fact as it actually
  behaves — do not carry forward any claim you've determined is false.
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
