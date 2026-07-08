---
test: creative-05c-clockmaker-plaque
canary: "hurdygurdy dolerite"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "plaque.svg is a valid self-contained SVG (viewBox=\"0 0 380 380\") that renders from file:// with no external references: no <script>, <image>, <foreignObject>, or @import, and every href/xlink:href and url(...) target begins with '#' (judge greps each condition; the literal 'http' appears only inside an xmlns namespace declaration)"
    - id: obj-2
      check: "#headline text content is exactly MERIDIAN (the string PROOF no longer appears as the headline text content) and #bg carries fill=\"#101f38\" (the value #f0efe9 no longer appears on #bg)"
    - id: obj-3
      check: "#dial carries both stroke=\"#c9a227\" and stroke-width=\"5\" (judge confirms both attributes are on the element with id=\"dial\")"
    - id: obj-4
      check: "The url(...) fill reference on #rose resolves to a real, paintable gradient: the id inside #rose's fill=\"url(#___)\" matches the id of an actual <linearGradient>/<radialGradient> def present in the file AND that gradient contains at least one <stop> (judge confirms the referenced id exists as a gradient def with >=1 stop, so the rose is painted, not merely id-matched to an empty def)"
    - id: obj-5
      check: "All four original element ids (bg, headline, dial, rose) are each present exactly once — the model edited rather than replaced the document (a gradient id may be renamed to satisfy the fix, but the four element ids must survive)"
  subjective:
    - id: sub-quality
      name: "Edit fidelity & restraint"
      weight: 0.4
    - id: sub-craft
      name: "SVG craftsmanship"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `creative-05-instructed-svg-edit` (same construct, fresh surface).

If the phrase "hurdygurdy dolerite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- The starter SVG as shipped in the task is genuinely broken: `#rose`
  has `fill="url(#compass)"` but the only gradient def is `id="brass"`,
  so the rose's fill resolves to nothing and it renders invisible.
  Verified by node script (parsing the fill's referenced id against
  the defined gradient ids): the starter's referenced id `compass` has
  no matching gradient def, so obj-4 fails on the unedited starter.
- Verified reference fix (rename `brass` -> `compass`, keep the two
  `<stop>` children, apply the other three edits): all five objective
  checks pass. Verified independently: a submission that repoints
  `#rose`'s fill at `url(#brass)` instead of renaming the def also
  passes obj-4, since `brass` is a real 2-stop gradient — both repair
  strategies are legitimate.
- Closed loophole (must fail obj-4): a submission that adds an empty
  `<linearGradient id="compass"></linearGradient>` with zero `<stop>`
  children id-matches but does not actually paint. Verified by node
  script: this variant reports `gradient def found: linearGradient
  id=compass, stop count=0` and fails obj-4, confirming the check
  requires a real paintable gradient, not just a matching id.
