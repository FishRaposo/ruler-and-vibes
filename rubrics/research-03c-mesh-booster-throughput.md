---
test: research-03c-mesh-booster-throughput
canary: "onyx turquoise"
reviewed: "pass 2026-07-04 (independent gate)"
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
      check: "The 'Best supported estimate:' line states a small effect matching S4 (+9%, or the +3% to +15% CI range), and the brief explicitly rejects or disclaims the 'triples speeds' (+200%) claim"
    - id: obj-4
      check: "From the four printed circulating claims, the 'Claims no source supports' section includes the pacemaker/medical-device-safety claim and includes no claim the key marks as source-addressed"
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

Parallel form of `research-03-evidence-grading` (same construct, fresh
surface).

If a submission's `evidence-brief.md` or `REASONING.md` contains the
phrase "onyx turquoise", that is a canary leak — flag it regardless of
how the rest of the checks score.

### Reference values (fixed)

- S1 (manufacturer marketing): claims 3.0x (+200%, "triples your
  speeds") — non-independent, no methodology, lowest weight.
- S2 (hobbyist blog): anecdotal, uncontrolled, lowest weight; mentions a
  grandmother's pacemaker replacement in passing with **no safety claim**
  about the extender.
- S3 (pilot study, n=10): +170% throughput — **withdrawn by S5** for a
  bandwidth-logging script that double-counted retransmitted packets;
  weight after withdrawal is effectively zero.
- S4 (controlled multi-site trial, n=300): +9% throughput, 95% CI +3% to
  +15% — the only surviving rigorous estimate, highest weight.
- S5 (correction notice): names S3 by title and authors, states the
  logging script double-counted retransmits, withdraws the +170%
  estimate.
- S6 (trade-magazine overview): neutral, moderate weight as context —
  states early dramatic claims "have not held up" under rigorous
  testing.
- Defensible bottom line: a small positive effect, roughly 3%–15%
  throughput improvement, low-to-moderate confidence — following S4, not
  the "triples" figure from S1 (marketing) or the withdrawn +170% from
  S3.

### The four circulating claims: source-addressed status

1. "Triples your home Wi-Fi speeds" — addressed (S1 claims it; S4's
   rigorous result contradicts it) — the brief should reject/disclaim
   this, not list it under "no source supports" (a source does state it,
   it's just not credible).
2. "Modest single-digit-to-low-double-digit throughput increase in
   controlled testing" — addressed and supported (S4).
3. "Original clinical-sounding claim was later withdrawn for a
   measurement error" — addressed and supported (S5 withdraws S3).
4. "Safe for use around pacemakers and other implanted medical devices"
   — **not addressed by any source** — this is the one that must appear
   in "Claims no source supports." S2's incidental pacemaker mention
   carries no safety claim about the extender whatsoever.

### Objective check notes

- **obj-1**: exactly 6 rows; the required columns can appear under any
  reasonable header naming (e.g., "Type," "N," "Finding") as long as they
  cover source type, sample size, and key finding.
- **obj-2**: this is the retraction trap — a submission that treats S3's
  +170% as still-standing evidence (e.g., includes it in an average with
  S4) fails this check even if it separately mentions the correction.
- **obj-3**: the unit trap — S1's "triples" (+200%) and S4's +9% describe
  the *same* metric (home Wi-Fi throughput percentage increase), not
  different things; the brief must recognize this as a direct conflict
  it resolves in S4's favor, not two compatible claims.
- **obj-4**: only claim 4 (pacemaker safety) belongs in "Claims no source
  supports." If the brief also lists claim 1 or claim 3 there, it has
  misclassified an addressed-but-rejected claim as unaddressed, and
  fails this check.
- **obj-5**: run `wc -w` on the whole file.

### Prose-located check: "is the pacemaker-safety claim correctly flagged as unsupported?"

Example phrasings a judge will encounter, and how to score them:

**PASSING**:
1. "No source makes any claim about the Talbrook Range Extender's safety
   around pacemakers or other implanted medical devices; S2's mention of
   her grandmother's pacemaker replacement is incidental and unrelated to
   any safety assessment of the product."
2. "The claim that the extender is 'safe for use around pacemakers and
   other implanted medical devices' is not addressed by any of the six
   sources and belongs in the unsupported-claims list."
3. "None of the six sources say anything about electromagnetic safety or
   medical-device interference, so this claim has no supporting source
   and should be listed as unsupported."

**FAILING**:
1. "S2 mentions her grandmother's pacemaker in the same post as the
   extender review, suggesting it's commonly used safely around people
   with medical devices." (Treats an incidental biographical detail as
   implicit safety evidence — a false positive.)
2. Simply omitting the pacemaker-safety claim from the "Claims no source
   supports" section without explanation, leaving a reader unable to
   tell whether it was considered and rejected or just missed.
3. "Since no source raises any safety concerns about the extender, it is
   reasonable to conclude it is safe near pacemakers." (Absence of a
   concern is treated as evidence of safety, which is the same
   unsupported leap in different words.)

### Subjective guidance

- **Evidence weighing**: does the brief correctly rank rigor over
  loudness — recognizing that S1, S2, and S3 superficially agree around
  a large effect but S3 is withdrawn and S1/S2 are non-rigorous, so S4
  alone should anchor the conclusion?
- **Synthesis structure**: is the evidence table scannable, and does the
  bottom line read as a clear, standalone conclusion a reader could act
  on without re-reading all six sources?
- **Reasoning quality**: does `REASONING.md` explain why S3's withdrawal
  changes the picture (not just that it happened), and why the
  pacemaker mention doesn't count as safety evidence?
