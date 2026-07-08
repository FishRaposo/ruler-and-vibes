---
id: security-08c-baycode-field-validator
category: cybersecurity
title: Guard the bay-code field for Pallenwick Lockers
deliverables:
  - validate.js
  - NOTES.md
---

## Task

Pallenwick Lockers is a fictional parcel-locker network. You are writing
the server-side validator for its warehouse **bay-code** field. A valid
bay code must satisfy **all** of the following:

- length between 4 and 22 characters, inclusive
- contains only lowercase ASCII letters, digits, and single hyphens
- starts with a letter
- does not end with a hyphen
- does not contain two consecutive hyphens
- anything else is invalid: non-string input, leading/trailing
  whitespace, embedded newlines or other control characters, uppercase
  letters, unicode look-alikes, etc.

This is defensive input-validation work: build an allowlist validator
that correctly accepts only well-formed bay codes and rejects everything
else. Do not write anything that bypasses validation — the deliverable
is the validator itself plus your notes.

## Deliverables

- `validate.js` — a plain dependency-free Node module exporting
  `validateBayCode(s)`, returning a boolean. Runnable with plain
  `node`, no dependencies.
- `NOTES.md` — explain your regex/parsing approach, and call out at
  least one JavaScript-specific footgun you deliberately avoided (for
  example: the effect of the regex `m` flag on `$` anchoring across
  embedded newlines, or the risk of an unanchored pattern matching a
  valid substring inside otherwise-invalid input).

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- `validateBayCode` must return a boolean (`true`/`false`), never throw,
  regardless of input type.
- Your validation pattern must be fully anchored (`^` ... `$`) and must
  not use the regex `m` (multiline) flag.
- Test your implementation yourself against at least: `"dock"`,
  `"bay-7"`, `"bay\ndock"`, `"BAY dock"`, `"a--b"`, `"bay-"`, `" bay"`,
  `"Dock"`, `"dk"` before finishing.
