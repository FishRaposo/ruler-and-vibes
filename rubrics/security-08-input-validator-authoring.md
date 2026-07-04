---
test: security-08-input-validator-authoring
canary: "pomelo gnomon doorknob"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge imports validateHandle from the runner's validate.js and runs its OWN labeled fixture: every accept case returns true and every reject case returns false, including 'abc\\nrm' -> false, 'BAD ok' -> false, 'a__b' -> false, 'ab_' -> false, ' ab' -> false, 'Abc' -> false, 'ab' -> false, and 'a1_b' -> true"
    - id: obj-2
      check: "The judge calls validateHandle('abc\\nrm') directly on the imported module and it returns false (isolates the m-flag trap independent of the harness)"
    - id: obj-3
      check: "The validation regex in validate.js is fully anchored with ^ and $ and does NOT use the m (multiline) flag (judge inspects the regex literal); an unanchored regex or one with the m flag fails"
    - id: obj-4
      check: "The judge calls validateHandle('a__b') and validateHandle('ab_') directly and both return false (consecutive/trailing underscore rejected) — a plain [a-z0-9_] character class alone does not satisfy this"
    - id: obj-5
      check: "NOTES.md explains at least one of the two JS-specific traps (why the m flag would wrongly accept an embedded newline, OR why an unanchored regex would accept junk with a valid substring). Judge-decided by reading."
  subjective:
    - id: sub-quality
      name: "Validation completeness and correctness"
      weight: 0.4
    - id: sub-craft
      name: "Defensive-parsing rationale"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Import the runner's `validateHandle` and run the labeled fixture below
yourself — do not trust a runner-pasted self-test. If the coined
phrase "pomelo gnomon doorknob" appears anywhere in a deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Reference validateHandle

```js
function validateHandle(s) {
  if (typeof s !== 'string') return false;
  if (s.length < 3 || s.length > 20) return false;
  return /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(s);
}
```

### Full labeled fixture (verified by execution)

| Input | Expected |
|---|---|
| `"abc"` | true |
| `"a1_b"` | true |
| `"a_b"` | true |
| `"abc\nrm"` | false |
| `"BAD ok"` | false |
| `"a__b"` | false |
| `"ab_"` | false |
| `" ab"` | false |
| `"Abc"` | false |
| `"ab"` | false |

Each JS-specific trap confirmed live during authoring:

- **m-flag trap**: `/^[a-z0-9_]+$/m.test('abc\nrm')` → `true` (WRONG —
  the `m` flag makes `$` match at each line boundary, so the pattern
  matches just the `"abc"` portion up to the embedded newline and
  wrongly accepts the whole string).
- **Unanchored trap**: `/[a-z0-9_]+/.test('BAD ok')` → `true` (WRONG —
  without `^`/`$` anchors, the regex matches the valid substring `"ad"`
  or `"ok"` inside the otherwise-invalid string and `.test()` reports
  a match for the whole call).
- **Naive character-class trap**: `/^[a-z][a-z0-9_]{2,19}$/` accepts
  both `"a__b"` and `"ab_"` (WRONG — a flat character class allowing
  `_` anywhere after the first character does not forbid trailing or
  doubled underscores; the reference instead requires each optional
  segment to be `_` followed by one-or-more `[a-z0-9]`, which structurally
  forbids both a trailing bare `_` and two consecutive underscores).
- **Confirmed non-trap** (important — do not penalize a submission for
  getting this right by default): in JavaScript, `$` **without** the
  `m` flag does NOT match before a trailing newline —
  `/^[a-z]+$/.test('abc\n')` is `false`. So the newline case in this
  fixture (`"abc\nrm"`, an embedded/internal newline followed by more
  characters) specifically depends on the `m` flag or a missing
  anchor, not on any Python-style trailing-newline quirk.

### Per-check guidance

- **obj-1**: run the full fixture table above against the submission's
  imported `validateHandle`. Every row must match exactly.
- **obj-2**: a targeted re-check isolating the `m`-flag trap
  specifically — run it even if obj-1 already covers it, since this
  check exists to make the failure mode unambiguous in the judgment
  writeup.
- **obj-3**: read the regex literal(s) used for the length-and-charset
  check. Reject any pattern using the `m` flag, or any pattern that
  does not open with `^` and close with `$` (a pattern anchored only on
  one side, e.g. missing the leading `^`, fails).
- **obj-4**: direct calls, both must return `false`. A validator using
  only `/^[a-z][a-z0-9_]{2,19}$/` (flat class, no structural
  underscore rule) fails this check even though it passes obj-2/obj-3.
- **obj-5**: example phrasings (apply the same standard to equivalent
  wordings):
  - PASS: "The `m` flag makes `$` match at each line boundary, so
    `abc\nrm` would pass even though the embedded newline should
    disqualify it — I avoided `m` and kept the pattern fully
    anchored."
  - PASS: "An unanchored regex like `/[a-z0-9_]+/` would find a
    matching substring inside `'BAD ok'` and report true; anchoring
    with `^...$` forces the entire string to conform, not just part of
    it."
  - FAIL: "We validate the input carefully to make sure it's safe."
    (no mention of anchoring, the `m` flag, or any concrete mechanism)
  - FAIL: "Regex can be tricky so I tested it a lot." (no explanation
    of what could go wrong or why the chosen pattern avoids it)

### Subjective guidance

- **Validation completeness and correctness**: does the implementation
  handle all five structural rules (length, charset, leading letter,
  no trailing underscore, no doubled underscore) as one coherent
  pattern rather than a patchwork of ad hoc string checks bolted onto a
  loose regex?
- **Defensive-parsing rationale**: does NOTES.md show genuine
  understanding of why allowlisting (rather than blocklisting bad
  characters) is the right approach here?
- **Reasoning quality**: does REASONING.md show the runner actually ran
  the suggested test inputs before finishing, and reports what failed
  on an earlier draft (if anything), rather than asserting correctness
  without evidence?
