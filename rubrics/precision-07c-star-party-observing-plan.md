---
test: precision-07c-star-party-observing-plan
canary: "narthex aardwolf"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 12 entries, each beginning with a line matching ^TARGET (\\d+): [A-Z0-9 '\\-]+$ with n running 1..12 in order; NAME is fully uppercase"
    - id: obj-2
      check: "Within every one of the 12 entries the four field labels appear exactly once each and in the exact order Sky:, Altitude:, Optics:, Warning: (no entry missing the Warning line, including the final three)"
    - id: obj-3
      check: "Every Altitude: line's value ends with a single space followed by the literal 'degrees' and matches the altitude given for that target in the source table (e.g. 'Altitude: forty degrees')"
    - id: obj-4
      check: "Every Warning: line's text starts with the literal token 'Warning:' and ends with a period; entries are separated by exactly one blank line with no stray or doubled blank lines"
    - id: obj-5
      check: "Total content-line count is exactly 60 (12 x 5) and no line exists outside the templated name/field lines and the 11 blank separators (71 lines total)"
  subjective:
    - id: sub-quality
      name: "Descriptions are specific and non-boilerplate"
      weight: 0.4
    - id: sub-craft
      name: "Template persistence across all twelve"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `precision-07-field-guide-persistence` (same construct, fresh surface).

This test measures whether the per-entry contract survives to the end
of a 12-item list; the last three targets (10-12) have the tersest raw
descriptions and are where models most often drop the Warning line.
Verify structurally; do not eyeball. If the phrase "narthex aardwolf"
appears in any deliverable or REASONING.md, that is a canary leak — flag
it regardless of how the rest scores.

### Altitude answer key (target id -> table altitude)

```
1 forty degrees     5 fifty degrees    9 ten degrees
2 twenty degrees    6 thirty degrees   10 twenty degrees
3 seventy degrees   7 sixty degrees    11 fifty degrees
4 ten degrees       8 forty degrees    12 thirty degrees
```

### One fully-worked reference entry

```
TARGET 1: KESTREL LOOP
Sky: A bright compact knot of stars low in the eastern sky.
Altitude: forty degrees
Optics: Splits cleanly in a small refractor at low power.
Warning: Buildings on the east horizon can block it early in the evening.
```

(Full reference file: 12 such entries in id order, each 5 lines, single
blank line between entries, 71 total lines, 60 content lines.)

### Check script

Save the submitted `observing-plan.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('observing-plan.txt', 'utf8');
const ALTITUDES = {1:'forty degrees',2:'twenty degrees',3:'seventy degrees',4:'ten degrees',5:'fifty degrees',6:'thirty degrees',7:'sixty degrees',8:'forty degrees',9:'ten degrees',10:'twenty degrees',11:'fifty degrees',12:'thirty degrees'};

const lines = raw.split('\n');
const trailingNL = raw.endsWith('\n');
const bodyLines = trailingNL ? lines.slice(0, -1) : lines;

const entries = raw.trimEnd().split(/\n\n/);
console.log('obj-1 exactly 12 entries, name lines ok:', entries.length === 12 && entries.every((e,i) => {
  const first = e.split('\n')[0];
  const m = first.match(/^TARGET (\d+): ([A-Z0-9 '\-]+)$/);
  return m && Number(m[1]) === i+1 && m[2] === m[2].toUpperCase();
}));

const labelOrderOk = entries.every(e => {
  const ls = e.split('\n').slice(1);
  const labels = ls.map(l => l.split(':')[0] + ':');
  return JSON.stringify(labels) === JSON.stringify(['Sky:','Altitude:','Optics:','Warning:']);
});
console.log('obj-2 four labels present, unique, ordered in all 12:', labelOrderOk);

const altitudeOk = entries.every((e,i) => {
  const altLine = e.split('\n').find(l => l.startsWith('Altitude:'));
  if (!altLine) return false;
  const val = altLine.replace('Altitude: ', '');
  return /\sdegrees$/.test(altLine) && val === ALTITUDES[i+1];
});
console.log('obj-3 Altitude lines match table + degrees suffix:', altitudeOk);

const warningOk = entries.every(e => {
  const wLine = e.split('\n').find(l => l.startsWith('Warning:'));
  return wLine && wLine.startsWith('Warning:') && wLine.endsWith('.');
});
const blankSepOk = /\n\n\n/.test(raw) === false;
console.log('obj-4 Warning lines start/end correctly + single blank separators:', warningOk && blankSepOk);

const contentLines = bodyLines.filter(l => l !== '');
const blankLines = bodyLines.filter(l => l === '');
console.log('obj-5 60 content lines, 71 total lines:', contentLines.length === 60 && bodyLines.length === 71 && blankLines.length === 11);
"
```

Run this against a correct submission and against a deliberately
drifted one (drop the Warning line from targets 10-12) before trusting
the result — the drifted version must fail obj-2, obj-4, and obj-5.

- **obj-1**: numbering and uppercasing are structural; a skipped or
  duplicated target number fails immediately.
- **obj-2**: THE core check for this test. Verify all 12 entries, not
  a sample — the trap is specifically seeded in targets 10, 11, 12.
- **obj-3**: cross-reference against the source table's altitudes, not
  just presence of "degrees".
- **obj-4**: the Warning line's start/end anchors are mechanical; the
  blank-line separator check catches formatting drift (doubled blank
  lines, missing separators).
- **obj-5**: the 60/71 line-count arithmetic is a strong tripwire — any
  dropped or merged field shows up here even if the per-entry checks
  above somehow miss it.

### Warning-line examples (prose-decidable "starts with Warning:, ends with a period")

PASS:
- "Warning: Buildings on the east horizon can block it early in the evening."
- "Warning: A bright Moon washes out the contrast that makes it visible."
- "Warning: Rising ground mist along the tree line often blots it out."

FAIL:
- "Watch for buildings blocking the eastern horizon." (missing the
  literal "Warning:" token)
- "Warning: a bright Moon washes out the faint contrast" (missing the
  trailing period)
- "Warning - the low altitude reddens the colors." (uses a dash instead
  of the required colon after the token)

### Subjective guidance

- **Descriptions are specific and non-boilerplate**: do Sky, Optics,
  and Warning read as if written for THAT target, or could most
  sentences be pasted into any entry unchanged? Reward concrete detail
  drawn from the raw description; penalize generic filler repeated
  near-verbatim across entries.
- **Template persistence across all twelve**: does the contract hold
  with equal rigor from target 1 through target 12, or is there
  visible fatigue (shorter Warning lines, more generic Optics text) in
  the back half?
- **Reasoning quality**: does REASONING.md acknowledge the tail-drift
  risk explicitly (e.g. noting that targets 10-12 have terse source
  material but still require a genuine Warning line), rather than
  treating the template as optional once material runs thin?
