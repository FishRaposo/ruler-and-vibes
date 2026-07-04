---
id: precision-03-amended-spec
category: instruction-following
title: Roster under an amended rule sheet
deliverables:
  - attendees.txt
---

## Task

Below is a clean registrant list for a workshop, followed by a numbered
rule sheet for producing `attendees.txt`, followed by an amendments
section. Read everything, including the amendments, before writing
anything.

Registrants (given as "First Last"):

```
Bram Feld
Marisol Vega
Ines Duarte
Kofi Abara
Petra Lindqvist
Yusuf Kanem
Sable Moreau (facilitator)
Dmitri Vega
Anouk Feld
Ravi Chandran
```

### Rules

1. One line per person, in "Last, First" format (comma + single space).
2. (reserved — not used)
3. Sort lines by FIRST name.
4. (reserved — not used)
5. Render all names in UPPERCASE.
6. Append " (host)" after the facilitator's name.
7. When two lines tie on whatever the current sort key is, break the tie
   by the other name (this rule applies to whichever sort key is in
   force).
8. No header, commentary, or trailing blank line.

### Amendments — these take precedence over the rules above

- **Amendment A** voids Rule 3 and replaces it with: sort lines by
  LAST name.
- **Amendment B** rewrites Rule 5 to read: render each name in the
  letter case exactly as it appears in the registrant list above (the
  "Last, First" arrangement from Rule 1 still applies — this amendment
  concerns casing only).
- **Amendment C** strikes Rule 6 entirely.

## Deliverables

- `attendees.txt` — the roster, produced under the rules as amended.

## Constraints

- Apply the amendments — they take precedence over the base rules
  wherever they conflict.
