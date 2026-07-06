---
id: reverse-01b-gate-stamp
category: reverse-engineering
title: Decode the Gate Stamp Function
deliverables:
  - clean.js
---

## Task

A fictional transit-turnstile firmware carries a legacy "gate stamp"
routine that no maintainer will admit to writing. The variable names
are meaningless, the string literals look shuffled, and the arithmetic
reads backwards. Your job is to work out exactly what it computes and
rewrite it as clean, readable code — same behavior, none of the
obfuscation leftovers.

Here is the routine, verbatim:

```js
var _m=['tAedoCrahc','htgnel'];
function _q(x){return x.split('').reverse().join('')}
function k7(s){
  var b=0x2C;
  var h=b&0;
  for(var i=0;i<s[_q(_m[1])];i++){
    var c=s[_q(_m[0])](i);
    h=((h<<4)- -c)^(c>>2);
    h=h&0x7FF;
  }
  return h- -((s[_q(_m[1])]*5)|0);
}
```

`s` is always a plain JavaScript string (possibly empty). Determine
precisely what `k7(s)` returns for any input string, then reimplement
it as a clean equivalent.

## Deliverables

- `clean.js` — exports a function `stamp(s)` via `module.exports`, a
  clean, readable reimplementation that is behaviorally IDENTICAL to
  `k7` for every input string. No renamed-but-still-obfuscated
  artifacts: no string-reversal indirection for property names, no
  dead identity expressions, no disguised operators. When run with
  `node clean.js`, it must print one line per reference vector below,
  in the exact format `INPUT => RESULT`, in this order:

  ```js
  const VECTORS = ["", "hub", "turnstile", "Gate7", "The 6am inbound train"];
  ```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { stamp }`; the judge's
  harness requires it.
