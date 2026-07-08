# REASONING.md — planning-01-tradeoff

## Approach

I built a weighted decision matrix with four criteria relevant to a small travel agency: cost, speed, ownership, and scalability. Weights were chosen to reflect the agency's constraints (small team, one tech person, need to move quickly).

## Key decisions

- Recommended SaaS over open source despite similar cost, because the open-source option has key-person risk (depends on one employee for maintenance).
- Custom build's high upfront cost ($30K) and 4-month delay make it hard to justify for an 8-person team.

## Trade-offs and limitations

- Did not model revenue growth or productivity gains from the booking system, which could change the cost-benefit.

## Files read

- tests/planning-reasoning/planning-01-tradeoff.md
