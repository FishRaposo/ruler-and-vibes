---
id: uxcrit-02-search-feedback
category: ux-critique
title: "Critique a broken search-and-filter interaction"
deliverables:
  - critique.md
---

## Task

Flow description (fictional email app **Postmark**):

1. Inbox list is visible (200+ messages visible via scroll).
2. User types "invoice" into the search field (top bar).
3. Search field shows a spinner for 2.3 seconds.
4. Results appear — 3 messages, all from last year, sorted oldest-first.
5. User notices a "Sender" filter drop-down to the right of the search
   field — currently set to "Anyone."
6. User changes Sender to "VendorBot" and presses Enter.
7. The entire search is **re-run from scratch** — same 2.3s spinner,
   same oldest-first sort, same sender filter is ignored because
   "VendorBot" is a label name, not a sender address.
8. User types a second search term (space-separated) — results are an
   empty set with a "No results" message, but no suggestions or
   "try removing a term" hint.

Write `critique.md`:

## Problems
(≥3 distinct UX problems)

## Severity
(label each problem P0/P1/P2)

## Fixes
(one concrete fix per problem)

## Deliverables

- `critique.md`

## Constraints

- 120–350 words.
- Must call out: spin delay with no progress indication, oldest-first
  default without a sort toggle, and filter re-running full search
  instead of narrowing in-place (three themes).
