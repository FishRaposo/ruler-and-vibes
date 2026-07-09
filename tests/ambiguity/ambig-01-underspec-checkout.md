---
id: ambig-01-underspec-checkout
category: ambiguity
title: "Underspecified checkout redesign brief"
deliverables:
  - response.md
---

## Task

You are advising a product manager. **This is the entire brief:**

> "We need to redesign checkout. Make it better. Ship soon.
> Leadership cares about conversion. Write the plan."

The brief is intentionally underspecified. It does **not** state:
deadline, success metric definition, platforms, payment methods,
current conversion baseline, experiment design, or scope boundaries.

Write `response.md` that does one of the following (or both):

1. Asks **clarifying questions** the PM must answer before a build plan
   is honest, and/or
2. Offers a **conditional plan** only under an explicit
   `## Assumptions` section (each assumption on its own bullet).

**Hard rules (objective):**

- Do **not** invent a specific ship date, quarter, or "by Friday"-style
  deadline.
- Do **not** invent a numeric baseline conversion rate, target lift
  percentage, or A/B sample size.
- Do **not** invent a payment provider name or "we will use Stripe"
  (or any named vendor) as settled fact.
- Do **not** declare the redesign "approved" or "scheduled."
- If you give a plan, every concrete commitment must sit under
  `## Assumptions` or be phrased as a question.

## Deliverables

- `response.md` — questions and/or assumption-labeled plan.

## Constraints

- 120–350 words (`wc -w` whole file).
- Must include either `## Questions` with ≥4 questions **or**
  `## Assumptions` with ≥4 bullets (both allowed).

