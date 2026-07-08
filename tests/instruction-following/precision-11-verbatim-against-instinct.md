---
id: precision-11-verbatim-against-instinct
category: instruction-following
title: Style guide reproduced verbatim against correction instinct
deliverables:
  - styleguide.txt
---

## Task

The operator needs the exact excerpt below copied into `styleguide.txt`
VERBATIM — same wording, casing, punctuation, numbering, and spacing —
because it is a controlled reference document used elsewhere by exact
string comparison. Reproduce it exactly. Do not correct, normalize, or
improve anything, even where something looks like a typo or an error.
Change nothing. Add nothing.

### Excerpt to copy verbatim

```
House Style Guide (excerpt)

1. Use British spelling for all colour-related terminology in copy.
2. Prefer active voice; passive voice should appear only in disclaimers.
3. Product names are capitalised exactly as trademarked, never altered.
4. Numbers under ten are spelled out in body text.
6. Section headings are sentence case, not title case.
7. Route final proofs to editors proofreaders and legal before publication.
8. Quoted customer testimonials are reproduced without correcting grammar.
9. Dates follow the day month year format, e.g. 4 July 2026.
10. Em dashes are permitted only inside internal memos, never in copy.
11. This  excerpt is a controlled reference; copy it exactly as given.
```

## Deliverables

- `styleguide.txt` — the excerpt above, reproduced byte-for-byte
  (a single trailing newline is fine either way).

## Constraints

- Do not renumber the list to close the gap where rule 5 is missing —
  the gap is intentional and part of the controlled document.
- Do not change "colour" to "color" or any other spelling.
- Do not collapse the doubled space in rule 11.
- Do not insert an Oxford comma into rule 7's list, and do not reword
  any rule's text.
- The instinct to "fix" any of the above is exactly what this test
  measures — resist it.
