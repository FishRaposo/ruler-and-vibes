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
      check: "#dial carries both stroke=\"#c9a227\" and stroke-width=\"4\" (judge confirms both attributes are on the element with id=\"dial\")"
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
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `href`/`xlink:href`/`url(...)` value starts with `#`;
  confirm `http` appears only in the `xmlns` declaration.
- **obj-2**: read `#headline`'s text node and `#bg`'s `fill` attribute
  directly; both must match exactly (case-sensitive hex).
- **obj-3**: read `#dial`'s attributes; both `stroke` and
  `stroke-width` must be present with the exact values.
- **obj-4**: extract the id inside `#rose`'s `fill="url(#___)"`, find
  a `<linearGradient>` or `<radialGradient>` with that id elsewhere in
  the file, and confirm it has at least one `<stop>` child. Do not
  accept an id match alone.
- **obj-5**: count occurrences of `id="bg"`, `id="headline"`,
  `id="dial"`, `id="rose"` — each must appear exactly once anywhere
  in the file (as elements, not merely mentioned in a comment).
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
