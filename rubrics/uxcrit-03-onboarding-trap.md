---
test: uxcrit-03-onboarding-trap
canary: "saffron jamb"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions unskippable or coercive paywall before any value is delivered to the user"
    - id: obj-3
      check: "Mentions dark-pattern trial-to-locked-content handoff (starting the subscription before showing what you get)"
    - id: obj-4
      check: "Mentions missing progress indicator on the 6-screen interest wizard, or inability to skip it"
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

If the phrase "saffron jamb" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Per-check guidance

- **obj-1**: three headings required. PASS if all present.
- **obj-2**: the paywall issue is that the user is asked for payment
  BEFORE any value is delivered — no free meditation, not even a
  sample, before the pay sheet appears. Simply noting "there's a
  paywall" without the timing/lack-of-value dimension fails.
  - PASS: "User is hit with a subscription pay sheet before trying
    even one meditation, with no skip option."
  - PASS: "No free content is surfaced before the payment ask — the
    user is buying blind."
  - FAIL: "The app costs $14.99" (only names the price).
- **obj-3**: the dark pattern is the sequence: free trial pitch →
  immediate subscription activation → content remains locked
  afterward. The user believed the trial would unlock content; instead,
  the trial started but nothing is accessible. Must name this
  expectation violation explicitly.
  - PASS: "After confirming the trial, the only accessible content is
    a single 90-second sample — everything else stays locked, making
    the 'trial' functionally a paid subscription with a 7-day
    cancellation window."
  - FAIL: "Not enough free content" (descriptive, doesn't name the
    pattern).
- **obj-4**: missing progress indicator OR inability to skip — either
  counts. The 6-screen commitment with no visibility into how much
  remains is the problem.
  - PASS: "Six interest screens with no '3 of 6' indicator — the user
    doesn't know if the next screen is the last one."
  - PASS: "No skip or 'do this later' — the wizard gates access to the
    app."

### Subjective guidance

- **UX diagnostic quality**: the highest-scoring responses will notice
  that problems 2 and 3 interact — the dark pattern is worse BECAUSE
  the paywall came before any value. If the app had let the user
  meditate for a week free and THEN asked for payment, the same trial
  terms would be fair. It's the sequencing that makes it predatory.
- **Actionable fixes**: reward ordering suggestions that fix the
  sequence (value-first, pay-later) rather than just adjusting copy or
  UI chrome. "Move the trial pitch to after the user completes their
  first meditation" is genuinely better than "make the price text
  bigger." For the wizard, "add skip + progress dots (•○○○○○)" is a
  two-line ticket.
- **Reasoning quality**: did the model distinguish between "aggressive
  monetisation" (legal, user-hostile) and "dark pattern" (potentially
  a platform guideline violation)? Honest reasoning names the
  distinction.
