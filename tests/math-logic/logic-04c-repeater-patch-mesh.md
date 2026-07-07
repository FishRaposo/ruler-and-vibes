---
id: logic-04c-repeater-patch-mesh
category: math-logic
title: Repeater Patch Mesh
deliverables:
  - PROOF.md
---

## Task

A regional amateur-radio contest network operates exactly 11 repeater
stations, numbered 1 through 11. During a contest season, any two
stations may be joined by at most one dedicated cross-band patch (so a
patch is an unordered pair of distinct stations, and no pair is patched
twice).

Answer all four parts below.

- **Part A**: What is the maximum possible number of patches in a
  contest season? Show the count.
- **Part B**: Prove in prose that it is **impossible** for every one of
  the 11 stations to carry exactly 7 patches in a contest season.
- **Part C**: Exhibit an explicit patch list (a specific list of
  patches) in which every station carries **exactly 6 patches**. Format
  the list as one patch per line, in the exact form `i-j` where `i` and
  `j` are station numbers from 1 to 11 and `i < j` (e.g. `1-2`). List
  only patch lines in this section — no other text on those lines.
- **Part D**: Prove that in any contest season where every station
  carries at least one patch, **two stations must carry the same number
  of patches**.

## Deliverables

- `PROOF.md` (at most 600 words) — containing all four parts, clearly
  labeled `## Part A`, `## Part B`, `## Part C`, `## Part D`, with Part
  C's patch list in the exact `i-j` one-per-line format specified
  above.

## Constraints

- At most 600 words (whole file, `wc -w`).
- Part C requires an actual exhibited patch list, not just an assertion
  that one exists. Any valid list where every station carries exactly 6
  patches is accepted — it does not need to match any particular
  construction.
- Parts B and D must be prose proofs, not just assertions of the
  conclusion.
