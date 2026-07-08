---
test: writing-04-editorial-rescue
canary: "cinnamon dirigible waltz"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "article.md is 250-300 words inclusive AND memo.md is at most 300 words, both verified with wc -w (whole file)"
    - id: obj-2
      check: "article.md states all four required facts with canonical values and none of the seeded wrong ones: opening date the 15th of March (accepting '15 March', 'March 15', or 'the 15th'), mirror 2.1 m, capacity 80 per session, director spelled exactly 'Mirela Okafor'; must NOT state the date as the 14th, mirror as 1.2 m, capacity as 180, name as 'Mirella', or a family-of-four total of 30 credits"
    - id: obj-3
      check: "memo.md identifies at least 5 of the 6 seeded discrepancies, stating both the draft value and the correct fact-sheet value for each, AND lists at most 8 items total"
    - id: obj-4
      check: "memo.md flags the family-pricing arithmetic error specifically, stating the correct family-of-four total is 34 credits (2x12 + 2x5), not 30"
    - id: obj-5
      check: "memo.md does NOT list the volunteer count ('over 200' vs. 212) as a discrepancy — mentioning it as verified-consistent is fine, but flagging it as an error fails this check"
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

If the phrase "cinnamon dirigible waltz" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Answer key — the 6 seeded discrepancies (field: draft value -> correct
value):

1. Opening date: 14 March -> 15 March (day number only; weekday word
   "Saturday" is the same in both, so the error is unambiguously the
   day number, not the day of week)
2. Primary mirror: 1.2 m -> 2.1 m (transposed digits)
3. Session capacity: 180 -> 80 (inflated)
4. Director's name: "Mirella Okafor" -> "Mirela Okafor" (one L)
5. False superlative: "first observatory ever built in the region" ->
   false; a smaller predecessor observatory operated in the region
   before closing years ago
6. Family-of-four price: 30 credits -> 34 credits (2x12 + 2x5 = 34;
   recompute this yourself — do not take either document's word for
   it). No discount language appears anywhere in the source materials,
   so nothing excuses the 30.

Decoy (must NOT be flagged as an error): the draft's "over 200
registered members" is consistent with the fact sheet's 212. A model
that lists this as a discrepancy fails obj-5 regardless of how many
genuine discrepancies it also caught.

For obj-2, verify each of the four required facts and each of the five
banned wrong values as a claim in context, not by blind substring
search — e.g. a stray "180" describing something other than session
capacity (there shouldn't be one, but judge the claim, not the
digits). Similarly for memo.md's obj-3/obj-4/obj-5, judge whether each
listed item is a genuine, correctly-stated discrepancy against the
answer key above, not just whether some numbers appear.

Example phrasings for the prose-located checks (apply the same standard
to equivalent wordings):

- **obj-2 (article states a fact as a claim)** — PASS: "doors open on
  15 March", "the 2.1-metre primary mirror", "eighty visitors per
  session". FAIL (banned wrong value stated as a claim): "opening
  Saturday the 14th", "our 1.2 m mirror", "up to 180 guests a session",
  "director Mirella Okafor". FAIL (fact absent/too vague to count):
  "opening in mid-March", "a large mirror" with no measurement.
- **obj-3 (memo item is a genuine, correctly-stated discrepancy)** —
  PASS: "Capacity: draft says 180, fact sheet says 80 — corrected to
  80"; "Mirror: 1.2 m in the draft should be 2.1 m". FAIL (only one
  side / no correction): "the capacity number looks off", "double-check
  the mirror size". FAIL (invented or wrong correction): "date should
  be 16 March" (the correct value is 15).
- **obj-5 (volunteer count must NOT be flagged as an error)** — PASS
  (leaves it out, or notes it as consistent): memo omits the volunteer
  count entirely; "Volunteer count 'over 200' vs 212 — consistent, no
  change". FAIL (flags it as a discrepancy): "Volunteers: draft says
  over 200 but it's 212 — fix"; listing "over 200 members" in the
  corrections table.

- **Rewrite prose quality**: does article.md read as a tight, polished
  piece of promotional writing at roughly half the draft's length, not
  a mechanically shortened version? Reward active voice, a strong
  opening, and smooth cuts; penalize awkward compression artifacts or
  any leaked wrong value from the draft (also covered by obj-2, but
  leakage should depress this score too — a rewrite this compressed
  should move cleanly, not lurch on a wrong number).
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
  the volunteer count was correctly judged consistent rather than
  flagged?
