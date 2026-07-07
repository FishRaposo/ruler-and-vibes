---
id: security-04c-wardstone-guestpin
category: cybersecurity
title: Hardening Wardstone Access before the guest-PIN launch
deliverables:
  - HARDENING.md
  - hardened-config.json
  - THREATMODEL.md
---

## Task

Wardstone Access is a smart-lock platform about to launch a guest-PIN
feature: a resident can issue a short PIN that lets a guest unlock a
specific door for a limited window without installing the app or holding
an account, and the PIN can be redeemed remotely. Below is the
platform's current `config.json`. Review it for security weaknesses and
produce a hardened version.

```json
{
  "appName": "Wardstone Access",
  "environment": "production",
  "broker": {
    "host": "mqtt.wardstone.example.net",
    "anonymousAccess": true,
    "allowedCommandPublishers": ["*"]
  },
  "firmwareUpdate": {
    "channel": "stable",
    "verifySignature": false,
    "allowHttpDownload": true,
    "pinToVendorCert": false
  },
  "credentials": {
    "devicePasswordHash": "sha1",
    "installerPinMinLength": 8,
    "maxUnlockAttemptsPerMinute": 5
  },
  "guestPins": {
    "pinLength": 4,
    "pinCharset": "digits",
    "validityHours": 0,
    "allowRemoteUnauthenticatedRedeem": true
  },
  "companionApp": {
    "deepLinkSchemes": ["wardstone", "http", "https"],
    "logUnlockEvents": true,
    "exposeDiagnosticsShell": true,
    "diagnosticsShellPath": "/debug/shell"
  },
  "telemetry": {
    "samplingRate": 0.25,
    "redactPii": true
  }
}
```

## Deliverables

- `HARDENING.md` — numbered list of weaknesses found; for each, the
  concrete risk and the specific fix applied.
- `hardened-config.json` — valid JSON, same shape as the original,
  with every real weakness fixed. Leave any value you judge already
  adequate untouched — don't change something just to have touched it.
- `THREATMODEL.md` — a threat model for the guest-PIN feature
  specifically: a table of at least 3 named assets at risk, and at
  least 6 distinct threat-to-mitigation pairs (e.g. PIN guessing, a PIN
  forwarded and reused after the visit, a forged firmware image pushed
  to the lock, unauthenticated commands reaching the unlock topic).

## Constraints

- `hardened-config.json` must parse as valid JSON.
- Change only what's actually wrong; don't rewrite keys you can't
  justify changing.
