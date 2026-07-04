---
id: debug-06-bisect-the-diffs
category: debugging
title: Bisect six diffs to one culprit
deliverables:
  - BISECT.md
  - fixed.js
---

## Task

A `formatDuration(seconds)` helper passed its test at commit `C0`:

**C0 (baseline, passing):**

```js
function formatDuration(seconds) {
  if (seconds < 60) return seconds + "s";
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  if (m < 60) return m + "m " + s + "s";
  var h = Math.floor(m / 60);
  m = m % 60;
  return h + "h " + m + "m " + s + "s";
}

module.exports = { formatDuration: formatDuration };
```

**Stated unit test at C0:** `formatDuration(3600) === "1h 0m 0s"`.

Six commits `C1..C6` were applied in order after `C0`. Each is a small,
plausible change — a refactor, a feature addition, or a tweak. After
all six are applied, the stated unit test FAILS. Exactly ONE of the six
diffs introduced a behavior change that breaks it; the rest are
behavior-preserving (refactors or unrelated additions).

**Diff C1:**

```diff
--- C0.js
+++ C1.js
@@ -1,11 +1,12 @@
+// C1: cosmetic refactor - use const-style naming for the seconds-remainder, no behavior change
 function formatDuration(seconds) {
   if (seconds < 60) return seconds + "s";
   var m = Math.floor(seconds / 60);
-  var s = seconds % 60;
-  if (m < 60) return m + "m " + s + "s";
+  var secsPart = seconds % 60;
+  if (m < 60) return m + "m " + secsPart + "s";
   var h = Math.floor(m / 60);
   m = m % 60;
-  return h + "h " + m + "m " + s + "s";
+  return h + "h " + m + "m " + secsPart + "s";
 }
 
 module.exports = { formatDuration: formatDuration };
```

**Diff C2:**

```diff
--- C1.js
+++ C2.js
@@ -1,5 +1,6 @@
-// C1: cosmetic refactor - use const-style naming for the seconds-remainder, no behavior change
+// C2: add input validation for negative durations (feature addition, valid inputs unaffected)
 function formatDuration(seconds) {
+  if (seconds < 0) throw new Error("negative duration");
   if (seconds < 60) return seconds + "s";
   var m = Math.floor(seconds / 60);
   var secsPart = seconds % 60;
```

**Diff C3:**

```diff
--- C2.js
+++ C3.js
@@ -1,5 +1,6 @@
-// C2: add input validation for negative durations (feature addition, valid inputs unaffected)
-function formatDuration(seconds) {
+// C3: add an opts.compact feature (unrelated addition); default (no opts) behavior unchanged
+function formatDuration(seconds, opts) {
+  opts = opts || {};
   if (seconds < 0) throw new Error("negative duration");
   if (seconds < 60) return seconds + "s";
   var m = Math.floor(seconds / 60);
@@ -7,6 +8,7 @@
   if (m < 60) return m + "m " + secsPart + "s";
   var h = Math.floor(m / 60);
   m = m % 60;
+  if (opts.compact) return h + "h" + m + "m" + secsPart + "s";
   return h + "h " + m + "m " + secsPart + "s";
 }
 
```

**Diff C4:**

```diff
--- C3.js
+++ C4.js
@@ -1,11 +1,11 @@
-// C3: add an opts.compact feature (unrelated addition); default (no opts) behavior unchanged
+// C4: tighten the hour-boundary check
 function formatDuration(seconds, opts) {
   opts = opts || {};
   if (seconds < 0) throw new Error("negative duration");
   if (seconds < 60) return seconds + "s";
   var m = Math.floor(seconds / 60);
   var secsPart = seconds % 60;
-  if (m < 60) return m + "m " + secsPart + "s";
+  if (m <= 60) return m + "m " + secsPart + "s";
   var h = Math.floor(m / 60);
   m = m % 60;
   if (opts.compact) return h + "h" + m + "m" + secsPart + "s";
```

**Diff C5:**

```diff
--- C4.js
+++ C5.js
@@ -1,11 +1,11 @@
-// C4: tighten the hour-boundary check
+// C5: reformat the minutes-branch return line for consistency
 function formatDuration(seconds, opts) {
   opts = opts || {};
   if (seconds < 0) throw new Error("negative duration");
   if (seconds < 60) return seconds + "s";
   var m = Math.floor(seconds / 60);
   var secsPart = seconds % 60;
-  if (m <= 60) return m + "m " + secsPart + "s";
+  if (m <= 60) return m + "m " + secsPart + "s"; // reformatted comment only, same expression
   var h = Math.floor(m / 60);
   m = m % 60;
   if (opts.compact) return h + "h" + m + "m" + secsPart + "s";
```

**Diff C6:**

```diff
--- C5.js
+++ C6.js
@@ -1,11 +1,15 @@
-// C5: reformat the minutes-branch return line for consistency
+/**
+ * Formats a non-negative duration in seconds as a human string.
+ * @param {number} seconds
+ * @param {{compact?: boolean}} [opts]
+ */
 function formatDuration(seconds, opts) {
   opts = opts || {};
   if (seconds < 0) throw new Error("negative duration");
   if (seconds < 60) return seconds + "s";
   var m = Math.floor(seconds / 60);
   var secsPart = seconds % 60;
-  if (m <= 60) return m + "m " + secsPart + "s"; // reformatted comment only, same expression
+  if (m <= 60) return m + "m " + secsPart + "s";
   var h = Math.floor(m / 60);
   m = m % 60;
   if (opts.compact) return h + "h" + m + "m" + secsPart + "s";
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
  keeping every other commit's change (including the `opts.compact`
  feature and the negative-duration guard). Include a self-test block
  runnable with `node fixed.js` printing a PASS/FAIL line for:
  1. `formatDuration(0)` → `"0s"`
  2. `formatDuration(59)` → `"59s"`
  3. `formatDuration(60)` → `"1m 0s"`
  4. `formatDuration(3661)` → `"1h 1m 1s"`
  5. `formatDuration(3600)` → `"1h 0m 0s"`

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
- Preserve every feature added by the five non-culprit commits (the
  `opts` parameter, the `compact` formatting, and the negative-duration
  guard all must remain in `fixed.js`).
