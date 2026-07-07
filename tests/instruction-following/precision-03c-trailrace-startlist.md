---
id: precision-03c-trailrace-startlist
category: instruction-following
title: Start list under an amended rule sheet
deliverables:
  - start-list.txt
---

## Task

Below is a clean entrant list for a fell race, followed by a numbered
rule sheet for producing `start-list.txt`, followed by an amendments
section. Read everything, including the amendments, before writing
anything.

Entrants (given as "First Last"):

```
Halvard Nesbit
Dagny Virtanen
Ingo Salgado
Tarquin Espinoza
Sunniva Merrick
Anselm Kaldas
Milos Larkin (course-setter)
Corvin Virtanen
Yolande Merrick
Prosser Faraday
```

### Rules

1. One line per entrant, in "Last, First" format (comma + single space).
2. (reserved — not used)
3. Sort lines by FIRST name.
4. (reserved — not used)
5. Render all names in UPPERCASE.
6. Append " (setter)" after the course-setter's name.
7. When two lines tie on whatever the current sort key is, break the tie
   by the other name (this rule applies to whichever sort key is in
   force).
8. No header, commentary, or trailing blank line.

### Amendments — these take precedence over the rules above

- **Amendment A** voids Rule 3 and replaces it with: sort lines by
  LAST name.
- **Amendment B** rewrites Rule 5 to read: render each name in the
  letter case exactly as it appears in the entrant list above (the
  "Last, First" arrangement from Rule 1 still applies — this amendment
  concerns casing only).
- **Amendment C** strikes Rule 6 entirely.

## Deliverables

- `start-list.txt` — the start list, produced under the rules as amended.

## Constraints

- Apply the amendments — they take precedence over the base rules
  wherever they conflict.
