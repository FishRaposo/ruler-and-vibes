---
id: ops-04b-env-config-url
category: ops
title: Fix API base URL env default
deliverables:
  - client.js
  - verify.js
---

## Task

`client.js` uses process.env.API_URL || 'http://wrong.example'. Should
default to 'http://127.0.0.1:4000'. verify.js checks getBase() === that.

```js
function getBase() {
  return process.env.API_URL || 'http://wrong.example';
}
module.exports = { getBase };
```

```js
// verify.js
delete process.env.API_URL;
const { getBase } = require('./client');
const ok = getBase() === 'http://127.0.0.1:4000';
console.log(ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);
```

Also when API_URL=http://x, getBase should return http://x — optional self-check.

## Deliverables

- `client.js`, `verify.js`.

## Constraints

- verify.js unchanged.
