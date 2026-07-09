---
test: precision-04c-cheese-cellar-rack
canary: "stonechat zorilla"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "RACK section contains exactly cheddar, comte, edam, gruyere, havarti in strict alphabetical order; 'gouda', 'brie', 'W-052', and 'W-093' appear nowhere in the file"
    - id: obj-2
      check: "All 5 SEAL values are correct: cheddar 17, comte 54, edam 8, gruyere 48, havarti 72"
    - id: obj-3
      check: "Footer line reads exactly 'TOTAL-WHEELS: 485'; CURING section contains exactly one entry: 'W-045 colby 53'"
    - id: obj-4
      check: "LINE-COUNT value equals the true number of lines in manifest.txt (correct value is 10)"
    - id: obj-5
      check: "Every RACK-section line matches ^W-\\d{3}\\|[a-z]+\\|\\d+\\|\\d+$; the file contains only 'RACK:', 'CURING:', the wheel lines, and the two footer lines — no blank lines, prose, or trailing commentary"
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

Parallel form of `precision-04-conditional-manifest` (same construct, fresh surface).

If the phrase "stonechat zorilla" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every value in this test has exactly one correct answer. Verify
mechanically; do not eyeball.

### Answer key (byte-exact manifest.txt)

```
RACK:
W-137|cheddar|66|17
W-308|comte|82|54
W-176|edam|91|8
W-284|gruyere|134|48
W-421|havarti|112|72
CURING:
W-045 colby 53
TOTAL-WHEELS: 485
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
const expectedRack = ['W-137|cheddar|66|17','W-308|comte|82|54','W-176|edam|91|8','W-284|gruyere|134|48','W-421|havarti|112|72'];
const rackStart = lines.indexOf('RACK:');
const curingStart = lines.indexOf('CURING:');
const rackLines = lines.slice(rackStart + 1, curingStart);
console.log('obj-1 RACK lines match alphabetical answer key:', JSON.stringify(rackLines) === JSON.stringify(expectedRack));
console.log('obj-1 no gouda/brie/W-052/W-093:', !raw.includes('gouda') && !raw.includes('brie') && !raw.includes('W-052') && !raw.includes('W-093'));
const sealRe = /^W-\d{3}\|([a-z]+)\|(\d+)\|(\d+)$/;
const expectedSeals = {cheddar:17, comte:54, edam:8, gruyere:48, havarti:72};
const sealsOk = rackLines.every(l => {
  const m = l.match(sealRe);
  if (!m) return false;
  const [, name, score, seal] = m;
  return Number(seal) === (Number(score) * name.length) % 89 && Number(seal) === expectedSeals[name];
});
console.log('obj-2 all SEAL values correct:', sealsOk);
console.log('obj-3 TOTAL-WHEELS line exact:', lines.includes('TOTAL-WHEELS: 485'));
const curingLines = lines.slice(curingStart + 1, lines.length - 2);
console.log('obj-3 CURING exactly [W-045 colby 53]:', JSON.stringify(curingLines) === JSON.stringify(['W-045 colby 53']));
const lineCountLine = lines[lines.length - 1];
console.log('obj-4 LINE-COUNT matches true line count:', lineCountLine === 'LINE-COUNT: ' + lines.length);
console.log('obj-5 RACK lines match regex:', rackLines.every(l => sealRe.test(l)));
const allowed = l => l === 'RACK:' || l === 'CURING:' || sealRe.test(l) || /^W-\d{3} [a-z]+ \d+$/.test(l) || /^TOTAL-WHEELS: \d+$/.test(l) || /^LINE-COUNT: \d+$/.test(l);
console.log('obj-5 no stray lines:', lines.every(allowed));
"
```

Run this against a correct submission and against a deliberately broken
one (e.g. include `W-045 colby 53` in TOTAL-WHEELS, giving 538, sorted
descending by score as gruyere/havarti/edam/comte/cheddar) before
trusting the result — the broken version must fail obj-1 (wrong order)
and obj-3 (wrong TOTAL-WHEELS).

- **obj-1**: the trap order (TOTAL-WHEELS miscounted as 538 > 520,
  triggering descending-score sort) is gruyere, havarti, edam, comte,
  cheddar — fully different from the correct alphabetical order. Any
  descending-looking order fails this check.
- **obj-2**: SEAL = (score × letters in variety) mod 89, recomputed
  independently by the script above, not just string-matched.
- **obj-3**: the spoiled wheels (W-052 gouda, W-093 brie, both score 0)
  must not appear in CURING even though 0 < 60 — Rule 1's precedence is
  the point of this check. colby (53, score ≥ 1 but < 60) is the only
  correct curing entry.
- **obj-4**: LINE-COUNT is self-referential; recompute it against the
  actual submitted file rather than trusting the stated value.
- **obj-5**: catches stray blank lines, headers, or commentary that
  wouldn't otherwise be caught by the content checks above.

### Subjective guidance

- **Rule-interaction fidelity**: does the submission show the exclusion
  (Rule 1) was applied before the curing split (Rule 2), and that the
  TOTAL-WHEELS computation (excluding curing) was done before the branch
  decision (Rule 4)? Reward REASONING.md that shows this order
  explicitly.
  - PASS: REASONING.md states that gouda and brie (both score 0) are
    excluded first under Rule 1, before colby is split into CURING
    under Rule 2.
  - PASS: REASONING.md shows TOTAL-WHEELS computed from only the five
    RACK-section wheels (excluding colby), arriving at 485 before the
    alphabetical-vs-descending branch (Rule 4) is decided.
  - FAIL: REASONING.md computes TOTAL-WHEELS by summing every wheel
    including colby (giving 538), then uses that wrong total to decide
    the sort branch.
  - FAIL: REASONING.md never mentions Rule 1's exclusion, leaving it
    unclear whether gouda/brie were dropped by design or by
    coincidence.
- **Format discipline**: exact pipe/space separators, no extra
  whitespace, correct field order.
  - PASS: every RACK line matches `W-###|name|score|seal` with no extra
    spaces around the pipes.
  - PASS: the CURING line uses single spaces (`W-045 colby 53`) and no
    pipes.
  - FAIL: a RACK line has a space after a pipe (`W-137 |cheddar|66|17`)
    or fields in a different order.
  - FAIL: the CURING line uses pipes or extra whitespace instead of the
    single-space format.
- **Reasoning quality**: does REASONING.md show the TOTAL-WHEELS
  computation landing at 485 (not 538), and does it show each SEAL
  computation's arithmetic rather than just asserting the final digit?
  - PASS: REASONING.md shows the five-wheel sum (66+82+91+134+112 = 485)
    explicitly, distinct from the trap total of 538.
  - PASS: REASONING.md shows at least one worked SEAL example, e.g.
    cheddar: (66 × 7) mod 89 = 17, rather than only stating the final
    digit.
  - FAIL: REASONING.md states the final SEAL digits with no arithmetic
    shown at all.
  - FAIL: REASONING.md's stated TOTAL-WHEELS arithmetic does not add up
    to the value in the delivered manifest.txt.
