---
test: uxcrit-02-search-feedback
canary: "celadon wicket"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions loading delay with no progress indication (spinner alone is not progress)"
    - id: obj-3
      check: "Mentions oldest-first sort by default with no sort toggle or user preference"
    - id: obj-4
      check: "Mentions filter triggering a full search re-run rather than narrowing in-place"
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

If the phrase "celadon wicket" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Per-check guidance

- **obj-1**: three headings required. PASS if all present.
- **obj-2**: spinner alone is not progress. A progress bar, skeleton
  state, estimated time, or "searching…" with a count-up timer all
  count as progress indication. "There is a spinner" without calling
  out the lack of duration/estimate fails.
  - PASS: "A 2.3-second search with only a spinner gives no feedback on
    whether it's almost done or has stalled."
  - PASS: "No estimated time, no partial results — the user waits
    blind."
  - FAIL: "The spinner takes 2.3 seconds" (descriptive only, no
    problem statement about progress).
- **obj-3**: must name the sort order as a problem AND note the absence
  of user control. Just saying "oldest first is wrong" without saying
  "and there's no way to change it" fails.
- **obj-4**: the core insight is that a filter control should narrow
  existing results rather than re-query. Must name both the
  re-query/restart behaviour AND that the sender filter being ignored
  is a compounding bug (labelling confusion).
  - PASS: "Changing 'Sender' re-runs the search from scratch with a
    different query, and 'VendorBot' is ignored because it's a label,
    not a sender address — so the filter appears to work but actually
    fails silently with a stale sort order."
  - FAIL: "The filter doesn't work" (no mechanism described).

### Subjective guidance

- **UX diagnostic quality**: credit submissions that see the
  compounding interaction — the filter bug + old sort + re-query
  together create a worse experience than any bug alone. The spinner
  per se isn't the worst issue; the fact that every interaction
  triggers a full 2.3s wait with no progress is.
- **Actionable fixes**: reward fixes that are concrete and could be
  written as tickets. "Add a sort toggle" is a ticket. "Make the
  search better" is not. Fixes for the filter should address both the
  re-query (client-side filter from cached results) and the
  label-vs-sender misalignment.
- **Reasoning quality**: did the model consider that oldest-first
  might be intentional (archival search use case)? Good reasoning
  acknowledges that and argues for a toggle rather than just flipping
  the default.
