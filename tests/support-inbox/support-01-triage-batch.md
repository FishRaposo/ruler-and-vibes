---
id: support-01-triage-batch
category: support-inbox
title: Triage eight support tickets
deliverables:
  - triage.json
---

## Task

Triage these tickets into tags and one-line actions. Policy:
- billing → finance queue
- outage → page oncall
- how-to → docs reply
- abuse → trust queue
- feature → backlog, no promise

Tickets:
1. "Double charged this month" 
2. "Site returns 500 for everyone"
3. "How do I export CSV?"
4. "Competitor spamming our form"
5. "Please add dark mode soon!!"
6. "Invoice PDF missing line items"
7. "Is there a keyboard shortcut for search?"
8. "App down since 09:00 UTC"

Write triage.json as an array of 8 objects:
`{ "id": 1, "tag": "...", "action": "..." }`
Tags must be one of: billing, outage, how-to, abuse, feature.

## Deliverables

- `triage.json`.

## Constraints

- Exactly 8 objects, ids 1–8.
- Valid JSON.
