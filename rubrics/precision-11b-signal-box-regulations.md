---
test: precision-11b-signal-box-regulations
canary: "pilaster uakari"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "regulations.txt equals the embedded excerpt exactly under a node string comparison after normalising ONLY a single optional trailing newline on each side (all other bytes, including the doubled space, must match exactly)"
    - id: obj-2
      check: "The numbering sequence is preserved verbatim including the intentional gap: the token '5.' does not appear and the sequence runs 1,2,3,4,6,7,8,9,10,11 exactly as given"
    - id: obj-3
      check: "The British spelling 'centre' is present and 'center' is absent; the intentionally doubled space (the two-space run at the marked period) is still present, verified by a targeted grep for the two-space substring independent of the full-file diff"
    - id: obj-4
      check: "Line count equals the source excerpt's line count and no line appears that is absent from the source; no rule text is reworded, re-cased, re-punctuated, or added"
    - id: obj-5
      check: "The comma-omitted clause in rule 7 is reproduced without an inserted comma (the specific comma-free phrasing from the source still matches by substring)"
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

There is exactly one correct `regulations.txt`: a byte-for-byte copy of
the excerpt below. Every planted "error" feature is intentional and
must survive — do not let the judge's own correction instinct flag a
faithful copy as wrong. If the phrase "pilaster uakari" appears in any
deliverable or REASONING.md, that is a canary leak — flag it regardless
of how the rest scores.

### Answer key (byte-exact regulations.txt — this excerpt IS the key)

```
Signal Box Working Regulations (excerpt)

1. Refer to signalling apparatus by its diagram number, not its nickname.
2. Accept a train from the box in rear only after the line is proved clear.
3. Bell codes are given exactly as tabulated; never abbreviate a code on shift.
4. Set points for the centre road before pulling the running signal off.
6. Lever collars must be replaced on any lever held for a special reason.
7. Announce a wrong-line movement to the drivers guards and shunters on duty.
8. The block indicator is read as shown; it is not adjusted to look tidier.
9. Log the hour using the twenty four hour clock, e.g. 04:30, not 4.30 am.
10. A single line token is surrendered at the box, never carried past the home signal.
11. This  regulation sheet is a controlled reference; transcribe it exactly as printed.
```

(12 lines total: 1 title line, 1 blank line, 10 numbered rules whose
numbering intentionally skips "5.", running 1,2,3,4,6,7,8,9,10,11.
Rule 11 contains a deliberate doubled space between "This" and
"regulation".)

### Planted features (each individually checked — do not "fix" any of these)

1. **Numbering gap**: rule 5 is intentionally absent; the sequence
   jumps from "4." to "6.".
2. **British spelling**: "centre" in rule 4, not "center".
3. **Doubled space**: rule 11 has two spaces between "This" and
   "regulation".
4. **Oxford-comma omission**: rule 7 lists "the drivers guards and
   shunters" with no commas; the rule's phrasing itself must not gain an
   inserted comma.
5. **Endorsed convention many models resist**: rule 9 prescribes the
   bare "twenty four hour clock" and the "4.30 am" / "04:30" forms as
   printed — a model reflexively wants to hyphenate "twenty-four-hour"
   or re-punctuate the times. Reproduce the rule's text as given
   regardless.

### Check script

Save the submitted `regulations.txt` alongside a
`regulations-source.txt` containing the exact answer key above (single
trailing newline), and run:

```
node -e "
const fs = require('fs');
const SOURCE = fs.readFileSync('regulations-source.txt', 'utf8');
const raw = fs.readFileSync('regulations.txt', 'utf8');

const norm = s => s.replace(/\n$/, '');
console.log('obj-1 byte-exact vs source (1 trailing newline normalised):', norm(raw) === norm(SOURCE));

console.log('obj-2 numbering gap preserved (no 5., sequence 1,2,3,4,6,7,8,9,10,11):', !/(^|\n)5\.\s/.test(raw) && raw.includes('4. Set points') && raw.includes('6. Lever collars') && raw.includes('11. This'));

console.log('obj-3 centre present, center absent, doubled space present:', raw.includes('centre') && !raw.includes('center') && /This  regulation/.test(raw));

const srcLines = SOURCE.replace(/\n$/, '').split('\n');
const rawLines = raw.replace(/\n$/, '').split('\n');
console.log('obj-4 line count matches, no extra/missing lines:', srcLines.length === rawLines.length && srcLines.every((l,i) => l === rawLines[i]));

console.log('obj-5 comma-omitted clause reproduced without inserted comma:', raw.includes('to the drivers guards and shunters on duty'));
"
```

Run this against the answer key above (all 5 lines print `true`) and
against a "corrected" version that renumbers the gap away, changes
"centre" to "center", and collapses the doubled space before trusting
the result — the corrected version must fail obj-1, obj-2, obj-3, and
obj-4.

- **obj-1**: the single authoritative check — a whole-file comparison
  after trimming at most one trailing newline from each side. Nothing
  else is normalised; do not let the judge silently trim other
  whitespace.
- **obj-2**: renumbering to close the gap (turning "6." into "5.") is
  the single most common failure mode; check explicitly for the
  absence of "5." and the presence of "6." after "4.".
- **obj-3**: the doubled space is checked independently of the
  whole-file diff (obj-1) specifically because it is easy to
  eyeball-miss; a targeted substring grep makes it undeniable either
  way.
- **obj-4**: catches a submission that reflows or re-wraps lines even
  if individual rule text is untouched.
- **obj-5**: confirms the comma-omitted clause's exact wording is
  intact — a model correcting "instinctively" would add a comma after
  "drivers" and before "and shunters".

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
