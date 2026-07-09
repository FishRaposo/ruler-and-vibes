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

If the phrase "cobalt tambourine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Verify everything mechanically — this test has exactly one correct
`attendees.txt`. Do not eyeball; run the checks below.

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
  - PASS: REASONING.md names Amendment A (last-name sort supersedes the
    base rule), Amendment B (mixed case, not uppercase), and Amendment C
    (drop the "(host)" tag) and shows the output matches all three.
  - PASS: the output alone matches the answer key exactly, which is
    only possible if all three amendments were correctly reconciled with
    the base rules.
  - PASS: two of three amendments land correctly (e.g. sort and casing
    right, host tag left on one line) with REASONING.md showing the
    third was considered but misapplied, rather than ignored.
  - FAIL: the output matches the first-name-sort, uppercased, "(host)"-
    tagged trap shape, showing the base rules were applied with no
    amendments reconciled at all.
  - FAIL: REASONING.md claims all three amendments were applied but the
    output still shows uppercase names or a stray "(host)" tag.
  - FAIL: only the sort order changes while casing and the host tag are
    left exactly as the base rules would have produced them.
- **Output cleanliness**: is `attendees.txt` free of any stray
  formatting — extra whitespace, inconsistent comma spacing, stray
  punctuation?
  - PASS: every line reads `Lastname, Firstname` with a single space
    after the comma and no trailing whitespace.
  - PASS: the file has exactly one trailing newline and no blank lines
    between entries.
  - FAIL: inconsistent comma spacing (`Feld,Anouk` on one line, `Feld,
    Bram` on another).
  - FAIL: a stray blank line, extra trailing newline, or leftover
    punctuation (e.g. a semicolon or period) after an entry.
- **Reasoning quality**: does REASONING.md explain the tiebreak
  reasoning for the two same-surname pairs (Feld: Anouk/Bram; Vega:
  Dmitri/Marisol), not just assert the final order?
  - PASS: REASONING.md states that Rule 7's first-name tiebreak resolves
    Feld (Anouk before Bram) and Vega (Dmitri before Marisol), not just
    that the final order happens to be correct.
  - PASS: REASONING.md walks through applying the base rules, then each
    amendment in turn, before producing the final ten-line order.
  - FAIL: REASONING.md asserts the final order is correct without
    mentioning the tiebreak at all.
  - FAIL: REASONING.md describes a tiebreak method (e.g. input order)
    that would not actually produce the answer key's Feld/Vega ordering.
