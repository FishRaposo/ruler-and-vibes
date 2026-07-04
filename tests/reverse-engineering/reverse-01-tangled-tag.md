---
id: reverse-01-tangled-tag
category: reverse-engineering
title: Untangle the Tag Function
deliverables:
  - clean.js
---

## Task

A fictional inventory tool has a legacy "record tag" routine that
nobody has touched in years. The variable names are gone, the string
literals look scrambled, and the arithmetic reads oddly. Your job is
to understand exactly what it computes and rewrite it as clean,
readable code — same behavior, no obfuscation artifacts.

Here is the routine, verbatim:

```js
var _p=['tAedoCrahc','htgnel'];
function _r(x){return x.split('').reverse().join('')}
function z9(s){
  var a=0x15;
  var t=a^a;
  for(var i=0;i<s[_r(_p[1])];i++){
    var c=s[_r(_p[0])](i);
    t=((t<<3)- -c)^(c>>1);
    t=t&0xFFF;
  }
  return t- -((s[_r(_p[1])]*7)|0);
}
```

`s` is always a plain JavaScript string (possibly empty). Work out
precisely what `z9(s)` returns for any input string, then reimplement
it as a clean equivalent.

## Deliverables

- `clean.js` — exports a function `tag(s)` via `module.exports`, a
  clean, readable reimplementation that is behaviorally IDENTICAL to
  `z9` for every input string. No renamed-but-still-obfuscated
  artifacts: no string-reversal indirection for property names, no
  dead identity expressions, no disguised operators. When run with
  `node clean.js`, it must print one line per reference vector below,
  in the exact format `INPUT => RESULT`, in this order:

  ```js
  const VECTORS = ["", "cab", "lantern", "Zip9", "The quick brown fox"];
  ```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { tag }`; the judge's
  harness requires it.
