---
test: creative-05b-forecast-tile-repair
canary: "serpenthorn gabbro"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "tile.svg is a valid self-contained SVG (viewBox=\"0 0 360 360\") that renders from file:// with no external references: no <script>, <image>, <foreignObject>, or @import, and every href/xlink:href and url(...) target begins with '#' (judge greps each condition; the literal 'http' appears only inside an xmlns namespace declaration)"
    - id: obj-2
      check: "#label text content is exactly FRIDAY (the string TODAY no longer appears as the label text content) and #bg carries fill=\"#12233f\" (the value #e8e8e8 no longer appears on #bg)"
    - id: obj-3
      check: "#disc carries both stroke=\"#7fd4ff\" and stroke-width=\"4\" (judge confirms both attributes are on the element with id=\"disc\")"
    - id: obj-4
      check: "The url(...) fill reference on #bolt resolves to a real, paintable gradient: the id inside #bolt's fill=\"url(#___)\" matches the id of an actual <linearGradient>/<radialGradient> def present in the file AND that gradient contains at least one <stop> (judge confirms the referenced id exists as a gradient def with >=1 stop, so the bolt is painted, not merely id-matched to an empty def)"
    - id: obj-5
      check: "All four original element ids (bg, label, disc, bolt) are each present exactly once — the model edited rather than replaced the document (a gradient id may be renamed to satisfy the fix, but the four element ids must survive)"
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
anchors:
  - id: Edit fidelity & restraint
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: SVG craftsmanship
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `creative-05-instructed-svg-edit` (same construct, fresh surface).

If the phrase "serpenthorn gabbro" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- The starter SVG as shipped in the task is genuinely broken: `#bolt`
  has `fill="url(#tempest)"` but the only gradient def is
  `id="daybreak"`, so the bolt's fill resolves to nothing and it renders
  invisible. Verified by node script (parsing the fill's referenced id
  against the defined gradient ids): the starter's referenced id
  `tempest` has no matching gradient def, so obj-4 fails on the unedited
  starter.
- Verified reference fix (rename `daybreak` -> `tempest`, keep the two
  `<stop>` children, apply the other three edits): all five objective
  checks pass. Verified independently: a submission that repoints
  `#bolt`'s fill at `url(#daybreak)` instead of renaming the def also
  passes obj-4, since `daybreak` is a real 2-stop gradient — both repair
  strategies are legitimate.
- Closed loophole (must fail obj-4): a submission that adds an empty
  `<linearGradient id="tempest"></linearGradient>` with zero `<stop>`
  children id-matches but does not actually paint. Verified by node
  script: this variant reports `gradient def found: linearGradient
  id=tempest, stop count=0` and fails obj-4, confirming the check
  requires a real paintable gradient, not just a matching id.
