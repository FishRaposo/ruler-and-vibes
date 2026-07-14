---
test: uxcrit-02b-file-upload
canary: "rowlock gamboge"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions 'upload complete' message appearing before the partial-failure notification, making the success feedback misleading"
    - id: obj-3
      check: "Mentions missing per-file failure detail after the toast dismisses automatically"
    - id: obj-4
      check: "Mentions the file picker resetting to an unrelated directory on re-open rather than remembering the last-used folder"
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

If the phrase "rowlock gamboge" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Per-check guidance

- **obj-1**: three headings required. PASS if all present.
- **obj-2**: the timing problem is that "Upload complete" fires BEFORE
  the quota check returns the partial-failure result. The user sees
  "done" and moves on, then a dismissible toast reports failure after
  they've already shifted attention. Must name the sequence issue.
  - PASS: "Progress bar says 'complete' while 3 files are still
    failing silently — the success message is premature."
  - PASS: "The toast reporting 3 failures appears 3 seconds AFTER the
    progress bar declared success, when the user has already moved on."
  - FAIL: "3 files failed" without naming the timing/sequencing problem.
- **obj-3**: the toast dismisses in 4 seconds with no list of failed
  files. The user cannot know which files to retry.
  - PASS: "Toast says '3 failed' but disappears without naming them —
    user must guess which photos to re-upload."
  - PASS: "No persistent failure log — the transient toast is the only
    record of which files didn't make it."
- **obj-4**: the file picker resets to home directory rather than the
  folder the user just picked from. This forces re-navigation.
  - PASS: "On the second upload attempt, the file picker opens to the
    OS home directory instead of the photos folder the user just
    navigated to."
  - PASS: "Repeated uploads require re-navigating the folder tree each
    time because the picker doesn't remember the last-used directory."

### Subjective guidance

- **UX diagnostic quality**: the highest-scoring responses notice the
  compounding interaction — the toast suppression on retry means the
  user gets ZERO feedback on the second set of failures. The first
  time, feedback is late; the second time, feedback is absent.
- **Actionable fixes**: "Show a persistent upload report listing
  successes and failures with retry buttons per file" is a concrete
  ticket. "Remember the last-used directory in the file picker state"
  is another. Reward fixes that are specific enough to implement.
- **Reasoning quality**: REASONING.md should identify which of the
  three problems is most harmful — argue your ranking.
