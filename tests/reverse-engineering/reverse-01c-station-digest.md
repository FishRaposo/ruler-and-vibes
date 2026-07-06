---
id: reverse-01c-station-digest
category: reverse-engineering
title: Untangle the Station Reading Digest
deliverables:
  - clean.js
---

## Task

A fictional weather-station firmware carries a legacy "reading digest"
routine that nobody has dared to touch. The variable names are gone, the
string literals look shuffled, and the arithmetic reads strangely. Your
job is to work out exactly what it computes and rewrite it as clean,
readable code — same behavior, no obfuscation artifacts.

Here is the routine, verbatim:

```js
var _q=['tAedoCrahc','htgnel'];
function _u(x){return x.split('').reverse().join('')}
function q7(s){
  var b=0x2C;
  var h=b^b;
  for(var i=0;i<s[_u(_q[1])];i++){
    var c=s[_u(_q[0])](i);
    h=((h<<4)- -c)^(c>>2);
    h=h&0x7FFF;
  }
  return h- -((s[_u(_q[1])]*11)|0);
}
```

`s` is always a plain JavaScript string (possibly empty). Work out
precisely what `q7(s)` returns for any input string, then reimplement it
as a clean equivalent.

## Deliverables

- `clean.js` — exports a function `tag(s)` via `module.exports`, a clean,
  readable reimplementation that is behaviorally IDENTICAL to `q7` for
  every input string. No renamed-but-still-obfuscated artifacts: no
  string-reversal indirection for property names, no dead identity
  expressions, no disguised operators. When run with `node clean.js`, it
  must print one line per reference vector below, in the exact format
  `INPUT => RESULT`, in this order:

  ```js
  const VECTORS = ["", "dew", "cirrus", "Fog7", "The damp grey morning"];
  ```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { tag }`; the judge's harness
  requires it.
