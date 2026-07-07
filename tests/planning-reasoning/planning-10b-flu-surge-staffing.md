---
id: planning-10b-flu-surge-staffing
category: planning-reasoning
title: Surge option and the decision flip-point
deliverables:
  - DECISION.md
---

## Task

A regional hospital network must commit to one of three nurse-staffing
strategies before it is known whether this flu season will be a
severe surge or a typical season. The payoff table below gives net
financial outcome in thousands of dollars ($k), depending on whether a
surge hits or the season stays typical:

| Option              | Surge payoff | Typical payoff |
|----------------------|--------------|-----------------|
| A — Lean Roster       | -30          | +60             |
| B — Flex Pool         | +25          | +35             |
| C — Max Roster        | +20          | +20             |

The current forecast gives the probability of a surge season as
**r = 0.40** (and a typical season as 0.60).

Do the following:

1. Compute the expected value (EV) of each option at r = 0.40, and
   name the best option.
2. Derive each option's EV as a function of r (a linear expression),
   and solve for the **flip-point** — the surge probability at which
   the best decision switches between Lean Roster and Flex Pool.
3. State whether Max Roster is ever the optimal choice for any surge
   probability in [0, 1], and justify the answer.
4. Compute the **value of perfect information** — how much more the
   network could expect to save if it knew whether the season would
   be a surge for certain before choosing, compared to the best it can
   do at r = 0.40 without that knowledge.

## Deliverables

- `DECISION.md` — must report:
  - The EV of each of the three options at r = 0.40, and which option
    is best.
  - The linear EV expression for each option in terms of r, and the
    flip-point probability between Lean Roster and Flex Pool, stated
    as an exact value (fraction or decimal).
  - Whether Max Roster is ever optimal on [0, 1], with justification.
  - The value of perfect information.

## Constraints

- Show the arithmetic or algebra behind every numeric claim — do not
  state conclusions without the supporting computation.
