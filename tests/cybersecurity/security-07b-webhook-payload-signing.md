---
id: security-07b-webhook-payload-signing
category: cybersecurity
title: Sign the outbound webhooks for Marlpit Relay
deliverables:
  - CHOICE.md
  - sign.js
---

## Task

Marlpit Relay is a fictional event-delivery service. When something
happens in a customer's account, Marlpit POSTs a small JSON event to
that customer's HTTP endpoint. Each request carries a plaintext body
such as `event=order.shipped&id=evt-7734&ts=1893456000` and an
accompanying signature. The receiver must be able to confirm —
**without calling back to Marlpit and without any shared session
state** — that the body it received was genuinely sent by Marlpit and
was not altered in transit. Anyone who inspects the traffic, or who
reverse-engineers the scheme, must not be able to fabricate a valid
signature for a body of their choosing. The body is not secret — the
receiver is allowed to read every field — it simply must not be
forgeable.

Here is the current (broken) implementation:

```js
'use strict';
const crypto = require('crypto');

const SECRET = 'marlpit-relay-signing-secret';

function sign(payload, key) {
  return crypto.createHash('md5').update(key + payload).digest('hex');
}

function verify(payload, sig, key) {
  return sign(payload, key) === sig;
}

module.exports = { sign, verify, SECRET };
```

This has three problems: MD5 is a fast, broken hash for this purpose;
concatenating `key + payload` before hashing is not a proper keyed MAC
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
  asymmetric encryption of the payload) does NOT fit. Explain why the
  original `md5(secret + payload)` construction is unsafe as a MAC, and
  why the comparison must be constant-time.
- `sign.js` — a plain dependency-free Node module (only Node's
  built-in `crypto`) exporting `sign(payload, key)` and `verify(payload,
  sig, key)` implementing the corrected construction.

## Constraints

- Plain Node.js, no dependencies beyond the built-in `crypto` module.
- `verify` must run in constant time with respect to the signature
  value — no early-exit string/byte comparison of the signature.
- Do not weaken the requirement (e.g. do not add a callback to Marlpit
  or a shared session store; the whole point is stateless
  verification by the receiver).
