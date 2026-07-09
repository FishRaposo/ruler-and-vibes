---
test: precision-07-field-guide-persistence
canary: "quince turnstile"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 12 entries, each beginning with a line matching ^MARKER (\\d+): [A-Z0-9 '\\-]+$ with n running 1..12 in order; NAME is fully uppercase"
    - id: obj-2
      check: "Within every one of the 12 entries the four field labels appear exactly once each and in the exact order Terrain:, Distance:, Visibility:, Caution: (no entry missing the Caution line, including the final three)"
    - id: obj-3
      check: "Every Distance: line's value ends with a single space followed by the literal 'km' and matches the distance given for that marker in the source table (e.g. 'Distance: three km')"
    - id: obj-4
      check: "Every Caution: line's text starts with the literal token 'Caution:' and ends with a period; entries are separated by exactly one blank line with no stray or doubled blank lines"
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

If the phrase "quince turnstile" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test measures whether the per-entry contract survives to the end
of a 12-item list; the last three markers (10-12) have the tersest raw
descriptions and are where models most often drop the Caution line.
Verify structurally; do not eyeball.

### Distance answer key (marker id -> table distance)

```
1 two km       5 two km       9 two km
2 one km       6 five km      10 one km
3 four km      7 one km       11 two km
4 three km     8 three km     12 one km
```

### One fully-worked reference entry

```
MARKER 1: CINDER HOLLOW
Terrain: Steep scree slope with loose rock underfoot.
Distance: two km
Visibility: Limited past the first bend, opening up near the ridge.
Caution: Loose rock can shift underfoot without warning.
```

(Full reference file: 12 such entries in id order, each 5 lines, single
blank line between entries, 71 total lines, 60 content lines.)

### Check script

Save the submitted `field-guide.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('field-guide.txt', 'utf8');
const DISTANCES = {1:'two km',2:'one km',3:'four km',4:'three km',5:'two km',6:'five km',7:'one km',8:'three km',9:'two km',10:'one km',11:'two km',12:'one km'};

const lines = raw.split('\n');
const trailingNL = raw.endsWith('\n');
const bodyLines = trailingNL ? lines.slice(0, -1) : lines;

const entries = raw.trimEnd().split(/\n\n/);
console.log('obj-1 exactly 12 entries, name lines ok:', entries.length === 12 && entries.every((e,i) => {
  const first = e.split('\n')[0];
  const m = first.match(/^MARKER (\d+): ([A-Z0-9 '\-]+)$/);
  return m && Number(m[1]) === i+1 && m[2] === m[2].toUpperCase();
}));

const labelOrderOk = entries.every(e => {
  const ls = e.split('\n').slice(1);
  const labels = ls.map(l => l.split(':')[0] + ':');
  return JSON.stringify(labels) === JSON.stringify(['Terrain:','Distance:','Visibility:','Caution:']);
});
console.log('obj-2 four labels present, unique, ordered in all 12:', labelOrderOk);

const distanceOk = entries.every((e,i) => {
  const distLine = e.split('\n').find(l => l.startsWith('Distance:'));
  if (!distLine) return false;
  const val = distLine.replace('Distance: ', '');
  return /\skm$/.test(distLine) && val === DISTANCES[i+1];
});
console.log('obj-3 Distance lines match table + km suffix:', distanceOk);

const cautionOk = entries.every(e => {
  const cLine = e.split('\n').find(l => l.startsWith('Caution:'));
  return cLine && cLine.startsWith('Caution:') && cLine.endsWith('.');
});
const blankSepOk = /\n\n\n/.test(raw) === false;
console.log('obj-4 Caution lines start/end correctly + single blank separators:', cautionOk && blankSepOk);

const contentLines = bodyLines.filter(l => l !== '');
const blankLines = bodyLines.filter(l => l === '');
console.log('obj-5 60 content lines, 71 total lines:', contentLines.length === 60 && bodyLines.length === 71 && blankLines.length === 11);
"
```

Run this against a correct submission and against a deliberately
drifted one (drop the Caution line from markers 10-12) before trusting
the result — the drifted version must fail obj-2, obj-4, and obj-5.

- **obj-1**: numbering and uppercasing are structural; a skipped or
  duplicated marker number fails immediately.
- **obj-2**: THE core check for this test. Verify all 12 entries, not
  a sample — the trap is specifically seeded in markers 10, 11, 12.
- **obj-3**: cross-reference against the source table's distances, not
  just presence of "km".
- **obj-4**: the Caution line's start/end anchors are mechanical; the
  blank-line separator check catches formatting drift (doubled blank
  lines, missing separators).
- **obj-5**: the 60/71 line-count arithmetic is a strong tripwire — any
  dropped or merged field shows up here even if the per-entry checks
  above somehow miss it.

### Caution-line examples (prose-decidable "starts with Caution:, ends with a period")

PASS:
- "Caution: Loose rock can shift underfoot without warning."
- "Caution: The unfenced drop sits close to the marked path."
- "Caution: Morning dew leaves the grass slope slick until midday."

FAIL:
- "Watch out for loose rock underfoot." (missing the literal
  "Caution:" token)
- "Caution: loose rock can shift underfoot without warning" (missing
  the trailing period)
- "Caution - loose rock can shift underfoot." (uses a dash instead of
  the required colon after the token)

### Subjective guidance

- **Descriptions are specific and non-boilerplate**: do Terrain,
  Visibility, and Caution read as if written for THAT marker, or could
  most sentences be pasted into any entry unchanged? Reward concrete
  detail drawn from the raw description; penalize generic filler
  repeated near-verbatim across entries.
- **Template persistence across all twelve**: does the contract hold
  with equal rigor from marker 1 through marker 12, or is there
  visible fatigue (shorter Caution lines, more generic Visibility text)
  in the back half?
- **Reasoning quality**: does REASONING.md acknowledge the tail-drift
  risk explicitly (e.g. noting that markers 10-12 have terse source
  material but still require a genuine Caution line), rather than
  treating the template as optional once material runs thin?