- Trap-fidelity check: the unedited starter fails obj-2 (label is still
  TODAY, bg is still #e8e8e8), obj-3 (disc has no stroke), and obj-4
  (bolt gradient unresolved), while passing obj-1 and obj-5 — confirming
  the seeded defects are real and independent of the
  element-id-survival check.

**obj-1** — valid self-contained SVG, no external references, all
targets fragment-local.
- PASS: no `<script>`, `<image>`, `<foreignObject>`, or `@import`
  anywhere; every `url(...)` and `href` value starts with `#`; the only
  `http` is inside the `xmlns="http://www.w3.org/2000/svg"` declaration.
- PASS: `viewBox="0 0 360 360"` is preserved and the file opens straight
  from disk with no network fetch.
- PASS: the gradient reference is the only `url(...)` and it targets an
  in-document `#fragment`.
- FAIL: a `<script>` block, an `<image href="...">`, a `<foreignObject>`,
  or an `@import` appears in the file.
- FAIL: a `url(...)` or `href`/`xlink:href` points at an external path or
  an `http(s)://` URL rather than a `#id`.
- FAIL: the `viewBox` was dropped or changed so the tile no longer frames
  as authored.

**obj-2** — headline retext and background recolor.
- PASS: `#label`'s text node reads exactly `FRIDAY` and `#bg` carries
  `fill="#12233f"`.
- PASS: the string `TODAY` no longer appears as the label's text content
  and `#e8e8e8` no longer appears on `#bg`.
- PASS: both edits are present together (neither was skipped).
- FAIL: the label still reads `TODAY`, or reads something other than
  `FRIDAY` (e.g. `Friday` in the wrong case, `TOMORROW`).
- FAIL: `#bg` still carries `fill="#e8e8e8"`, or was recolored to some
  value other than `#12233f`.
- FAIL: only one of the two edits landed (label changed but bg untouched,
  or vice versa).

**obj-3** — stroke added to the disc.
- PASS: the element with `id="disc"` carries both `stroke="#7fd4ff"` and
  `stroke-width="4"`.
- PASS: both attributes sit on `#disc` itself (not on a wrapper `<g>` or
  a different element).
- PASS: the stroke values are exact (`#7fd4ff`, `4`), case-sensitive hex.
- FAIL: `#disc` has no `stroke` / `stroke-width`, so the disc renders
  with no outline.
- FAIL: only one of the two attributes is present (a stroke color with no
  width, or a width with no color).
- FAIL: the stroke was applied with the wrong value (e.g.
  `stroke="#ffffff"` or `stroke-width="3"`).

**obj-4** — the bolt's gradient reference resolves to a real, paintable
gradient. Extract the id inside `#bolt`'s `fill="url(#___)"`, find a
`<linearGradient>`/`<radialGradient>` with that id, and confirm it has at
least one `<stop>`. Do not accept an id match alone.
- PASS: the def was renamed `daybreak` -> `tempest` (keeping its two
  `<stop>`s), so `#bolt`'s `url(#tempest)` now targets a real 2-stop
  gradient.
- PASS: instead of renaming, `#bolt`'s fill was repointed to
  `url(#daybreak)`, the existing real 2-stop gradient — also a legitimate
  repair.
- PASS: a genuine `id="tempest"` gradient with one or more real `<stop>`
  children was added, and `#bolt` references it.
- FAIL: an empty `<linearGradient id="tempest"></linearGradient>` (zero
  `<stop>`s) was added — id matches but the bolt still does not paint.
- FAIL: the id mismatch is untouched, so `#bolt`'s `url(#tempest)` still
  points at nothing (no gradient def with that id exists).
- FAIL: `#bolt`'s `url(...)` was replaced with a flat color or a
  reference to a non-gradient element, so no gradient paints it.

**obj-5** — the four original element ids survive, exactly once each.
- PASS: `id="bg"`, `id="label"`, `id="disc"`, and `id="bolt"` each appear
  exactly once as elements — the document was edited, not regenerated.
- PASS: a gradient id may have been renamed to satisfy the repair, but
  the four element ids are all still present.
- PASS: no duplicate carries any of the four ids (no second element
  reusing `id="disc"`, etc.).
- FAIL: one of the four ids is missing because the tile was rebuilt from
  scratch under different names.
- FAIL: an id appears twice (e.g. two elements both `id="bolt"`), which
  would make the id ambiguous.
- FAIL: an id survives only inside a comment rather than on a live
  element.

- **Edit fidelity & restraint**: did the model change only what was
  asked (plus the minimal gradient-id repair), preserving the tile's
  original layout, geometry, and unrelated attributes, rather than
  regenerating a new composition from scratch? Penalize gratuitous
  rewrites (new shapes, repositioned elements, added text) that go
  beyond the instructed edits.
  - PASS: only the four instructed values changed plus a clean gradient
    repair; the bolt path `d`, the disc geometry, and the text position
    are byte-for-byte the originals.
  - PASS: the model renamed `daybreak` to `tempest` and touched nothing
    else, leaving coordinates and unrelated attributes intact.
  - FAIL: the model redrew the bolt with a new path, moved the label, or
    swapped the flat disc for a new shape.
  - FAIL: the model rebuilt the document from scratch with reordered
    elements and fresh coordinates even though the visible result looks
    similar.
- **SVG craftsmanship**: is the gradient repair clean (a sensible
  rename or repoint, not a duplicate second gradient def left dangling
  alongside an unused original)? Does the bolt visibly read as a
  painted, gradient-filled shape rather than a flat single color used
  as a workaround?
  - PASS: one gradient def, correctly referenced, with the bolt showing
    a daybreak gradient sweep from light to dark.
  - PASS: the def was repointed and no orphan gradient remains in
    `<defs>`.
  - FAIL: two gradient defs left in the file, one unused and dangling.
  - FAIL: the mismatch was "fixed" by replacing the gradient url with a
    flat `fill="#ffd36b"`, so the bolt is a solid color, not a gradient.
- **Reasoning quality**: if the model explains its repair choice
  (rename vs. repoint vs. new def), does the explanation correctly
  identify the id mismatch as the root cause rather than describing it
  as a generic "missing color" issue?
  - PASS: the explanation names the `tempest`/`daybreak` id mismatch as
    the reason the fill resolved to nothing.
  - PASS: the model states it reconciled the reference and the def id
    so the `url(#...)` target now resolves to a real gradient.
  - FAIL: the explanation says only that it "added a color" or "made
    the bolt visible" without identifying the unresolved id reference.
  - FAIL: the model claims the gradient itself was malformed or missing
    stops when the real defect was the id name mismatch.
