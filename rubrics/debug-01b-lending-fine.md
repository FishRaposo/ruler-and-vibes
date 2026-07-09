---
test: debug-01b-lending-fine
canary: "serval chartreuse"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce 13, 22, 43.5, 23, 15 (verify independently)"
    - id: obj-3
      check: "DIAGNOSIS.md names all three distinct root causes: the crashing reshelving loop (j <= length, unguarded access), the loyalty cap applied to the whole fine instead of the portion above 30, and the surcharge decided from the post-cap fee with a > 15 boundary instead of the pre-cap base fine at >= 15"
    - id: obj-4
      check: "Fix is minimal: same single function, structure preserved, <= 90 lines, no dependencies"
  subjective:
    - id: sub-quality
      name: "Root-cause depth"
      weight: 0.4
    - id: sub-craft
      name: "Fix discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Root-cause depth
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Fix discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-01-root-cause` (same construct, fresh surface).

- Run the self-tests, then verify the five reference outputs yourself
  with node. Probe extra cases: an empty books array, `damaged` on
  multiple books, a base fine of exactly 30.
- The three seeded bugs, for reference:
  - **Reshelving loop crash** — `for (var j = 0; j <= loan.books.length; j++)`
    reads `loan.books[length]` (undefined) and throws; the fix is
    `j < loan.books.length`.
  - **Loyalty cap over-applied** — `fee = fee * 0.75` discounts the
    entire fine; the spec caps only the portion above 30, so the fix is
    `fee = 30 + (fee - 30) * 0.75`. Case 3 (base 48) separates these:
    43.5 correct vs 36 for the whole-fee cap.
  - **Surcharge from the wrong basis** — `if (fee > 15)` tests the
    post-cap `fee` with a strict `>`; the spec waives on the PRE-CAP
    base fine at `>= 15`. Case 5 (base exactly 15) separates these:
    15 correct vs 20 when the surcharge fires.
- Root-cause depth: a good diagnosis traces from the visible symptom
  back to the exact faulty expression — rather than describing what the
  new code does. Penalize diagnoses that only restate the fix.
- Fix discipline: smallest change that restores the spec; penalize
  drive-by rewrites, renamed variables, or "improvements" beyond the
  three bugs.
- Reasoning quality: does REASONING.md distinguish finding the bugs from
  fixing them, and note what else was checked?
- PASS examples for obj-3: "the loop runs one index past the end and
  dereferences `undefined`"; "the cap multiplies the full fee instead of
  only the amount over 30"; "shipping the surcharge off the discounted
  fee, and using `>` where the spec says at-least-15 on the pre-cap
  fine." FAIL examples for obj-3: "changed a few comparisons and the
  loop bound" (names no root cause); "the cap was wrong" (does not locate
  the faulty expression); listing only the crash and one math bug (misses
  the third).
- If the phrase "serval chartreuse" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
