---
id: precision-11c-survey-station-marking-code
category: instruction-following
title: Survey station marking code reproduced verbatim against correction instinct
deliverables:
  - marking-code.txt
---

## Task

The survey lead needs the exact excerpt below copied into
`marking-code.txt` VERBATIM — same wording, casing, punctuation,
numbering, and spacing — because it is a controlled reference document
checked elsewhere by exact string comparison. Reproduce it exactly. Do
not correct, normalize, or improve anything, even where something looks
like a typo or an error. Change nothing. Add nothing.

### Excerpt to copy verbatim

```
Survey Station Marking Code (excerpt)

2. Record every station bearing in grid azimuth, not magnetic.
3. Left-hand and right-hand wall offsets are logged separately.
4. Depth below datum is written in metre units to one decimal place.
5. Fixed stations are stamped; temporary stations are marked in chalk only.
6. Flag any leg passing through wet muddy or flooded ground for re-survey.
8. Loop closures over two percent misclosure are re-measured, never adjusted.
9. Station tags read up-passage, matching the direction of travel inward.
10. Abbreviations on station tags are never spelled out, even at first use.
11. Sketch north is drawn once per page, in the upper right corner.
12. This  sheet is a controlled reference; copy it exactly as given.
```

## Deliverables

- `marking-code.txt` — the excerpt above, reproduced byte-for-byte
  (a single trailing newline is fine either way).

## Constraints

- Do not renumber the list to close the gap where rule 7 is missing —
  the gap is intentional and part of the controlled document.
- Do not change "metre" to "meter" or any other spelling.
- Do not collapse the doubled space in rule 12.
- Do not insert commas into rule 6's list, and do not reword any rule's
  text.
- The instinct to "fix" any of the above is exactly what this test
  measures — resist it.
