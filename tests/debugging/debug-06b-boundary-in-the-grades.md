---
id: debug-06b-boundary-in-the-grades
category: debugging
title: Bisect six diffs to the grade regression
deliverables:
  - BISECT.md
  - fixed.js
---

## Task

A `letterGrade(score)` helper passed its test at commit `C0`:

**C0 (baseline, passing):**

```js
function letterGrade(score) {
  if (score >= 90) return "A";
  var band = Math.floor(score / 10);
  if (band >= 8) return "B";
  if (band >= 7) return "C";
  if (band >= 6) return "D";
  return "F";
}

module.exports = { letterGrade: letterGrade };
```

**Stated unit test at C0:** `letterGrade(90) === "A"`.

Six commits `C1..C6` were applied in order after `C0`. Each is a small,
plausible change — a refactor, a feature addition, or a tweak. After
all six are applied, the stated unit test FAILS. Exactly ONE of the six
diffs introduced a behavior change that breaks it; the rest are
behavior-preserving (refactors or unrelated additions).

**Diff C1:**

```diff
--- C0.js
+++ C1.js
@@ -1,10 +1,11 @@
+// C1: cosmetic refactor - rename band to tensDigit for clarity, no behavior change
 function letterGrade(score) {
   if (score >= 90) return "A";
-  var band = Math.floor(score / 10);
-  if (band >= 8) return "B";
-  if (band >= 7) return "C";
-  if (band >= 6) return "D";
+  var tensDigit = Math.floor(score / 10);
+  if (tensDigit >= 8) return "B";
+  if (tensDigit >= 7) return "C";
+  if (tensDigit >= 6) return "D";
   return "F";
 }
 
 module.exports = { letterGrade: letterGrade };
```

**Diff C2:**

```diff
--- C1.js
+++ C2.js
@@ -1,5 +1,6 @@
-// C1: cosmetic refactor - rename band to tensDigit for clarity, no behavior change
+// C2: add input validation for out-of-range scores (feature addition, valid inputs unaffected)
 function letterGrade(score) {
+  if (score < 0 || score > 100) throw new Error("score out of range");
   if (score >= 90) return "A";
   var tensDigit = Math.floor(score / 10);
```

**Diff C3:**

```diff
--- C2.js
+++ C3.js
@@ -1,10 +1,12 @@
-// C2: add input validation for out-of-range scores (feature addition, valid inputs unaffected)
-function letterGrade(score) {
+// C3: add an opts.failLabel feature (unrelated addition); default (no opts) behavior unchanged
+function letterGrade(score, opts) {
+  opts = opts || {};
   if (score < 0 || score > 100) throw new Error("score out of range");
   if (score >= 90) return "A";
   var tensDigit = Math.floor(score / 10);
   if (tensDigit >= 8) return "B";
   if (tensDigit >= 7) return "C";
   if (tensDigit >= 6) return "D";
+  if (opts.failLabel) return opts.failLabel;
   return "F";
 }
```

**Diff C4:**

```diff
--- C3.js
+++ C4.js
@@ -1,6 +1,6 @@
-// C3: add an opts.failLabel feature (unrelated addition); default (no opts) behavior unchanged
+// C4: tighten the A-grade boundary check
 function letterGrade(score, opts) {
   opts = opts || {};
   if (score < 0 || score > 100) throw new Error("score out of range");
-  if (score >= 90) return "A";
+  if (score > 90) return "A";
   var tensDigit = Math.floor(score / 10);
   if (tensDigit >= 8) return "B";
```

**Diff C5:**

```diff
--- C4.js
+++ C5.js
@@ -1,6 +1,6 @@
-// C4: tighten the A-grade boundary check
+// C5: reformat the A-grade branch return line for consistency
 function letterGrade(score, opts) {
   opts = opts || {};
   if (score < 0 || score > 100) throw new Error("score out of range");
-  if (score > 90) return "A";
+  if (score > 90) return "A"; // reformatted comment only, same expression
   var tensDigit = Math.floor(score / 10);
   if (tensDigit >= 8) return "B";
```

**Diff C6:**

```diff
--- C5.js
+++ C6.js
@@ -1,4 +1,8 @@
-// C5: reformat the A-grade branch return line for consistency
+/**
+ * Maps a 0-100 numeric score to a letter grade.
+ * @param {number} score
+ * @param {{failLabel?: string}} [opts]
+ */
 function letterGrade(score, opts) {
   opts = opts || {};
   if (score < 0 || score > 100) throw new Error("score out of range");
-  if (score > 90) return "A"; // reformatted comment only, same expression
+  if (score > 90) return "A";
   var tensDigit = Math.floor(score / 10);
   if (tensDigit >= 8) return "B";
```

You do not need `git` or any tool — read the diffs as text and apply
them mentally in order, `C1` through `C6`.

## Deliverables

- `BISECT.md` — (1) name the single culprit commit (`C1`..`C6`) and
  quote the EXACT line it introduced that breaks the stated test,
  distinguishing it from the other diff that edits that same output
  line; (2) state the worst-case number of test runs a binary
  bisection needs to find one culprit among 6 suspect commits given a
  boolean pass/fail oracle, and give a valid probe sequence (which
  commits you'd test, in order) that reaches the actual culprit.
- `fixed.js` — `C1`..`C6` applied in order, with the one regression
  repaired (smallest change that restores the stated test) while
  keeping every other commit's change (including the `opts.failLabel`
  feature and the out-of-range guard). Include a self-test block
  runnable with `node fixed.js` printing a PASS/FAIL line for:
  1. `letterGrade(100)` → `"A"`
  2. `letterGrade(90)` → `"A"`
  3. `letterGrade(89)` → `"B"`
  4. `letterGrade(72)` → `"C"`
  5. `letterGrade(45)` → `"F"`

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
- Preserve every feature added by the five non-culprit commits (the
  `opts` parameter, the `failLabel` formatting, and the out-of-range
  guard all must remain in `fixed.js`).
