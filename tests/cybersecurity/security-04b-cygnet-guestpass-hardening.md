---
id: security-04b-cygnet-guestpass-hardening
category: cybersecurity
title: Hardening Cygnet Hub before the guest-pass launch
deliverables:
  - HARDENING.md
  - hardened-settings.json
  - THREATMODEL.md
---

## Task

Cygnet Hub is a smart-building access controller about to launch a
public guest-pass feature: any tenant will be able to generate a QR
code that lets anyone holding it unlock the lobby door without an
account, optionally with a time limit. Below is the controller's
current `settings.json`. Review it for security weaknesses and produce
a hardened version.

```json
{
  "appName": "Cygnet Hub",
  "environment": "production",
  "server": {
    "listenPort": 9600,
    "diagnosticsEndpointEnabled": true,
    "diagnosticsEndpointPath": "/ops/diagnostics/env"
  },
  "crossOrigin": {
    "allowedOrigins": ["*"],
    "allowCredentials": true,
    "allowedMethods": ["GET", "POST", "PATCH", "DELETE"]
  },
  "session": {
    "cookie": {
      "name": "cygnet_session",
      "secure": false,
      "httpOnly": false,
      "sameSite": "none"
    },
    "idleTimeoutMinutes": 20
  },
  "auth": {
    "passphraseHashAlgorithm": "sha1",
    "passphraseMinLength": 14,
    "maxUnlockAttemptsPerMinute": 8
  },
  "guestPasses": {
    "codeLength": 5,
    "codeCharset": "digits",
    "validityHours": 0,
    "allowAnonymousEntry": true
  },
  "attachments": {
    "allowedExtensions": [".pdf", ".png", ".jpg", ".mp4", ".svg"],
    "renderInline": true,
    "servedFromOrigin": "https://hub.cygnet.example.io",
    "maxSizeMb": 40
  },
  "telemetry": {
    "level": "info",
    "maskCredentials": true
  }
}
```

## Deliverables

- `HARDENING.md` — numbered list of weaknesses found; for each, the
  concrete risk and the specific fix applied.
- `hardened-settings.json` — valid JSON, same shape as the original,
  with every real weakness fixed. Leave any value you judge already
  adequate untouched — don't change something just to have touched it.
- `THREATMODEL.md` — a threat model for the guest-pass feature
  specifically: a table of at least 3 named assets at risk, and at
  least 6 distinct threat-to-mitigation pairs (e.g. code guessing,
  pass leakage via the `Referer` header, uploaded content executing in
  a resident's browser, indefinite pass lifetime).

## Constraints

- `hardened-settings.json` must parse as valid JSON.
- Change only what's actually wrong; don't rewrite keys you can't
  justify changing.