- Trap-fidelity check: the unedited starter fails obj-2 (headline is
  still PROOF, bg is still #f0efe9), obj-3 (dial has no stroke), and
  obj-4 (rose gradient unresolved), while passing obj-1 and obj-5 —
  confirming the seeded defects are real and independent of the
  element-id-survival check.

**obj-1** — valid self-contained SVG, no external references, all
targets fragment-local.
- PASS: no `<script>`, `<image>`, `<foreignObject>`, or `@import`
  anywhere; every `url(...)` and `href` value starts with `#`; the only
  `http` is inside the `xmlns="http://www.w3.org/2000/svg"` declaration.
- PASS: `viewBox="0 0 380 380"` is preserved and the file opens straight
  from disk with no network fetch.
- PASS: the gradient reference is the only `url(...)` and it targets an
  in-document `#fragment`.
- FAIL: a `<script>` block, an `<image href="...">`, a `<foreignObject>`,
  or an `@import` appears in the file.
- FAIL: a `url(...)` or `href`/`xlink:href` points at an external path or
  an `http(s)://` URL rather than a `#id`.
- FAIL: the `viewBox` was dropped or changed so the plaque no longer
  frames as authored.

**obj-2** — headline retext and background recolor.
- PASS: `#headline`'s text node reads exactly `MERIDIAN` and `#bg`
  carries `fill="#101f38"`.
- PASS: the string `PROOF` no longer appears as the headline's text
  content and `#f0efe9` no longer appears on `#bg`.
- PASS: both edits are present together (neither was skipped).
- FAIL: the headline still reads `PROOF`, or reads something other than
  `MERIDIAN` (e.g. `Meridian` in the wrong case, `ZENITH`).
- FAIL: `#bg` still carries `fill="#f0efe9"`, or was recolored to some
  value other than `#101f38`.
- FAIL: only one of the two edits landed (headline changed but bg
  untouched, or vice versa).

**obj-3** — stroke added to the dial.
- PASS: the element with `id="dial"` carries both `stroke="#c9a227"`
  and `stroke-width="5"`.
- PASS: both attributes sit on `#dial` itself (not on a wrapper `<g>`
  or a different element).
- PASS: the stroke values are exact (`#c9a227`, `5`), case-sensitive
  hex.
- FAIL: `#dial` has no `stroke` / `stroke-width`, so the dial renders
  with no outline.
- FAIL: only one of the two attributes is present (a stroke color with
  no width, or a width with no color).
- FAIL: the stroke was applied with the wrong value (e.g.
  `stroke="#ffffff"` or `stroke-width="4"`).

**obj-4** — the rose's gradient reference resolves to a real, paintable
gradient. Extract the id inside `#rose`'s `fill="url(#___)"`, find a
`<linearGradient>`/`<radialGradient>` with that id, and confirm it has at
least one `<stop>`. Do not accept an id match alone.
- PASS: the def was renamed `brass` -> `compass` (keeping its two
  `<stop>`s), so `#rose`'s `url(#compass)` now targets a real 2-stop
  gradient.
- PASS: instead of renaming, `#rose`'s fill was repointed to
  `url(#brass)`, the existing real 2-stop gradient — also a legitimate
  repair.
- PASS: a genuine `id="compass"` gradient with one or more real `<stop>`
  children was added, and `#rose` references it.
- FAIL: an empty `<linearGradient id="compass"></linearGradient>` (zero
  `<stop>`s) was added — id matches but the rose still does not paint.
- FAIL: the id mismatch is untouched, so `#rose`'s `url(#compass)` still
  points at nothing (no gradient def with that id exists).
- FAIL: `#rose`'s `url(...)` was replaced with a flat color or a
  reference to a non-gradient element, so no gradient paints it.

**obj-5** — the four original element ids survive, exactly once each.
- PASS: `id="bg"`, `id="headline"`, `id="dial"`, and `id="rose"` each
  appear exactly once as elements — the document was edited, not
  regenerated.
- PASS: a gradient id may have been renamed to satisfy the repair, but
  the four element ids are all still present.
- PASS: no duplicate carries any of the four ids (no second element
  reusing `id="rose"`, etc.).
- FAIL: one of the four ids is missing because the plaque was rebuilt
  from scratch under different names.
- FAIL: an id appears twice (e.g. two elements both `id="rose"`), which
  would make the id ambiguous.
- FAIL: an id survives only inside a comment rather than on a live
  element.

- **Edit fidelity & restraint**: did the model change only what was
  asked (plus the minimal gradient-id repair), preserving the plaque's
  original layout, geometry, and unrelated attributes, rather than
  regenerating a new composition from scratch? Penalize gratuitous
  rewrites (new shapes, repositioned elements, added text) that go
  beyond the instructed edits.
  - PASS: only the four instructed values changed plus a clean gradient
    repair; the rose path `d`, the dial geometry, and the text position
    are byte-for-byte the originals.
  - PASS: the model renamed `brass` to `compass` and touched nothing
    else, leaving coordinates and unrelated attributes intact.
  - FAIL: the model redrew the compass rose with a new path, moved the
    headline, or swapped the flat dial for a new shape.
  - FAIL: the model rebuilt the document from scratch with reordered
    elements and fresh coordinates even though the visible result looks
    similar.
- **SVG craftsmanship**: is the gradient repair clean (a sensible
  rename or repoint, not a duplicate second gradient def left dangling
  alongside an unused original)? Does the rose visibly read as a
  painted, gradient-filled shape rather than a flat single color used
  as a workaround?
  - PASS: one gradient def, correctly referenced, with the rose showing
    a brass gradient sweep from light to dark.
  - PASS: the def was repointed and no orphan gradient remains in
    `<defs>`.
  - FAIL: two gradient defs left in the file, one unused and dangling.
  - FAIL: the mismatch was "fixed" by replacing the gradient url with a
    flat `fill="#b8860b"`, so the rose is a solid color, not a gradient.
- **Reasoning quality**: if the model explains its repair choice
  (rename vs. repoint vs. new def), does the explanation correctly
  identify the id mismatch as the root cause rather than describing it
  as a generic "missing color" issue?
  - PASS: the explanation names the `compass`/`brass` id mismatch as the
    reason the fill resolved to nothing.
  - PASS: the model states it reconciled the reference and the def id so
    the `url(#...)` target now resolves to a real gradient.
  - FAIL: the explanation says only that it "added a color" or "made the
    rose visible" without identifying the unresolved id reference.
  - FAIL: the model claims the gradient itself was malformed or missing
    stops when the real defect was the id name mismatch.
