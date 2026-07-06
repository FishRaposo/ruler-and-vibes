---
id: coding-11c-scada-telemetry-report
category: coding
title: SCADA telemetry feed to a byte-exact report
deliverables:
  - report.js
---

## Task

Below is an 8-line wind-farm telemetry feed, embedded verbatim. Each
well-formed line matches the pattern
`^\S+ \S+ turbine=(\w+) kwh=(\d+)$` — that is: whitespace-delimited
timestamp, whitespace-delimited status word, then `turbine=<id>`, then
`kwh=<integer>`, with nothing else on the line. Some lines are
deliberately malformed and must be silently skipped entirely (not
partially parsed, not coerced to a default value).

```
2026-03-01T00:00:00 ONLINE turbine=arden kwh=140
2026-03-01T00:10:00 DERATED turbine=brae kwh=60
SENSOR FAULT NO DATA
2026-03-01T00:20:00 ONLINE turbine=arden kwh=45
2026-03-01T00:30:00 CURTAILED turbine=crag kwh=
2026-03-01T00:40:00 ONLINE turbine=brae kwh=210
2026-03-01T00:50:00 ONLINE turbine=arden kwh=x
2026-03-01T01:00:00 ONLINE turbine=crag kwh=95
```

Three of these lines are malformed: one is pure garbage with no
recognizable structure, one has an empty `kwh=` value, and one has a
non-numeric `kwh=x` value. All three must be skipped — do not let them
contribute 0, `NaN`, or any other value to a turbine's total.

## Deliverables

- `report.js` — embeds the 8-line feed above as a string (no file or
  stdin reading), parses it with the rule above, and prints one line
  per turbine with at least one valid entry, sorted by turbine id
  ascending, in the exact format `<turbine> <count> <totalKwh>` where
  `<count>` is the number of valid (non-skipped) lines for that turbine
  and `<totalKwh>` is the sum of their `kwh` values across those lines.
  Nothing else should be printed to stdout.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 70 lines.
- No external file or stdin dependency — the feed string is embedded
  directly in `report.js`.
- Malformed lines are skipped outright, never coerced (e.g. treating
  an empty or non-numeric `kwh=` as `0`, or using `parseInt` in a way
  that silently produces `NaN` and pollutes a sum, is incorrect).
