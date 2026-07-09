---
id: teach-01b-junior-cert-renew
category: teaching
title: "Handoff so a junior can renew a TLS cert"
deliverables:
  - handoff.md
---

## Task

Explain TLS cert renew on fictional host:

- Cert path: `/etc/lampost/tls/fullchain.pem`  
- Key: `/etc/lampost/tls/privkey.pem`  
- Renew by: run `/usr/local/bin/renew-tls.sh`, then reload nginx via
  `systemctl reload nginx`  
- Do **not** delete old certs until next day  

`handoff.md`: Goal / Preconditions / Steps / Verify / Rollback  

No inventing Kubernetes consoles.

## Deliverables

- `handoff.md`

## Constraints

- 150–320 words. Numbered steps include renew script + nginx reload.

