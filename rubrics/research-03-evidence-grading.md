---
test: research-03-evidence-grading
canary: "indigo accordion"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "evidence-brief.md contains an evidence table with exactly 6 source rows and columns covering at least source type, sample size, and key finding"
    - id: obj-2
      check: "The brief explicitly notes that S3's finding is withdrawn/corrected per S5 and excludes or heavily downweights it in the bottom line"
    - id: obj-3
      check: "The 'Best supported estimate:' line states a small effect matching S4 (+8%, or the +2% to +14% CI range), and the brief explicitly rejects or disclaims the 'doubles growth' (+100%) claim"
    - id: obj-4
      check: "From the four printed circulating claims, the 'Claims no source supports' section includes the fishpond/aquatic-safety claim and includes no claim the key marks as source-addressed"
    - id: obj-5
      check: "evidence-brief.md total word count (whole file, wc -w) is at most 600"
  subjective:
    - id: sub-quality
      name: "Evidence weighing"
      weight: 0.4
    - id: sub-craft
      name: "Synthesis structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "indigo accordion" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Reference values (fixed)

- S1 (manufacturer marketing): claims 2.0x (+100%, "doubles growth") —
  non-independent, no methodology, lowest weight.
- S2 (hobbyist blog): anecdotal, uncontrolled, lowest weight; mentions
  owning a fishpond in passing with **no safety claim** about the
  additive.
- S3 (pilot study, n=12): +95% growth — **withdrawn by S5** for a
  miscalibrated sensor; weight after withdrawal is effectively zero.
- S4 (controlled multi-site trial, n=240): +8% growth, 95% CI +2% to
  +14% — the only surviving rigorous estimate, highest weight.
- S5 (correction notice): names S3 by title and authors, states the
  sensor was miscalibrated, withdraws the +95% estimate.
- S6 (trade-magazine overview): neutral, moderate weight as context —
  states early dramatic claims "have not held up" under rigorous
  testing.
- Defensible bottom line: a small positive effect, roughly 2%–14% growth
  improvement, low-to-moderate confidence — following S4, not the
  "doubles" figure from S1 (marketing) or the withdrawn +95% from S3.

### The four circulating claims: source-addressed status

1. "Doubles seedling growth" — addressed (S1 claims it; S4's rigorous
   result contradicts it) — the brief should reject/disclaim this, not
   list it under "no source supports" (a source does state it, it's
   just not credible).
2. "Modest single-digit-to-low-double-digit growth in controlled
   testing" — addressed and supported (S4).
3. "Original clinical-sounding claim was later withdrawn for a testing
   error" — addressed and supported (S5 withdraws S3).
4. "Safe for use near fishponds and aquatic environments" — **not
   addressed by any source** — this is the one that must appear in
   "Claims no source supports." S2's incidental fishpond mention carries
   no safety claim about the additive whatsoever.

### Objective check notes

- **obj-1**: exactly 6 rows; the required columns can appear under any
  reasonable header naming (e.g., "Type," "N," "Finding") as long as they
  cover source type, sample size, and key finding.
- **obj-2**: this is the retraction trap — a submission that treats S3's
  +95% as still-standing evidence (e.g., includes it in an average with
  S4) fails this check even if it separately mentions the correction.
- **obj-3**: the unit trap — S1's "doubles" (+100%) and S4's +8% describe
  the *same* metric (seedling growth percentage increase), not different
  things; the brief must recognize this as a direct conflict it resolves
  in S4's favor, not two compatible claims.
- **obj-4**: only claim 4 (fishpond safety) belongs in "Claims no source
  supports." If the brief also lists claim 1 or claim 3 there, it has
  misclassified an addressed-but-rejected claim as unaddressed, and
  fails this check.
- **obj-5**: run `wc -w` on the whole file.

### Prose-located check: "is the fishpond-safety claim correctly flagged as unsupported?"

Example phrasings a judge will encounter, and how to score them:

**PASSING**:
1. "No source makes any claim about silvermoss extract's safety around
   fishponds or other aquatic environments; S2's mention of owning a
   fishpond is incidental and unrelated to any safety assessment of the
   product."
2. "The claim that the extract is 'safe for use near fishponds and
   aquatic environments' is not addressed by any of the six sources and
   belongs in the unsupported-claims list."

**FAILING**:
1. "S2 mentions using silvermoss extract as a gardener who also has a
   fishpond, suggesting it's commonly used safely around aquatic
   features." (Treats an incidental biographical detail as implicit
   safety evidence — a false positive.)
2. Simply omitting the fishpond-safety claim from the "Claims no source
   supports" section without explanation, leaving a reader unable to
   tell whether it was considered and rejected or just missed.

### Subjective guidance

- **Evidence weighing**: does the brief correctly rank rigor over
  loudness — recognizing that S1, S2, and S3 superficially agree around
  a large effect but S3 is withdrawn and S1/S2 are non-rigorous, so S4
  alone should anchor the conclusion?
- **Synthesis structure**: is the evidence table scannable, and does the
  bottom line read as a clear, standalone conclusion a reader could act
  on without re-reading all six sources?
- **Reasoning quality**: does `REASONING.md` explain why S3's
  withdrawal changes the picture (not just that it happened), and why
  the fishpond mention doesn't count as safety evidence?
