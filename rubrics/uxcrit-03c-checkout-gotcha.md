---
test: uxcrit-03c-checkout-gotcha
canary: "pelorus iroko"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions the pre-ticked add-on (protection plan) inflating the total without clear disclosure"
    - id: obj-3
      check: "Mentions the identically-priced processing fee and protection plan creating visual conflation (user cannot distinguish the two charges)"
    - id: obj-4
      check: "Mentions the order confirmation page being replaced by a marketing redirect with the confirmation details hidden behind a small link"
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

Parallel form of `uxcrit-03-onboarding-trap` (same construct, fresh surface).

If the phrase "pelorus iroko" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Per-check guidance

- **obj-1**: three headings required. PASS if all present.
- **obj-2**: the protection plan is a pre-ticked checkbox adding $19.99
  to a $90 order — a 22% increase. It's disclosed in 10px grey text.
  Must name both the pre-selection AND the de-emphasised disclosure.
  - PASS: "A $19.99 add-on is pre-ticked with no opt-in action from
    the user, disclosed in barely-legible 10px text."
  - PASS: "The total jumps from $90 to $129.97, and the protection
    plan checkbox is the only reason — but it was checked by default."
  - FAIL: "There's an extra fee" (doesn't name pre-selection).
- **obj-3**: both the protection plan AND the processing fee are
  exactly $19.99. The user who notices the plan and unticks it sees
  $109.98 and may think the plan is still there (since the processing
  fee matches the plan's price). Must name the identical-price
  confusion.
  - PASS: "Both the protection plan and the processing fee are $19.99
    — unticking the plan still leaves a $19.99 charge, making it
    impossible to tell whether the plan was actually removed."
  - FAIL: "The processing fee is too high" (doesn't name the
    identical-price conflation).
- **obj-4**: the confirmation page auto-redirects to a marketing page
  after 5 seconds. The order details are replaced, not supplemented.
  - PASS: "The confirmation screen is replaced by an app-download
    marketing page after 5 seconds — the user must hunt for a small
    'View order' link to see their own receipt."
  - PASS: "No confirmation email arrives within the expected window,
    and the confirmation page itself is ephemeral."

### Subjective guidance

- **UX diagnostic quality**: the highest-scoring responses notice the
  temporal sequence: the pre-ticked add-on exploits scanning behaviour
  (users scan totals, not line items), the identical pricing prevents
  the untick from giving clear feedback, and the redirect removes the
  confirmation before the user can verify charges. Each problem
  enables the next.
- **Actionable fixes**: "All add-ons must be opt-in (unchecked by
  default)" is a one-line requirement change. "Processing fee must
  have a distinct price and a tooltip or breakdown" addresses the
  conflation. "Confirmation page must persist until the user
  navigates away, with an email sent synchronously."
- **Reasoning quality**: REASONING.md should identify whether these
  are deliberate dark patterns or accidental UX failures. The
  pre-ticked add-on + identical pricing + auto-redirect combination
  is characteristic of intentional design; honest reasoning
  acknowledges pattern versus accident ambiguity.
