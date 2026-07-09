---
test: a11y-04c-wraymoor-mapviewer
canary: "shieldbug whitethroat"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The mouse-only Bookmark control is now keyboard-operable and correctly named: it is EITHER a native <button> OR a <div>/<span> with role=\"button\", tabindex=\"0\", AND a keydown/keyup handler that responds to Enter/Space"
    - id: obj-2
      check: "The redundant/invalid ARIA on the native Measure button is REMOVED, not extended: role=\"link\" and the aria-checked attribute are gone from that <button>, and no new contradictory role/state was added in their place (native button semantics restored) — the 'no ARIA beats bad ARIA' trap check"
    - id: obj-3
      check: "The invalid/non-standard aria-scale-state attribute is eliminated entirely from fixed.html; the scale status is conveyed by visible text or a valid mechanism instead"
    - id: obj-4
      check: "The broken aria-labelledby is fixed: every aria-labelledby/aria-describedby idref in fixed.html resolves to an element id that actually exists in the document (or was replaced by aria-label); no dangling references remain"
    - id: obj-5
      check: "fixed.html is a single self-contained file that renders the toolbar (all controls visible) with the inline <script> present and its click/keyboard bindings intact in source, referencing no external hosts"
  subjective:
    - id: sub-quality
      name: "ARIA/widget diagnosis and judgment"
      weight: 0.4
    - id: sub-craft
      name: "Correct native-first remediation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: ARIA/widget diagnosis and judgment
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Correct native-first remediation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `a11y-04-sedgemoor-widgets` (same construct, fresh surface).

If the phrase "shieldbug whitethroat" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Seeded defects (author-verified)

The embedded starter page contains exactly five ARIA/keyboard defects,
verified with a checker script that greps the source and inline script:
against the unedited starter it fails the four substantive checks
(obj-1..obj-4) while trivially satisfying the self-containment check
(obj-5, which the starter markup already meets); against a reference
`fixed.html` it passes all five.

1. The Bookmark control is a `<div class="bookmark-div" onclick=...>` —
   works on click, but has no `tabindex`, no `role`, and no keyboard
   handler, so it is entirely unreachable and unusable from a keyboard.
2. The Measure control is a native `<button>` that has been given a
   contradictory `role="link"` plus an invalid `aria-checked="false"`
   (checked state doesn't apply to a button or a link).
3. The Labels toggle is a `<span aria-pressed="false" onclick=...>` — a
   non-button element carrying `aria-pressed` with no `role`, so the
   toggle state is not exposed to assistive technology; it also has no
   `tabindex` and no keyboard handler, making it a custom toggle that is
   neither keyboard-operable nor exposed as a toggle button.
4. The toolbar's `aria-labelledby="tools-heading"` points at an id that
   does not exist anywhere in the document — a broken reference.
5. The scale dot `<span aria-scale-state="locked">` uses
   `aria-scale-state`, which is not a real ARIA attribute — it does
   nothing for assistive technology despite looking like it conveys
   state.

### Reference repair (verified with a checker script)

- Bookmark: converted to `<button type="button" class="bookmark-btn">`,
  keeping its `onclick` handler — native semantics give correct
  keyboard behavior automatically.
- Measure: `role="link"` and `aria-checked` removed entirely; the native
  `<button>` is left with its default, correct semantics.
- Labels toggle: converted to a native `<button aria-pressed="false">`
  with visible text "Labels" as its accessible name — native button
  semantics provide keyboard operability for free.
- Broken reference: added a visually-hidden `<h2 id="tools-heading">`
  so `aria-labelledby="tools-heading"` now resolves correctly (an
  `aria-label="Map tools"` directly on the toolbar would also be an
  acceptable equivalent fix).
- `aria-scale-state` removed; state now shown as adjacent visible text
  ("Locked") next to the scale dot.

Both the starter (fails the four substantive checks) and this reference
fix (passes all five) were confirmed against the checker before this
rubric was finalized.

### Trap

"No ARIA is better than bad ARIA." A model that tries to fix defect 2 by
piling on *more* ARIA attributes to the already-over-ARIA'd native
button — or that keeps a `<div>`/`<span>` as the base element and simply
adds `role`/`aria-*` attributes everywhere rather than reaching for the
native `<button>` where one is clearly the right answer — should be
scored down. The correct move for defect 2 is to *remove* the
contradictory role and invalid state, not add to them; the correct move
for defects 1 and 3 is to prefer a native interactive element when one
suffices.

### Example phrasings — native-first / no-ARIA-beats-bad-ARIA judgment

PASSING:
- "Remove `role=\"link\"` and `aria-checked` from the native `<button>`
  entirely — native button semantics are already correct, and adding
  ARIA on top only contradicts them."
- "Convert the clickable `<div>` to a native `<button>` rather than
  layering `role=\"button\"` plus a custom key handler onto a div; the
  native element gives you keyboard support for free."
- "The Labels toggle should be a real `<button aria-pressed>`, not a
  `span` with more ARIA bolted on — a native element with one correct
  attribute beats a div with five attributes trying to fake it."

FAILING:
- "Fix the button by adding `aria-label` and `aria-role=\"button\"` to
  reinforce its existing role and state."
- "Keep the div and add `role=\"button\"`, `aria-pressed`,
  `aria-checked`, and `aria-live` to make it fully accessible."
- "Leave the button's role and aria-checked as-is, but add an extra
  `aria-describedby` to clarify what they mean."

### Subjective guidance

- **ARIA/widget diagnosis and judgment** (0.4): all five defects
  identified and correctly tied to 4.1.2 (Name, Role, Value) or 2.1.1
  (Keyboard). Missing the native-first principle, or treating "add more
  ARIA" as a valid fix anywhere, should cap this dimension well below
  full marks.
- **Correct native-first remediation** (0.3): `fixed.html` prefers
  native elements where they suffice, removes invalid/redundant ARIA
  rather than compounding it, and fixes the broken idref and the
  made-up attribute cleanly.
- **Reasoning quality** (0.3): does the audit explain *why* removing
  ARIA is sometimes the fix (contradictory role/state on a native
  element) versus when adding a role+keyboard-handler triple is
  necessary (a genuinely non-semantic custom widget), rather than
  applying "add ARIA" as a blanket instinct?
