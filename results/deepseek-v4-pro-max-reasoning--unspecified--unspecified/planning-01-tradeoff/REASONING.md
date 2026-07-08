## Approach
Evaluated three options using a weighted decision matrix with four criteria chosen to reflect the agency's priorities: cost, speed, scalability, and data ownership. Computed weighted scores and made a clear recommendation backed by the numbers.

## Key decisions
Chose criteria that matter to an 8-person travel agency: upfront cost (they're small), time to deliver (they need booking management now), ongoing cost (recurring budget matters), scalability risk (growth plans), and data ownership (customer data sensitivity). The self-hosted OSS option wins because it balances low recurring costs with full ownership at a manageable one-time setup.

## Trade-offs and limitations
The matrix depends on the assumption that the agency won't grow past 15 seats soon — if they do, SaaS pricing jumps sharply, which actually reinforces the OSS recommendation. The main vulnerability is the single tech-savvy employee, which I mitigated through documentation and a support budget.

## Files read
- tests/planning-reasoning/planning-01-tradeoff.md
