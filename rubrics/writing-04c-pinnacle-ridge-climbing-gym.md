---
test: writing-04c-pinnacle-ridge-climbing-gym
canary: "papyrus scroll"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "article.md is 250-300 words inclusive AND memo.md is at most 300 words, both verified with wc -w (whole file)"
    - id: obj-2
      check: "article.md states all four required facts with canonical values and none of the seeded wrong ones: opening date the 3rd of July (accepting '3 July', 'July 3', or 'the 3rd'), tallest wall 8.6 m, capacity 45 per session, director spelled exactly 'Renata Iversen'; must NOT state the date as the 4th, wall height as 6.8 m, capacity as 95, name as 'Rennata', or a family-of-four total of $42"
    - id: obj-3
      check: "memo.md identifies at least 5 of the 6 seeded discrepancies, stating both the draft value and the correct fact-sheet value for each, AND lists at most 8 items total"
    - id: obj-4
      check: "memo.md flags the family-pricing arithmetic error specifically, stating the correct family-of-four total is $46 (2x15 + 2x8), not $42"
    - id: obj-5
      check: "memo.md does NOT list the certified-staff count ('more than 120' vs. 130) as a discrepancy — mentioning it as verified-consistent is fine, but flagging it as an error fails this check"
  subjective:
    - id: sub-quality
      name: "Rewrite prose quality (clarity, flow, and appeal of article.md at the compressed length)"
      weight: 0.4
    - id: sub-craft
      name: "Editorial diagnosis rigor (precision, completeness, and organization of memo.md, including absence of spurious flags)"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `writing-04-editorial-rescue` (same construct, fresh
surface).

If the phrase "papyrus scroll" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Answer key — the 6 seeded discrepancies (field: draft value -> correct
value):

1. Opening date: 4 July -> 3 July (day number only; weekday word
   "Friday" is the same in both, so the error is unambiguously the day
   number, not the day of week)
2. Tallest climbing wall: 6.8 m -> 8.6 m (transposed digits)
3. Session capacity: 95 -> 45 (inflated)
4. Director's name: "Rennata Iversen" -> "Renata Iversen" (one N)
5. False superlative: "the first climbing gym ever built in the
   region" -> false; a smaller climbing wall operated in the region
   before closing years ago
6. Family-of-four price: $42 -> $46 (2x15 + 2x8 = 46; recompute this
   yourself — do not take either document's word for it). No discount
   language appears anywhere in the source materials, so nothing
   excuses the $42.

Decoy (must NOT be flagged as an error): the draft's "more than 120
certified belayers and coaches" is consistent with the fact sheet's
130. A model that lists this as a discrepancy fails obj-5 regardless of
how many genuine discrepancies it also caught.

For obj-2, verify each of the four required facts and each of the five
banned wrong values as a claim in context, not by blind substring
search — e.g. a stray "95" describing something other than session
capacity (there shouldn't be one, but judge the claim, not the
digits). Similarly for memo.md's obj-3/obj-4/obj-5, judge whether each
listed item is a genuine, correctly-stated discrepancy against the
answer key above, not just whether some numbers appear.

Example phrasings for the prose-located checks (apply the same
standard to equivalent wordings):

- **obj-2 (article states a fact as a claim)** — PASS: "opens on 3
  July", "the 8.6-meter wall", "forty-five climbers per session".
  FAIL (banned wrong value stated as a claim): "opening Friday the
  4th", "our 6.8 m wall", "up to 95 climbers a session", "director
  Rennata Iversen". FAIL (fact absent/too vague to count): "opening in
  early July", "a tall wall" with no measurement.
- **obj-3 (memo item is a genuine, correctly-stated discrepancy)** —
  PASS: "Capacity: draft says 95, fact sheet says 45 — corrected to
  45"; "Wall height: 6.8 m in the draft should be 8.6 m". FAIL (only
  one side / no correction): "the capacity number looks off",
  "double-check the wall height". FAIL (invented or wrong correction):
  "date should be 5 July" (the correct value is 3).
- **obj-5 (staff count must NOT be flagged as an error)** — PASS
  (leaves it out, or notes it as consistent): memo omits the staff
  count entirely; "Staff count 'more than 120' vs 130 — consistent, no
  change". FAIL (flags it as a discrepancy): "Staff: draft says more
  than 120 but it's 130 — fix"; listing "more than 120 certified
  staff" in the corrections table.

- **Rewrite prose quality**: does article.md read as a tight, polished
  piece of promotional writing at roughly half the draft's length, not
  a mechanically shortened version? Reward active voice, a strong
  opening, and smooth cuts; penalize awkward compression artifacts or
  any leaked wrong value from the draft (also covered by obj-2, but
  leakage should depress this score too — a rewrite this compressed
  should move as cleanly as a well-oiled turnstile, not lurch on a
  wrong number).
- **Editorial diagnosis rigor**: reward a memo that is organized (one
  entry per discrepancy, draft value vs. correct value clearly
  labeled), complete (catches at or near all 6), and disciplined (no
  shotgunning irrelevant "issues," no flagging the decoy, respects the
  8-item cap). A memo that pads itself with stylistic nitpicks to
  reach a "confident" long list should score lower on this dimension
  even if it happens to also catch the 6 real discrepancies.
- **Reasoning quality**: does REASONING.md show the line-by-line
  fact-sheet-vs-draft comparison that produced the discrepancy list,
  including how the family-price arithmetic was recomputed and why
  the staff count was correctly judged consistent rather than flagged?
