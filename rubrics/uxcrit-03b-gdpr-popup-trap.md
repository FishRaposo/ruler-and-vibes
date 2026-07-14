---
test: uxcrit-03b-gdpr-popup-trap
canary: "keelson woad"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions the 'Reject All' button being visually invisible or absent (affordance asymmetry making rejection harder than acceptance)"
    - id: obj-3
      check: "Mentions pre-toggled legitimate-interest vendors in the Customise modal with no 'Reject All' or bulk-deselect control"
    - id: obj-4
      check: "Mentions the cookie-consent-to-subscription upsell that conflates tracking consent with a paid subscription choice"
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

If the phrase "keelson woad" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Per-check guidance

- **obj-1**: three headings required. PASS if all present.
- **obj-2**: the "Reject All" button is the same colour as the banner
  background — effectively invisible. The user has no equal-path
  rejection. Must name the visual asymmetry.
  - PASS: "The 'Reject All' button is invisible against the dark
    background — the user is steered toward 'Accept All' by design."
  - PASS: "Refusing tracking requires finding a hidden button while
    accepting it is a single prominent tap — this is affordance
    asymmetry, a recognised dark pattern."
  - FAIL: "There's no way to reject cookies" (inaccurate — there IS
    a button, but it's hidden).
- **obj-3**: the Customise modal pre-toggles ALL 47 vendors ON, with
  no bulk-deselect. Closing without toggling leaves everything
  accepted. This is "consent by default" which is not consent.
  - PASS: "Every vendor toggle starts ON in the modal; closing the
    modal without manually toggling all 47 off constitutes acceptance
    under the banner's logic."
  - PASS: "No 'Reject All' inside the Customise modal — even a
    privacy-conscious user who opens it must manually toggle 47 items
    to actually reject."
- **obj-4**: the interstitial conflates "reject cookies" with "pay us
  money." These are unrelated decisions — tracking consent and
  subscription are legally and functionally separate.
  - PASS: "The interstitial frames the choice as 'accept tracking OR
    subscribe' — making privacy a paid feature."
  - PASS: "The subscription page mentions 'ad-free' but the cookie
    banner never mentioned ads — the user is learning about the
    tracking-for-ads trade-off only after being funnelled toward
    payment."

### Subjective guidance

- **UX diagnostic quality**: the highest-scoring responses will note
  that this flow likely violates GDPR — consent must be freely given,
  specific, informed, and unambiguous. Pre-toggled legitimate-interest
  vendors with no reject-all pathway fails the "freely given" test;
  the paywall alternative fails the "freely given" test (consent is
  not free if the alternative is a paid subscription).
- **Actionable fixes**: "Give Accept All and Reject All equal visual
  weight as the two primary buttons" is the minimum fix. "Add a
  'Reject All' inside the Customise modal" and "remove the cookie-wall
  interstitial — show the content with essential cookies only" are
  separate tickets.
- **Reasoning quality**: REASONING.md should distinguish between bad
  UX (the invisible button, the 47 toggles) and the legal/ethical
  dimension (cookie walls as consent). Good reasoning names both.
