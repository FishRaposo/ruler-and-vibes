---
test: story-01-absolute-vs-rate
canary: "carafe pitcher"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 90 words or fewer (judge runs wc -w, excluding a single heading line if present)"
    - id: obj-2
      check: "The text cites the per-1,000 rate 8 (or 8.0) for North AND 15 (or 15.0) for South, each attached to its region as a per-1,000 rate; neither '8' nor '15' collides as a substring of 192/90/24000/6000, so a plain search for the digit strings is safe"
    - id: obj-3
      check: "The text identifies South (not North) as the region with the worse complaint problem"
    - id: obj-4
      check: "No sentence in the narrative asserts North has the worse problem/rate; the raw count 192 may appear only if immediately reframed by rate — judge reads every North-referencing sentence against the shipped PASS/FAIL example phrasings (prose-located check)"
  subjective:
    - id: sub-quality
      name: "Decision usefulness and audience fit"
      weight: 0.4
    - id: sub-craft
      name: "Numeric precision and narrative concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "carafe pitcher" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- North: 192 / 24,000 * 1,000 = **8** complaints per 1,000 orders
  exactly.
- South: 90 / 6,000 * 1,000 = **15** complaints per 1,000 orders
  exactly.
- Raw counts: North 192 > South 90 — this is the trap direction; a
  narrative that stops at raw counts wrongly names North.
- Correct verdict: **South** has the worse complaint problem (15 per
  1,000 vs North's 8 per 1,000), despite having far fewer raw
  complaints and a fifth of North's order volume.
- Substring-collision check (node): neither "8" nor "15" occurs as a
  substring of 192, 90, 24000, or 6000, so grepping for the rate
  figures "8" and "15" is mechanically safe here — but obj-4 (whether
  North is wrongly crowned worse) still requires reading the sentence,
  since prose can invoke "192" without stating a rate at all.

### Trap

The trap is a classic absolute-vs-rate confusion: North's raw
complaint count (192) is more than double South's (90), which is the
number most likely to be reached for first and used as the headline.
But North ships four times the order volume of South, so the correct
decision-relevant metric — complaints per 1,000 orders — flips the
verdict entirely: North is actually the cleaner operation (8/1k) and
South is the one with the real complaint problem (15/1k). A model that
reports the raw counts and calls North "worse" has fallen for exactly
the error this test is built to catch.

### Example phrasings — obj-4, does the narrative correctly avoid crowning North as worse?

**PASSING** (supported claims — cite the rate, or reframe the raw count):

1. "South has the worse complaint problem: 15 complaints per 1,000
   orders versus North's 8. North logged more raw complaints (192) but
   at a quarter of South's rate once order volume is accounted for."
2. "By rate, South is the concern — 15 per 1,000 orders against
   North's 8. North's 192 complaints look large only because it ships
   four times the volume; per order, it's actually the safer region."
3. "South's complaint rate (15/1,000) is nearly double North's
   (8/1,000), making South the region needing attention, even though
   North's absolute complaint count is higher."

**FAILING** (over-claims — crown North using the raw count, without a
rate reframe):

1. "North is the worse-performing region, with 192 complaints last
   month compared to South's 90."
2. "North clearly has the bigger complaint problem — nearly double the
   volume of complaints South received."
3. "The data shows North needs the most attention, given its much
   higher complaint count."
4. "North had 192 complaints, more than double South's 90, so North's
   operations team should be the focus of the next review." (raw count
   used to justify the verdict, no rate reframe anywhere)

### Subjective guidance

- **Decision usefulness and audience fit** (0.4): does the narrative
  give the operations lead a clear, correctly-directed answer they
  could act on immediately, without hedging into a non-answer or
  presenting both regions as equally concerning?
- **Numeric precision and narrative concision** (0.3): are the rate
  figures exact (8 and 15, or 8.0/15.0) and presented as the load-
  bearing numbers, with the word budget used efficiently rather than
  padded with hedges or repeated table restatement?
- **Reasoning quality** (0.3): does the narrative show — even briefly
  — an understanding of WHY the rate is the right metric (differing
  order volumes), rather than just asserting the rate figures without
  connecting them to the volume difference?
