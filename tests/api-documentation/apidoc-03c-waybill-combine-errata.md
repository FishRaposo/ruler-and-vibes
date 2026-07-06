---
id: apidoc-03c-waybill-combine-errata
category: api-documentation
title: Reconcile drifted docs against a waybill-combine function
deliverables:
  - REFERENCE.md
  - errata.json
---

## Task

Below is the complete, verified source of `combineWaybill(base, addendum)`,
followed by the CURRENT documentation for it. The docs were written a
while ago and nobody has checked them against the code since. Some of
the claims below are wrong. Your job is to determine, by actually
running the code (not by trusting the prose), which claims are true
and which are false — then ship corrected documentation.

```js
function isPlainRecord(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function combineWaybill(base, addendum) {
  if (base == null) {
    throw new TypeError('base waybill is required');
  }
  if (addendum == null) {
    return { ...base };
  }
  const out = { ...base };
  for (const key of Object.keys(addendum)) {
    const bv = out[key];
    const av = addendum[key];
    if (Array.isArray(bv) && Array.isArray(av)) {
      out[key] = bv.concat(av);
    } else if (isPlainRecord(bv) && isPlainRecord(av)) {
      out[key] = combineWaybill(bv, av);
    } else {
      out[key] = av;
    }
  }
  return out;
}

module.exports = { combineWaybill };
```

### Current documentation (may contain errors)

> `combineWaybill(base, addendum)` combines two freight waybill records.
>
> - **w1**: When `addendum` is `null`, the function returns the SAME
>   `base` object reference (no copy is made).
> - **w2**: When both `base` and `addendum` have an array at the same
>   key, the `addendum` array REPLACES the `base` array entirely.
> - **w3**: When both `base` and `addendum` have a plain object at the
>   same key, the two records are deep-merged recursively.
> - **w4**: If `addendum` has a scalar (e.g. a number) at a key where
>   `base` has an object, the function THROWS, since this is a
>   type mismatch.

## Deliverables

- `REFERENCE.md` — corrected reference documentation for
  `combineWaybill`, covering: the base/addendum parameters, the one
  thrown error (and its exact trigger), the null-addendum return
  value, how arrays at matching keys are combined, how nested plain
  records are combined, and what happens when a scalar and an object
  collide at the same key. State each fact as it actually behaves —
  do not carry forward any claim you've determined is false.
- `errata.json` — a JSON object with keys `w1`, `w2`, `w3`, `w4`, each
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
