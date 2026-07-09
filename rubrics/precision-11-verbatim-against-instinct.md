---
test: precision-11-verbatim-against-instinct
canary: "brackwater flambeau"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "styleguide.txt equals the embedded excerpt exactly under a node string comparison after normalising ONLY a single optional trailing newline on each side (all other bytes, including the doubled space, must match exactly)"
    - id: obj-2
      check: "The numbering sequence is preserved verbatim including the intentional gap: the token '5.' does not appear and the sequence runs 1,2,3,4,6,7,8,9,10,11 exactly as given"
    - id: obj-3
      check: "The British spelling 'colour' is present and 'color' is absent; the intentionally doubled space (the two-space run at the marked period) is still present, verified by a targeted grep for the two-space substring independent of the full-file diff"
    - id: obj-4
      check: "Line count equals the source excerpt's line count and no line appears that is absent from the source; no rule text is reworded, re-cased, re-punctuated, or added"
    - id: obj-5
      check: "The comma-omitted list in rule 7 is reproduced without an inserted comma (the specific comma-free phrasing from the source still matches by substring)"
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
anchors:
  - id: Literal fidelity over correction instinct
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Byte-exact reproduction
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "brackwater flambeau" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

There is exactly one correct `styleguide.txt`: a byte-for-byte copy of
the excerpt below. Every planted "error" feature is intentional and
must survive — do not let the judge's own correction instinct flag a
faithful copy as wrong.

### Answer key (byte-exact styleguide.txt — this excerpt IS the key)

```
House Style Guide (excerpt)

1. Use British spelling for all colour-related terminology in copy.
2. Prefer active voice; passive voice should appear only in disclaimers.
3. Product names are capitalised exactly as trademarked, never altered.
4. Numbers under ten are spelled out in body text.
6. Section headings are sentence case, not title case.
7. Route final proofs to editors proofreaders and legal before publication.
8. Quoted customer testimonials are reproduced without correcting grammar.
9. Dates follow the day month year format, e.g. 4 July 2026.
10. Em dashes are permitted only inside internal memos, never in copy.
11. This  excerpt is a controlled reference; copy it exactly as given.
```

(12 lines total: 1 title line, 1 blank line, 10 numbered rules whose
numbering intentionally skips "5.", running 1,2,3,4,6,7,8,9,10,11.
Rule 11 contains a deliberate doubled space between "This" and
"excerpt".)

### Planted features (each individually checked — do not "fix" any of these)

1. **Numbering gap**: rule 5 is intentionally absent; the sequence
   jumps from "4." to "6.".
2. **British spelling**: "colour" in rule 1, not "color".
3. **Doubled space**: rule 11 has two spaces between "This" and
   "excerpt".
4. **Oxford-comma omission**: rule 7 lists "editors proofreaders and
   legal" with no commas; the rule's phrasing itself must not gain an
   inserted comma.
5. **Endorsed convention many models resist**: rule 10 permits em
   dashes only in internal memos, never in copy — a convention some
   models reflexively want to soften or contradict when writing about
   dashes. Reproduce the rule's text as given regardless.

### Check script

Save the submitted `styleguide.txt` alongside a `styleguide-source.txt`
containing the exact answer key above (single trailing newline), and
run:

```
node -e "
const fs = require('fs');
const SOURCE = fs.readFileSync('styleguide-source.txt', 'utf8');
const raw = fs.readFileSync('styleguide.txt', 'utf8');

const norm = s => s.replace(/\n$/, '');
console.log('obj-1 byte-exact vs source (1 trailing newline normalised):', norm(raw) === norm(SOURCE));

console.log('obj-2 numbering gap preserved (no 5., sequence 1,2,3,4,6,7,8,9,10,11):', !/(^|\n)5\.\s/.test(raw) && raw.includes('4. Numbers') && raw.includes('6. Section') && raw.includes('11. This'));

console.log('obj-3 colour present, color absent, doubled space present:', raw.includes('colour') && !raw.includes('color') && /This  excerpt/.test(raw));

const srcLines = SOURCE.replace(/\n$/, '').split('\n');
const rawLines = raw.replace(/\n$/, '').split('\n');
console.log('obj-4 line count matches, no extra/missing lines:', srcLines.length === rawLines.length && srcLines.every((l,i) => l === rawLines[i]));

console.log('obj-5 comma-omitted list clause reproduced without inserted comma:', raw.includes('to editors proofreaders and legal'));
"
```

Run this against the answer key above (all 5 lines print `true`) and
against a "corrected" version that renumbers the gap away, changes
"colour" to "color", and collapses the doubled space before trusting
the result — the corrected version must fail obj-1, obj-2, obj-3, and
obj-4.

- **obj-1**: the single authoritative check — a whole-file comparison
  after trimming at most one trailing newline from each side. Nothing
  else is normalised; do not let the judge silently trim other
  whitespace.
- **obj-2**: renumbering to close the gap (turning "6." into "5.") is
  the single most common failure mode; check explicitly for the
  absence of "5." and the presence of "6." immediately after "4.".
- **obj-3**: the doubled space is checked independently of the
  whole-file diff (obj-1) specifically because it is easy to
  eyeball-miss; a targeted substring grep makes it undeniable either
  way.
- **obj-4**: catches a submission that reflows or re-wraps lines even
  if individual rule text is untouched.
- **obj-5**: confirms the comma-omitted clause's exact wording is
  intact — a model correcting "instinctively" would add a comma after
  "editors" and before "and legal".

### Subjective guidance

- **Literal fidelity over correction instinct**: does the submission
  show it recognized the planted features as intentional (either
  silently, by reproducing them, or explicitly in REASONING.md) rather
  than "fixing" one or more of them? A submission that fixes even one
  planted feature (e.g. silently renumbers rule 5 away) should score
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
