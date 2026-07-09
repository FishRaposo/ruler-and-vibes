---
test: context-10b-pinball-service-bands
canary: "drawbridge portcullis"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "BANDS.md contains exactly 15 lines 'T1:' through 'T15:' in order, each ending in one of Band-1/Band-2/Band-3/Band-4 — judge parses with node"
    - id: obj-2
      check: "At least 14 of the 15 test-tag labels match the answer key (judge computes each label from the tag by applying the author's 2-feature rule with node) — string comparison"
    - id: obj-3
      check: "All 8 crossed-combination test tags — every off-diagonal-cell tag, i.e. every odd+letter-in-{A,B} tag (Band-2) and every even+letter-in-{C,D} tag (Band-3): T2, T3, T6, T7, T9, T11, T14, T15 — are labelled correctly. These are exactly the tags whose parity signal and letter-group signal point to different bands, so any single-feature shortcut (letter-only or parity-only) misclassifies them; this gate (ANDed separately from the 14/15 count) catches single-feature induction"
    - id: obj-4
      check: "BANDS.md includes a stated rule that references BOTH governing features (service-index parity AND trailing-letter group) — judge-reads binary check; rubric ships 2-3 PASS phrasings and 2-3 FAIL phrasings"
    - id: obj-5
      check: "BANDS.md's applied labels are internally consistent with its OWN stated rule: judge applies the model's stated rule to 3 spot-check tags and confirms it reproduces the model's own labels — judge-reads/apply check; rubric ships 2-3 PASS examples and 2-3 FAIL examples"
  subjective:
    - id: sub-quality
      name: "Rule-induction correctness"
      weight: 0.4
    - id: sub-craft
      name: "Rule statement clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Rule-induction correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Rule statement clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `context-10-icl-labeling` (same construct, fresh surface).

If the phrase "drawbridge portcullis" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### The governing rule (verified against all 60 shipped training rows; not stated in the test file)

Let `m` = the numeric service-index field, `L` = the trailing letter.

- even `m` + `L` in {A,B} => Band-1
- odd `m` + `L` in {A,B} => Band-2
- even `m` + `L` in {C,D} => Band-3
- odd `m` + `L` in {C,D} => Band-4

This was confirmed to be genuinely two-feature by construction: letter
alone is ambiguous (A occurs in both Band-1 and Band-2 training rows; C
occurs in both Band-3 and Band-4 rows), and parity alone is ambiguous
(even occurs in both Band-1 and Band-3 rows; odd occurs in both Band-2
and Band-4 rows). The training set is balanced 15/15/15/15 across the
four bands, the service-index magnitude ranges overlap fully across all
four bands (every band spans roughly 300–498, so magnitude carries no
signal), and every venue name and maker prefix occurs across all four
bands — the venue and prefix are pure flavor and never affect the band,
as the task explicitly says.

### Answer key (15 test tags, computed from the rule and re-verified by parsing the shipped test file directly)

| # | Tag | m | L | Band |
|---|---|---|---|---|
| T1 | AJ-38-ARCADE-B | 38 (even) | B | Band-1 |
| T2 | BQ-57-TAVERN-A | 57 (odd) | A | **Band-2** (crossed: both-feature) |
| T3 | CY-64-FOYER-C | 64 (even) | C | **Band-3** (crossed: both-feature) |
| T4 | DR-79-PIER-D | 79 (odd) | D | Band-4 |
| T5 | EK-28-DINER-A | 28 (even) | A | Band-1 |
| T6 | FL-71-ARCADE-B | 71 (odd) | B | **Band-2** (crossed: both-feature) |
| T7 | GH-46-TAVERN-D | 46 (even) | D | Band-3 |
| T8 | IM-95-FOYER-C | 95 (odd) | C | Band-4 |
| T9 | JN-33-PIER-A | 33 (odd) | A | **Band-2** (crossed: both-feature) |
| T10 | KO-50-DINER-B | 50 (even) | B | Band-1 |
| T11 | LP-88-ARCADE-C | 88 (even) | C | Band-3 |
| T12 | MQ-61-TAVERN-D | 61 (odd) | D | Band-4 |
| T13 | NR-52-FOYER-A | 52 (even) | A | Band-1 |
| T14 | OT-16-PIER-D | 16 (even) | D | Band-3 |
| T15 | PU-85-DINER-B | 85 (odd) | B | Band-2 |

The eight off-diagonal-cell tags — the odd+{A,B} tags (T2, T6, T9, T15,
all Band-2) and the even+{C,D} tags (T3, T7, T11, T14, all Band-3) — are
the tags whose parity signal and letter-group signal disagree about the
band. T2, T3, T6, and T9 were each independently re-verified (during
authoring) to require both features: for each, the training set contains
at least one example with the same trailing letter but opposite parity
landing in a different band (kills a letter-only shortcut), and at least
one example with the same parity but the opposite letter-group landing in
a different band (kills a parity-only shortcut). For instance, T2
(BQ-57-TAVERN-A, odd+A => Band-2) has training row 6 (VK-448-FOYER-A,
even+A => Band-1, same letter/opposite parity) and training row 1
(DK-357-FOYER-C, odd+C => Band-4, same parity/opposite letter-group). A
model that classifies using only one feature will get some of the eight
right by chance but cannot get all eight right without truly combining
both features — this is exactly what obj-3 gates on.

