---
test: context-03c-clinical-program-contradictions
canary: "crenel mandrill"
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
---

## Judge guidance

Parallel form of `context-03-contradictions` (same construct, fresh surface).

If the phrase "crenel mandrill" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

This test's main soundness risk is an accidental sixth contradiction, so
the answer key below reflects a full claims-inventory pairwise audit
performed before this rubric was finalized: every number, date, name, and
status claim in the transcript was catalogued and checked pairwise, and
the only irreconcilable pairs are the 5 listed below. 12 additional
background claims in the transcript (team size, patient-education budget,
contingency reserve, assay-parameter count, freezer-retrofit count,
dry-run sample count, legacy-interface count, communication date,
shipping-order runway, lock-to-readout gap, etc.) each appear exactly
once with no counterpart claim anywhere else, and cannot be
contradictions.

### Answer key: the 5 genuine contradictions

1. **First-in-human dosing date** — Line 3 (Ada): "first-in-human dosing
   is confirmed for May 6" vs. Line 5 (Felix): "dosing won't start until
   the week of May 18." No reconciling language anywhere.
2. **Assay-transfer budget** — Line 15 (Miriam): "The assay-transfer
   budget is 220k, fully approved by finance last quarter" vs. Line 16
   (Ines): "The assay-transfer budget is 255k, per finance's own
   numbers." No correction language anywhere — both stand unresolved
   through the end of the transcript.
3. **Clinical-site count** — Line 10 (Ines): "all 6 clinical sites in the
   network" vs. Line 11 (Lena): "covers all 8 clinical sites in the
   network, not 6." No reconciling text.
4. **Immunogenicity-assay validation status (self-contradiction)** — Line
   21 (Dev): "The immunogenicity assay validation completed Tuesday with
   no blocking deficiencies" vs. Line 32 (Dev): "The immunogenicity assay
   validation is still running and won't finish until Friday." Same
   speaker, same named assay; Line 33 explicitly confirms Dev has NOT
   resolved which cycle the Tuesday result belonged to, so no
   reconciliation occurs anywhere in the transcript.
5. **Cold-chain logistics vendor** — Line 36 (Lena): "We've selected
   Polaris Cryo as our cold-chain logistics vendor" vs. Line 37 (Felix):
   "the cold-chain shipments are going through Thornmere Logistics,
   that's the vendor we picked." Two different companies named as the
   single chosen vendor; no reconciling text.

### Answer key: the 4 decoys (must NOT appear as contradictions)

1. **FTE phrasing** — Line 9 (Ada): "Dev is at 0.6 FTE" and Line 9a
   (Ines): "Dev's putting in three days a week" are the same fact in two
   phrasings (0.6 FTE = three of five working days) — reconciled.
2. **Comparator-drug cost correction** — Line 52 (Miriam): "63k" and Line
   54 (Miriam): "The updated number for comparator-drug procurement is
   69k, I had an old vendor quote" — explicit self-correction with
   correction language — reconciled.
3. **Deviation rate on different bases** — Line 25 (Felix): "up 9% ...
   against the full current run-set" and Line 26 (Dev): "up 35%, but
   that's measured against last month's much smaller run-set" — Line 27
   explicitly states these are two different denominators, both true —
   reconciled.
4. **Database lock vs. topline readout** — Line 47 (Ada): "Database lock
   is locked for June 2" and Line 48 (Ines): "the topline readout is June
   16" — Line 49 explicitly states these are two different milestones,
   not a restatement of one date — reconciled.

### Objective check notes

- **obj-1/obj-5**: match rows by line-number pairs, not by paraphrased
  wording — a submission may summarize the explanation differently but
  must cite the correct line pair for each contradiction. Exactly 5 rows
  total; more than 5 or fewer than 5 both fail obj-5.
- **obj-2**: check each of the 4 decoys individually — if a submission's
  table includes a row citing the line pair for the FTE, comparator-drug,
  deviation-rate, or lock/readout items, that is a false positive and
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
1. "Line 15 (Miriam) states the assay-transfer budget is 220k, but Line
   16 (Ines) states it is 255k, and no correction or reconciling language
   appears anywhere afterward — a genuine, unresolved contradiction."
2. "Dev states on Line 21 that the immunogenicity assay validation
   completed Tuesday, then on Line 32 says the same validation is still
   running until Friday. Line 33 confirms he has not sorted out which
   cycle the Tuesday result belongs to, so this remains unresolved."
3. "Two different vendors (Polaris Cryo, Line 36; Thornmere Logistics,
   Line 37) are each named as the single chosen cold-chain logistics
   vendor, with no reconciling statement in the transcript."

**FAILING** (incorrectly flags a decoy as a contradiction):
1. "Ada says Dev is at 0.6 FTE (Line 9) but Ines says three days a week
   (Line 9a) — these numbers don't match." (They do match: 0.6 FTE =
   three of five working days; this is the reconciled decoy, not a
   contradiction.)
2. "Felix reports deviation rate at 9% while Dev reports 35% — a clear
   contradiction in the deviation numbers." (Line 27 explicitly states
   these are measured against two different denominators; flagging this
   is a false positive.)
3. "Database lock is June 2 but the topline readout is June 16 — the
   schedule doesn't add up." (These are two different, explicitly named
   milestones per Line 49, not the same date restated inconsistently.)

### Subjective guidance

- **Contradiction analysis quality**: does the submission correctly
  separate genuine contradictions from superficially-similar decoys?
  Reward explanations that name *why* a decoy reconciles (not just that
  it does) when the submission correctly excludes it in commentary
  outside the required table.
- **Quotation and citation discipline**: are quotes exact and lines
  correctly cited, with explanations that reference the specific language
  that makes reconciliation impossible (e.g., "no correction language
  anywhere" for the budget contradiction)?
- **Reasoning quality**: does `REASONING.md` describe a systematic pass
  over the transcript (e.g., building a claims inventory) rather than an
  ad hoc skim? Does it acknowledge the risk of false positives on the
  four decoy pairs specifically?
