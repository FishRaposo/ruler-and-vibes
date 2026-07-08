# a11y-01-thornbury-signup — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("coriander tarragon").

## Objective checks
- obj-1 (self-contained fixed.html renders form): PASS — Single file, data: URI images only; logo, email, name, submit present.
- obj-2 (content images meaningful alt): PASS — Logo `alt="Thornbury Community Garden"`; chart describes bar growth (not "image").
- obj-3 (decorative divider empty/presentation): PASS — `alt=""` on `.divider`.
- obj-4 (both inputs programmatic names; name for fixed): PASS — `label for="email-input"` and `for="name-input"`; no `full-name-field`.
- obj-5 (submit accessible name): PASS — `aria-label="Subscribe to newsletter"`; SVG `aria-hidden="true"`.

## Subjective criteria
- sub-quality (Audit accuracy and completeness): 9/10 — All six seeded defects listed: missing logo alt, placeholder chart alt, descriptive divider alt, span-not-label email, mismatched name `for`, nameless icon button; decorative trap correctly called noise.
- sub-craft (Markup correctness and minimal-diff repair): 8/10 — Targeted fixes; swapped `.caption` span for real labels and restyled `label` to match caption look — small visual-class change, still minimal.
- sub-reasoning (Reasoning quality): 9/10 — Explicit decorative-vs-informative rule; notes chart alt is an inference from five rising bars and may not match true data semantics.

## Verdict
Complete a11y repair that correctly empties the decorative divider alt and fixes both label associations. Audit maps each defect to WCAG with concrete element hooks.
