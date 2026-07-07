---
id: debug-06c-bisect-size-diffs
category: debugging
title: Bisect six diffs to one culprit in a size formatter
deliverables:
  - BISECT.md
  - fixed.js
---

## Task

A `formatSize(bytes)` helper passed its test at commit `C0`:

**C0 (baseline, passing):**

```js
function formatSize(bytes) {
  if (bytes < 1024) return bytes + "B";
  var kb = Math.floor(bytes / 1024);
  var b = bytes % 1024;
  if (kb < 1024) return kb + "K " + b + "B";
  var mb = Math.floor(kb / 1024);
  kb = kb % 1024;
  return mb + "M " + kb + "K " + b + "B";
}

module.exports = { formatSize: formatSize };
```

**Stated unit test at C0:** `formatSize(1048576) === "1M 0K 0B"`.

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
+// C1: cosmetic refactor - rename the leftover-bytes variable, no behavior change
 function formatSize(bytes) {
   if (bytes < 1024) return bytes + "B";
   var kb = Math.floor(bytes / 1024);
-  var b = bytes % 1024;
-  if (kb < 1024) return kb + "K " + b + "B";
+  var bytesPart = bytes % 1024;
+  if (kb < 1024) return kb + "K " + bytesPart + "B";
   var mb = Math.floor(kb / 1024);
   kb = kb % 1024;
-  return mb + "M " + kb + "K " + b + "B";
+  return mb + "M " + kb + "K " + bytesPart + "B";
 }
 
 module.exports = { formatSize: formatSize };
```

**Diff C2:**

```diff
--- C1.js
+++ C2.js
@@ -1,5 +1,6 @@
-// C1: cosmetic refactor - rename the leftover-bytes variable, no behavior change
+// C2: add input validation for negative sizes (feature addition, valid inputs unaffected)
 function formatSize(bytes) {
+  if (bytes < 0) throw new Error("negative size");
   if (bytes < 1024) return bytes + "B";
   var kb = Math.floor(bytes / 1024);
   var bytesPart = bytes % 1024;
```

**Diff C3:**

```diff
--- C2.js
+++ C3.js
@@ -1,5 +1,6 @@
-// C2: add input validation for negative sizes (feature addition, valid inputs unaffected)
-function formatSize(bytes) {
+// C3: add an opts.terse feature (unrelated addition); default (no opts) behavior unchanged
+function formatSize(bytes, opts) {
+  opts = opts || {};
   if (bytes < 0) throw new Error("negative size");
   if (bytes < 1024) return bytes + "B";
   var kb = Math.floor(bytes / 1024);
@@ -7,6 +8,7 @@
   if (kb < 1024) return kb + "K " + bytesPart + "B";
   var mb = Math.floor(kb / 1024);
   kb = kb % 1024;
+  if (opts.terse) return mb + "M" + kb + "K" + bytesPart + "B";
   return mb + "M " + kb + "K " + bytesPart + "B";
 }
 
```

**Diff C4:**

```diff
--- C3.js
+++ C4.js
@@ -1,11 +1,11 @@
-// C3: add an opts.terse feature (unrelated addition); default (no opts) behavior unchanged
+// C4: tighten the kilobyte-boundary check
 function formatSize(bytes, opts) {
   opts = opts || {};
   if (bytes < 0) throw new Error("negative size");
   if (bytes < 1024) return bytes + "B";
   var kb = Math.floor(bytes / 1024);
   var bytesPart = bytes % 1024;
-  if (kb < 1024) return kb + "K " + bytesPart + "B";
+  if (kb <= 1024) return kb + "K " + bytesPart + "B";
   var mb = Math.floor(kb / 1024);
   kb = kb % 1024;
   if (opts.terse) return mb + "M" + kb + "K" + bytesPart + "B";
```

**Diff C5:**

```diff
--- C4.js
+++ C5.js
@@ -1,11 +1,11 @@
-// C4: tighten the kilobyte-boundary check
+// C5: reformat the kilobyte-branch return line for consistency
 function formatSize(bytes, opts) {
   opts = opts || {};
   if (bytes < 0) throw new Error("negative size");
   if (bytes < 1024) return bytes + "B";
   var kb = Math.floor(bytes / 1024);
   var bytesPart = bytes % 1024;
-  if (kb <= 1024) return kb + "K " + bytesPart + "B";
+  if (kb <= 1024) return kb + "K " + bytesPart + "B"; // reformatted comment only, same expression
   var mb = Math.floor(kb / 1024);
   kb = kb % 1024;
   if (opts.terse) return mb + "M" + kb + "K" + bytesPart + "B";
```

**Diff C6:**

```diff
--- C5.js
+++ C6.js
@@ -1,11 +1,15 @@
-// C5: reformat the kilobyte-branch return line for consistency
+/**
+ * Formats a non-negative byte count as a human string (binary units).
+ * @param {number} bytes
+ * @param {{terse?: boolean}} [opts]
+ */
 function formatSize(bytes, opts) {
   opts = opts || {};
   if (bytes < 0) throw new Error("negative size");
   if (bytes < 1024) return bytes + "B";
   var kb = Math.floor(bytes / 1024);
   var bytesPart = bytes % 1024;
-  if (kb <= 1024) return kb + "K " + bytesPart + "B"; // reformatted comment only, same expression
+  if (kb <= 1024) return kb + "K " + bytesPart + "B";
   var mb = Math.floor(kb / 1024);
   kb = kb % 1024;
   if (opts.terse) return mb + "M" + kb + "K" + bytesPart + "B";
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
  keeping every other commit's change (including the `opts.terse`
  feature and the negative-size guard). Include a self-test block
  runnable with `node fixed.js` printing a PASS/FAIL line for:
  1. `formatSize(0)` → `"0B"`
  2. `formatSize(1023)` → `"1023B"`
  3. `formatSize(1024)` → `"1K 0B"`
  4. `formatSize(1049601)` → `"1M 1K 1B"`
  5. `formatSize(1048576)` → `"1M 0K 0B"`

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
- Preserve every feature added by the five non-culprit commits (the
  `opts` parameter, the `terse` formatting, and the negative-size
  guard all must remain in `fixed.js`).
