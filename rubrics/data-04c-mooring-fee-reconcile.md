---
test: data-04c-mooring-fee-reconcile
canary: "fettle oread"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "results.json parses with node and expected_total_q2 === 990 (numeric)"
    - id: obj-2
      check: "collected_total_q2 === 952 (numeric; duplicate B018 line counted once, orphan B019 excluded, and the B020/B021 pair either both included or both excluded — verified equivalent)"
    - id: obj-3
      check: "discrepancies[] contains an entry for V05 with amount 30 (missing 2025-06-01 payment) and an entry for V08 with amount 8 (May underpayment)"
    - id: obj-4
      check: "B019 is flagged as orphan/unmatched AND the repeated B018 line is flagged as a duplicate ledger entry, each identifiable anywhere in results.json or RECONCILIATION.md"
    - id: obj-5
      check: "V06 does not appear as an open discrepancy — either absent from discrepancies[] or explicitly marked resolved/offset by refund B021"
    - id: obj-6
      check: "RECONCILIATION.md is at most 600 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Reconciliation rigor"
      weight: 0.4
    - id: sub-craft
      name: "Discrepancy classification & audit trail"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Reconciliation rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Discrepancy classification & audit trail
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `data-04-ledger-reconcile` (same construct, fresh surface).

If the phrase "fettle oread" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute everything yourself with node before scoring. Ground truth
  per vessel (Q2 2025 expected billing): V01 90, V02 60 (Apr 2 + May 2,
  both precede the 2025-05-14 departure), V03 240, V04 160, V05 90, V06
  80 (Apr 9 only; May 9 falls on the 2025-05-09 departure date, so it is
  not charged), V07 30, V08 240 — total 990.
- Ledger ground truth: 17 legitimate charge lines sum to 952 (V05's
  2025-06-01 payment is absent entirely — a missing payment of 30; V08's
  2025-05-20 payment is 72 instead of 80 — an underpayment of 8). Four
  additional lines are seeded traps: B018 duplicates B006 verbatim (same
  vessel, date, and amount — since payment IDs are unique terminal-assigned
  identifiers, this is a bookkeeping duplicate, not a second real charge);
  B019 (30) is billed to V77, which does not exist in vessels.csv, making
  it an orphan/unattributable line; B020 (+80) is a post-departure error
  charge to V06; B021 (-80) is a refund that exactly offsets B020, so
  V06's net impact is zero. Naive summing of all 21 raw lines gives 1062.
  Correct net collected is 952 either way B020/B021 are treated (both
  included, since they net to zero, or both excluded).
- Reconciliation rigor: verify collected_total_q2 by an independent
  script if useful — dedupe by payment_id-equivalent lines, drop lines
  whose vessel_id doesn't exist, sum the rest. 1062 (naive), 952
  (correct), and any number in between usually indicates only a subset of
  the traps was caught. A submission landing on 990 has likely ignored
  the ledger and just restated the expected schedule.
  - PASS examples: "deduped B018 against B006, dropped orphan B019, and
    confirmed B020/B021 net to zero — collected_total_q2 is 952, not the
    naive 1062"; "flagged 1062 as the raw sum and explained why it
    overstates collections before presenting the corrected 952";
    "re-ran the sum independently, matching each line's vessel_id against
    vessels.csv rather than trusting the ledger as given."
  - FAIL examples: "totals don't fully reconcile, more investigation
    needed" with no computed figure; reporting 1062 (naive sum) or 990
    (the expected schedule restated) as the final collected total;
    landing on a number between 952 and 1062 with no explanation of
    which traps were and weren't applied.
- Discrepancy classification & audit trail: reward classifying each of
  the six seeded issues distinctly (missing payment, underpayment,
  orphan, duplicate, post-departure error, offsetting refund) rather than
  lumping them into a vague "totals don't match" note. The refund pairing
  is the subtlest trap — it rewards restraint: recognizing that V06's
  overcharge is already resolved and should NOT be re-surfaced as
  something needing action is as important as catching the other five.
  - PASS examples: "six distinct findings: V05 missing payment (30), V08
    underpayment (8), B019 orphan (billed to nonexistent V77), B018
    duplicate of B006, B020 post-departure error charge to V06, offset by
    refund B021 — net zero, no action needed"; "V06 shows a +80/-80 pair
    that fully cancels, so it's noted as resolved rather than listed as
    an open discrepancy"; an audit trail that cites the specific ledger
    row for every flagged item.
  - FAIL examples: a single line like "ledger has some data quality
    issues" with no per-item breakdown; grouping the duplicate and the
    orphan together as generic "bad rows"; re-surfacing V06 as an
    unresolved discrepancy despite the B020/B021 refund fully offsetting
    it.
- Reasoning quality: does REASONING.md explain WHY each excluded or
  deduplicated line was excluded (not just that it was), and does it show
  the arithmetic that ties the 38 shortfall (990 - 952) back to the two
  genuine underpayments (30 + 8)? Penalize submissions that assert the
  final numbers without showing how they got there.
  - PASS examples: "990 - 952 = 38, which decomposes into V05's missing
    30 payment plus V08's 8 underpayment — the other four traps net to
    zero once deduped/excluded/offset"; "B019 is excluded because V77
    does not exist in vessels.csv, not merely because it looked odd";
    "B018 is deduped because it matches B006 on vessel, date, and amount
    exactly — a real second charge would need its own terminal-assigned
    payment ID."
  - FAIL examples: "the numbers reconcile now" with no supporting
    arithmetic; stating collected_total_q2 = 952 without showing how
    1062 was reduced to it; "removed a few duplicate/bad lines" without
    naming which lines or the reason each was removed.
