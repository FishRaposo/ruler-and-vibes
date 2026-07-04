---
id: security-07-crypto-scheme-selection
category: cybersecurity
title: Sign the download links for Petrel Vault
deliverables:
  - CHOICE.md
  - sign.js
---

## Task

Petrel Vault is a fictional file vault. The server issues time-limited
download URLs of the form `file=<id>&exp=<unixSeconds>`. The server
must be able to verify — **without a database lookup** — that a given
`(file, exp)` pair was actually issued by the server and has not been
tampered with. Anyone who guesses or reverse-engineers the scheme must
not be able to forge a valid URL for a file/expiry of their choosing.
There is no confidentiality requirement — the params are not secret,
they just must not be forgeable.

Here is the current (broken) implementation:

```js
'use strict';
const crypto = require('crypto');

const SECRET = 'petrel-vault-secret-key';

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
Do not write anything that forges a signature or exploits the broken
scheme — the deliverable is the corrected construction and your
reasoning for choosing it.

## Deliverables

- `CHOICE.md` — name the primitive you chose and justify it: why a
  keyed MAC fits this requirement, and why each tempting alternative
  (plain hash of secret-concatenated-with-message, symmetric or
  asymmetric encryption of the params) does NOT fit. Explain why the
  original `md5(secret + params)` construction is unsafe as a MAC, and
  why the comparison must be constant-time.
- `sign.js` — a plain dependency-free Node module (only Node's
  built-in `crypto`) exporting `sign(params, key)` and `verify(params,
  sig, key)` implementing the corrected construction.

## Constraints

- Plain Node.js, no dependencies beyond the built-in `crypto` module.
- `verify` must run in constant time with respect to the signature
  value — no early-exit string/byte comparison of the signature.
- Do not weaken the requirement (e.g. do not add a database lookup;
  the whole point is stateless verification).
