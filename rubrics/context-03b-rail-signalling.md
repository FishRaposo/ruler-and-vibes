---
test: context-03b-rail-signalling
canary: "machicolation guenon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All 5 seeded contradictions are present as table rows, matched by their pair of line numbers (see answer key below)"
    - id: obj-2
      check: "None of the 4 seeded decoys (listed below with their in-text reconciliations) appears as a claimed contradiction"
    - id: obj-3
      check: "Every claimed contradiction's two quotes appear verbatim in the transcript (judge greps each quote against the test file)"
    - id: obj-4
      check: "Every cited line number actually contains its quoted text (judge checks the quote against that numbered line)"
    - id: obj-5
      check: "CONTRADICTIONS.md contains exactly 5 contradiction rows — all seeded, none extra (judge counts rows)"
  subjective:
    - id: sub-quality
      name: "Contradiction analysis quality"
      weight: 0.4
    - id: sub-craft
      name: "Quotation and citation discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Contradiction analysis quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Quotation and citation discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `context-03-contradictions` (same construct, fresh
surface).

If the phrase "machicolation guenon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test's main soundness risk is an accidental sixth contradiction, so
the answer key below reflects a full claims-inventory pairwise audit
performed before this rubric was finalized: every number, date, name, and
status claim in the transcript was catalogued and checked pairwise, and
the only irreconcilable pairs are the 5 listed below. 12 additional
background claims in the transcript (team size, training budget,
contingency reserve, soak-scenario count, signal-head retrofit count,
dry-run telemetry-point count, legacy interlocking count, communication
date, equipment-order runway, freeze-to-commissioning gap, telemetry rate
limit, on-site engineer count, etc.) each appear exactly once with no
counterpart claim anywhere else, and cannot be contradictions.

### Answer key: the 5 genuine contradictions

1. **Energization date** — Line 3 (Halligan): "energization is confirmed
   for October 9" vs. Line 5 (Provan): "the line won't energize until the
   week of October 20." No reconciling language anywhere.
2. **Signalling budget** — Line 15 (Rennick): "The signalling budget is
   210k, fully approved by finance last quarter" vs. Line 16 (Sundqvist):
   "The signalling budget is 248k, per finance's own numbers." No
   correction language anywhere — both stand unresolved through the end
   of the transcript (Line 17 only says Rennick will double-check).
3. **Level-crossing count** — Line 10 (Sundqvist): "all 6 level crossings
   on the line" vs. Line 11 (Escamilla): "covers all 8 level crossings on
   the line, not 6." No reconciling text.
4. **Soak-test completion status (self-contradiction)** — Line 21
   (Vasey): "The full block-signal soak test finished Monday with no
   blocking failures" vs. Line 32 (Vasey): "The full block-signal soak
   test is still running and won't finish until Thursday." Same speaker,
   same named suite; Line 33 explicitly confirms Vasey has NOT resolved
   which cycle the Monday result belonged to, so no reconciliation occurs
   anywhere in the transcript.
5. **Traction-power vendor** — Line 36 (Escamilla): "We've selected
   Corvenna Traction as our traction-power vendor" vs. Line 37 (Provan):
   "the traction-power equipment is coming from Bracknall Dynamics, that's
   the vendor we picked." Two different companies named as the single
   chosen vendor; no reconciling text.

### Answer key: the 4 decoys (must NOT appear as contradictions)

1. **FTE phrasing** — Line 9 (Halligan): "Priti is at 0.4 FTE" and Line
   9a (Vasey): "Priti is giving two days a week" are the same fact in two
   phrasings (0.4 FTE = two of five working days) — reconciled.
2. **Software assurance fee correction** — Line 52 (Rennick): "64k" and
   Line 54 (Rennick): "The updated number for the software assurance fee
   is 71k... I had an old vendor quote" — explicit self-correction with
   correction language — reconciled.
