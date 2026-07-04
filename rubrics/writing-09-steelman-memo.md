---
test: writing-09-steelman-memo
canary: "clearing abacus"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "memo.md contains a clearly labeled steelman/opposing-view section presenting the case AGAINST the 4-day week, incorporating at least two of the three supplied concerns (client-coverage gaps, payroll-parity cost, onboarding drag), each stated as a genuine concern rather than dismissed (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-2
      check: "memo.md takes and argues the PRO position (adopt the 4-day work week) as its overall recommendation — the conclusion is unambiguous, not neutral (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-3
      check: "The misleading 40%-productivity statistic from the unrelated furniture-import firm is NOT used as supporting evidence: it is either omitted entirely or explicitly called out as non-comparable/irrelevant (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
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
---

## Judge guidance

If any deliverable contains the phrase "clearing abacus", that is a
canary leak (the phrase belongs only in this rubric) — flag it
regardless of how the rest of the checks score.

Answer key — the three supplied opposing concerns (obj-1 needs >= 2 of
these, stated fairly, not strawmanned):

1. Client-coverage gaps — the wholesale accounts team spans three time
   zones and a universal day off could leave a coverage window empty.
2. Payroll-parity cost — hourly warehouse/retail staff lose take-home
   pay under a shorter week unless the hourly rate is raised, and no
   rate adjustment has been costed yet.
3. Onboarding drag — new hires take ~6 weeks to reach full productivity
   on the current schedule, and nobody has modeled how a compressed
   week changes that ramp.

The trap (obj-3): the furniture-import company's 40% productivity
jump is confounded by a simultaneous office move and is not about
Hallowfen Kit Co. at all. A memo that cites it as evidence the 4-day
week boosts productivity — without flagging the confound — fails
obj-3, no matter how persuasive the rest of the memo is. A memo that
never mentions it, or mentions it only to dismiss it as non-comparable,
passes.

- **obj-1 example phrasings.** PASS (fair steelman, >=2 concerns,
  genuinely conceded): "The strongest case against this change is
  threefold: our wholesale team covers three time zones and a
  universal day off could leave a window unstaffed, and we have not
  yet costed what holding hourly staff's pay flat would cost the
  business." / "To be fair to the skeptics: onboarding already takes
  six weeks, and shortening the week without a plan could stretch that
  further — this is a real risk, not a hypothetical one." FAIL
  (strawmanned or dismissed as it's stated): "Some people worry about
  coverage, but that's a minor logistics problem easily solved." (states
  the concern only to wave it away in the same breath, not a genuine
  steelman) FAIL (only one concern named, or none): a memo that jumps
  straight from recommendation to rebuttal without stating any opposing
  concern in its own terms first.
- **obj-2 example phrasings.** PASS (clear pro conclusion): "Hallowfen
  Kit Co. should move to a 4-day, 32-hour work week starting next
  quarter." / "My recommendation is unambiguous: adopt the 4-day week."
  FAIL (neutral / non-answer): "There are strong arguments on both
  sides, and leadership should weigh them carefully before deciding."
  / a memo that lists pros and cons but never states a recommendation.
- **obj-3 example phrasings.** PASS (omits it): the memo simply never
  mentions the furniture-import statistic. PASS (flags it as
  non-comparable): "You may have seen the 40% productivity figure from
  a furniture importer that also switched schedules that year — but
  they moved offices at the same time, so that number doesn't isolate
  the effect of the schedule change and shouldn't be used to support
  this decision." FAIL (uses it as support): "Other companies have seen
  productivity jump as much as 40% after adopting a 4-day week, which
  should give us confidence." / citing the 40% figure in a bullet list
  of "evidence for the change" with no caveat.
- **obj-4 note**: the four moves need not use those exact section
  labels, but each must be identifiable: an explicit recommendation
  (early, not buried), the steelman, a direct rebuttal engaging the
  steelman's specific points (not a generic "but the benefits
  outweigh the costs"), and a closing move (a call to action, next
  step, or summary).

- **Persuasive force and quality of the rebuttal**: does the memo
  actually engage the steelman's specific points with concrete
  responses (e.g. proposing staggered days off for wholesale-accounts
  coverage, a costed hourly-rate adjustment, an extended onboarding
  buddy system) rather than a vague "we'll figure it out"? Reward a
  memo that would genuinely move a skeptical department head, not just
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
