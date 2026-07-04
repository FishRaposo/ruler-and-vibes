---
id: security-08-input-validator-authoring
category: cybersecurity
title: Guard the handle field for Spinnaker Social
deliverables:
  - validate.js
  - NOTES.md
---

## Task

Spinnaker Social is a fictional social app. You are writing the
server-side validator for its account-handle field. A valid handle
must satisfy **all** of the following:

- length between 3 and 20 characters, inclusive
- contains only lowercase ASCII letters, digits, and single
  underscores
- starts with a letter
- does not end with an underscore
- does not contain two consecutive underscores
- anything else is invalid: non-string input, leading/trailing
  whitespace, embedded newlines or other control characters,
  uppercase letters, unicode look-alikes, etc.

This is defensive input-validation work: build an allowlist validator
that correctly accepts only well-formed handles and rejects everything
else. Do not write anything that bypasses validation — the deliverable
is the validator itself plus your notes.

## Deliverables

- `validate.js` — a plain dependency-free Node module exporting
  `validateHandle(s)`, returning a boolean. Runnable with plain
  `node`, no dependencies.
- `NOTES.md` — explain your regex/parsing approach, and call out at
  least one JavaScript-specific footgun you deliberately avoided (for
  example: the effect of the regex `m` flag on `$` anchoring across
  embedded newlines, or the risk of an unanchored pattern matching a
  valid substring inside otherwise-invalid input).

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- `validateHandle` must return a boolean (`true`/`false`), never throw,
  regardless of input type.
- Your validation pattern must be fully anchored (`^` ... `$`) and must
  not use the regex `m` (multiline) flag.
- Test your implementation yourself against at least: `"abc"`,
  `"a1_b"`, `"abc\nrm"`, `"BAD ok"`, `"a__b"`, `"ab_"`, `" ab"`,
  `"Abc"`, `"ab"` before finishing.
