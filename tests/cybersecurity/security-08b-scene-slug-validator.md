---
id: security-08b-scene-slug-validator
category: cybersecurity
title: Guard the scene-slug field for Lumenhaus
deliverables:
  - validate.js
  - NOTES.md
---

## Task

Lumenhaus is a fictional smart-lighting platform. You are writing the
server-side validator for its lighting-scene slug field (the short key
an operator assigns to a saved lighting scene). A valid scene slug must
satisfy **all** of the following:

- length between 4 and 24 characters, inclusive
- contains only lowercase ASCII letters, digits, and single
  underscores
- starts with a letter
- does not end with an underscore
- does not contain two consecutive underscores
- anything else is invalid: non-string input, leading/trailing
  whitespace, embedded newlines or other control characters,
  uppercase letters, unicode look-alikes, etc.

This is defensive input-validation work: build an allowlist validator
that correctly accepts only well-formed slugs and rejects everything
else. Do not write anything that bypasses validation — the deliverable
is the validator itself plus your notes.

## Deliverables

- `validate.js` — a plain dependency-free Node module exporting
  `validateSceneSlug(s)`, returning a boolean. Runnable with plain
  `node`, no dependencies.
- `NOTES.md` — explain your regex/parsing approach, and call out at
  least one JavaScript-specific footgun you deliberately avoided (for
  example: the effect of the regex `m` flag on `$` anchoring across
  embedded newlines, or the risk of an unanchored pattern matching a
  valid substring inside otherwise-invalid input).

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- `validateSceneSlug` must return a boolean (`true`/`false`), never
  throw, regardless of input type.
- Your validation pattern must be fully anchored (`^` ... `$`) and must
  not use the regex `m` (multiline) flag.
- Test your implementation yourself against at least: `"glow"`,
  `"z9_lux"`, `"dusk\ndrop"`, `"BRIGHT hue"`, `"a__b_x"`, `"patio_"`,
  `" glow"`, `"Dawn"`, `"dim"` before finishing.
