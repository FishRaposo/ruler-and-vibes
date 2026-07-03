---
id: coding-02-refactor
category: coding
title: Behavior-preserving refactor
deliverables:
  - refactored.js
  - CHANGES.md
---

## Task

Refactor the function below into clean, maintainable code WITHOUT
changing its behavior. Same inputs, same outputs, exactly.

```js
function calc(o){
  var t=0;
  for(var i=0;i<o.items.length;i++){
    var it=o.items[i];
    if(it.type=="book"){t=t+it.price*it.qty*0.9;}
    else{if(it.type=="food"){t=t+it.price*it.qty;}else{t=t+it.price*it.qty*1.2;}}
  }
  if(o.coupon){if(o.coupon=="TEN"){t=t*0.9}else{if(o.coupon=="HALF"){t=t*0.5}}}
  if(t>100){t=t-5}
  return Math.round(t*100)/100;
}
```

## Deliverables

- `refactored.js` — the refactored `calc` plus a self-test block runnable
  with `node refactored.js` that checks AT LEAST these five inputs and
  prints one PASS/FAIL line per case:
  1. `{items:[{type:"book",price:10,qty:2}]}`
  2. `{items:[{type:"food",price:5,qty:3}]}`
  3. `{items:[{type:"gadget",price:50,qty:2}]}`
  4. `{items:[{type:"book",price:100,qty:1}],coupon:"HALF"}`
  5. `{items:[{type:"gadget",price:100,qty:1}],coupon:"TEN"}`
- `CHANGES.md` — what you changed, why, and how you know behavior is
  preserved.

## Constraints

- Plain JavaScript, no dependencies, `refactored.js` at most 100 lines.
- The quirks are behavior, not bugs: the flat 5-unit discount above 100
  applies AFTER the coupon, and unknown coupons do nothing. Keep them.
