---
test: story-01b-warranty-plants
canary: "wisteria toboggan"
reviewed: "pass 2026-07-04 (independent gate: key re-derived, contract verified, checks discriminate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 90 words or fewer (judge runs wc -w, excluding a single heading line if present)"
    - id: obj-2
      check: "The text cites the per-1,000 rate 6 (or 6.0) for Brantwick AND 14 (or 14.0) for Solmere, each attached to its plant as a per-1,000 rate; neither '6' nor '14' collides as a substring of 210/98/35000/7000, so a plain search for the digit strings is safe"
    - id: obj-3
      check: "The text identifies Solmere (not Brantwick) as the plant with the worse warranty problem"
    - id: obj-4
      check: "No sentence in the narrative asserts Brantwick has the worse problem/rate; the raw count 210 may appear only if immediately reframed by rate — judge reads every Brantwick-referencing sentence against the shipped PASS/FAIL example phrasings (prose-located check)"
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
anchors:
  - id: Decision usefulness and audience fit
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Numeric precision and narrative concision
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `story-01-absolute-vs-rate` (same construct, fresh
surface).

If the phrase "wisteria toboggan" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified with node during authoring)

- Brantwick: 210 / 35,000 * 1,000 = **6** warranty claims per 1,000
  units shipped exactly.
- Solmere: 98 / 7,000 * 1,000 = **14** warranty claims per 1,000
  units shipped exactly.
- Raw counts: Brantwick 210 > Solmere 98 — this is the trap
  direction; a narrative that stops at raw counts wrongly names
  Brantwick.
- Correct verdict: **Solmere** has the worse warranty problem (14 per
  1,000 vs Brantwick's 6 per 1,000), despite having far fewer raw
  claims and a fifth of Brantwick's shipping volume.
- Substring-collision check (node): neither "6" nor "14" occurs as a
  substring of 210, 98, 35000, or 7000, so grepping for the rate
  figures "6" and "14" is mechanically safe here — but obj-4 (whether
  Brantwick is wrongly crowned worse) still requires reading the
  sentence, since prose can invoke "210" without stating a rate at
  all.

### Trap

The trap is a classic absolute-vs-rate confusion: Brantwick's raw
claim count (210) is more than double Solmere's (98), which is the
number most likely to be reached for first and used as the headline.
But Brantwick ships five times the unit volume of Solmere, so the
correct decision-relevant metric — claims per 1,000 units shipped —
flips the verdict entirely: Brantwick is actually the cleaner plant
(6/1k) and Solmere is the one with the real warranty problem (14/1k).
A model that reports the raw counts and calls Brantwick "worse" has
fallen for exactly the error this test is built to catch.

### Example phrasings — obj-4, does the narrative correctly avoid crowning Brantwick as worse?

**PASSING** (supported claims — cite the rate, or reframe the raw count):

1. "Solmere has the worse warranty problem: 14 claims per 1,000 units
   shipped versus Brantwick's 6. Brantwick logged more raw claims
   (210) but at less than half Solmere's rate once shipping volume is
   accounted for."
2. "By rate, Solmere is the concern — 14 per 1,000 units against
   Brantwick's 6. Brantwick's 210 claims look large only because it
   ships five times the volume; per unit, it's actually the cleaner
   plant."
3. "Solmere's claim rate (14/1,000) is more than double Brantwick's
   (6/1,000), making Solmere the plant needing attention, even though
   Brantwick's absolute claim count is higher."

**FAILING** (over-claims — crown Brantwick using the raw count,
without a rate reframe):

1. "Brantwick is the worse-performing plant, with 210 warranty claims
   last quarter compared to Solmere's 98."
2. "Brantwick clearly has the bigger warranty problem — more than
   double the number of claims Solmere received."
3. "Brantwick had 210 claims, over twice Solmere's 98, so Brantwick's
   line should be the focus of the next quality review." (raw count
   used to justify the verdict, no rate reframe anywhere)

### Subjective guidance

- **Decision usefulness and audience fit** (0.4): does the narrative
  give the quality manager a clear, correctly-directed answer they
  could act on immediately, without hedging into a non-answer or
  presenting both plants as equally concerning?
- **Numeric precision and narrative concision** (0.3): are the rate
  figures exact (6 and 14, or 6.0/14.0) and presented as the load-
  bearing numbers, with the word budget used efficiently rather than
  padded with hedges or repeated table restatement?
- **Reasoning quality** (0.3): does the narrative show — even briefly
  — an understanding of WHY the rate is the right metric (differing
  shipping volumes), rather than just asserting the rate figures
  without connecting them to the volume difference?
