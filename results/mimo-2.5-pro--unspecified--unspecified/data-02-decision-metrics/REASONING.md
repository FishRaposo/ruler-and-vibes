# REASONING.md — data-02-decision-metrics

## Approach

I computed the requested metrics directly from the CSV data: total spend, cost per lead, conversion rate, and CAC per channel. I then used these to justify a budget allocation.

## Key decisions

- Chose 70/30 Search/Social split because Search has 29% lower CAC and nearly 3× conversion rate, but retained Social for lead volume and top-of-funnel reach.
- Assumed constant CAC at higher spend levels (flagged as a risk).

## Trade-offs and limitations

- Did not model diminishing returns explicitly — the 4-week sample is too small for a saturation curve.
- Could have used a marginal analysis approach, but the data doesn't support it with only 4 data points per channel.

## Files read

- tests/data-analysis/data-02-decision-metrics.md
