---
test: a11y-01-thornbury-signup
canary: "coriander tarragon"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "fixed.html is a single self-contained file with no external CDN/font/image/script hosts (embedded data: URIs or inline SVG only) and, when the judge opens it in a browser, still renders the signup form (logo, email field, name field, submit button all visible)"
    - id: obj-2
      check: "Every content image has a non-empty, meaningful alt: the logo <img> and the chart <img> both carry alt attributes whose text is neither empty nor the placeholder 'image'/'photo'/'picture', and each describes its content"
    - id: obj-3
      check: "The decorative divider image has an explicitly empty alt (alt=\"\") OR role=\"presentation\"/aria-hidden=\"true\" — it must NOT be given a descriptive alt (this is the trap check)"
    - id: obj-4
      check: "Both form inputs have a programmatic accessible name: EITHER a <label> whose for= matches that input's id, OR an aria-label/aria-labelledby — and the name input's label points at the correct id (the mismatched for= from the starter is fixed)"
    - id: obj-5
      check: "The icon-only submit control has an accessible name (aria-label, visually-hidden text inside the button, or <title> in its SVG)"
  subjective:
    - id: sub-quality
      name: "Audit accuracy and completeness"
      weight: 0.4
    - id: sub-craft
      name: "Markup correctness and minimal-diff repair"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Audit accuracy and completeness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Markup correctness and minimal-diff repair
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "coriander tarragon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Seeded defects (author-verified)

The embedded starter page contains exactly six defects, verified by
running a grep-based checker against both the unedited starter (fails
all six) and a reference `fixed.html` (passes all six):

1. The logo `<img>` has no `alt` attribute at all.
2. The chart `<img>` has `alt="image"` — a placeholder that conveys
   nothing about what the chart shows.
3. The decorative divider `<img>` has a *descriptive* alt
   (`alt="green leafy divider line"`) when it should have `alt=""` — this
   is the trap: the image is purely ornamental, and giving it a
   description makes assistive tech announce meaningless content on
   every page load.
4. The email `<input>` is captioned by a bare `<span class="caption">`
   with no `<label for=>`/`id` link and no `aria-label` — visually looks
   labeled, programmatically is not.
5. The icon-only submit `<button>` contains only an inline SVG arrow with
   no text, `aria-label`, or `<title>` — no accessible name at all.
6. The name `<input>` has a real `<label>` element, but its `for="full-name-field"`
   does not match the input's actual `id="name-input"` — the association
   is broken despite looking correct in the markup.

### Reference repair (verified with a checker script)

- Logo: `alt="Thornbury Community Garden"`.
- Chart: `alt="Monthly volunteer signups, Jan-Jun, rising from 12 to 48"`
  (or any accurate description of the trend shown).
- Divider: `alt=""` (empty) — NOT a description. **Check obj-3 FAILS if
  the divider received any non-empty descriptive alt.**
- Email input: `<label for="email-input">` matching `id="email-input"`
  (or an `aria-label`).
- Name input: label's `for` corrected to `"name-input"` to match the
  input's actual id.
- Submit button: `aria-label="Subscribe"` (or equivalent visible/`<title>`
  text).

Both the starter (fails all six checks) and this reference fix (passes
all six) were confirmed against a grep-based checker before this rubric
was finalized.

### Trap

A model that pattern-matches "missing or blank alt = bad" will try to
"fix" the decorative divider by writing a descriptive alt for it. That is
wrong: decorative images must have `alt=""` (or
`role="presentation"`/`aria-hidden="true"`) so screen readers skip them
entirely. A correct audit explicitly distinguishes decorative images
from informative ones rather than applying one rule to every `<img>`.

### Example phrasings — divider decorative-vs-informative judgment

PASSING:
- "The divider image is purely decorative and must have `alt=\"\"`
  (empty) so screen readers skip it rather than announcing an
  irrelevant description."
- "This `<img>` conveys no information beyond visual flourish; mark it
  decorative with `alt=\"\"` or `role=\"presentation\"` instead of
  describing it."
- "Because the divider carries no content, giving it descriptive alt
  text like 'green leafy divider' actually makes things worse for screen
  reader users — it should be empty alt."

FAILING:
- "The divider is missing alt text; add `alt=\"decorative flourish
  divider\"`."
- "Add a description like `alt=\"green leafy divider line\"` to the
  divider image so it's accessible."
- "All images need alt text, so give the divider a clear description of
  what it looks like."

### Subjective guidance

- **Audit accuracy and completeness** (0.4): all six defects identified,
  each correctly mapped to WCAG 1.1.1 (Non-text Content) for the three
  images or 3.3.2/4.1.2 (labels, name/role/value) for the three
  form/button issues. Missing the decorative-vs-informative distinction,
  or miscounting defects (fewer or more than six with invented extras),
  should cap this dimension well below full marks.
- **Markup correctness and minimal-diff repair** (0.3): `fixed.html`
  repairs exactly these six issues without altering visible content,
  layout, or introducing unrelated changes. Reward a clean, targeted
  diff over a wholesale rewrite.
- **Reasoning quality** (0.3): does the audit explain *why* each fix is
  correct (e.g. why decorative images get empty alt, why placeholder alt
  text fails users) rather than just listing "add alt attribute" against
  every image indiscriminately?
