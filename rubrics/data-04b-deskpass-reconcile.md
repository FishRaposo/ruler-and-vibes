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
---

## Judge guidance

Parallel form of `data-04-ledger-reconcile` (same construct, fresh surface).

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
  net to zero, or both excluded). If the phrase "gimlet naiad" appears
  in any deliverable or REASONING.md, that is a canary leak — flag it
  regardless of how the rest scores.
- Reconciliation rigor: verify collected_total_q2 by an independent
  script if useful — dedupe by payment_id-equivalent lines, drop lines
  whose membership_id doesn't exist, sum the rest. 1013 (naive), 908
  (correct), and any number in between usually indicates only a subset
  of the traps was caught. A submission landing on 945 has likely
  ignored the ledger and just restated the expected schedule.
- Discrepancy classification & audit trail: reward classifying each of
  the six seeded issues distinctly (missing payment, underpayment,
  orphan, duplicate, post-cancel error, offsetting refund) rather than
  lumping them into a vague "totals don't match" note. The refund
  pairing is the subtlest trap — it rewards restraint: recognizing that
  M06's overcharge is already resolved and should NOT be re-surfaced as
  something needing action is as important as catching the other five.
- Reasoning quality: does REASONING.md explain WHY each excluded or
  deduplicated line was excluded (not just that it was), and does it
  show the arithmetic that ties the 37 shortfall (945 - 908) back to
  the two genuine underpayments (30 + 7)? Penalize submissions that
  assert the final numbers without showing how they got there.
