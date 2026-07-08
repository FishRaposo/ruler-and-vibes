## Approach
Computed per-channel metrics from the raw CSV: total spend, leads, and customers summed across four weeks, then derived cost per lead, conversion rate, and CAC. Compared the two channels and made a budget allocation recommendation based on CAC.

## Key decisions
Search outperforms Social on every conversion metric despite generating fewer leads — its conversion rate is nearly 3x higher. The full $6,000 allocation to Search follows directly from the numbers: lower CAC means more customers per dollar. I noted the risks of zero Social spend as a caveat.

## Trade-offs and limitations
The analysis assumes linear scalability, which rarely holds in practice. I flagged this explicitly in the risks section. The four-week dataset is a thin sample — seasonal effects or campaign fatigue aren't captured.

## Files read
- tests/data-analysis/data-02-decision-metrics.md
