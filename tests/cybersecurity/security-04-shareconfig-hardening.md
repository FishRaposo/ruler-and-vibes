---
id: security-04-shareconfig-hardening
category: cybersecurity
title: Hardening Petrel Docs before the share-link launch
deliverables:
  - HARDENING.md
  - hardened-config.json
  - THREATMODEL.md
---

## Task

Petrel Docs is a document-sharing app about to launch a public
share-link feature: any user will be able to generate a link that lets
anyone with the URL view a document without logging in, optionally
with an expiry. Below is the app's current `config.json`. Review it
for security weaknesses and produce a hardened version.

```json
{
  "appName": "Petrel Docs",
  "environment": "production",
  "server": {
    "port": 8443,
    "debugEndpointEnabled": true,
    "debugEndpointPath": "/internal/debug/env"
  },
  "cors": {
    "allowedOrigins": ["*"],
    "allowCredentials": true,
    "allowedMethods": ["GET", "POST", "PUT", "DELETE"]
  },
  "session": {
    "cookie": {
      "name": "petrel_sid",
      "secure": false,
      "httpOnly": false,
      "sameSite": "none"
    },
    "sessionIdleTimeoutMinutes": 15
  },
  "auth": {
    "passwordHashAlgorithm": "md5",
    "passwordMinLength": 12,
    "maxLoginAttemptsPerMinute": 10
  },
  "shareLinks": {
    "tokenLength": 6,
    "tokenCharset": "digits",
    "expiryDays": 0,
    "allowPublicUnauthenticated": true
  },
  "uploads": {
    "allowedExtensions": [".pdf", ".docx", ".png", ".jpg", ".html"],
    "serveInline": true,
    "servedFromOrigin": "https://docs.petrel.example.com",
    "maxSizeMb": 25
  },
  "logging": {
    "level": "info",
    "redactSecrets": true
  }
}
```

## Deliverables

- `HARDENING.md` — numbered list of weaknesses found; for each, the
  concrete risk and the specific fix applied.
- `hardened-config.json` — valid JSON, same shape as the original,
  with every real weakness fixed. Leave any value you judge already
  adequate untouched — don't change something just to have touched it.
- `THREATMODEL.md` — a threat model for the share-link feature
  specifically: a table of at least 3 named assets at risk, and at
  least 6 distinct threat-to-mitigation pairs (e.g. token guessing,
  link leakage via the `Referer` header, uploaded content executing in
  a viewer's browser, indefinite link lifetime).

## Constraints

- `hardened-config.json` must parse as valid JSON.
- Change only what's actually wrong; don't rewrite keys you can't
  justify changing.
