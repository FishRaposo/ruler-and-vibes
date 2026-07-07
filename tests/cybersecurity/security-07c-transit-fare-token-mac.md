---
id: security-07c-transit-fare-token-mac
category: cybersecurity
title: Stamp the offline fare tokens for Tollcrest Transit
deliverables:
  - SELECTION.md
  - token.js
---

## Task

Tollcrest Transit runs fictional offline fare gates. When a rider taps
out, the gate encodes a short token of the form
`gate=<id>&valid=<unixSeconds>`. A downstream gate must be able to
confirm — **without calling back to any central server** — that a given
`(gate, valid)` pair was really stamped by the transit system and has
not been altered. Anyone who inspects or reconstructs the token format
must not be able to mint a valid token for a gate/expiry of their
choosing. Nothing here is secret — the gate id and validity time are
printed on the token and readable by anyone; they simply must not be
forgeable.

Here is the current (broken) implementation:

```js
'use strict';
const crypto = require('crypto');

const SECRET = 'tollcrest-gate-shared-key';

function sign(params, key) {
  return crypto.createHash('md5').update(key + params).digest('hex');
}

function verify(params, sig, key) {
  return sign(params, key) === sig;
}

module.exports = { sign, verify, SECRET };
```

This has three problems: MD5 is a fast, broken hash for this purpose;
concatenating `key + params` before hashing is not a proper keyed MAC
construction (it is shaped like a length-extension vulnerability, not
a real HMAC); and comparing digests with `===` leaks timing
information about how many leading bytes matched.

Your task is defensive: select the correct cryptographic primitive
class for this threat model and build a correct, runnable replacement.
Do not write anything that forges a token or exploits the broken
scheme — the deliverable is the corrected construction and your
reasoning for choosing it.

## Deliverables

- `SELECTION.md` — name the primitive you chose and justify it: why a
  keyed MAC fits this requirement, and why each tempting alternative
  (plain hash of secret-concatenated-with-message, symmetric or
  asymmetric encryption of the params) does NOT fit. Explain why the
  original `md5(secret + params)` construction is unsafe as a MAC, and
  why the comparison must be constant-time.
- `token.js` — a plain dependency-free Node module (only Node's
  built-in `crypto`) exporting `sign(params, key)` and `verify(params,
  sig, key)` implementing the corrected construction.

## Constraints

- Plain Node.js, no dependencies beyond the built-in `crypto` module.
- `verify` must run in constant time with respect to the signature
  value — no early-exit string/byte comparison of the signature.
- Do not weaken the requirement (e.g. do not add a server callback or
  a stored token table; the whole point is offline, stateless
  verification).