3. **Snag rate on different bases** — Line 25 (Provan): "up 9% ... against
   the full route mileage in scope" and Line 26 (Vasey): "up 33%, but
   that's measured against last month's much smaller tested section" —
   Line 27 explicitly states these are two different denominators, both
   true — reconciled.
4. **Design freeze vs. commissioning date** — Line 47 (Halligan): "Design
   freeze is locked for September 26" and Line 48 (Sundqvist): "the
   commissioning date is October 15" — Line 49 explicitly states these
   are two different milestones, not a restatement of one date —
   reconciled.

### Objective check notes

- **obj-1/obj-5**: match rows by line-number pairs, not by paraphrased
  wording — a submission may summarize the explanation differently but
  must cite the correct line pair for each contradiction. Exactly 5 rows
  total; more than 5 or fewer than 5 both fail obj-5.
- **obj-2**: check each of the 4 decoys individually — if a submission's
  table includes a row citing the line pair for the FTE, assurance-fee,
  snag-rate, or freeze/commissioning items, that is a false positive and
  fails obj-2 regardless of how many genuine contradictions are also
  correctly found.
- **obj-3/obj-4**: grep each quoted string in the submission against the
  test file; every seeded quote sits on a single numbered line by design,
  so verbatim matching should be unambiguous. A quote that is paraphrased
  rather than verbatim, or attributed to the wrong line number, fails.

### Prose-located check: "is this row a genuine contradiction or a decoy?"

This determination is binary but requires reading in context. Example
phrasings a judge will encounter, and how to score them:

**PASSING** (correctly flags a genuine contradiction):
1. "Line 15 (Rennick) states the signalling budget is 210k, but Line 16
   (Sundqvist) states it is 248k, and no correction or reconciling
   language appears anywhere afterward — a genuine, unresolved
   contradiction."
2. "Vasey states on Line 21 that the soak test finished Monday, then on
   Line 32 says the same suite is still running until Thursday. Line 33
   confirms she has not sorted out which cycle the Monday result belongs
   to, so this remains unresolved."
3. "Two different vendors (Corvenna Traction, Line 36; Bracknall
   Dynamics, Line 37) are each named as the single chosen traction-power
   vendor, with no reconciling statement in the transcript."
4. "Sundqvist says all 6 level crossings are in scope (Line 10) while
   Escamilla says the contract covers all 8, not 6 (Line 11); the count is
   left to be checked with no reconciliation, so this is genuine."

**FAILING** (incorrectly flags a decoy as a contradiction):
1. "Halligan says Priti is at 0.4 FTE (Line 9) but Vasey says two days a
   week (Line 9a) — these numbers don't match." (They do match: 0.4 FTE =
   two of five working days; this is the reconciled decoy, not a
   contradiction.)
2. "Provan reports the snag rate up 9% while Vasey reports it up 33% — a
   clear contradiction in the commissioning numbers." (Line 27 explicitly
   states these are measured against two different denominators; flagging
   this is a false positive.)
3. "Design freeze is September 26 but the commissioning date is October
   15 — the schedule doesn't add up." (These are two different, explicitly
   named milestones per Line 49, not the same date restated
   inconsistently.)
4. "Rennick quotes the software assurance fee at 64k (Line 52) but then
   71k (Line 54) — the finance numbers contradict each other." (Line 54 is
   an explicit self-correction with correction language — "I had an old
   vendor quote" — so this is reconciled, not a contradiction.)

### Subjective guidance

- **Contradiction analysis quality**: does the submission correctly
  separate genuine contradictions from superficially-similar decoys?
  Reward explanations that name *why* a decoy reconciles (not just that it
  does) when the submission correctly excludes it in commentary outside
  the required table.
- **Quotation and citation discipline**: are quotes exact and lines
  correctly cited, with explanations that reference the specific language
  that makes reconciliation impossible (e.g., "no correction language
  anywhere" for the budget contradiction)?
- **Reasoning quality**: does `REASONING.md` describe a systematic pass
  over the transcript (e.g., building a claims inventory) rather than an
  ad hoc skim? Does it acknowledge the risk of false positives on the four
  decoy pairs specifically?
