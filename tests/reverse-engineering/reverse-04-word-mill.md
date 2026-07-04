---
id: reverse-04-word-mill
category: reverse-engineering
title: Reconstruct the Word Mill
deliverables:
  - transform.js
  - RULE.md
---

## Task

A fictional text toy called the "word mill" takes a lowercase string of
space-separated words and rewrites it. You don't have its source code —
only a table of examples. Each word is transformed independently of
the others (the spaces themselves are never touched).

Observed input -> output pairs:

| Input | Output |
|---|---|
| `cat` | `tac` |
| `hi` | `ih` |
| `lemon` | `nomel` |
| `at` | `ta` |
| `stone` | `enots` |
| `we go` | `ew og` |
| `a` | `a` |
| `drum sky` | `rumd yks` |
| `red fox` | `der xof` |

Infer the exact rule the mill applies to a single word, then implement
it. Your rule must reproduce all nine examples above exactly — but
being consistent with all nine examples is necessary, not sufficient;
make sure you haven't just found *a* rule that happens to fit, when a
different rule also fits all nine but disagrees elsewhere. Look
especially hard at any example that a simpler, more obvious pattern
would get wrong.

## Deliverables

- `transform.js` — exports `transform(s)` via `module.exports`, taking
  a lowercase string of one or more space-separated words and returning
  the mill's output for it, implementing your inferred rule (not a
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
