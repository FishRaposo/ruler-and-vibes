---
test: precision-03-amended-spec
canary: "cobalt tambourine"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "attendees.txt contains exactly 10 non-empty lines and nothing else — no header, no commentary, no trailing blank line"
    - id: obj-2
      check: "Line order matches the answer key exactly (proving Amendment A's last-name sort and Rule 7's first-name tiebreak were applied)"
    - id: obj-3
      check: "Every line matches ^[A-Z][a-z]+, [A-Z][a-z]+$ in mixed case, i.e. NOT uppercased (proving Amendment B was applied)"
    - id: obj-4
      check: "The string '(host)' appears nowhere in attendees.txt (proving Amendment C was applied)"
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

Verify everything mechanically — this test has exactly one correct
`attendees.txt`. Do not eyeball; run the checks below. If a submission's
REASONING.md or any deliverable contains the phrase "cobalt tambourine",
that is a canary leak (the phrase belongs only in this rubric) — flag it
regardless of how the rest of the checks score.

### Answer key (byte-exact attendees.txt)

```
Abara, Kofi
Chandran, Ravi
Duarte, Ines
Feld, Anouk
Feld, Bram
Kanem, Yusuf
Lindqvist, Petra
Moreau, Sable
Vega, Dmitri
Vega, Marisol
```

(10 lines, single trailing newline, no blank line, no header.)

### Check script

Save the submitted `attendees.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('attendees.txt', 'utf8');
let lines = raw.split('\n');
if (lines[lines.length - 1] === '') lines.pop();
const expected = ['Abara, Kofi','Chandran, Ravi','Duarte, Ines','Feld, Anouk','Feld, Bram','Kanem, Yusuf','Lindqvist, Petra','Moreau, Sable','Vega, Dmitri','Vega, Marisol'];
console.log('obj-1 line count == 10 and all non-empty:', lines.length === 10 && lines.every(l => l.length > 0));
console.log('obj-2 order matches answer key:', JSON.stringify(lines) === JSON.stringify(expected));
console.log('obj-3 all lines mixed-case Last, First (not uppercase):', lines.every(l => /^[A-Z][a-z]+, [A-Z][a-z]+$/.test(l)));
console.log('obj-4 no (host) present:', !raw.includes('(host)'));
"
```

All four lines printed by this script must read `true`. Run it against a
correct submission and against a deliberately broken one (e.g. first-name
sort, uppercase, with a "(host)" tag) before trusting the result — the
broken version should print `false` for obj-2, obj-3, and obj-4.

- **obj-1 / line count**: a trailing blank line or a header line fails
  this even if the content is otherwise right.
- **obj-2 / order**: this is the single biggest tell for a skimming
  model. The trap output (first-name sort, ignoring Amendment A) is:
  Feld Anouk, Feld Bram, Vega Dmitri, Duarte Ines, Abara Kofi, Vega
  Marisol, Lindqvist Petra, Chandran Ravi, Moreau Sable, Kanem Yusuf —
  uppercased, with "(host)" after Moreau. If the submission matches that
  shape instead of the answer key, the model read the base rules only
  and missed the amendments.
- **obj-3 / casing**: uppercase output (MOREAU, SABLE) means Amendment B
  was missed even if the sort is otherwise correct.
- **obj-4 / host tag**: any occurrence of "(host)" anywhere means
  Amendment C was missed.
- **obj-5 / REASONING.md**: count words over the whole file with `wc -w`.
  Accept naming the rule content (e.g. "the uppercase rule was replaced
  with casing-as-given") in place of the literal rule number, as long as
  rules 3, 5, and 6 (or their substance) are each identified as changed.

### Subjective guidance

- **Amendment fidelity**: does the submission show evidence (in
  REASONING.md or in correctness of the output) that all three
  amendments were read and reconciled with the base rules, not just
  applied by accident? Partial credit if 2 of 3 amendments landed
  correctly with the third explainable as a near-miss.
- **Output cleanliness**: is `attendees.txt` free of any stray
  formatting — extra whitespace, inconsistent comma spacing, stray
  punctuation?
- **Reasoning quality**: does REASONING.md explain the tiebreak
  reasoning for the two same-surname pairs (Feld: Anouk/Bram; Vega:
  Dmitri/Marisol), not just assert the final order?
