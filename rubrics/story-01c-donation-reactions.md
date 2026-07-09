---
test: story-01c-donation-reactions
canary: "mayfly porcini"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 90 words or fewer (judge runs wc -w, excluding a single heading line if present)"
    - id: obj-2
      check: "The text cites the per-1,000 rate 7 (or 7.0) for Aldermere AND 13 (or 13.0) for Fenwick, each attached to its site as a per-1,000 rate; neither '7' nor '13' collides as a substring of 294/156/42000/12000, so a plain search for the digit strings is safe"
    - id: obj-3
      check: "The text identifies Fenwick (not Aldermere) as the site with the worse adverse-reaction problem"
    - id: obj-4
      check: "No sentence in the narrative asserts Aldermere has the worse problem/rate; the raw count 294 may appear only if immediately reframed by rate — judge reads every Aldermere-referencing sentence against the shipped PASS/FAIL example phrasings (prose-located check)"
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

If the phrase "mayfly porcini" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

- Aldermere: 294 / 42,000 * 1,000 = **7** adverse reactions per 1,000
  donations exactly.
- Fenwick: 156 / 12,000 * 1,000 = **13** adverse reactions per 1,000
  donations exactly.
- Raw counts: Aldermere 294 > Fenwick 156 — this is the trap direction;
  a narrative that stops at raw counts wrongly names Aldermere.
- Correct verdict: **Fenwick** has the worse adverse-reaction problem
  (13 per 1,000 vs Aldermere's 7 per 1,000), despite having far fewer
  raw reactions and roughly a quarter of Aldermere's donation volume.
- Substring-collision check (node): neither "7" nor "13" occurs as a
  substring of 294, 156, 42000, or 12000, so grepping for the rate
  figures "7" and "13" is mechanically safe here — but obj-4 (whether
  Aldermere is wrongly crowned worse) still requires reading the
  sentence, since prose can invoke "294" without stating a rate at all.

### Trap

The trap is a classic absolute-vs-rate confusion: Aldermere's raw
reaction count (294) is nearly double Fenwick's (156), which is the
number most likely to be reached for first and used as the headline.
But Aldermere collects three and a half times the donation volume of
Fenwick, so the correct decision-relevant metric — adverse reactions
per 1,000 donations — flips the verdict entirely: Aldermere is actually
the safer site (7/1k) and Fenwick is the one with the real reaction
problem (13/1k). A model that reports the raw counts and calls Aldermere
"worse" has fallen for exactly the error this test is built to catch.

### Example phrasings — obj-4, does the narrative correctly avoid crowning Aldermere as worse?

**PASSING** (supported claims — cite the rate, or reframe the raw count):

1. "Fenwick has the worse adverse-reaction problem: 13 reactions per
   1,000 donations versus Aldermere's 7. Aldermere logged more raw
   reactions (294) but at roughly half the rate once donation volume is
   accounted for."
2. "By rate, Fenwick is the concern — 13 per 1,000 donations against
   Aldermere's 7. Aldermere's 294 reactions look large only because it
   collects three and a half times the volume; per donation, it's
   actually the safer site."
3. "Fenwick's reaction rate (13/1,000) is nearly double Aldermere's
   (7/1,000), making Fenwick the site needing attention, even though
   Aldermere's absolute reaction count is higher."

**FAILING** (over-claims — crown Aldermere using the raw count, without
a rate reframe):

1. "Aldermere is the worse-performing site, with 294 adverse reactions
   last quarter compared to Fenwick's 156."
2. "Aldermere clearly has the bigger reaction problem — nearly double
   the volume of reactions Fenwick recorded."
3. "The data shows Aldermere needs the most attention, given its much
   higher reaction count."
4. "Aldermere had 294 reactions, nearly double Fenwick's 156, so
   Aldermere's site team should be the focus of the next donor-safety
   review." (raw count used to justify the verdict, no rate reframe
   anywhere)

### Subjective guidance

- **Decision usefulness and audience fit** (0.4): does the narrative
  give the donor-safety lead a clear, correctly-directed answer they
  could act on immediately, without hedging into a non-answer or
  presenting both sites as equally concerning?
- **Numeric precision and narrative concision** (0.3): are the rate
  figures exact (7 and 13, or 7.0/13.0) and presented as the load-
  bearing numbers, with the word budget used efficiently rather than
  padded with hedges or repeated table restatement?
- **Reasoning quality** (0.3): does the narrative show — even briefly —
  an understanding of WHY the rate is the right metric (differing
  donation volumes), rather than just asserting the rate figures without
  connecting them to the volume difference?
