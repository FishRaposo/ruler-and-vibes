---
id: precision-06-unstated-rule-induction
category: instruction-following
title: Codeword table from worked examples only
deliverables:
  - codewords.tsv
---

## Task

A single deterministic rule maps each input word below to its output
codeword. The rule is NOT stated — induce it from the worked examples,
then apply the exact same rule to the four new inputs.

### Worked examples (input -> output)

```
harbor -> rharbo6
kite -> ekit4
meadow -> wmeado6
fox -> xfo3
```

### New inputs to transform

```
lantern
owl
cascade
drum
```

## Deliverables

- `codewords.tsv` — a two-column, tab-separated file with one data row
  per new input, in the order given above: `input<TAB>output`. An
  optional single header row `input	output` is allowed.

## Constraints

- Exactly 4 data rows, no more, no fewer.
- No commentary, explanation, or extra columns anywhere in the file.
- None of the four worked-example words (harbor, kite, meadow, fox) may
  appear as a data row.
- Apply the SAME rule used to produce all four worked examples — it is
  a single rule, not a per-word special case.
