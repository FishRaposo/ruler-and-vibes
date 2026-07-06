---
id: security-02c-shelf-triage
category: cybersecurity
title: Eight fragments, four of them bluffing you
deliverables:
  - TRIAGE.md
---

## Task

Below are eight independent code snippets (A-H) from a fictional
shared reading-list app. Some are genuinely vulnerable; some only look
risky. Classify each one correctly — misclassifying a safe snippet as
vulnerable is scored just as harshly as missing a real flaw.

```js
// ===== Snippet A (order a reader's shelf by a user-chosen field) =====
const SHELF_SORT = Object.freeze({ title: 'book_title', progress: 'pct_read', added: 'added_at' });
function buildShelfQuery(db, userSortKey, minProgress) {
  const column = Object.prototype.hasOwnProperty.call(SHELF_SORT, userSortKey)
    ? SHELF_SORT[userSortKey]
    : 'book_title';
  const sql = `SELECT * FROM shelf_items WHERE pct_read >= ? ORDER BY ${column} ASC`;
  return db.query(sql, [minProgress]);
}

// ===== Snippet B (import a shared shelf's nested display preferences) =====
function mergeShelfPrefs(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      mergeShelfPrefs(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
// usage: mergeShelfPrefs(defaultPrefs, JSON.parse(req.body.prefs))

// ===== Snippet C (ping a user-provided peer host to check catalog sync) =====
const { exec } = require('child_process');
function checkPeerHost(hostname, cb) {
  exec('ping -c 1 ' + hostname, (err, stdout) => cb(err, stdout));
}

// ===== Snippet D (render a book cover thumbnail via a helper binary) =====
const { execFile } = require('child_process');
function renderCoverThumbnail(bookId, cb) {
  execFile('cover-render', ['--book', String(bookId)], (err, stdout) => cb(err, stdout));
}

// ===== Snippet E (render a reader's user-submitted display name in a card) =====
function renderReaderName(container, name) {
  container.textContent = name;
}

// ===== Snippet F (render a user-submitted book review body) =====
function renderReviewBody(container, body) {
  container.innerHTML = body;
}

// ===== Snippet G (validate a shelf name against a "tidy" shape) =====
function isTidyShelfName(name) {
  const pattern = /^(([A-Za-z]+)*)+$/;
  return pattern.test(name);
}

// ===== Snippet H (rotate a cosmetic "reading nudge" on the home screen) =====
const NUDGES = ['Read slower.', 'One more chapter.', 'Margins are yours.'];
function pickReadingNudge() {
  return NUDGES[Math.floor(Math.random() * NUDGES.length)];
}
```

## Deliverables

- `TRIAGE.md` — a table covering all eight labels A-H, exactly one
  verdict (VULNERABLE or SAFE) per label. For each snippet classified
  VULNERABLE, name the vulnerability class and give a concrete,
  correct one-line fix. For each snippet classified SAFE, give a
  one-line justification of why the apparent risk doesn't apply.

## Constraints

- Every one of A-H must appear exactly once in the table — no
  omissions, no double-classification.
- Justifications must engage with the actual data flow in the
  snippet, not just its surface resemblance to a known bad pattern.
