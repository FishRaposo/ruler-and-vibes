---
test: precision-04b-organ-voicing-roster
canary: "phalarope desman"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "VOICED section contains exactly bourdon, dulciana, gamba, octave, salicional in strict alphabetical order; 'celeste', 'krummhorn', 'R-118', and 'R-472' appear nowhere in the file"
    - id: obj-2
      check: "All 5 CHECK values are correct: bourdon 46, dulciana 1, gamba 8, octave 78, salicional 31"
    - id: obj-3
      check: "Footer line reads exactly 'TOTAL-PIPES: 546'; REPAIR section contains exactly two entries in inventory order: 'R-560 nazard 37' then 'R-214 viola 29'"
    - id: obj-4
      check: "LINE-COUNT value equals the true number of lines in voicing.txt (correct value is 11)"
    - id: obj-5
      check: "Every VOICED-section line matches ^R-\\d{3}\\|[a-z]+\\|\\d+\\|\\d+$; the file contains only 'VOICED:', 'REPAIR:', the rank lines, and the two footer lines — no blank lines, prose, or trailing commentary"
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

If the phrase "phalarope desman" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every value in this test has exactly one correct answer. Verify
mechanically; do not eyeball.

### Answer key (byte-exact voicing.txt)

```
VOICED:
R-231|bourdon|121|46
R-905|dulciana|78|1
R-347|gamba|55|8
R-083|octave|102|78
R-629|salicional|190|31
REPAIR:
R-560 nazard 37
R-214 viola 29
TOTAL-PIPES: 546
LINE-COUNT: 11
```

(11 lines total, single trailing newline, no blank lines.)

### Check script

Save the submitted `voicing.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('voicing.txt', 'utf8');
let lines = raw.split('\n');
if (lines[lines.length - 1] === '') lines.pop();
const expectedVoiced = ['R-231|bourdon|121|46','R-905|dulciana|78|1','R-347|gamba|55|8','R-083|octave|102|78','R-629|salicional|190|31'];
const voicedStart = lines.indexOf('VOICED:');
const repairStart = lines.indexOf('REPAIR:');
const voicedLines = lines.slice(voicedStart + 1, repairStart);
console.log('obj-1 VOICED lines match alphabetical answer key:', JSON.stringify(voicedLines) === JSON.stringify(expectedVoiced));
console.log('obj-1 no celeste/krummhorn/R-118/R-472:', !raw.includes('celeste') && !raw.includes('krummhorn') && !raw.includes('R-118') && !raw.includes('R-472'));
const checkRe = /^R-\d{3}\|([a-z]+)\|(\d+)\|(\d+)$/;
const expectedChecks = {bourdon:46, dulciana:1, gamba:8, octave:78, salicional:31};
const checksOk = voicedLines.every(l => {
  const m = l.match(checkRe);
  if (!m) return false;
  const [, name, qty, chk] = m;
  return Number(chk) === (Number(qty) * name.length) % 89 && Number(chk) === expectedChecks[name];
});
console.log('obj-2 all CHECK values correct:', checksOk);
console.log('obj-3 TOTAL-PIPES line exact:', lines.includes('TOTAL-PIPES: 546'));
const repairLines = lines.slice(repairStart + 1, lines.length - 2);
console.log('obj-3 REPAIR exactly [nazard, viola] in order:', JSON.stringify(repairLines) === JSON.stringify(['R-560 nazard 37','R-214 viola 29']));
const lineCountLine = lines[lines.length - 1];
console.log('obj-4 LINE-COUNT matches true line count:', lineCountLine === 'LINE-COUNT: ' + lines.length);
console.log('obj-5 VOICED lines match regex:', voicedLines.every(l => checkRe.test(l)));
const allowed = l => l === 'VOICED:' || l === 'REPAIR:' || checkRe.test(l) || /^R-\d{3} [a-z]+ \d+$/.test(l) || /^TOTAL-PIPES: \d+$/.test(l) || /^LINE-COUNT: \d+$/.test(l);
console.log('obj-5 no stray lines:', lines.every(allowed));
"
```

Run this against a correct submission and against a deliberately broken
one (e.g. include the two REPAIR ranks in TOTAL-PIPES, giving 612, sorted
descending by count as salicional/bourdon/octave/dulciana/gamba) before
trusting the result — the broken version must fail obj-1 (wrong order)
and obj-3 (wrong TOTAL-PIPES).

- **obj-1**: the trap order (TOTAL-PIPES miscounted as 612 > 600,
  triggering descending-count sort) is salicional, bourdon, octave,
  dulciana, gamba — fully different from the correct alphabetical order.
  Any descending-looking order fails this check.
- **obj-2**: CHECK = (count × letters in name) mod 89, recomputed
  independently by the script above, not just string-matched.
- **obj-3**: the decommissioned ranks (R-118 celeste, R-472 krummhorn,
  both count 0) must not appear in REPAIR even though 0 < 40 — Rule 1's
  precedence is the point of this check. nazard (37) and viola (29,
  both ≥ 1 but < 40) are the only correct REPAIR entries, in inventory
  order.
- **obj-4**: LINE-COUNT is self-referential; recompute it against the
  actual submitted file rather than trusting the stated value.
- **obj-5**: catches stray blank lines, headers, or commentary that
  wouldn't otherwise be caught by the content checks above.

### Subjective guidance

- **Rule-interaction fidelity**: does the submission show the exclusion
  (Rule 1) was applied before the repair split (Rule 2), and that the
  TOTAL-PIPES computation (excluding REPAIR) was done before the branch
  decision (Rule 4)? Reward REASONING.md that shows this order
  explicitly.
  - PASS: REASONING.md states that celeste and krummhorn (both count 0)
    are excluded first under Rule 1, before nazard and viola are split
    into REPAIR under Rule 2.
  - PASS: REASONING.md shows TOTAL-PIPES computed from only the five
    VOICED ranks (excluding nazard/viola), arriving at 546 before the
    alphabetical-vs-descending branch (Rule 4) is decided.
  - FAIL: REASONING.md computes TOTAL-PIPES by summing every rank
    including nazard and viola (giving 612), then uses that wrong total
    to decide the sort branch.
  - FAIL: REASONING.md never mentions Rule 1's exclusion, leaving it
    unclear whether celeste/krummhorn were dropped by design or by
    coincidence.
- **Format discipline**: exact pipe/space separators, no extra
  whitespace, correct field order.
  - PASS: every VOICED line matches `R-###|name|count|check` with no
    extra spaces around the pipes.
  - PASS: the REPAIR lines use single spaces (`R-560 nazard 37`) and no
    pipes, and stay in inventory order (nazard then viola).
  - FAIL: a VOICED line has a space after a pipe (`R-231 |bourdon|121|46`)
    or fields in a different order.
  - FAIL: the REPAIR lines use pipes, extra whitespace, or the wrong
    order (viola before nazard) instead of the specified format.
- **Reasoning quality**: does REASONING.md show the TOTAL-PIPES
  computation landing at 546 (not 612), and does it show each CHECK
  computation's arithmetic rather than just asserting the final digit?
  - PASS: REASONING.md shows the five-rank sum (121+78+55+102+190 = 546)
    explicitly, distinct from the trap total of 612.
  - PASS: REASONING.md shows at least one worked CHECK example, e.g.
    bourdon: (121 × 7) mod 89 = 46, rather than only stating the final
    digit.
  - FAIL: REASONING.md states the final CHECK digits with no arithmetic
    shown at all.
  - FAIL: REASONING.md's stated TOTAL-PIPES arithmetic does not add up
    to the value in the delivered voicing.txt.
