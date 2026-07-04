---
id: planning-10-storm-option
category: planning-reasoning
title: Storm option and the decision flip-point
deliverables:
  - DECISION.md
---

## Task

An outdoor event organizer must commit to one of three options before
the weather is known. The payoff table below gives net profit in
thousands of dollars ($k), depending on whether a storm hits or the
weather is clear:

| Option        | Storm payoff | Clear payoff |
|---------------|--------------|--------------|
| A — Outdoors  | -20          | +50          |
| B — Tent      | +30          | +40          |
| C — Indoors   | +25          | +25          |

The current forecast gives the probability of a storm as **p = 0.30**
(and clear weather as 0.70).

Do the following:

1. Compute the expected value (EV) of each option at p = 0.30, and
   name the best option.
2. Derive each option's EV as a function of p (a linear expression),
   and solve for the **flip-point** — the storm probability at which
   the best decision switches between Outdoors and Tent.
3. State whether Indoors is ever the optimal choice for any storm
   probability in [0, 1], and justify the answer.
4. Compute the **value of perfect information** — how much more the
   organizer could expect to earn if they knew the weather for certain
   before choosing, compared to the best they can do at p = 0.30
   without that knowledge.

## Deliverables

- `DECISION.md` — must report:
  - The EV of each of the three options at p = 0.30, and which option
    is best.
  - The linear EV expression for each option in terms of p, and the
    flip-point probability between Outdoors and Tent, stated as an
    exact value (fraction or decimal).
  - Whether Indoors is ever optimal on [0, 1], with justification.
  - The value of perfect information.

## Constraints

- Show the arithmetic or algebra behind every numeric claim — do not
  state conclusions without the supporting computation.
