---
id: precision-03b-seed-library-labels
category: instruction-following
title: Seed-library labels under an amended filing sheet
deliverables:
  - labels.txt
---

## Task

Below is a clean accession list for a community seed library, followed by
a numbered filing sheet for producing `labels.txt`, followed by an
amendments section. Read everything, including the amendments, before
writing anything.

Accessions (given as "Variety Grower"):

```
Sundrop Renquist
Moonglow Brandt
Firetongue Okvist
Emberpod Yakubu
Frostbell Nystrom
Hazelwind Salcedo
Coppervine Kessler (steward)
Duskrunner Brandt
Thorncap Renquist
Ravenwing Winters
```

### Rules

1. One line per accession, in "Grower, Variety" format (comma + single
   space).
2. (reserved — not used)
3. Sort lines by VARIETY.
4. (reserved — not used)
5. Render all names in UPPERCASE.
6. Append " (steward)" after the steward's name.
7. When two lines tie on whatever the current sort key is, break the tie
   by the other field (this rule applies to whichever sort key is in
   force).
8. No header, commentary, or trailing blank line.

### Amendments — these take precedence over the rules above

- **Amendment A** voids Rule 3 and replaces it with: sort lines by
  GROWER.
- **Amendment B** rewrites Rule 5 to read: render each name in the letter
  case exactly as it appears in the accession list above (the "Grower,
  Variety" arrangement from Rule 1 still applies — this amendment concerns
  casing only).
- **Amendment C** strikes Rule 6 entirely.

## Deliverables

- `labels.txt` — the label file, produced under the rules as amended.

## Constraints

- Apply the amendments — they take precedence over the base rules wherever
  they conflict.
