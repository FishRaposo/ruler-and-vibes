---
id: security-02b-plan-import-triage
category: cybersecurity
title: Eight handlers, four of them a trap
deliverables:
  - TRIAGE.md
---

## Task

Below are eight independent code snippets (A-H) from a fictional
workout-logging app. Some are genuinely vulnerable; some only look
risky. Classify each one correctly — misclassifying a safe snippet as
vulnerable is scored just as harshly as missing a real flaw.

```js
// ===== Snippet A (order a workout feed by a user-chosen field) =====
const ORDER_FIELDS = Object.freeze({ heaviest: 'top_weight', newest: 'logged_at', volume: 'total_volume' });
function buildFeedQuery(db, userOrderKey, athleteId) {
  const col = Object.prototype.hasOwnProperty.call(ORDER_FIELDS, userOrderKey)
    ? ORDER_FIELDS[userOrderKey]
    : 'logged_at';
  const sql = `SELECT * FROM workouts WHERE athlete_id = ? ORDER BY ${col} DESC`;
  return db.query(sql, [athleteId]);
}

// ===== Snippet B (import a shared training plan's nested overrides) =====
function applyPlanOverrides(base, overrides) {
  for (const field in overrides) {
    if (overrides[field] && typeof overrides[field] === 'object') {
      if (!base[field]) base[field] = {};
      applyPlanOverrides(base[field], overrides[field]);
    } else {
      base[field] = overrides[field];
    }
  }
  return base;
}
// usage: applyPlanOverrides(defaultPlan, JSON.parse(req.body.overrides))

// ===== Snippet C (surface a cosmetic "hype line" on the session screen) =====
const HYPE_LINES = ['New PR loading.', 'One more rep.', 'Own the eccentric.'];
function pickHypeLine() {
  return HYPE_LINES[Math.floor(Math.random() * HYPE_LINES.length)];
}

// ===== Snippet D (resolve a user-provided device host to check sync reachability) =====
const { exec } = require('child_process');
function resolveDeviceHost(hostname, cb) {
  exec('nslookup ' + hostname, (err, stdout) => cb(err, stdout));
}

// ===== Snippet E (export a session log to CSV via a helper binary) =====
const { execFile } = require('child_process');
function exportSessionCsv(sessionId, cb) {
  execFile('session-export', ['--session', String(sessionId)], (err, stdout) => cb(err, stdout));
}

// ===== Snippet F (render a coach's user-submitted note on a session) =====
function renderCoachNote(container, note) {
  container.innerHTML = note;
}

// ===== Snippet G (render an athlete's user-submitted display name in a card) =====
function renderAthleteName(container, name) {
  container.textContent = name;
}

// ===== Snippet H (validate a workout tag against a "clean slug" shape) =====
function isCleanSlug(tag) {
  const pattern = /^([a-z]+-?)+$/;
  return pattern.test(tag);
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
