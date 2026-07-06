---
id: coding-02b-payroll-levy
category: coding
title: Behavior-preserving payroll refactor
deliverables:
  - refactored.js
  - CHANGES.md
---

## Task

Refactor the function below into clean, maintainable code WITHOUT
changing its behavior. Same inputs, same outputs, exactly.

```js
function gp(s){
  var g=0;
  for(var i=0;i<s.shifts.length;i++){
    var sh=s.shifts[i];
    if(sh.kind=="weekend"){g=g+sh.rate*sh.hours*1.25;}
    else{if(sh.kind=="standard"){g=g+sh.rate*sh.hours;}else{g=g+sh.rate*sh.hours*1.5;}}
  }
  if(s.bonus){if(s.bonus=="RAISE"){g=g*1.1}else{if(s.bonus=="DOCK"){g=g*0.5}}}
  if(g>500){g=g-20}
  return Math.round(g*100)/100;
}
```

## Deliverables

- `refactored.js` — the refactored `gp` plus a self-test block runnable
  with `node refactored.js` that checks AT LEAST these five inputs and
  prints one PASS/FAIL line per case:
  1. `{shifts:[{kind:"weekend",rate:20,hours:4}]}`
  2. `{shifts:[{kind:"standard",rate:15,hours:6}]}`
  3. `{shifts:[{kind:"holiday",rate:40,hours:9}]}`
  4. `{shifts:[{kind:"weekend",rate:60,hours:8}],bonus:"DOCK"}`
  5. `{shifts:[{kind:"holiday",rate:50,hours:8}],bonus:"RAISE"}`
- `CHANGES.md` — what you changed, why, and how you know behavior is
  preserved.

## Constraints

- Plain JavaScript, no dependencies, `refactored.js` at most 100 lines.
- The quirks are behavior, not bugs: the flat 20-unit levy above 500
  applies AFTER the bonus code, and unrecognized bonus codes do nothing.
  Keep them.
