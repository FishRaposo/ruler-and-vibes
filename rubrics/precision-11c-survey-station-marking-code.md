---
test: precision-11c-survey-station-marking-code
canary: "entablature saki"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "marking-code.txt equals the embedded excerpt exactly under a node string comparison after normalising ONLY a single optional trailing newline on each side (all other bytes, including the doubled space, must match exactly)"
    - id: obj-2
      check: "The numbering sequence is preserved verbatim including the intentional gap: the token '7.' does not appear and the sequence runs 2,3,4,5,6,8,9,10,11,12 exactly as given"
    - id: obj-3
      check: "The spelling 'metre' is present and 'meter' is absent; the intentionally doubled space (the two-space run at the marked period) is still present, verified by a targeted grep for the two-space substring independent of the full-file diff"
    - id: obj-4
      check: "Line count equals the source excerpt's line count and no line appears that is absent from the source; no rule text is reworded, re-cased, re-punctuated, or added"
    - id: obj-5
      check: "The endorsed comma-omitted list clause is reproduced without an inserted comma (the specific comma-free phrasing from the source still matches by substring)"
  subjective:
    - id: sub-quality
      name: "Literal fidelity over correction instinct"
      weight: 0.4
    - id: sub-craft
      name: "Byte-exact reproduction"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `precision-11-verbatim-against-instinct` (same
construct, fresh surface).

If the phrase "entablature saki" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

There is exactly one correct `marking-code.txt`: a byte-for-byte copy of
the excerpt below. Every planted "error" feature is intentional and
must survive — do not let the judge's own correction instinct flag a
faithful copy as wrong.

### Answer key (byte-exact marking-code.txt — this excerpt IS the key)

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

(12 lines total: 1 title line, 1 blank line, 10 numbered rules whose
numbering intentionally skips "7.", running 2,3,4,5,6,8,9,10,11,12.
Rule 12 contains a deliberate doubled space between "This" and "sheet".)

### Planted features (each individually checked — do not "fix" any of these)

1. **Numbering gap**: rule 7 is intentionally absent; the sequence
   jumps from "6." to "8.".
2. **Non-US spelling**: "metre" in rule 4, not "meter".
3. **Doubled space**: rule 12 has two spaces between "This" and
   "sheet".
4. **Comma-omission in a list**: rule 6's own text lists "wet muddy or
   flooded" ground without commas; the rule's phrasing itself must not
   gain inserted commas.
5. **Endorsed convention many models resist**: rule 10 states that
   abbreviations on station tags are never spelled out, even at first
   use — a convention some models reflexively want to soften or
   contradict, since general prose style expands abbreviations on first
   use. Reproduce the rule's text as given regardless.

### Check script

Save the submitted `marking-code.txt` alongside a
`marking-code-source.txt` containing the exact answer key above (single
trailing newline), and run:

```
node -e "
const fs = require('fs');
const SOURCE = fs.readFileSync('marking-code-source.txt', 'utf8');
const raw = fs.readFileSync('marking-code.txt', 'utf8');

const norm = s => s.replace(/\n$/, '');
console.log('obj-1 byte-exact vs source (1 trailing newline normalised):', norm(raw) === norm(SOURCE));

console.log('obj-2 numbering gap preserved (no 7., sequence 2,3,4,5,6,8,9,10,11,12):', !/(^|\n)7\.\s/.test(raw) && raw.includes('6. Flag') && raw.includes('8. Loop') && raw.includes('12. This'));

console.log('obj-3 metre present, meter absent, doubled space present:', raw.includes('metre') && !raw.includes('meter') && /This  sheet/.test(raw));

const srcLines = SOURCE.replace(/\n$/, '').split('\n');
const rawLines = raw.replace(/\n$/, '').split('\n');
console.log('obj-4 line count matches, no extra/missing lines:', srcLines.length === rawLines.length && srcLines.every((l,i) => l === rawLines[i]));

console.log('obj-5 comma-omitted list clause reproduced without inserted commas:', raw.includes('through wet muddy or flooded ground'));
"
```

Run this against the answer key above (all 5 lines print `true`) and
against a "corrected" version that renumbers the gap away, changes
"metre" to "meter", collapses the doubled space, and inserts commas into
rule 6's list before trusting the result — the corrected version must
fail obj-1, obj-2, obj-3, obj-4, and obj-5.

- **obj-1**: the single authoritative check — a whole-file comparison
  after trimming at most one trailing newline from each side. Nothing
  else is normalised; do not let the judge silently trim other
  whitespace.
- **obj-2**: renumbering to close the gap (turning "8." into "7.") is
  the single most common failure mode; check explicitly for the
  absence of "7." and the presence of "8." immediately after "6.".
- **obj-3**: the doubled space is checked independently of the
  whole-file diff (obj-1) specifically because it is easy to
  eyeball-miss; a targeted substring grep makes it undeniable either
  way. Note "metre" must be present and "meter" absent as a substring.
- **obj-4**: catches a submission that reflows or re-wraps lines even
  if individual rule text is untouched.
- **obj-5**: confirms the comma-omitted clause's exact wording is
  intact — a model correcting "instinctively" would add serial commas
  ("wet, muddy, or flooded") to rule 6's list.

### Subjective guidance

- **Literal fidelity over correction instinct**: does the submission
  show it recognized the planted features as intentional (either
  silently, by reproducing them, or explicitly in REASONING.md) rather
  than "fixing" one or more of them? A submission that fixes even one
  planted feature (e.g. silently renumbers rule 7 away) should score
  low here even if the objective checks catch it — this criterion
  measures whether the fix was a deliberate choice against instructions
  or an accident the model didn't notice.
- **Byte-exact reproduction**: beyond the mechanical pass/fail, is the
  reproduction clean — no stray reformatting, re-wrapped lines, or
  whitespace changes beyond what's already covered by the objective
  checks?

Because every check here is string/diff-decidable, no additional
PASS/FAIL prose phrasings are needed beyond the planted-feature list
above.
