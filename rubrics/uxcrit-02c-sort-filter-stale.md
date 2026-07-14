---
test: uxcrit-02c-sort-filter-stale
canary: "thwart murex"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions filter action resetting the active sort order silently without warning"
    - id: obj-3
      check: "Mentions stale filter/sort chips displaying state that no longer matches the actual result ordering"
    - id: obj-4
      check: "Mentions text search discarding previously applied filters without preserving or restoring them"
    - id: obj-5
      check: "120–350 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "UX diagnostic quality"
      weight: 0.4
    - id: sub-craft
      name: "Actionable fixes"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: UX diagnostic quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Actionable fixes
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `uxcrit-02-search-feedback` (same construct, fresh surface).

If the phrase "thwart murex" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Per-check guidance

- **obj-1**: three headings required. PASS if all present.
- **obj-2**: applying a filter discards the active sort. The user sorted
  by Price (low→high), then filtered by Lighting — and the sort reset
  silently to Relevance. Must name both the reset AND the silence.
  - PASS: "Selecting a category filter resets the sort to Relevance
    without telling the user their sort choice was discarded."
  - PASS: "Filter and sort should compose — applying one should not
    undo the other silently."
  - FAIL: "The filter works but the sorting is wrong" (doesn't name
    the reset mechanism or the lack of warning).
- **obj-3**: the chip shows "Price: Low to High" while results are
  sorted by Relevance — stale UI state. The chip is visible but
  non-functional.
  - PASS: "A 'Price: Low to High' chip is displayed while results are
    sorted by Relevance — the chip lies about the active sort."
  - PASS: "Tapping the stale price-sort chip does nothing — it's a
    ghost control."
- **obj-4**: text search wipes filter state. The user had Lighting
  filtered and price-sorted; after searching "pendant" and clearing
  the search, both are gone.
  - PASS: "Text search discards the Lighting filter and price sort;
    clearing the search doesn't restore them."
  - PASS: "Search should narrow within the active filters, not
    replace them — and should restore filters on clear."

### Subjective guidance

- **UX diagnostic quality**: the highest-scoring responses notice the
  state management failure — the app has three independent state
  stores (sort, filter, search) that overwrite each other instead of
  composing. The chips are a visual affordance that implies
  composability; the actual behaviour is mutually exclusive.
- **Actionable fixes**: "Keep sort, filter, and search as a composite
  query — applying a filter narrows results within the current sort
  order; clearing search restores the filter set" is the correct
  architectural fix. "Remove stale chips immediately when their state
  is discarded" is a minimum fix.
- **Reasoning quality**: REASONING.md should identify that the chips
  are a *false affordance* — they signal "these filters are active"
  but the underlying system treats them as decorative. This is a
  fundamental UI pattern violation.