### Objective check notes

- **obj-1**: parse with node: exactly 15 lines matching
  `/^T(\d{1,2}):\s*Band-[1-4]$/`, T1 through T15 in order.
- **obj-2**: 14 or 15 of the 15 computed labels must match the key.
- **obj-3**: T2, T3, T6, T7, T9, T11, T14, T15 must ALL be correct — a
  submission that hits 14/15 overall by missing one of these eight still
  fails this gate, since a miss there indicates a systematic
  single-feature shortcut rather than a one-off slip.
- **obj-4/obj-5**: see PASS/FAIL phrasings below; both are judge-reads
  checks on the `## Rule` section's prose.

Reference node check (obj-1/obj-2/obj-3), runnable standalone —
save the submission's `## Bands` lines to `bands.txt` and run
`node check.js bands.txt`:

```js
// check.js
const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8')
  .split('\n').map(s => s.trim()).filter(Boolean);
const KEY = { T1:'Band-1',T2:'Band-2',T3:'Band-3',T4:'Band-4',T5:'Band-1',
  T6:'Band-2',T7:'Band-3',T8:'Band-4',T9:'Band-2',T10:'Band-1',T11:'Band-3',
  T12:'Band-4',T13:'Band-1',T14:'Band-3',T15:'Band-2' };
const CROSSED = ['T2','T3','T6','T7','T9','T11','T14','T15'];
const got = {};
const re = /^T(\d{1,2}):\s*(Band-[1-4])$/;
let order = [];
for (const l of lines) { const m = l.match(re); if (m) { got['T'+m[1]] = m[2]; order.push('T'+m[1]); } }
const expectedOrder = Array.from({length:15}, (_,i)=>'T'+(i+1));
const obj1 = order.length === 15 && expectedOrder.every((t,i)=>order[i]===t);
let correct = 0; for (const t of expectedOrder) if (got[t] === KEY[t]) correct++;
const obj2 = correct >= 14;
const obj3 = CROSSED.every(t => got[t] === KEY[t]);
console.log({ parsed: order.length, correct, obj1, obj2, obj3 });
```

### Prose-located check: "does the stated rule reference both features?"

**PASSING** (references both service-index parity and trailing-letter
group):
1. "The band depends on whether the middle number is even or odd, and
   whether the trailing letter is A/B versus C/D: even+AB is Band-1,
   odd+AB is Band-2, even+CD is Band-3, odd+CD is Band-4."
2. "I found two things determine the band together — the parity
   (even/odd) of the three-digit service index, and which group the
   final letter falls into (A or B vs. C or D)."
3. "The rule is a 2x2: parity of the service-index field crossed with
   the letter group of the trailing character."

**FAILING** (single feature or wrong feature):
1. "The band is decided by the last letter: A and B give the lower
   bands, C and D give the higher bands." (Only one feature stated;
   ignores parity entirely.)
2. "The band follows the venue field — DINER and ARCADE tags tend to
   land in higher bands." (Wrong feature; venue is explicitly
   flavor-only per the task.)
3. "The band depends on the number — smaller service indices are Band-1
   and Band-2, larger ones are Band-3 and Band-4." (Only one feature,
   and not even the correct one — it's parity, not magnitude.)

### Prose-located check: "is the stated rule self-consistent with the model's own applied labels?"

**PASSING** (rule reproduces the model's own labels on a spot check):
1. Stated rule: "even+AB=Band-1, odd+AB=Band-2, even+CD=Band-3,
   odd+CD=Band-4." Applying this to the model's own T1 answer
   (AJ-38-ARCADE-B, even+B) gives Band-1 — matches the model's stated
   `T1: Band-1`.
2. The model's rule and its T4 answer (DR-79-PIER-D, odd+D) both agree
   on Band-4 when the stated rule is applied by the judge.
3. A model that states the rule with a worked example matching one of
   its own 15 answers exactly, with no contradiction found on
   spot-checking 3 different labels.

**FAILING** (rule contradicts the model's own labels, or is too vague
to apply):
1. Stated rule: "the last letter mostly determines it, with some
   exceptions" — too vague to mechanically apply to any tag, so it
   cannot be checked against the model's own T-labels at all.
2. Stated rule says "even service index + A/B = Band-1", but the model's
   own `T5: Band-2` answer is for EK-28-DINER-A, which is even+A — the
   model's own rule would produce Band-1, contradicting its own answer.
3. The rule statement and the applied labels appear to have been
   produced independently (e.g., the rule is a correct 2x2 but at least
   one spot-checked label contradicts it), indicating the model applied
   a different, unstated heuristic when actually labeling.

### Subjective guidance

- **Rule-induction correctness**: beyond the pass/fail gates, does the
  submission's rule match the true 2x2 structure exactly (not an
  approximation that happens to get most training examples right)?
- **Rule statement clarity**: could another person apply the stated rule
  to a brand-new tag without needing to see the training table again?
- **Reasoning quality**: does `REASONING.md` describe how the model
  ruled out single-feature hypotheses (e.g., noticing the confuser pairs
  where the same letter appears in two different bands) rather than
  asserting the final rule without showing the induction process?
