---
id: uxcrit-03c-checkout-gotcha
category: ux-critique
title: "Critique a broken checkout flow with a pre-selected upsell trap"
deliverables:
  - critique.md
---

## Task

Flow description (fictional ticket platform **Stagehand**):

1. User selects two concert tickets at $45 each ($90 subtotal).
2. Proceeds to checkout. On the "Review" screen, the subtotal shows
   "$90.00" but the total at the bottom shows "$129.97."
3. Below the ticket line items, in 10px grey text, a line reads
   "Ticket Protection Plan — $19.99" with a pre-ticked checkbox.
4. User unticks it. Total updates to "$109.98."
5. User notices another line: "Processing Fee — $19.99" — separate
   from the protection plan but the same price, making it easy to
   misread as still being the plan. No breakdown or explanation of
   the fee.
6. User clicks "Pay." The next screen says "Order confirmed" with a
   green checkmark, then auto-redirects after 5 seconds to a page
   that says "Download our app for faster checkout" with an
   animated mockup — the order confirmation details are replaced
   and the user can only get back to them via a small "View order"
   link at the very bottom.
7. No email confirmation is sent for 12 minutes (the user checks).

Write `critique.md`:

## Problems
(&#8805;3 distinct UX problems)

## Severity
(label each problem P0/P1/P2)

## Fixes
(one concrete fix per problem)

## Deliverables

- `critique.md`

## Constraints

- 120–350 words.
- Must call out: pre-ticked add-on inflating the total, identically-
  priced fee and protection plan creating visual conflation, and
  confirmation page being replaced by a marketing redirect (three
  themes).
