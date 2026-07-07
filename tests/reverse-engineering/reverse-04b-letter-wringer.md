---
id: reverse-04b-letter-wringer
category: reverse-engineering
title: Reconstruct the Letter Wringer
deliverables:
  - transform.js
  - RULE.md
---

## Task

A fictional toy called the "letter wringer" takes a lowercase string of
space-separated words and cranks each one through its rollers,
rewriting it. You don't have its source code — only a table of
examples. Each word is transformed independently of the others (the
spaces themselves are never touched).

Observed input -> output pairs:

| Input | Output |
|---|---|
| `peg` | `gpe` |
| `on` | `no` |
| `clamp` | `pclam` |
| `it` | `ti` |
| `gouge` | `egoug` |
| `up in` | `pu ni` |
| `i` | `i` |
| `vise rod` | `esiv dro` |
| `cog nut` | `gco tnu` |

Infer the exact rule the wringer applies to a single word, then
implement it. Your rule must reproduce all nine examples above exactly
— but being consistent with all nine examples is necessary, not
sufficient; make sure you haven't just found *a* rule that happens to
fit, when a different rule also fits all nine but disagrees elsewhere.
Look especially hard at any example that a simpler, more obvious
pattern would get wrong.

## Deliverables

- `transform.js` — exports `transform(s)` via `module.exports`, taking
  a lowercase string of one or more space-separated words and returning
  the wringer's output for it, implementing your inferred rule (not a
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
