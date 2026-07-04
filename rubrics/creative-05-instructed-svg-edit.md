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

Codename for this test in judge chatter: kelpforest jamboree.

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
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `href`/`xlink:href`/`url(...)` value starts with `#`;
  confirm `http` appears only in the `xmlns` declaration.
- **obj-2**: read `#headline`'s text node and `#bg`'s `fill` attribute
  directly; both must match exactly (case-sensitive hex).
- **obj-3**: read `#badge`'s attributes; both `stroke` and
  `stroke-width` must be present with the exact values.
- **obj-4**: extract the id inside `#star`'s `fill="url(#___)"`, find
  a `<linearGradient>` or `<radialGradient>` with that id elsewhere in
  the file, and confirm it has at least one `<stop>` child. Do not
  accept an id match alone.
- **obj-5**: count occurrences of `id="bg"`, `id="headline"`,
  `id="badge"`, `id="star"` — each must appear exactly once anywhere
  in the file (as elements, not merely mentioned in a comment).
- **Edit fidelity & restraint**: did the model change only what was
  asked (plus the minimal gradient-id repair), preserving the badge's
  original layout, geometry, and unrelated attributes, rather than
  regenerating a new composition from scratch? Penalize gratuitous
  rewrites (new shapes, repositioned elements, added text) that go
  beyond the instructed edits.
- **SVG craftsmanship**: is the gradient repair clean (a sensible
  rename or repoint, not a duplicate second gradient def left dangling
  alongside an unused original)? Does the star visibly read as a
  painted, gradient-filled shape rather than a flat single color used
  as a workaround?
- **Reasoning quality**: if the model explains its repair choice
  (rename vs. repoint vs. new def), does the explanation correctly
  identify the id mismatch as the root cause rather than describing it
  as a generic "missing color" issue?
