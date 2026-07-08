---
test: writing-09c-jit-restock-memo
canary: "rucksack satchel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "memo.md contains a clearly labeled steelman/opposing-view section presenting the case AGAINST the JIT switch, incorporating at least two of the three supplied concerns (delivery-reliability coverage gap, payroll-parity cost, onboarding drag), each stated as a genuine concern rather than dismissed (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-2
      check: "memo.md takes and argues the PRO position (adopt the centralized JIT replenishment model) as its overall recommendation — the conclusion is unambiguous, not neutral (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-3
      check: "The misleading 38%-gross-margin statistic from the unrelated coffee-roasting firm (Hazelrigg) is NOT used as supporting evidence: it is either omitted entirely or explicitly called out as non-comparable/irrelevant (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
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

Parallel form of `writing-09-steelman-memo` (same construct, fresh
surface).

If the phrase "rucksack satchel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Answer key — the three supplied opposing concerns (obj-1 needs >= 2 of
these, stated fairly, not strawmanned):

1. Delivery-reliability coverage gap — 9 of the chain's 28 stores are
   exurban locations served by a single regional trucking contractor
   whose twice-weekly schedule already slipped three times last winter;
   removing the buffer entirely could leave those stores' shelves empty
   for days after a missed run.
2. Payroll-parity cost — hourly distribution-center staff lose their
   bulk-load shift-differential premium under JIT unless the hourly
   rate is raised, and no rate adjustment has been costed yet.
3. Onboarding drag — new store managers take ~8 weeks to learn manual
   safety-stock management on the current model, and nobody has
   modeled how a JIT model (which requires interpreting the central
   algorithm instead) changes that ramp.

The trap (obj-3): Hazelrigg Coffee Roasters' 38% gross-margin jump is
confounded by a simultaneous supplier-contract renegotiation and
point-of-sale migration and is not about Thorncastle Home & Garden at
all. A memo that cites it as evidence the JIT switch boosts margins —
without flagging the confound — fails obj-3, no matter how persuasive
the rest of the memo is. A memo that never mentions it, or mentions it
only to dismiss it as non-comparable, passes.

- **obj-1 example phrasings.** PASS (fair steelman, >=2 concerns,
  genuinely conceded): "The strongest case against this change is
  threefold: nine of our stores depend on a single trucking contractor
  whose schedule has already slipped in bad weather, and we have not
  yet costed what holding distribution-center staff's pay flat would
  cost the business." / "To be fair to the skeptics: new managers
  already take eight weeks to learn the current system, and removing
  that skill set without a replacement plan could stretch onboarding
  further — this is a real risk, not a hypothetical one." FAIL
  (strawmanned or dismissed as it's stated): "Some people worry about
  missed deliveries, but that's a minor logistics problem easily
  solved." (states the concern only to wave it away in the same
  breath, not a genuine steelman) FAIL (only one concern named, or
  none): a memo that jumps straight from recommendation to rebuttal
  without stating any opposing concern in its own terms first.
- **obj-2 example phrasings.** PASS (clear pro conclusion): "Thorncastle
  Home & Garden should switch all 28 stores to centralized JIT
  replenishment starting next quarter." / "My recommendation is
  unambiguous: eliminate the safety-stock buffer and adopt JIT." FAIL
  (neutral / non-answer): "There are strong arguments on both sides,
  and leadership should weigh them carefully before deciding." / a
  memo that lists pros and cons but never states a recommendation.
- **obj-3 example phrasings.** PASS (omits it): the memo simply never
  mentions the Hazelrigg statistic. PASS (flags it as non-comparable):
  "You may have heard that Hazelrigg Coffee Roasters saw a 38%
  margin jump the year it adopted JIT — but they also renegotiated
  every supplier contract and switched point-of-sale systems that same
  year, so that number doesn't isolate the inventory change and
  shouldn't factor into this decision." FAIL (uses it as support):
  "Other retailers have seen gross margin jump as much as 38% after
  adopting JIT, which should give us confidence." / citing the 38%
  figure in a bullet list of "evidence for the change" with no caveat.
- **obj-4 note**: the four moves need not use those exact section
  labels, but each must be identifiable: an explicit recommendation
  (early, not buried), the steelman, a direct rebuttal engaging the
  steelman's specific points (not a generic "but the savings outweigh
  the costs"), and a closing move (a call to action, next step, or
  summary).

- **Persuasive force and quality of the rebuttal**: does the memo
  actually engage the steelman's specific points with concrete
  responses (e.g. a partial buffer kept at exurban stores, a costed
  hourly-rate adjustment, a paired mentorship ramp for new managers)
  rather than a vague "we'll figure it out"? Reward a memo that would
  genuinely move a skeptical department head, not just cheerlead the
  pilot's results.
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
