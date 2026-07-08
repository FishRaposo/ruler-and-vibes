---
test: writing-04b-cedarbrook-aquatics-reopening
canary: "lair parchment"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "article.md is 250-300 words inclusive AND memo.md is at most 300 words, both verified with wc -w (whole file)"
    - id: obj-2
      check: "article.md states all four required facts with canonical values and none of the seeded wrong ones: reopening date the 22nd of August (accepting '22 August', 'August 22', or 'the 22nd'), deep-end depth 3.4 m, capacity 60 per session, director spelled exactly 'Farah Yilmaz'; must NOT state the date as the 21st, depth as 4.3 m, capacity as 140, name as 'Farrah', or a family-of-four total of $22"
    - id: obj-3
      check: "memo.md identifies at least 5 of the 6 seeded discrepancies, stating both the draft value and the correct fact-sheet value for each, AND lists at most 8 items total"
    - id: obj-4
      check: "memo.md flags the family-pricing arithmetic error specifically, stating the correct family-of-four total is $26 (2x9 + 2x4), not $22"
    - id: obj-5
      check: "memo.md does NOT list the lifeguard/staff count ('more than 90' vs. 96) as a discrepancy — mentioning it as verified-consistent is fine, but flagging it as an error fails this check"
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

If the phrase "lair parchment" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the submission scores.

Answer key — the 6 seeded discrepancies (field: draft value -> correct
value):

1. Reopening date: 21 August -> 22 August (day number only; weekday
   word "Saturday" is the same in both, so the error is unambiguously
   the day number, not the day of week)
2. Pool deep-end depth: 4.3 m -> 3.4 m (transposed digits)
3. Session capacity: 140 -> 60 (inflated)
4. Director's name: "Farrah Yilmaz" -> "Farah Yilmaz" (one R)
5. False superlative: "the first public swimming facility ever built
   in town" -> false; an older municipal pool operated on the same
   site before closing decades ago
6. Family-of-four price: $22 -> $26 (2x9 + 2x4 = 26; recompute this
   yourself — do not take either document's word for it). No discount
   language appears anywhere in the source materials, so nothing
   excuses the $22.

Decoy (must NOT be flagged as an error): the draft's "more than 90
trained lifeguards and staff" is consistent with the fact sheet's 96.
A model that lists this as a discrepancy fails obj-5 regardless of how
many genuine discrepancies it also caught.

For obj-2, verify each of the four required facts and each of the five
banned wrong values as a claim in context, not by blind substring
search — e.g. a stray "140" describing something other than session
capacity (there shouldn't be one, but judge the claim, not the
digits). Similarly for memo.md's obj-3/obj-4/obj-5, judge whether each
listed item is a genuine, correctly-stated discrepancy against the
answer key above, not just whether some numbers appear.

Example phrasings for the prose-located checks (apply the same
standard to equivalent wordings):

- **obj-2 (article states a fact as a claim)** — PASS: "doors reopen
  on 22 August", "the 3.4-metre deep end", "sixty swimmers per
  session". FAIL (banned wrong value stated as a claim): "reopening
  Saturday the 21st", "our 4.3 m deep end", "up to 140 swimmers a
  session", "director Farrah Yilmaz". FAIL (fact absent/too vague to
  count): "reopening in late August", "a deep pool" with no
  measurement.
- **obj-3 (memo item is a genuine, correctly-stated discrepancy)** —
  PASS: "Capacity: draft says 140, fact sheet says 60 — corrected to
  60"; "Depth: 4.3 m in the draft should be 3.4 m". FAIL (only one
  side / no correction): "the capacity number looks off",
  "double-check the depth figure". FAIL (invented or wrong
  correction): "date should be 23 August" (the correct value is 22).
- **obj-5 (lifeguard count must NOT be flagged as an error)** — PASS
  (leaves it out, or notes it as consistent): memo omits the lifeguard
  count entirely; "Lifeguard count 'more than 90' vs 96 — consistent,
  no change". FAIL (flags it as a discrepancy): "Lifeguards: draft
  says more than 90 but it's 96 — fix"; listing "more than 90 trained
  lifeguards" in the corrections table.

- **Rewrite prose quality**: does article.md read as a tight, polished
  piece of promotional writing at roughly half the draft's length, not
  a mechanically shortened version? Reward active voice,
  a strong opening, and smooth cuts; penalize awkward compression
  artifacts or any leaked wrong value from the draft (also covered by
  obj-2, but leakage should depress this score too — a rewrite this
  compressed should read cleanly and precisely, not lurch on a wrong
  number).
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
  the lifeguard count was correctly judged consistent rather than
  flagged?
