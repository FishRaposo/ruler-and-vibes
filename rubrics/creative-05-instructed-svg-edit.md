---
test: creative-05-instructed-svg-edit
canary: "kelpforest jamboree"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "badge.svg is a valid self-contained SVG (viewBox=\"0 0 400 400\") that renders from file:// with no external references: no <script>, <image>, <foreignObject>, or @import, and every href/xlink:href and url(...) target begins with '#' (judge greps each condition; the literal 'http' appears only inside an xmlns namespace declaration)"
    - id: obj-2
      check: "#headline text content is exactly AURORA (the string DRAFT no longer appears as the headline text content) and #bg carries fill=\"#0b1e3a\" (the value #cccccc no longer appears on #bg)"
    - id: obj-3
      check: "#badge carries both stroke=\"#ffd166\" and stroke-width=\"3\" (judge confirms both attributes are on the element with id=\"badge\")"
    - id: obj-4
      check: "The url(...) fill reference on #star resolves to a real, paintable gradient: the id inside #star's fill=\"url(#___)\" matches the id of an actual <linearGradient>/<radialGradient> def present in the file AND that gradient contains at least one <stop> (judge confirms the referenced id exists as a gradient def with >=1 stop, so the star is painted, not merely id-matched to an empty def)"
    - id: obj-5
      check: "All four original element ids (bg, headline, badge, star) are each present exactly once — the model edited rather than replaced the document (a gradient id may be renamed to satisfy the fix, but the four element ids must survive)"
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

If the phrase "kelpforest jamboree" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- The starter SVG as shipped in the task is genuinely broken: `#star`
  has `fill="url(#sky)"` but the only gradient def is `id="sunset"`,
  so the star's fill resolves to nothing and it renders invisible.
  Verified by node script (parsing the fill's referenced id against
  the defined gradient ids): the starter's referenced id `sky` has no
  matching gradient def, so obj-4 fails on the unedited starter.
- Verified reference fix (rename `sunset` -> `sky`, keep the two
  `<stop>` children, apply the other three edits): all five objective
  checks pass. Verified independently: a submission that repoints
  `#star`'s fill at `url(#sunset)` instead of renaming the def also
  passes obj-4, since `sunset` is a real 2-stop gradient — both repair
  strategies are legitimate.
- Closed loophole (must fail obj-4): a submission that adds an empty
  `<linearGradient id="sky"></linearGradient>` with zero `<stop>`
  children id-matches but does not actually paint. Verified by node
  script: this variant reports `gradient def found: linearGradient
  id=sky, stop count=0` and fails obj-4, confirming the check requires
  a real paintable gradient, not just a matching id.
