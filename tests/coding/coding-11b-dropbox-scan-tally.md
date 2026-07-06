---
id: coding-11b-dropbox-scan-tally
category: coding
title: Book-return dropbox scan feed to a byte-exact tally
deliverables:
  - tally.js
---

## Task

Below is an 8-line scan feed from a library book-return dropbox,
embedded verbatim. Each well-formed line matches the pattern
`^\S+ \S+ shelf=(\w+) pages=(\d+)$` — that is: whitespace-delimited
timestamp, whitespace-delimited branch code, then `shelf=<id>`, then
`pages=<integer>`, with nothing else on the line. Some lines are
deliberately malformed and must be silently skipped entirely (not
partially parsed, not coerced to a default value).

```
2026-03-04T09:00:00 MAIN shelf=fiction pages=310
2026-03-04T09:07:00 MAIN shelf=history pages=88
!! damaged label unreadable !!
2026-03-04T09:15:00 EAST shelf=fiction pages=142
2026-03-04T09:22:00 EAST shelf=science pages=
2026-03-04T09:30:00 MAIN shelf=history pages=205
2026-03-04T09:41:00 EAST shelf=fiction pages=qq
2026-03-04T09:52:00 MAIN shelf=science pages=176
```

Three of these lines are malformed: one is pure garbage with no
recognizable structure, one has an empty `pages=` value, and one has a
non-numeric `pages=qq` value. All three must be skipped — do not let
them contribute 0, `NaN`, or any other value to a shelf's total.

## Deliverables

- `tally.js` — embeds the 8-line feed above as a string (no file or
  stdin reading), parses it with the rule above, and prints one line
  per shelf with at least one valid entry, sorted by shelf id
  ascending, in the exact format `<shelf> <count> <totalPages>` where
  `<count>` is the number of valid (non-skipped) lines for that shelf
  and `<totalPages>` is the sum of their `pages` values across those
  lines. Nothing else should be printed to stdout.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 70 lines.
- No external file or stdin dependency — the feed string is embedded
  directly in `tally.js`.
- Malformed lines are skipped outright, never coerced (e.g. treating
  an empty or non-numeric `pages=` as `0`, or using `parseInt` in a way
  that silently produces `NaN` and pollutes a sum, is incorrect).
