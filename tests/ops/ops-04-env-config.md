---
id: ops-04-env-config
category: ops
title: Fix broken env config path
deliverables:
  - load.js
  - config.json
  - verify.js
---

## Task

App reads config via `load.js`:

```js
const fs = require('fs');
const path = require('path');
function load() {
  // BUG: looks in /etc/myapp/config.json instead of local config.json
  const p = '/etc/myapp/config.json';
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
module.exports = { load };
```

**config.json** (local):
```json
{"host":"127.0.0.1","port":9191}
```

**verify.js**:
```js
const { load } = require('./load');
const c = load();
const ok = c.host === '127.0.0.1' && c.port === 9191;
console.log(ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);
```

Fix load.js to read `config.json` beside itself. Copy all three files.

## Deliverables

- `load.js`, `config.json`, `verify.js`.

## Constraints

- verify.js and config.json unchanged from task.
