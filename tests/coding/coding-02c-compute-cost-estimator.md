---
id: coding-02c-compute-cost-estimator
category: coding
title: Behavior-preserving refactor of a cost estimator
deliverables:
  - refactored.js
  - CHANGES.md
---

## Task

Refactor the function below into clean, maintainable code WITHOUT
changing its behavior. Same inputs, same outputs, exactly.

```js
function estimate(j){
  var c=0;
  for(var i=0;i<j.tasks.length;i++){
    var tk=j.tasks[i];
    if(tk.tier=="batch"){c=c+tk.rate*tk.hours*0.8;}
    else{if(tk.tier=="standard"){c=c+tk.rate*tk.hours;}else{c=c+tk.rate*tk.hours*1.5;}}
  }
  if(j.promo){if(j.promo=="SAVE20"){c=c*0.8}else{if(j.promo=="HALF"){c=c*0.5}}}
  if(c>200){c=c-8}
  return Math.round(c*100)/100;
}
```

## Deliverables

- `refactored.js` — the refactored `estimate` plus a self-test block
  runnable with `node refactored.js` that checks AT LEAST these five
  inputs and prints one PASS/FAIL line per case:
  1. `{tasks:[{tier:"batch",rate:10,hours:5}]}`
  2. `{tasks:[{tier:"standard",rate:8,hours:4}]}`
  3. `{tasks:[{tier:"burst",rate:40,hours:5}]}`
  4. `{tasks:[{tier:"standard",rate:100,hours:1}],promo:"HALF"}`
  5. `{tasks:[{tier:"burst",rate:200,hours:1}],promo:"SAVE20"}`
- `CHANGES.md` — what you changed, why, and how you know behavior is
  preserved.

## Constraints

- Plain JavaScript, no dependencies, `refactored.js` at most 100 lines.
- The quirks are behavior, not bugs: the flat 8-unit rebate above 200
  applies AFTER the promo, and unrecognized promo codes do nothing. Keep
  them.
