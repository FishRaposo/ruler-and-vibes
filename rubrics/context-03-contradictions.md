---
test: context-03-contradictions
canary: "terracotta tuba"
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

If the phrase "terracotta tuba" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test's main soundness risk is an accidental sixth contradiction, so
the answer key below reflects a full claims-inventory pairwise audit
performed before this rubric was finalized: every number, date, name, and
status claim in the transcript was catalogued and checked pairwise, and
the only irreconcilable pairs are the 5 listed below. 12 additional
background claims in the transcript (team size, training budget,
contingency reserve, test-case count, forklift count, dry-run SKU count,
legacy interface count, communication date, hardware-order runway,
freeze-to-release gap, etc.) each appear exactly once with no
counterpart claim anywhere else, and cannot be contradictions.

### Answer key: the 5 genuine contradictions

1. **Pilot launch date** — Line 3 (Priya): "the pilot launch is
   confirmed for March 12" vs. Line 5 (Tomas): "the pilot won't launch
   until the week of March 23." No reconciling language anywhere.
2. **Integration budget** — Line 15 (Callum): "The integration budget is
   140k, fully approved by finance last quarter" vs. Line 16 (Renata):
   "The integration budget is 165k, per finance's own numbers." No
   correction language anywhere — both stand unresolved through the end
   of the transcript.
3. **Warehouse count** — Line 10 (Renata): "all 7 warehouses in the
   network" vs. Line 11 (Sofia): "covers all 9 warehouses in the
   network, not 7." No reconciling text.
4. **Load-test completion status (self-contradiction)** — Line 21
   (Dana): "The full regression load-test suite finished Tuesday with no
   blocking failures" vs. Line 32 (Dana): "The full regression load-test
   suite is still running and won't finish until Friday." Same speaker,
   same named suite; Line 33 explicitly confirms Dana has NOT resolved
   which cycle the Tuesday result belonged to, so no reconciliation
   occurs anywhere in the transcript.
5. **Barcode-scanner vendor** — Line 36 (Sofia): "We've selected Corvid
   Systems as our barcode-scanner vendor" vs. Line 37 (Tomas): "the
   barcode scanners are coming from Haldane Robotics, that's the vendor
   we picked." Two different companies named as the single chosen
   vendor; no reconciling text.

### Answer key: the 4 decoys (must NOT appear as contradictions)

1. **FTE phrasing** — Line 9 (Priya): "Dana is at 0.5 FTE" and Line 9a
   (Renata): "Dana's putting in half of her time" are the same fact in
   two phrasings (0.5 FTE = half time) — reconciled.
2. **Licensing cost correction** — Line 52 (Callum): "82k" and Line 54
   (Callum): "The updated number for licensing is 88k... I had an old
   vendor quote" — explicit self-correction with correction language —
   reconciled.
3. **Defect density on different bases** — Line 25 (Tomas): "12% ...
   against the full current codebase" and Line 26 (Dana): "40%, but
   that's measured against last month's much smaller test surface" —
   Line 27 explicitly states these are two different denominators, both
   true — reconciled.
4. **Code freeze vs. release date** — Line 47 (Priya): "Code freeze is
   locked for March 5" and Line 48 (Renata): "the release date is March
   19" — Line 49 explicitly states these are two different milestones,
   not a restatement of one date — reconciled.

### Objective check notes

- **obj-1/obj-5**: match rows by line-number pairs, not by paraphrased
  wording — a submission may summarize the explanation differently but
  must cite the correct line pair for each contradiction. Exactly 5 rows
  total; more than 5 or fewer than 5 both fail obj-5.
- **obj-2**: check each of the 4 decoys individually — if a submission's
  table includes a row citing the line pair for the FTE, licensing,
  defect-density, or freeze/release items, that is a false positive and
  fails obj-2 regardless of how many genuine contradictions are also
  correctly found.
- **obj-3/obj-4**: grep each quoted string in the submission against the
  test file; every seeded quote sits on a single numbered line by
  design, so verbatim matching should be unambiguous. A quote that is
  paraphrased rather than verbatim, or attributed to the wrong line
  number, fails.

### Prose-located check: "is this row a genuine contradiction or a decoy?"

This determination is binary but requires reading in context. Example
phrasings a judge will encounter, and how to score them:

**PASSING** (correctly flags a genuine contradiction):
1. "Line 15 (Callum) states the integration budget is 140k, but Line 16
   (Renata) states it is 165k, and no correction or reconciling language
   appears anywhere afterward — a genuine, unresolved contradiction."
2. "Dana states on Line 21 that the load-test suite finished Tuesday,
   then on Line 32 says the same suite is still running until Friday.
   Line 33 confirms she has not sorted out which cycle the Tuesday
   result belongs to, so this remains unresolved."
3. "Two different vendors (Corvid Systems, Line 36; Haldane Robotics,
   Line 37) are each named as the single chosen barcode-scanner vendor,
   with no reconciling statement in the transcript."

**FAILING** (incorrectly flags a decoy as a contradiction):
1. "Priya says Dana is at 0.5 FTE (Line 9) but Renata says half of her
   time (Line 9a) — these numbers don't match." (They do match: 0.5 FTE
   = half-time; this is the reconciled decoy, not a contradiction.)
2. "Tomas reports defect density at 12% while Dana reports 40% — a clear
   contradiction in the QA numbers." (Line 27 explicitly states these
   are measured against two different denominators; flagging this is a
   false positive.)
3. "Code freeze is March 5 but the release date is March 19 — the
   schedule doesn't add up." (These are two different, explicitly
   named milestones per Line 49, not the same date restated
   inconsistently.)

### Subjective guidance

- **Contradiction analysis quality**: does the submission correctly
  separate genuine contradictions from superficially-similar decoys?
  Reward explanations that name *why* a decoy reconciles (not just that
  it does) when the submission correctly excludes it in commentary
  outside the required table.
- **Quotation and citation discipline**: are quotes exact and lines
  correctly cited, with explanations that reference the specific
  language that makes reconciliation impossible (e.g., "no correction
  language anywhere" for the budget contradiction)?
- **Reasoning quality**: does `REASONING.md` describe a systematic
  pass over the transcript (e.g., building a claims inventory) rather
  than an ad hoc skim? Does it acknowledge the risk of false positives
  on the four decoy pairs specifically?
