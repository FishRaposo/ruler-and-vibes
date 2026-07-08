---
id: agent-04b-pr-review-auth
category: agentic-coding
title: Review auth helper diff
deliverables:
  - REVIEW.md
---

## Task

Diff for isAdmin:

```diff
-function isAdmin(user) {
-  return user && user.role === 'admin';
-}
+function isAdmin(user) {
+  return user.role == 'admin'; // loose equality; throws if user null
+}
```

Real defects (exactly two blockers):
1. Null/undefined user throws (no guard).
2. Compares only `role === 'admin'`, but the PR description says treat
   **admin or owner** as admin — owner is dropped.

Loose `==` vs `===` is **not** a blocker for this review.

Style decoy: missing semicolon — not a blocker.

Write REVIEW.md with ## Blockers and ## Nits.

## Deliverables

- `REVIEW.md`.

## Constraints

- ≤ 300 words.
