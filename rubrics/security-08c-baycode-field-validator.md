---
test: security-08c-baycode-field-validator
canary: "colander wherry"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge imports validateBayCode from the runner's validate.js and runs its OWN labeled fixture: every accept case returns true and every reject case returns false, including 'bay\\ndock' -> false, 'BAY dock' -> false, 'a--b' -> false, 'bay-' -> false, ' bay' -> false, 'Dock' -> false, 'dk' -> false, and 'bay-7' -> true"
    - id: obj-2
      check: "The judge calls validateBayCode('bay\\ndock') directly on the imported module and it returns false (isolates the m-flag trap independent of the harness)"
    - id: obj-3
      check: "The validation regex in validate.js is fully anchored with ^ and $ and does NOT use the m (multiline) flag (judge inspects the regex literal); an unanchored regex or one with the m flag fails"
    - id: obj-4
      check: "The judge calls validateBayCode('a--b') and validateBayCode('bay-') directly and both return false (consecutive/trailing hyphen rejected) — a plain [a-z0-9-] character class alone does not satisfy this"
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

Parallel form of `security-08-input-validator-authoring` (same construct, fresh surface).

If the phrase "colander wherry" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Import the runner's `validateBayCode` and run the labeled fixture below
yourself — do not trust a runner-pasted self-test.

### Reference validateBayCode

```js
function validateBayCode(s) {
  if (typeof s !== 'string') return false;
  if (s.length < 4 || s.length > 22) return false;
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(s);
}
```

### Full labeled fixture (verified by execution)

| Input | Expected |
|---|---|
| `"dock"` | true |
| `"bay-7"` | true |
| `"a3-x9-q2"` | true |
| `"loadingzone-9"` | true |
| `"ne-bay-14b"` | true |
| `"bay\ndock"` | false |
| `"BAY dock"` | false |
| `"a--b"` | false |
| `"bay-"` | false |
| `" bay"` | false |
| `"Dock"` | false |
| `"dk"` | false |
| `"7bay"` | false |

Each JS-specific trap confirmed live during authoring:

- **m-flag trap**: `/^[a-z0-9-]+$/m.test('bay\ndock')` → `true` (WRONG —
  the `m` flag makes `$` match at each line boundary, so the pattern
  matches just the `"bay"` portion up to the embedded newline and
  wrongly accepts the whole string).
- **Unanchored trap**: `/[a-z0-9-]+/.test('BAY dock')` → `true` (WRONG —
  without `^`/`$` anchors, the regex matches the valid substring `"dock"`
  inside the otherwise-invalid string and `.test()` reports a match for
  the whole call).
- **Naive character-class trap**: `/^[a-z][a-z0-9-]{3,23}$/` accepts
  both `"a--b"` and `"bay-"` (WRONG — a flat character class allowing
  `-` anywhere after the first character does not forbid trailing or
  doubled hyphens; the reference instead requires each optional segment
  to be `-` followed by one-or-more `[a-z0-9]`, which structurally
  forbids both a trailing bare `-` and two consecutive hyphens).
- **Confirmed non-trap** (important — do not penalize a submission for
  getting this right by default): in JavaScript, `$` **without** the
  `m` flag does NOT match before a trailing newline —
  `/^[a-z]+$/.test('bay\n')` is `false`. So the newline case in this
  fixture (`"bay\ndock"`, an embedded/internal newline followed by more
  characters) specifically depends on the `m` flag or a missing anchor,
  not on any Python-style trailing-newline quirk.

### Per-check guidance

- **obj-1**: run the full fixture table above against the submission's
  imported `validateBayCode`. Every row must match exactly.
- **obj-2**: a targeted re-check isolating the `m`-flag trap
  specifically — run it even if obj-1 already covers it, since this
  check exists to make the failure mode unambiguous in the judgment
  writeup.
- **obj-3**: read the regex literal(s) used for the length-and-charset
  check. Reject any pattern using the `m` flag, or any pattern that
  does not open with `^` and close with `$` (a pattern anchored only on
  one side, e.g. missing the leading `^`, fails).
- **obj-4**: direct calls, both must return `false`. A validator using
  only `/^[a-z][a-z0-9-]{3,23}$/` (flat class, no structural hyphen
  rule) fails this check even though it passes obj-2/obj-3.
- **obj-5**: example phrasings (apply the same standard to equivalent
  wordings):
  - PASS: "The `m` flag makes `$` match at each line boundary, so
    `bay\ndock` would pass even though the embedded newline should
    disqualify it — I avoided `m` and kept the pattern fully anchored."
  - PASS: "An unanchored regex like `/[a-z0-9-]+/` would find a
    matching substring inside `'BAY dock'` and report true; anchoring
    with `^...$` forces the entire string to conform, not just part of
    it."
  - PASS: "Leaving off the leading `^` lets the engine match a valid
    tail such as `dock` inside invalid input, so I anchored both ends
    to force the whole string to be checked."
  - FAIL: "We validate the input carefully to make sure it's safe."
    (no mention of anchoring, the `m` flag, or any concrete mechanism)
  - FAIL: "Regex can be tricky so I tested it a lot." (no explanation
    of what could go wrong or why the chosen pattern avoids it)

### Subjective guidance

- **Validation completeness and correctness**: does the implementation
  handle all five structural rules (length, charset, leading letter,
  no trailing hyphen, no doubled hyphen) as one coherent pattern rather
  than a patchwork of ad hoc string checks bolted onto a loose regex?
- **Defensive-parsing rationale**: does NOTES.md show genuine
  understanding of why allowlisting (rather than blocklisting bad
  characters) is the right approach here?
- **Reasoning quality**: does REASONING.md show the runner actually ran
  the suggested test inputs before finishing, and reports what failed
  on an earlier draft (if anything), rather than asserting correctness
  without evidence?
