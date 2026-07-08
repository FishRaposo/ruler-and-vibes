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
  - PASS examples: "deduped P009 against P005, dropped orphan P019, and
    confirmed P012/P020 net to zero — collected_total_q1 is 605, not
    the naive 675"; "flagged 675 as the raw sum and explained why it
    overstates collections before presenting the corrected 605";
    "re-ran the sum independently, matching each line's subscription_id
    against subscriptions.csv rather than trusting the ledger as given."
  - FAIL examples: "totals don't fully reconcile, more investigation
    needed" with no computed figure; reporting 675 (naive sum) or 630
    (the expected schedule restated) as the final collected total;
    landing on a number between 605 and 675 with no explanation of
    which traps were and weren't applied.
- Discrepancy classification & audit trail: reward classifying each of
  the six seeded issues distinctly (missing payment, underpayment,
  orphan, duplicate, post-cancel error, offsetting refund) rather than
  lumping them into a vague "totals don't match" note. The refund
  pairing is the subtlest trap — it rewards restraint: recognizing that
  S06's overcharge is already resolved and should NOT be re-surfaced as
  something needing action is as important as catching the other five.
  - PASS examples: "six distinct findings: S05 missing payment (20),
    S08 underpayment (5), P019 orphan (billed to nonexistent S99), P009
    duplicate of P005, P012 post-cancel error charge to S06, offset by
    refund P020 — net zero, no action needed"; "S06 shows a +50/-50
    pair that fully cancels, so it's noted as resolved rather than
    listed as an open discrepancy"; an audit trail that cites the
    specific ledger row for every flagged item.
  - FAIL examples: a single line like "ledger has some data quality
    issues" with no per-item breakdown; grouping the duplicate and the
    orphan together as generic "bad rows"; re-surfacing S06 as an
    unresolved discrepancy despite the P012/P020 refund fully offsetting
    it.
- Reasoning quality: does REASONING.md explain WHY each excluded or
  deduplicated line was excluded (not just that it was), and does it
  show the arithmetic that ties the 25 shortfall (630 - 605) back to
  the two genuine underpayments (20 + 5)? Penalize submissions that
  assert the final numbers without showing how they got there.
  - PASS examples: "630 - 605 = 25, which decomposes into S05's missing
    20 payment plus S08's 5 underpayment — the other four traps net to
    zero once deduped/excluded/offset"; "P019 is excluded because S99
    does not exist in subscriptions.csv, not merely because it looked
    odd"; "P009 is deduped because it matches P005 on subscription,
    date, and amount exactly — a real second charge would need its own
    processor-assigned payment ID."
  - FAIL examples: "the numbers reconcile now" with no supporting
    arithmetic; stating collected_total_q1 = 605 without showing how
    675 was reduced to it; "removed a few duplicate/bad lines" without
    naming which lines or the reason each was removed.
