---
id: planning-10c-fuel-spike-fleet
category: planning-reasoning
title: Fuel-spike fleet and the decision flip-point
deliverables:
  - DECISION.md
---

## Task

A regional freight company must commit to one of three fleet strategies
before it is known whether a fuel-price spike will occur. The payoff
table below gives net profit in thousands of dollars ($k), depending on
whether a price spike hits or fuel prices stay stable:

| Option              | Spike payoff | Stable payoff |
|---------------------|--------------|----------------|
| A — Diesel Fleet     | -35          | +65            |
| B — Hybrid Fleet     | +30          | +45            |
| C — Electric Fleet   | +24          | +24            |

The current forecast gives the probability of a price spike as
**p = 0.35** (and stable prices as 0.65).

Do the following:

1. Compute the expected value (EV) of each option at p = 0.35, and
   name the best option.
2. Derive each option's EV as a function of p (a linear expression),
   and solve for the **flip-point** — the spike probability at which
   the best decision switches between Diesel Fleet and Hybrid Fleet.
3. State whether Electric Fleet is ever the optimal choice for any
   spike probability in [0, 1], and justify the answer.
4. Compute the **value of perfect information** — how much more the
   company could expect to earn if it knew whether the spike would
   occur for certain before choosing, compared to the best it can do
   at p = 0.35 without that knowledge.

## Deliverables

- `DECISION.md` — must report:
  - The EV of each of the three options at p = 0.35, and which option
    is best.
  - The linear EV expression for each option in terms of p, and the
    flip-point probability between Diesel Fleet and Hybrid Fleet,
    stated as an exact value (fraction or decimal).
  - Whether Electric Fleet is ever optimal on [0, 1], with
    justification.
  - The value of perfect information.

## Constraints

- Show the arithmetic or algebra behind every numeric claim — do not
  state conclusions without the supporting computation.
