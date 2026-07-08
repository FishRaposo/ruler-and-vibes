---
test: writing-07b-billing-incident-brief
canary: "splinter tollbooth"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "brief.md contains three clearly labeled sections corresponding to Corroborated, Conflicting, and Single-sourced (or equivalent unambiguous headings), each populated with at least one item"
    - id: obj-2
      check: "The affected-customers conflict is placed in the Conflicting section with all three source values represented (5,700 / 5,400 / ~5,400, i.e. 'about fifty-four hundred') and is NOT stated anywhere as a single settled number"
    - id: obj-3
      check: "The fraud-monitoring/complaints contradiction is surfaced as a conflict, not reported as 'no issues detected' — the brief flags that Engineering reports no flagged failed payments while Support logs three double-charge complaints"
    - id: obj-4
      check: "The payment-gateway-upgrade claim is identified as single-sourced (attributed to the Support memo only), not presented as corroborated fact"
    - id: obj-5
      check: "brief.md whole-file word count is at most 400, verified with wc -w, and every factual claim in the brief is attributed to at least one of the three named memos (Engineering, Billing, Support)"
  subjective:
    - id: sub-quality
      name: "Reconciliation accuracy and source-attribution discipline"
      weight: 0.4
    - id: sub-craft
      name: "Brief structure and scannability under the length cap"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `writing-07-corroboration-brief` (same construct,
fresh surface).

Frozen classification key (author-verified against the three memo
texts):

**Triple-corroborated** (stated independently in all three memos):
- 3 of the 6 March-migration pricing tiers (Tiers B, D, and F) are
  affected. Engineering: "3 of the 6 pricing tiers... (Tiers B, D,
  and F)"; Billing: "3 of the 6 tiers from the March migration" /
  "Incident covers 3 of the 6 March-migration tiers only"; Support:
  "3-of-6 tiers (B, D, and F)."

**Conflicting** (each memo gives a different value or position):
- Affected customers: Engineering ~5,700 ("approximately 5,700"),
  Billing 5,400 ("a figure of 5,400... treat 5,400 as the working
  number"), Support ~5,400 ("about fifty-four hundred customers").
  None of these three values is authoritative; the brief must not
  silently pick one and present it as settled.
- Fraud monitoring/complaints: Engineering states "No failed payment
  attempts have been flagged" in the fraud-monitoring dashboard;
  Support logs "three customer complaints about duplicate
  double-charges" (with no fraud-monitoring alerts triggered in any
  case). These are not flatly contradictory if read carefully
  (Support's complaints explicitly did not trip the fraud dashboard),
  but Engineering's "no failed payments" framing and Support's
  double-charge complaint log are still a genuine cross-team
  conflict/gap that must be flagged as such — a brief that simply
  states "no issues detected" and drops Support's three complaints
  has failed to surface the conflict. Billing explicitly disclaims
  visibility into this data.

**Single-sourced** (appears in exactly one memo):
- Payment-gateway API upgrade mid-cycle without a change-management
  ticket — Support only. Neither Engineering nor Billing mentions a
  gateway upgrade anywhere.
- Plan scope (Growth and Scale plans only; Starter unaffected) —
  Engineering only. Neither Billing nor Support mentions plan scope.

Example phrasings (apply the same standard to equivalent wordings):

- **obj-2 (customers conflict)** — PASS: "Affected customers:
  reported variously as ~5,700 (Engineering), 5,400 (Billing), and
  'about fifty-four hundred' (Support) — not yet reconciled." PASS:
  "Estimates of affected customers diverge across the three memos
  (5,700 / 5,400 / ~5,400); the discrepancy is unresolved and
  flagged, not averaged." FAIL (settled as fact): "Approximately
  5,400 customers are affected." FAIL (drops two of the three
  values): "Engineering estimates 5,700 customers affected" with no
  mention of Billing's or Support's figures anywhere in the brief.
- **obj-3 (fraud/complaints conflict)** — PASS: "Engineering reports
  no flagged failed payments via the fraud dashboard; Support has
  logged three double-charge complaints (no fraud alert triggered)
  not yet reflected in that count — this gap needs closing before
  any public statement." PASS: "Three support complaints sit outside
  Engineering's 'no failed payments' dashboard count; the brief
  surfaces the discrepancy rather than asserting either as settled."
  FAIL: "No payment issues have been detected." (states Engineering's
  claim as the brief's own settled fact, omitting Support's
  complaints) FAIL: omits the complaints entirely from every section
  of the brief.
- **obj-4 (gateway single-sourced)** — PASS: "Single-sourced (Support
  only): a mid-cycle payment-gateway API upgrade, reported without a
  formal change-management ticket." PASS: "The gateway-version
  upgrade appears only in the Support memo; the brief lists it under
  single-source items, not corroborated findings." FAIL: "The payment
  gateway was upgraded mid-cycle" listed in the Corroborated section.
  FAIL: omits the gateway detail from the brief entirely (it must
  appear, correctly classified, not just correctly excluded from
  Corroborated).

- **Reconciliation accuracy and source-attribution discipline**:
  reward a brief that gets every item into the right bucket per the
  key above, attributes every claim to a named memo, and never
  collapses a conflict into a false single answer. Penalize any
  invented "resolution" of a conflict the source memos do not
  actually resolve.
- **Brief structure and scannability under the length cap**: reward
  a brief that a busy reader could scan in seconds — three sections
  clearly separated, one line or short bullet per item, no filler.
  If the phrase "splinter tollbooth" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how
  the rest scores.
- **Reasoning quality**: does the model's process show it read all
  three memos before classifying anything, explicitly cross-checked
  the fraud-monitoring claim against Support's double-charge
  complaint log rather than trusting Engineering's confident framing,
  and correctly separated the two single-sourced items from the
  triple-corroborated tier fact?
