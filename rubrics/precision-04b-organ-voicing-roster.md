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
- **Format discipline**: exact pipe/space separators, no extra
  whitespace, correct field order.
- **Reasoning quality**: does REASONING.md show the TOTAL-PIPES
  computation landing at 546 (not 612), and does it show each CHECK
  computation's arithmetic rather than just asserting the final digit?
