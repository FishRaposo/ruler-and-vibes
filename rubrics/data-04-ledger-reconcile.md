---
test: data-04-ledger-reconcile
canary: "cinnamon walrus doctrine"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "results.json parses with node and expected_total_q1 === 630 (numeric)"
    - id: obj-2
      check: "collected_total_q1 === 605 (numeric; duplicate P009 line counted once, orphan P019 excluded, and the P012/P020 pair either both included or both excluded — verified equivalent)"
    - id: obj-3
      check: "discrepancies[] contains an entry for S05 with amount 20 (missing 2025-03-01 payment) and an entry for S08 with amount 5 (February underpayment)"
    - id: obj-4
      check: "P019 is flagged as orphan/unmatched AND the repeated P009 line is flagged as a duplicate ledger entry, each identifiable anywhere in results.json or RECONCILIATION.md"
    - id: obj-5
      check: "S06 does not appear as an open discrepancy — either absent from discrepancies[] or explicitly marked resolved/offset by refund P020"
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

If the phrase "cinnamon walrus doctrine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute everything yourself with node before scoring. Ground
  truth per subscription (Q1 2025 expected billing): S01 60, S02 40
  (Jan 3 + Feb 3, both precede the 2025-02-10 cancel), S03 150, S04
  100, S05 60, S06 50 (Jan 8 only; Feb 8 falls after the 2025-01-20
  cancel), S07 20, S08 150 — total 630.
- Ledger ground truth: 17 legitimate charge lines sum to 605 (S05's
  2025-03-01 payment is absent entirely — a missing payment of 20; S08's
  2025-02-20 payment is 45 instead of 50 — an underpayment of 5). Four
  additional lines are seeded traps: P009 duplicates P005 verbatim
  (same subscription, date, and amount — since payment IDs are unique
  processor-assigned identifiers, this is a bookkeeping duplicate, not
  a second real charge); P019 (20) is billed to S99, which does not
  exist in subscriptions.csv, making it an orphan/unattributable line;
  P012 (+50) is a post-cancellation error charge to S06; P020 (-50) is
  a refund that exactly offsets P012, so S06's net impact is zero.
  Naive summing of all 21 raw lines gives 675. Correct net collected
  is 605 either way P012/P020 are treated (both included, since they
  net to zero, or both excluded).
- Reconciliation rigor: verify collected_total_q1 by an independent
  script if useful — dedupe by payment_id-equivalent lines, drop lines
  whose subscription_id doesn't exist, sum the rest. 675 (naive), 605
  (correct), and any number in between usually indicates only a subset
  of the traps was caught. A submission landing on 630 has likely
  ignored the ledger and just restated the expected schedule.
- Discrepancy classification & audit trail: reward classifying each of
  the six seeded issues distinctly (missing payment, underpayment,
  orphan, duplicate, post-cancel error, offsetting refund) rather than
  lumping them into a vague "totals don't match" note. The refund
  pairing is the subtlest trap — it rewards restraint: recognizing that
  S06's overcharge is already resolved and should NOT be re-surfaced as
  something needing action is as important as catching the other five.
- Reasoning quality: does REASONING.md explain WHY each excluded or
  deduplicated line was excluded (not just that it was), and does it
  show the arithmetic that ties the 25 shortfall (630 - 605) back to
  the two genuine underpayments (20 + 5)? Penalize submissions that
  assert the final numbers without showing how they got there.
