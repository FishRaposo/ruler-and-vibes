---
id: agent-03c-slugify-until-green
category: agentic-coding
title: Implement slugify until tests green
deliverables:
  - slug.js
  - tests.js
---

## Task

**tests.js**
```js
const { slugify } = require('./slug');
function assert(c,m){console.log((c?'PASS':'FAIL')+' '+m); if(!c) process.exitCode=1;}
assert(slugify('Hello World') === 'hello-world', 'basic');
assert(slugify('  Foo   Bar  ') === 'foo-bar', 'spaces');
assert(slugify('A_B') === 'a-b', 'underscore');
assert(slugify('Hello!') === 'hello', 'punct');
assert(slugify('') === '', 'empty');
```

Rules: lower-case; runs of non-alphanumeric → single hyphen; trim hyphens.

Implement slug.js; tests.js unchanged.

## Deliverables

- `slug.js`, `tests.js`.

## Constraints

- slug.js ≤ 40 lines.
