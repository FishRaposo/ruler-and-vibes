---
id: uxcrit-02c-sort-filter-stale
category: ux-critique
title: "Critique a stale sort-and-filter interaction on a product listing"
deliverables:
  - critique.md
---

## Task

Flow description (fictional marketplace app **Keystone**):

1. User browses a product listing page showing 120 items sorted by
   "Relevance" (the default).
2. User opens the sort drop-down and selects "Price: Low to High."
   The page shows a full-page spinner for 1.8 seconds and re-renders
   all 120 items.
3. User now opens the "Category" filter and checks "Lighting."
   The page again shows a full-page spinner for 1.8 seconds, discards
   the price sort, and re-renders 34 lighting items sorted by
   "Relevance" again.
4. The active sort and filter selections are displayed as chips below
   the toolbar — but the "Price: Low to High" chip is still present
   even though the results are sorted by Relevance. Tapping it does
   nothing.
5. User types "pendant" into the text search field. Results narrow to
   7 items, but the "Lighting" filter chip and the "Price: Low to
   High" chip both disappear. User cannot tell whether the search
   ignored their filters or just didn't show the chips.
6. User clears the text search. The 34 lighting items reload sorted
   by "Relevance" — neither the price sort nor the category filter
   was preserved across the search.

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
- Must call out: filter resetting the sort silently, stale chip state
  showing a sort order that isn't active, and text search discarding
  applied filters without warning (three themes).
