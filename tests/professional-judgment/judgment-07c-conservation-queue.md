---
id: judgment-07c-conservation-queue
category: professional-judgment
title: "Rank seven conservation requests by a stated priority rule"
deliverables:
  - conservation-queue.md
---

## Task

You are the head conservator at a regional museum. Seven artifacts have
been flagged for urgent conservation attention at once. Read the table
and the binding priority rule below, then produce a full 1-through-7
ranking.

**Artifact table:**

| ID | Description | Fragility rating (1-5) | Annual public viewing count (thousands) | Outbound loan/exhibition transfer today? |
|---|---|---|---|---|
| A1 | Oil painting, canvas cracking along the frame edge | 3 | 30 | No |
| A2 | Illuminated manuscript, ink fading on several pages | 2 | 2 | **Yes** |
| A3 | Marble sculpture, unstable base risking tip-over | 4 | 60 | No |
| A4 | Woven tapestry, thread fraying at the border | 2 | 45 | No |
| A5 | Ceramic vase, hairline fissure near the rim | 3 | 12 | No |
| A6 | Photograph album, emulsion fading on early prints | 4 | 18 | No |
| A7 | Coin collection, surface tarnish across several pieces | 2 | 6 | No |

**Binding priority rule:**

> Priority score = fragility rating x annual public viewing count (in
> thousands). Rank artifacts by descending priority score. If two
> artifacts have equal scores, the one with the higher fragility rating
> ranks first. EXCEPTION: any artifact currently committed to an
> outbound loan or exhibition transfer TODAY jumps to rank #1,
> regardless of its computed score.

## Deliverables

- `conservation-queue.md` — a numbered 1-through-7 ranking of all seven
  artifacts, showing the computed priority score for at least the top
  three ranked artifacts.

## Constraints

- Include all seven artifacts exactly once; do not omit or duplicate
  any.
- Apply the loan-transfer-today override before applying the score
  ranking.
- Apply the higher-fragility tie-break when two scores are equal.
- Show your computed priority scores for at least the top three
  ranked artifacts.
