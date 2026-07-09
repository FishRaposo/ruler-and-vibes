---
test: writing-09b-fine-free-library-memo
canary: "underpass knapsack"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "memo.md contains a clearly labeled steelman/opposing-view section presenting the case AGAINST the fine-free policy, incorporating at least two of the three supplied concerns (high-demand item hoarding, budget-parity cost, onboarding drag), each stated as a genuine concern rather than dismissed (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-2
      check: "memo.md takes and argues the PRO position (adopt the fine-free lending policy) as its overall recommendation — the conclusion is unambiguous, not neutral (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-3
      check: "The misleading 35%-foot-traffic statistic from the unrelated bookstore chain is NOT used as supporting evidence: it is either omitted entirely or explicitly called out as non-comparable/irrelevant (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-4
      check: "memo.md is structured with all four required moves present, in a recognizable order: a recommendation, the steelman, a rebuttal/response to it, and a close"
    - id: obj-5
      check: "memo.md whole-file word count is between 350 and 500 inclusive, verified with wc -w"
  subjective:
    - id: sub-quality
      name: "Persuasive force and quality of the rebuttal"
      weight: 0.4
    - id: sub-craft
      name: "Fairness of the steelman (opposing case stated at its genuine strongest)"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Persuasive force and quality of the rebuttal
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Fairness of the steelman (opposing case stated at its genuine strongest)
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `writing-09-steelman-memo` (same construct, fresh
surface).

If the phrase "underpass knapsack" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

Answer key — the three supplied opposing concerns (obj-1 needs >= 2 of
these, stated fairly, not strawmanned):

1. High-demand item hoarding — WiFi hotspots, tool-lending kits, and
   museum passes could stay checked out indefinitely with no financial
   deterrent to bring them back, and waitlists (currently ~3 weeks)
   could stretch further at the busiest branches.
2. Budget-parity cost — fine revenue currently funds about $95,000/year
   for the after-school tutoring program, and no replacement funding
   source has been identified yet.
3. Onboarding drag — new frontline staff take ~5 weeks to reach full
   proficiency handling account/fee disputes, and nobody has modeled
   how removing fines changes that ramp.

The trap (obj-3): the bookstore chain's (Quillfeather Books) 35%
foot-traffic jump is confounded by a simultaneous expansion of store
hours and the addition of cafés, and is not about Fintlebury County
Library System at all. A memo that cites it as evidence the fine-free
policy drives engagement — without flagging the confound — fails
obj-3, no matter how persuasive the rest of the memo is. A memo that
never mentions it, or mentions it only to dismiss it as non-comparable,
passes.

- **obj-1 example phrasings.** PASS (fair steelman, >=2 concerns,
  genuinely conceded): "The strongest case against this change is
  real: high-demand items like hotspots and tool kits could stay out
  indefinitely with nothing to bring them back, and we have not yet
  identified a replacement for the $95,000 the fine revenue currently
  provides the tutoring program." / "To be fair to the skeptics:
  onboarding already takes about five weeks, and removing fines
  without a plan could change that ramp in ways we haven't modeled —
  this is a real risk, not a hypothetical one." FAIL (strawmanned or
  dismissed as it's stated): "Some staff worry about coverage and
  budget stuff, but those are minor logistics problems any competent
  team can iron out in a month." (states the concerns only to wave
  them away in the same breath, not a genuine steelman) FAIL (only one
  concern named, or none): a memo that jumps straight from
  recommendation to rebuttal without stating any opposing concern in
  its own terms first.
- **obj-2 example phrasings.** PASS (clear pro conclusion): "Fintlebury
  County Library System should eliminate overdue fines on all borrowed
  materials, effective next fiscal year." / "My recommendation is
  unambiguous: adopt the fine-free policy system-wide." FAIL (neutral /
  non-answer): "There are strong arguments on both sides, and the
  board should weigh them carefully before deciding." / a memo that
  lists pros and cons but never states a recommendation.
- **obj-3 example phrasings.** PASS (omits it): the memo simply never
  mentions the Quillfeather Books statistic. PASS (flags it as
  non-comparable): "You may have heard that Quillfeather Books saw a
  35% jump in foot traffic after dropping late fees — but they also
  expanded hours and added cafés that same year, so that number
  doesn't isolate the effect of the fee change and shouldn't be used
  to support this decision." FAIL (uses it as support): "Other
  institutions have seen traffic jump as much as 35% after going
  fine-free, which should give us confidence." / citing the 35% figure
  in a bullet list of "evidence for the change" with no caveat.
- **obj-4 note**: the four moves need not use those exact section
  labels, but each must be identifiable: an explicit recommendation
  (early, not buried), the steelman, a direct rebuttal engaging the
  steelman's specific points (not a generic "but the benefits outweigh
  the costs"), and a closing move (a call to action, next step, or
  summary).

- **Persuasive force and quality of the rebuttal**: does the memo
  actually engage the steelman's specific points with concrete
  responses (e.g. a capped/deterrent scheme for high-demand items, a
  costed interim funding source for the tutoring program, a revised
  onboarding module) rather than a vague "we'll figure it out"? Reward
  a memo that would genuinely move a skeptical branch manager, not just
  cheerlead the pilot's results.
- **Fairness of the steelman**: is the opposing case given its full due
  — concrete, specific, and stated the way its actual holder would
  state it — before being answered, rather than a token paragraph
  built to be knocked down? A steelman that concedes real, unresolved
  cost or risk should score higher than one that quietly hedges every
  concern into a non-issue.
- **Reasoning quality**: does the memo's own construction (or any
  reasoning the model provides) show it deliberately separated
  "concerns to state fairly" from "the poisoned statistic to avoid,"
  rather than accidentally landing on the right structure?
