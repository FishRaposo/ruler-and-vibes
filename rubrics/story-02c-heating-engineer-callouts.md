---
test: story-02c-heating-engineer-callouts
canary: "muslin virga"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "narrative.md exists and its body is 120 words or fewer (judge runs wc -w on the body, excluding a single heading line if present)"
    - id: obj-2
      check: "The text states Ottway has the higher first-visit rate in BOTH job classes (Routine service AND Breakdown repair) — judge confirms Ottway is named as the per-class winner for each job type, not merely that the four percentages appear somewhere"
    - id: obj-3
      check: "The text states the pooled/overall rate favors Thorne (Thorne ~79.3% vs Ottway ~29.7%, or equivalent) AND attributes this reversal to job-mix/composition rather than Thorne being better per job — judge reads the attribution semantically (the mix caveat must be present), not by a bare number search"
    - id: obj-4
      check: "No unqualified claim that Thorne is the more reliable engineer appears in the narrative; any 'Thorne leads overall' statement must be paired with the mix caveat — judge reads against the shipped PASS/FAIL phrasings (prose-located check)"
  subjective:
    - id: sub-quality
      name: "Insight correctness and paradox framing"
      weight: 0.4
    - id: sub-craft
      name: "Clear prose explanation without a worksheet"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Insight correctness and paradox framing
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Clear prose explanation without a worksheet
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `story-02-simpsons-reversal` (same construct, fresh
surface).

If the phrase "muslin virga" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest of the checks
score.

### Answer key (verified with node during authoring)

- Routine service: Thorne 232/240 = **96.67%**, Ottway 59/60 =
  **98.33%** — Ottway higher.
- Breakdown repair: Thorne 6/60 = **10.00%**, Ottway 30/240 =
  **12.50%** — Ottway higher.
- Pooled: Thorne 238/300 = **79.33%**, Ottway 89/300 = **29.67%** —
  Thorne higher.
- This is a genuine Simpson's-paradox reversal: Ottway wins every
  individual job class, yet Thorne wins the pooled comparison because
  Thorne's job mix is heavily skewed toward the easy class (240 of
  Thorne's 300 jobs are Routine service, vs only 60 of Ottway's 300).
- Correct verdict: Ottway is the more reliable engineer on a
  like-for-like basis; Thorne's pooled lead is a mix artifact, not
  superior performance.
- Substring note: the pooled figures (79.33, 29.67) and the per-class
  figures share recurring digits (e.g. "12.50" digits recur elsewhere,
  and "10.00" resembles other counts), so obj-2 and obj-3 must be judged
  semantically (who is named as winning each class, and whether the mix
  caveat is present) rather than by bare digit search.

### Trap

The trap is a static Simpson's-paradox reversal. A narrative that only
reports the pooled totals (Thorne 79.33% vs Ottway 29.67%) and calls
Thorne the more reliable engineer is technically citing real numbers but
drawing the wrong conclusion — it hides that Ottway outperforms Thorne on
both job classes individually. The correct narrative must surface the
per-class reversal and explain that Thorne's pooled advantage comes from
handling a much easier mix of jobs, not from being better at fixing them
on the first visit.

### Example phrasings — obj-4, does the narrative avoid crowning Thorne unconditionally?

**PASSING** (states the per-class win for Ottway, attributes Thorne's
pooled lead to mix):

1. "Ottway is the more reliable engineer — she beats Thorne on routine
   services (98.33% vs 96.67%) and breakdown repairs (12.50% vs 10.00%).
   Thorne's stronger overall number (79.33% vs 29.67%) is a mix effect:
   Thorne handles mostly routine jobs, which inflates his blended
   average."
2. "On a like-for-like basis Ottway wins every job class. Thorne only
   leads in the pooled total because he's assigned far more of the easy
   routine work — the aggregate number overstates Thorne's actual
   performance."
3. "Thorne's overall rate (79.33%) looks stronger than Ottway's
   (29.67%), but that's purely because Thorne gets an easier job mix; per
   job class, Ottway fixes more reliably in both categories."

**FAILING** (crowns Thorne using only the pooled rate, no mix caveat):

1. "Thorne is the stronger engineer, fixing 79.33% of jobs on the first
   visit versus Ottway's 29.67%."
2. "Ottway underperforms across the board — her overall first-visit rate
   is less than half of Thorne's."
3. "Based on total first-visit rate, Thorne is clearly the more reliable
   engineer and should be given more breakdown repairs."

### Subjective guidance

- **Insight correctness and paradox framing** (0.4): does the narrative
  correctly identify Ottway as the per-class winner in both categories
  AND correctly explain that Thorne's pooled lead is a job-mix artifact,
  without treating the paradox as a contradiction to hedge away?
- **Clear prose explanation without a worksheet** (0.3): is the
  explanation delivered as connected prose that a reader unfamiliar with
  Simpson's paradox could follow, rather than a recomputation table or a
  fragmented list of the four percentages?
- **Reasoning quality** (0.3): does the narrative demonstrate genuine
  understanding of WHY the reversal happens (differing job-mix
  proportions per engineer), rather than merely reporting both the
  per-class and pooled numbers without connecting them causally?
