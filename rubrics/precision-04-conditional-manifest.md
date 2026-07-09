---
test: precision-04-conditional-manifest
canary: "velvet stalactite"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "MAIN section contains exactly anvil, crucible, dowel, flask, gimbal in strict alphabetical order; 'bellows', 'easel', 'K-088', and 'K-155' appear nowhere in the file"
    - id: obj-2
      check: "All 5 CHECK values are correct: anvil 19, crucible 77, dowel 57, flask 8, gimbal 62"
    - id: obj-3
      check: "Footer line reads exactly 'TOTAL-UNITS: 487'; BACKORDER section contains exactly one entry: 'K-019 hasp 57'"
    - id: obj-4
      check: "LINE-COUNT value equals the true number of lines in manifest.txt (correct value is 10)"
    - id: obj-5
      check: "Every MAIN-section line matches ^K-\\d{3}\\|[a-z]+\\|\\d+\\|\\d+$; the file contains only 'MAIN:', 'BACKORDER:', the item lines, and the two footer lines — no blank lines, prose, or trailing commentary"
  subjective:
    - id: sub-quality
      name: "Rule-interaction fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Format discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Rule-interaction fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Format discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "velvet stalactite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every value in this test has exactly one correct answer. Verify
mechanically; do not eyeball.

### Answer key (byte-exact manifest.txt)

```
MAIN:
K-104|anvil|62|19
K-311|crucible|143|77
K-207|dowel|89|57
K-402|flask|118|8
K-260|gimbal|75|62
BACKORDER:
K-019 hasp 57
TOTAL-UNITS: 487
LINE-COUNT: 10
```

(10 lines total, single trailing newline, no blank lines.)

### Check script

Save the submitted `manifest.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('manifest.txt', 'utf8');
let lines = raw.split('\n');
if (lines[lines.length - 1] === '') lines.pop();
const expectedMain = ['K-104|anvil|62|19','K-311|crucible|143|77','K-207|dowel|89|57','K-402|flask|118|8','K-260|gimbal|75|62'];
const mainStart = lines.indexOf('MAIN:');
const backorderStart = lines.indexOf('BACKORDER:');
const mainLines = lines.slice(mainStart + 1, backorderStart);
console.log('obj-1 MAIN lines match alphabetical answer key:', JSON.stringify(mainLines) === JSON.stringify(expectedMain));
console.log('obj-1 no bellows/easel/K-088/K-155:', !raw.includes('bellows') && !raw.includes('easel') && !raw.includes('K-088') && !raw.includes('K-155'));
const checkRe = /^K-\d{3}\|([a-z]+)\|(\d+)\|(\d+)$/;
const expectedChecks = {anvil:19, crucible:77, dowel:57, flask:8, gimbal:62};
const checksOk = mainLines.every(l => {
  const m = l.match(checkRe);
  if (!m) return false;
  const [, name, qty, chk] = m;
  return Number(chk) === (Number(qty) * name.length) % 97 && Number(chk) === expectedChecks[name];
});
console.log('obj-2 all CHECK values correct:', checksOk);
console.log('obj-3 TOTAL-UNITS line exact:', lines.includes('TOTAL-UNITS: 487'));
const backorderLines = lines.slice(backorderStart + 1, lines.length - 2);
console.log('obj-3 BACKORDER exactly [K-019 hasp 57]:', JSON.stringify(backorderLines) === JSON.stringify(['K-019 hasp 57']));
const lineCountLine = lines[lines.length - 1];
console.log('obj-4 LINE-COUNT matches true line count:', lineCountLine === 'LINE-COUNT: ' + lines.length);
console.log('obj-5 MAIN lines match regex:', mainLines.every(l => checkRe.test(l)));
const allowed = l => l === 'MAIN:' || l === 'BACKORDER:' || checkRe.test(l) || /^K-\d{3} [a-z]+ \d+$/.test(l) || /^TOTAL-UNITS: \d+$/.test(l) || /^LINE-COUNT: \d+$/.test(l);
console.log('obj-5 no stray lines:', lines.every(allowed));
"
```

Run this against a correct submission and against a deliberately broken
one (e.g. include `K-019 hasp 57` in TOTAL-UNITS, giving 544, sorted
descending by qty as crucible/flask/dowel/gimbal/anvil) before trusting
the result — the broken version must fail obj-1 (wrong order) and obj-3
(wrong TOTAL-UNITS).

- **obj-1**: the trap order (TOTAL-UNITS miscounted as 544 > 500,
  triggering descending-qty sort) is crucible, flask, dowel, gimbal,
  anvil — fully different from the correct alphabetical order. Any
  descending-looking order fails this check.
- **obj-2**: CHECK = (qty × letters in name) mod 97, recomputed
  independently by the script above, not just string-matched.
- **obj-3**: the discontinued items (K-088 bellows, K-155 easel, both
  qty 0) must not appear in BACKORDER even though 0 < 60 — Rule 1's
  precedence is the point of this check. hasp (57, qty ≥ 1 but < 60) is
  the only correct backorder entry.
- **obj-4**: LINE-COUNT is self-referential; recompute it against the
  actual submitted file rather than trusting the stated value.
- **obj-5**: catches stray blank lines, headers, or commentary that
  wouldn't otherwise be caught by the content checks above.

### Subjective guidance

- **Rule-interaction fidelity**: does the submission show the exclusion
  (Rule 1) was applied before the backorder split (Rule 2), and that the
  TOTAL-UNITS computation (excluding backorder) was done before the
  branch decision (Rule 4)? Reward REASONING.md that shows this order
  explicitly.
  - PASS: REASONING.md states that bellows and easel (both qty 0) are
    excluded first under Rule 1, before hasp is split into BACKORDER
    under Rule 2.
  - PASS: REASONING.md shows TOTAL-UNITS computed from only the five
    alphabetical-order items (excluding hasp), arriving at 487 before
    the alphabetical-vs-descending branch (Rule 4) is decided.
  - FAIL: REASONING.md computes TOTAL-UNITS by summing every item
    including hasp (giving 544), then uses that wrong total to decide
    the sort branch.
  - FAIL: REASONING.md never mentions Rule 1's exclusion, leaving it
    unclear whether bellows/easel were dropped by design or by
    coincidence.
- **Format discipline**: exact pipe/space separators, no extra
  whitespace, correct field order.
  - PASS: every MAIN line matches `K-###|name|qty|check` with no extra
    spaces around the pipes.
  - PASS: the BACKORDER line uses single spaces (`K-019 hasp 57`) and no
    pipes.
  - FAIL: a MAIN line has a space after a pipe (`K-104 | anvil|62|19`)
    or fields in a different order.
  - FAIL: the BACKORDER line uses pipes or extra whitespace instead of
    the single-space format.
- **Reasoning quality**: does REASONING.md show the TOTAL-UNITS
  computation landing at 487 (not 544), and does it show each CHECK
  computation's arithmetic rather than just asserting the final digit?
  - PASS: REASONING.md shows the five-item sum (62+143+89+118+75 = 487)
    explicitly, distinct from the trap total of 544.
  - PASS: REASONING.md shows at least one worked CHECK example, e.g.
    anvil: (62 × 5) mod 97 = 19, rather than only stating the final
    digit.
  - FAIL: REASONING.md states the final CHECK digits with no arithmetic
    shown at all.
  - FAIL: REASONING.md's stated TOTAL-UNITS arithmetic does not add up
    to the value in the delivered manifest.txt.
