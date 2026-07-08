# data-02-decision-metrics — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Files read only the test file. No canary "penny-lure".

## Objective checks
- obj-1 (CAC correct for both channels): PASS — Search $91.67, Social $129.41 (recomputed 2200/24 and 2200/17).
- obj-2 (Lead→customer conversion and cost per lead correct): PASS — Search 22.2% / $20.37; Social 7.6% / $9.78.
- obj-3 (Allocation follows the computed economics — majority to Search or argued deviation): PASS — full $6,000 to Search justified by ~29% lower CAC and projected customers/value.
- obj-4 (<= 600 words; assumptions stated explicitly): PASS — 257 words; constant returns, scalability, value stability, zero-Social optionality all stated.

## Subjective criteria
- sub-quality (Quantitative rigor): 8/10 — Correctly elevates CAC over cheap Social leads; projects ~65 vs ~46 customers and $26k vs $18.4k value at $6k. Does not explicitly net against the $400 LTV bar (e.g. $308 vs $271 contribution) though the comparison is still per-customer.
- sub-craft (Decision linkage): 7/10 — Allocation is numerically tied to CAC gap, but all-in Search ignores the memo's own $500 Social optionality note as an actual budget line — a pure 100% split after flagging the learning-loss risk is slightly brittle.
- sub-reasoning (Reasoning quality): 8/10 — Flags linear-scalability assumption and thin four-week sample in both metrics.md and REASONING; notes Search conversion ~3× Social.

## Verdict
Arithmetic is exact and the Search-majority economic logic is sound. Full $6k to Search is defensible from CAC but leaves the stated Social test-budget insight on the table rather than in the allocation.
