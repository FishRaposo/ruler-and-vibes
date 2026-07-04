---
id: security-02-decoy-triage
category: cybersecurity
title: Eight snippets, four of them lying to you
deliverables:
  - TRIAGE.md
---

## Task

Below are eight independent code snippets (A-H) from a fictional
recipe-sharing app. Some are genuinely vulnerable; some only look
risky. Classify each one correctly — misclassifying a safe snippet as
vulnerable is scored just as harshly as missing a real flaw.

```js
// ===== Snippet A (import shared recipe collections) =====
function mergeRecipeSettings(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      mergeRecipeSettings(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
// usage: mergeRecipeSettings(defaultSettings, JSON.parse(req.body.settings))

// ===== Snippet B (sort recipes by a user-chosen column) =====
const SORT_COLUMNS = Object.freeze({ name: 'recipe_name', rating: 'avg_rating', date: 'created_at' });
function sortRecipesQuery(db, userSortKey, minRating) {
  const column = Object.prototype.hasOwnProperty.call(SORT_COLUMNS, userSortKey)
    ? SORT_COLUMNS[userSortKey]
    : 'recipe_name';
  const sql = `SELECT * FROM recipes WHERE rating >= ? ORDER BY ${column} ASC`;
  return db.query(sql, [minRating]);
}

// ===== Snippet C (validate a recipe title against a "reasonable format") =====
function isReasonableTitle(title) {
  const pattern = /^(([a-zA-Z]+)+)+$/;
  return pattern.test(title);
}

// ===== Snippet D (export a recipe collection to PDF via a helper binary) =====
const { execFile } = require('child_process');
function exportRecipePdf(recipeId, cb) {
  execFile('recipe-to-pdf', ['--id', String(recipeId)], (err, stdout) => cb(err, stdout));
}

// ===== Snippet E (render a recipe's user-submitted description) =====
function renderRecipeDescription(container, description) {
  container.innerHTML = description;
}

// ===== Snippet F (render a recipe's user-submitted title in a card) =====
function renderRecipeTitle(container, title) {
  container.textContent = title;
}

// ===== Snippet G (ping a user-provided mirror host to check availability) =====
const { exec } = require('child_process');
function checkMirrorHost(hostname, cb) {
  exec('ping -c 1 ' + hostname, (err, stdout) => cb(err, stdout));
}

// ===== Snippet H (rotate a cosmetic "cooking tip of the day" banner) =====
const TIPS = ['Rest your dough.', 'Salt in stages.', 'Toast your spices.'];
function pickRandomTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
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
