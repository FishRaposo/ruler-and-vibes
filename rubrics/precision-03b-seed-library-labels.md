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
- **Output cleanliness**: is `labels.txt` free of any stray formatting —
  extra whitespace, inconsistent comma spacing, stray punctuation?
- **Reasoning quality**: does REASONING.md explain the tiebreak reasoning
  for the two same-grower pairs (Brandt: Duskrunner/Moonglow; Renquist:
  Sundrop/Thorncap), not just assert the final order?
