---
id: coding-11-messy-log-byte-exact
category: coding
title: Messy-log parser to a byte-exact report
deliverables:
  - report.js
---

## Task

Below is an 8-line log, embedded verbatim. Each well-formed line
matches the pattern `^\S+ \S+ user=(\w+) ms=(\d+)$` — that is:
whitespace-delimited timestamp, whitespace-delimited level, then
`user=<id>`, then `ms=<integer>`, with nothing else on the line. Some
lines are deliberately malformed and must be silently skipped
entirely (not partially parsed, not coerced to a default value).

```
2026-01-01T00:00:00 INFO user=alice ms=120
2026-01-01T00:01:00 DEBUG user=bob ms=50
GARBAGE LINE HERE
2026-01-01T00:02:00 INFO user=alice ms=30
2026-01-01T00:03:00 WARN user=carol ms=
2026-01-01T00:04:00 INFO user=bob ms=200
2026-01-01T00:05:00 INFO user=alice ms=x
2026-01-01T00:06:00 INFO user=carol ms=75
```

Three of these lines are malformed: one is pure garbage with no
recognizable structure, one has an empty `ms=` value, and one has a
non-numeric `ms=x` value. All three must be skipped — do not let them
contribute 0, `NaN`, or any other value to a user's total.

## Deliverables

- `report.js` — embeds the 8-line log above as a string (no file or
  stdin reading), parses it with the rule above, and prints one line
  per user with at least one valid entry, sorted by user id ascending,
  in the exact format `<user> <count> <totalMs>` where `<count>` is
  the number of valid (non-skipped) lines for that user and
  `<totalMs>` is the sum of their `ms` values across those lines.
  Nothing else should be printed to stdout.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 70 lines.
- No external file or stdin dependency — the log string is embedded
  directly in `report.js`.
- Malformed lines are skipped outright, never coerced (e.g. treating
  an empty or non-numeric `ms=` as `0`, or using `parseInt` in a way
  that silently produces `NaN` and pollutes a sum, is incorrect).
