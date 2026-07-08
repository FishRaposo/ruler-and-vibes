---
id: ops-04c-env-config-mode
category: ops
title: Fix NODE_ENV production flag
deliverables:
  - mode.js
  - verify.js
---

## Task

`mode.js`: isProd() should be true only when NODE_ENV==='production'.
Currently returns true when NODE_ENV is unset (bug).

```js
function isProd() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
}
module.exports = { isProd };
```

verify.js unsets NODE_ENV and expects isProd()===false; then sets production and expects true.

## Deliverables

- `mode.js`, `verify.js` with both checks.

## Constraints

- Include verify.js that tests both cases.
