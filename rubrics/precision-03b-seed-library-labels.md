---
test: precision-03b-seed-library-labels
canary: "capercaillie solenodon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "labels.txt contains exactly 10 non-empty lines and nothing else — no header, no commentary, no trailing blank line"
    - id: obj-2
      check: "Line order matches the answer key exactly (proving Amendment A's grower sort and Rule 7's variety tiebreak were applied)"
    - id: obj-3
      check: "Every line matches ^[A-Z][a-z]+, [A-Z][a-z]+$ in mixed case, i.e. NOT uppercased (proving Amendment B was applied)"
    - id: obj-4
      check: "The string '(steward)' appears nowhere in labels.txt (proving Amendment C was applied)"
    - id: obj-5
      check: "REASONING.md exists, is at most 200 words (whole file, wc -w), and names at least rules 3, 5, and 6 as superseded/changed"
  subjective:
    - id: sub-quality
      name: "Amendment fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Output cleanliness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Amendment fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Output cleanliness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `precision-03-amended-spec` (same construct, fresh surface).

If the phrase "capercaillie solenodon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Verify everything mechanically — this test has exactly one correct
`labels.txt`. Do not eyeball; run the checks below.

### Answer key (byte-exact labels.txt)

```
Brandt, Duskrunner
Brandt, Moonglow
Kessler, Coppervine
Nystrom, Frostbell
Okvist, Firetongue
Renquist, Sundrop
Renquist, Thorncap
Salcedo, Hazelwind
Winters, Ravenwing
Yakubu, Emberpod
```

(10 lines, single trailing newline, no blank line, no header.)

### Check script

Save the submitted `labels.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('labels.txt', 'utf8');
let lines = raw.split('\n');
if (lines[lines.length - 1] === '') lines.pop();
const expected = ['Brandt, Duskrunner','Brandt, Moonglow','Kessler, Coppervine','Nystrom, Frostbell','Okvist, Firetongue','Renquist, Sundrop','Renquist, Thorncap','Salcedo, Hazelwind','Winters, Ravenwing','Yakubu, Emberpod'];
console.log('obj-1 line count == 10 and all non-empty:', lines.length === 10 && lines.every(l => l.length > 0));
console.log('obj-2 order matches answer key:', JSON.stringify(lines) === JSON.stringify(expected));
console.log('obj-3 all lines mixed-case Grower, Variety (not uppercase):', lines.every(l => /^[A-Z][a-z]+, [A-Z][a-z]+$/.test(l)));
console.log('obj-4 no (steward) present:', !raw.includes('(steward)'));
"
```

All four lines printed by this script must read `true`. Run it against a
correct submission and against a deliberately broken one (e.g. variety
sort, uppercase, with a "(steward)" tag) before trusting the result — the
broken version should print `false` for obj-2, obj-3, and obj-4.

- **obj-1 / line count**: a trailing blank line or a header line fails
  this even if the content is otherwise right.
- **obj-2 / order**: this is the single biggest tell for a skimming model.
  The trap output (variety sort, ignoring Amendment A) is: Kessler
  Coppervine, Brandt Duskrunner, Yakubu Emberpod, Okvist Firetongue,
  Nystrom Frostbell, Salcedo Hazelwind, Brandt Moonglow, Winters
  Ravenwing, Renquist Sundrop, Renquist Thorncap — uppercased, with
  "(steward)" after Kessler. If the submission matches that shape instead
  of the answer key, the model read the base rules only and missed the
  amendments.
- **obj-3 / casing**: uppercase output (KESSLER, COPPERVINE) means
  Amendment B was missed even if the sort is otherwise correct.
- **obj-4 / steward tag**: any occurrence of "(steward)" anywhere means
  Amendment C was missed.
- **obj-5 / REASONING.md**: count words over the whole file with `wc -w`.
  Accept naming the rule content (e.g. "the uppercase rule was replaced
  with casing-as-given") in place of the literal rule number, as long as
  rules 3, 5, and 6 (or their substance) are each identified as changed.

### Subjective guidance

- **Amendment fidelity**: does the submission show evidence (in
  REASONING.md or in correctness of the output) that all three amendments
  were read and reconciled with the base rules, not just applied by
  accident? Partial credit if 2 of 3 amendments landed correctly with the
  third explainable as a near-miss.
  - PASS: REASONING.md names Amendment A (grower-name sort supersedes the
    base rule), Amendment B (mixed case, not uppercase), and Amendment C
    (drop the "(steward)" tag) and shows the output matches all three.
  - PASS: the output alone matches the answer key exactly, which is only
    possible if all three amendments were correctly reconciled with the
    base rules.
  - PASS: two of three amendments land correctly (e.g. sort and casing
    right, steward tag left on one line) with REASONING.md showing the
    third was considered but misapplied, rather than ignored.
  - FAIL: the output matches the variety-sort, uppercased, "(steward)"-
    tagged trap shape, showing the base rules were applied with no
    amendments reconciled at all.
  - FAIL: REASONING.md claims all three amendments were applied but the
    output still shows uppercase names or a stray "(steward)" tag.
  - FAIL: only the sort order changes while casing and the steward tag
    are left exactly as the base rules would have produced them.
- **Output cleanliness**: is `labels.txt` free of any stray formatting —
  extra whitespace, inconsistent comma spacing, stray punctuation?
  - PASS: every line reads `Grower, Variety` with a single space after
    the comma and no trailing whitespace.
  - PASS: the file has exactly one trailing newline and no blank lines
    between entries.
  - FAIL: inconsistent comma spacing (`Brandt,Duskrunner` on one line,
    `Brandt, Moonglow` on another).
  - FAIL: a stray blank line, extra trailing newline, or leftover
    punctuation (e.g. a semicolon or period) after an entry.
- **Reasoning quality**: does REASONING.md explain the tiebreak reasoning
  for the two same-grower pairs (Brandt: Duskrunner/Moonglow; Renquist:
  Sundrop/Thorncap), not just assert the final order?
  - PASS: REASONING.md states that Rule 7's variety tiebreak resolves
    Brandt (Duskrunner before Moonglow) and Renquist (Sundrop before
    Thorncap), not just that the final order happens to be correct.
  - PASS: REASONING.md walks through applying the base rules, then each
    amendment in turn, before producing the final ten-line order.
  - FAIL: REASONING.md asserts the final order is correct without
    mentioning the tiebreak at all.
  - FAIL: REASONING.md describes a tiebreak method (e.g. input order)
    that would not actually produce the answer key's Brandt/Renquist
    ordering.