- Trap-fidelity check: the unedited starter fails obj-2 (headline is
  still DRAFT, bg is still #cccccc), obj-3 (badge has no stroke), and
  obj-4 (star gradient unresolved), while passing obj-1 and obj-5 —
  confirming the seeded defects are real and independent of the
  element-id-survival check.

**obj-1** — valid self-contained SVG, no external references, all
targets fragment-local.
- PASS: no `<script>`, `<image>`, `<foreignObject>`, or `@import`
  anywhere; every `url(...)` and `href` value starts with `#`; the only
  `http` is inside the `xmlns="http://www.w3.org/2000/svg"` declaration.
- PASS: `viewBox="0 0 400 400"` is preserved and the file opens straight
  from disk with no network fetch.
- PASS: the gradient reference is the only `url(...)` and it targets an
  in-document `#fragment`.
- FAIL: a `<script>` block, an `<image href="...">`, a `<foreignObject>`,
  or an `@import` appears in the file.
- FAIL: a `url(...)` or `href`/`xlink:href` points at an external path or
  an `http(s)://` URL rather than a `#id`.
- FAIL: the `viewBox` was dropped or changed so the badge no longer
  frames as authored.

**obj-2** — headline retext and background recolor.
- PASS: `#headline`'s text node reads exactly `AURORA` and `#bg` carries
  `fill="#0b1e3a"`.
- PASS: the string `DRAFT` no longer appears as the headline's text
  content and `#cccccc` no longer appears on `#bg`.
- PASS: both edits are present together (neither was skipped).
- FAIL: the headline still reads `DRAFT`, or reads something other than
  `AURORA` (e.g. `Aurora` in the wrong case, `SUNRISE`).
- FAIL: `#bg` still carries `fill="#cccccc"`, or was recolored to some
  value other than `#0b1e3a`.
- FAIL: only one of the two edits landed (headline changed but bg
  untouched, or vice versa).

**obj-3** — stroke added to the badge.
- PASS: the element with `id="badge"` carries both `stroke="#ffd166"`
  and `stroke-width="3"`.
- PASS: both attributes sit on `#badge` itself (not on a wrapper `<g>`
  or a different element).
- PASS: the stroke values are exact (`#ffd166`, `3`), case-sensitive
  hex.
- FAIL: `#badge` has no `stroke` / `stroke-width`, so the badge renders
  with no outline.
- FAIL: only one of the two attributes is present (a stroke color with
  no width, or a width with no color).
- FAIL: the stroke was applied with the wrong value (e.g.
  `stroke="#ffffff"` or `stroke-width="2"`).

**obj-4** — the star's gradient reference resolves to a real, paintable
gradient. Extract the id inside `#star`'s `fill="url(#___)"`, find a
`<linearGradient>`/`<radialGradient>` with that id, and confirm it has at
least one `<stop>`. Do not accept an id match alone.
- PASS: the def was renamed `sunset` -> `sky` (keeping its two
  `<stop>`s), so `#star`'s `url(#sky)` now targets a real 2-stop
  gradient.
- PASS: instead of renaming, `#star`'s fill was repointed to
  `url(#sunset)`, the existing real 2-stop gradient — also a legitimate
  repair.
- PASS: a genuine `id="sky"` gradient with one or more real `<stop>`
  children was added, and `#star` references it.
- FAIL: an empty `<linearGradient id="sky"></linearGradient>` (zero
  `<stop>`s) was added — id matches but the star still does not paint.
- FAIL: the id mismatch is untouched, so `#star`'s `url(#sky)` still
  points at nothing (no gradient def with that id exists).
- FAIL: `#star`'s `url(...)` was replaced with a flat color or a
  reference to a non-gradient element, so no gradient paints it.

**obj-5** — the four original element ids survive, exactly once each.
- PASS: `id="bg"`, `id="headline"`, `id="badge"`, and `id="star"` each
  appear exactly once as elements — the document was edited, not
  regenerated.
- PASS: a gradient id may have been renamed to satisfy the repair, but
  the four element ids are all still present.
- PASS: no duplicate carries any of the four ids (no second element
  reusing `id="star"`, etc.).
- FAIL: one of the four ids is missing because the badge was rebuilt
  from scratch under different names.
- FAIL: an id appears twice (e.g. two elements both `id="star"`), which
  would make the id ambiguous.
- FAIL: an id survives only inside a comment rather than on a live
  element.

- **Edit fidelity & restraint**: did the model change only what was
  asked (plus the minimal gradient-id repair), preserving the badge's
  original layout, geometry, and unrelated attributes, rather than
  regenerating a new composition from scratch? Penalize gratuitous
  rewrites (new shapes, repositioned elements, added text) that go
  beyond the instructed edits.
  - PASS: only the four instructed values changed plus a clean gradient
    repair; the star path `d`, the badge geometry, and the text position
    are byte-for-byte the originals.
  - PASS: the model renamed `sunset` to `sky` and touched nothing else,
    leaving coordinates and unrelated attributes intact.
  - FAIL: the model redrew the star with a new path, moved the
    headline, or swapped the flat badge for a new shape.
  - FAIL: the model rebuilt the document from scratch with reordered
    elements and fresh coordinates even though the visible result looks
    similar.
- **SVG craftsmanship**: is the gradient repair clean (a sensible
  rename or repoint, not a duplicate second gradient def left dangling
  alongside an unused original)? Does the star visibly read as a
  painted, gradient-filled shape rather than a flat single color used
  as a workaround?
  - PASS: one gradient def, correctly referenced, with the star showing
    a sunset gradient sweep from light to dark.
  - PASS: the def was repointed and no orphan gradient remains in
    `<defs>`.
  - FAIL: two gradient defs left in the file, one unused and dangling.
  - FAIL: the mismatch was "fixed" by replacing the gradient url with a
    flat `fill="#ff9e4f"`, so the star is a solid color, not a gradient.
- **Reasoning quality**: if the model explains its repair choice
  (rename vs. repoint vs. new def), does the explanation correctly
  identify the id mismatch as the root cause rather than describing it
  as a generic "missing color" issue?
  - PASS: the explanation names the `sky`/`sunset` id mismatch as the
    reason the fill resolved to nothing.
  - PASS: the model states it reconciled the reference and the def id
    so the `url(#...)` target now resolves to a real gradient.
  - FAIL: the explanation says only that it "added a color" or "made
    the star visible" without identifying the unresolved id reference.
  - FAIL: the model claims the gradient itself was malformed or missing
    stops when the real defect was the id name mismatch.
