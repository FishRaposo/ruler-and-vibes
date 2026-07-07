---
id: reverse-04c-ticket-stamper
category: reverse-engineering
title: Reconstruct the Ticket Stamper
deliverables:
  - transform.js
  - RULE.md
---

## Task

A fictional novelty toy called the "ticket stamper" takes a lowercase
string of space-separated words and stamps out a scrambled version onto
a paper ticket. You don't have its source code — only a table of
examples pulled from old ticket stubs. Each word is transformed
independently of the others (the spaces themselves are never touched).

Observed input -> output pairs:

| Input | Output |
|---|---|
| `cog` | `gco` |
| `in` | `ni` |
| `latch` | `hlatc` |
| `up` | `pu` |
| `crank` | `kcran` |
| `on if` | `no fi` |
| `i` | `i` |
| `gear peg` | `raeg gpe` |
| `rod nut` | `dro tnu` |

Work out the exact per-word rule the stamper applies, then implement
it. Matching all nine examples above is necessary, but not sufficient —
a different rule can fit these nine and still disagree elsewhere, so
make sure you've landed on the actual rule rather than one that merely
happens to fit. Pay close attention to any example where a simpler,
more obvious pattern would give the wrong answer.

## Deliverables

- `transform.js` — exports `transform(s)` via `module.exports`, taking
  a lowercase string of one or more space-separated words and returning
  the stamper's output for it, implementing your inferred rule (not a
  lookup table of the examples above).
- `RULE.md` — states your inferred rule precisely enough that someone
  else could implement it from your description alone; for each of the
  nine examples, briefly notes what it shows about the rule; and
  explicitly identifies at least one simpler competing rule that also
  fits several of the examples, names the specific example that rules
  it out, and explains why.

## Constraints

- Plain JavaScript, no dependencies, single file for `transform.js`.
- The file must end with `module.exports = { transform }`; the judge's
  harness requires it.
- Assume all input to `transform` is well-formed: lowercase letters and
  single spaces between words only, no leading/trailing/double spaces.
