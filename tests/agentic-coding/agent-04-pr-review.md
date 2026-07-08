---
id: agent-04-pr-review
category: agentic-coding
title: Review a diff: real bugs vs style nits
deliverables:
  - REVIEW.md
---

## Task

Review this pull request diff for `total.js`. Write REVIEW.md.

```diff
--- a/total.js
+++ b/total.js
@@ function sum(nums) {
-  let s = 0;
-  for (const n of nums) s += n;
-  return s;
+  let s = 0;
+  for (var i = 0; i <= nums.length; i++) { // loop bound
+    s += nums[i];
+  }
+  return s * 1.0; // style: pointless *1.0
 }
@@ function avg(nums) {
-  return sum(nums) / nums.length;
+  return sum(nums) / nums.length; // empty array → Infinity/NaN still unhandled
 }
```

Known intent: sum and avg of numbers; empty avg should return null.

There are **exactly three real defects** you must catch:
1. Off-by-one loop (`i <= length`) → reads undefined.
2. Empty `avg` still divides by zero / length 0.
3. Using `var i` is NOT a real defect for this review — ignore pure style
   except: the pointless `* 1.0` is a **style decoy** (must NOT be listed
   as a blocking bug).

Also ignore "should use const" nits.

REVIEW.md must list blocking bugs with severity blocker, and optionally
nits separately.

## Deliverables

- `REVIEW.md` — sections `## Blockers` and `## Nits` (nits may be empty).

## Constraints

- ≤ 350 words.
- Blockers must include the off-by-one and empty-avg issues.
