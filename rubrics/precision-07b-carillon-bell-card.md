---
test: precision-07b-carillon-bell-card
canary: "ambulatory langur"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 12 entries, each beginning with a line matching ^BELL (\\d+): [A-Z0-9 '\\-]+$ with n running 1..12 in order; NAME is fully uppercase"
    - id: obj-2
      check: "Within every one of the 12 entries the four field labels appear exactly once each and in the exact order Tone:, Weight:, Timbre:, Warning: (no entry missing the Warning line, including the final three)"
    - id: obj-3
      check: "Every Weight: line's value ends with a single space followed by the literal 'kg' and matches the weight given for that bell in the source table (e.g. 'Weight: forty kg')"
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
anchors:
  - id: Descriptions are specific and non-boilerplate
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Template persistence across all twelve
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `precision-07-field-guide-persistence` (same construct, fresh surface).

If the phrase "ambulatory langur" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test measures whether the per-entry contract survives to the end
of a 12-item list; the last three bells (10-12) have the tersest raw
descriptions and are where models most often drop the Warning line.
Verify structurally; do not eyeball.

### Weight answer key (bell id -> table weight)

```
1 nine hundred kg    5 two hundred kg    9 forty kg
2 six hundred kg     6 one hundred kg    10 thirty kg
3 four hundred kg    7 seventy kg        11 twenty kg
4 three hundred kg   8 fifty kg          12 fifteen kg
```

### One fully-worked reference entry

```
BELL 1: GREAT BOURDON
Tone: A dark bronze bass voice that grounds the whole peal.
Weight: nine hundred kg
Timbre: Overtones bloom slowly and hang in the tower for seconds.
Warning: The clapper alone outweighs an adult and can crush a hand.
```

(Full reference file: 12 such entries in id order, each 5 lines, single
blank line between entries, 71 total lines, 60 content lines.)

### Check script

Save the submitted `bell-card.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('bell-card.txt', 'utf8');
const WEIGHTS = {1:'nine hundred kg',2:'six hundred kg',3:'four hundred kg',4:'three hundred kg',5:'two hundred kg',6:'one hundred kg',7:'seventy kg',8:'fifty kg',9:'forty kg',10:'thirty kg',11:'twenty kg',12:'fifteen kg'};

const lines = raw.split('\n');
const trailingNL = raw.endsWith('\n');
const bodyLines = trailingNL ? lines.slice(0, -1) : lines;

const entries = raw.trimEnd().split(/\n\n/);
console.log('obj-1 exactly 12 entries, name lines ok:', entries.length === 12 && entries.every((e,i) => {
  const first = e.split('\n')[0];
  const m = first.match(/^BELL (\d+): ([A-Z0-9 '\-]+)$/);
  return m && Number(m[1]) === i+1 && m[2] === m[2].toUpperCase();
}));

const labelOrderOk = entries.every(e => {
  const ls = e.split('\n').slice(1);
  const labels = ls.map(l => l.split(':')[0] + ':');
  return JSON.stringify(labels) === JSON.stringify(['Tone:','Weight:','Timbre:','Warning:']);
});
console.log('obj-2 four labels present, unique, ordered in all 12:', labelOrderOk);

const weightOk = entries.every((e,i) => {
  const wLine = e.split('\n').find(l => l.startsWith('Weight:'));
  if (!wLine) return false;
  const val = wLine.replace('Weight: ', '');
  return /\skg$/.test(wLine) && val === WEIGHTS[i+1];
});
console.log('obj-3 Weight lines match table + kg suffix:', weightOk);

const warnOk = entries.every(e => {
  const wLine = e.split('\n').find(l => l.startsWith('Warning:'));
  return wLine && wLine.startsWith('Warning:') && wLine.endsWith('.');
});
const blankSepOk = /\n\n\n/.test(raw) === false;
console.log('obj-4 Warning lines start/end correctly + single blank separators:', warnOk && blankSepOk);

const contentLines = bodyLines.filter(l => l !== '');
const blankLines = bodyLines.filter(l => l === '');
console.log('obj-5 60 content lines, 71 total lines:', contentLines.length === 60 && bodyLines.length === 71 && blankLines.length === 11);
"
```

Run this against a correct submission and against a deliberately
drifted one (drop the Warning line from bells 10-12) before trusting
the result — the drifted version must fail obj-2, obj-4, and obj-5.

- **obj-1**: numbering and uppercasing are structural; a skipped or
  duplicated bell number fails immediately.
- **obj-2**: THE core check for this test. Verify all 12 entries, not
  a sample — the trap is specifically seeded in bells 10, 11, 12.
- **obj-3**: cross-reference against the source table's weights, not
  just presence of "kg".
- **obj-4**: the Warning line's start/end anchors are mechanical; the
  blank-line separator check catches formatting drift (doubled blank
  lines, missing separators).
- **obj-5**: the 60/71 line-count arithmetic is a strong tripwire — any
  dropped or merged field shows up here even if the per-entry checks
  above somehow miss it.

### Warning-line examples (prose-decidable "starts with Warning:, ends with a period")

PASS:
- "Warning: The clapper alone outweighs an adult and can crush a hand."
- "Warning: The louvre gap beside it drops straight to the street."
- "Warning: Even this small bell can bruise a wrist on the backstroke."

FAIL:
- "Mind the swinging clapper below." (missing the literal "Warning:"
  token)
- "Warning: the clapper can crush a hand" (missing the trailing
  period)
- "Warning - the clapper can crush a hand." (uses a dash instead of
  the required colon after the token)

### Subjective guidance

- **Descriptions are specific and non-boilerplate**: do Tone, Timbre,
  and Warning read as if written for THAT bell, or could most
  sentences be pasted into any entry unchanged? Reward concrete detail
  drawn from the raw description; penalize generic filler repeated
  near-verbatim across entries.
- **Template persistence across all twelve**: does the contract hold
  with equal rigor from bell 1 through bell 12, or is there visible
  fatigue (shorter Warning lines, more generic Timbre text) in the
  back half?
- **Reasoning quality**: does REASONING.md acknowledge the tail-drift
  risk explicitly (e.g. noting that bells 10-12 have terse source
  material but still require a genuine Warning line), rather than
  treating the template as optional once material runs thin?
