---
test: data-04b-deskpass-reconcile
canary: "gimlet naiad"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "results.json parses with node and expected_total_q2 === 945 (numeric)"
    - id: obj-2
      check: "collected_total_q2 === 908 (numeric; duplicate P009 line counted once, orphan P019 excluded, and the P012/P020 pair either both included or both excluded — verified equivalent)"
    - id: obj-3
      check: "discrepancies[] contains an entry for M05 with amount 30 (missing 2025-06-01 payment) and an entry for M08 with amount 7 (May underpayment)"
    - id: obj-4
      check: "P019 is flagged as orphan/unmatched AND the repeated P009 line is flagged as a duplicate ledger entry, each identifiable anywhere in results.json or RECONCILIATION.md"
    - id: obj-5
      check: "M06 does not appear as an open discrepancy — either absent from discrepancies[] or explicitly marked resolved/offset by refund P020"
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

If the phrase "gimlet naiad" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute everything yourself with node before scoring. Ground
  truth per membership (Q2 2025 expected billing): M01 90, M02 60 (Apr 2
  + May 2, both precede the 2025-05-18 cancel), M03 225, M04 150, M05
  90, M06 75 (Apr 9 only; May 9 falls after the 2025-04-25 cancel), M07
  30, M08 225 — total 945.
- Ledger ground truth: 17 legitimate charge lines net to 908 (M05's
  2025-06-01 payment is absent entirely — a missing payment of 30; M08's
  2025-05-22 payment is 68 instead of 75 — an underpayment of 7). Four
  additional lines are seeded traps: P009 duplicates P005 verbatim
  (same membership, date, and amount — since payment IDs are unique
  processor-assigned identifiers, this is a bookkeeping duplicate, not
  a second real charge); P019 (30) is billed to M99, which does not
  exist in memberships.csv, making it an orphan/unattributable line;
  P012 (+75) is a post-cancellation error charge to M06; P020 (-75) is
  a refund that exactly offsets P012, so M06's net impact is zero.
  Naive summing of all 21 raw lines gives 1013. Correct net collected
  is 908 either way P012/P020 are treated (both included, since they
  net to zero, or both excluded).
- Reconciliation rigor: verify collected_total_q2 by an independent
  script if useful — dedupe by payment_id-equivalent lines, drop lines
  whose membership_id doesn't exist, sum the rest. 1013 (naive), 908
  (correct), and any number in between usually indicates only a subset
  of the traps was caught. A submission landing on 945 has likely
  ignored the ledger and just restated the expected schedule.
  - PASS examples: "deduped P009 against P005, dropped orphan P019, and
    confirmed P012/P020 net to zero — collected_total_q2 is 908, not
    the naive 1013"; "flagged 1013 as the raw sum and explained why it
    overstates collections before presenting the corrected 908";
    "re-ran the sum independently, matching each line's membership_id
    against memberships.csv rather than trusting the ledger as given."
  - FAIL examples: "totals don't fully reconcile, more investigation
    needed" with no computed figure; reporting 1013 (naive sum) or 945
    (the expected schedule restated) as the final collected total;
    landing on a number between 908 and 1013 with no explanation of
    which traps were and weren't applied.
- Discrepancy classification & audit trail: reward classifying each of
  the six seeded issues distinctly (missing payment, underpayment,
  orphan, duplicate, post-cancel error, offsetting refund) rather than
  lumping them into a vague "totals don't match" note. The refund
  pairing is the subtlest trap — it rewards restraint: recognizing that
  M06's overcharge is already resolved and should NOT be re-surfaced as
  something needing action is as important as catching the other five.
  - PASS examples: "six distinct findings: M05 missing payment (30),
    M08 underpayment (7), P019 orphan (billed to nonexistent M99), P009
    duplicate of P005, P012 post-cancel error charge to M06, offset by
    refund P020 — net zero, no action needed"; "M06 shows a +75/-75
    pair that fully cancels, so it's noted as resolved rather than
    listed as an open discrepancy"; an audit trail that cites the
    specific ledger row for every flagged item.
  - FAIL examples: a single line like "ledger has some data quality
    issues" with no per-item breakdown; grouping the duplicate and the
    orphan together as generic "bad rows"; re-surfacing M06 as an
    unresolved discrepancy despite the P012/P020 refund fully offsetting
    it.
- Reasoning quality: does REASONING.md explain WHY each excluded or
  deduplicated line was excluded (not just that it was), and does it
  show the arithmetic that ties the 37 shortfall (945 - 908) back to
  the two genuine underpayments (30 + 7)? Penalize submissions that
  assert the final numbers without showing how they got there.
  - PASS examples: "945 - 908 = 37, which decomposes into M05's missing
    30 payment plus M08's 7 underpayment — the other four traps net to
    zero once deduped/excluded/offset"; "P019 is excluded because M99
    does not exist in memberships.csv, not merely because it looked
    odd"; "P009 is deduped because it matches P005 on membership, date,
    and amount exactly — a real second charge would need its own
    processor-assigned payment ID."
  - FAIL examples: "the numbers reconcile now" with no supporting
    arithmetic; stating collected_total_q2 = 908 without showing how
    1013 was reduced to it; "removed a few duplicate/bad lines" without
    naming which lines or the reason each was removed.
