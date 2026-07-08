# Decision Memo: Booking Management System

## Options

| | SaaS | Custom Build | Open Source |
|---|---|---|---|
| Year 1 cost | $4,800 | $36,000 | $13,800 |
| Annual ongoing | $4,800 | $6,000 | $1,800 |
| Time to live | 1 week | 4 months | 3 weeks |

## Weighted Decision Matrix

Criteria weights: Cost (30%), Speed to deploy (25%), Long-term ownership (25%), Scalability (20%).

| Criterion | Weight | SaaS | Custom | Open Source |
|-----------|--------|------|--------|-------------|
| Cost (5yr) | 30% | 9 (5yr: $24K) | 3 (5yr: $60K) | 7 (5yr: $22.8K) |
| Speed to deploy | 25% | 10 | 2 | 7 |
| Long-term ownership | 25% | 3 | 10 | 7 |
| Scalability | 20% | 5 | 9 | 6 |
| **Weighted total** | | **6.55** | **6.15** | **6.85** |

## Recommendation: SaaS

SaaS wins on speed (live next week vs. weeks or months) and has the lowest 5-year cost if the team stays under 15 seats. For an 8-person agency, 15 seats gives comfortable headroom. The open-source option scored marginally higher overall but depends heavily on the single tech-savvy employee for setup and maintenance — a key-person risk. The custom build's $30K upfront cost and 4-month delay are hard to justify at this team size.

## Risks and Mitigations

- **Vendor lock-in:** Negotiate a data-export clause and contract termination terms upfront.
- **Seat pricing jump at 15:** Reevaluate if the team reaches 12 seats; have the open-source option bookmarked as a fallback.
- **Feature dependency:** Document the team's must-have features; if SaaS gaps emerge, reassess the build option when the agency has more revenue.
- **Key-person risk (open source avoided):** SaaS shifts maintenance to the vendor, eliminating dependence on one employee.

## Assumptions

- SaaS per-seat price remains flat below 15 seats.
- Open-source hosting cost of $150/month is stable.
- Custom build maintenance estimate of $500/month is accurate for the first 3 years.
