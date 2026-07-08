---
test: judgment-02b-biospecimen-sop-conflict
canary: "sanderling mullion"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "memo.md exists and wc -w is at most 350"
    - id: obj-2
      check: "Memo cites both SOP identifiers: SR-9 section 3.2 AND SD-4 section 6.1"
    - id: obj-3
      check: "Memo states the correct participant-response deadline of April 18 (March 4 + 45 days under the stated convention); accepts any unambiguous rendering (April 18, 18 April, April 18th); fails April 17 or April 19"
    - id: obj-4
      check: "Memo states the correct earliest disposal date under SR-9 of May 19 (February 18 + 90 days under the stated convention); accepts any unambiguous rendering; fails May 18 or May 20"
    - id: obj-5
      check: "Memo contains an explicit interim recommendation AND requests a decision by a stated date on or before April 18 (it does not unilaterally direct destruction or retention as settled)"
  subjective:
    - id: sub-quality
      name: "Escalation judgment"
      weight: 0.4
    - id: sub-craft
      name: "Memo structure and stakeholder framing"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `judgment-02-policy-conflict-memo` (same construct, fresh surface).

If the phrase "sanderling mullion" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Dates verified by direct computation (do not trust either document's
arithmetic — recompute; the scenario is pinned to 2025, a non-leap
year, so the Feb-29 boundary does not apply): March 4 + 45 days =
April 18; February 18, 2025 + 21 days = March 11 (SD-4's own
destruction trigger — not itself a required check, but strengthens
sub-quality if used to show urgency, since the March 11 forced
destruction is only three days after "today," March 8, 2025);
February 18, 2025 + 90 days = May 19. Reject near-miss dates: April
17/19 and May 18/20 all fail obj-3/obj-4 even though they look
plausible under a different (inclusive/exclusive) counting convention
or a leap-year misreading of the unstated-in-earlier-drafts year — the
test file's
explicit convention makes only April 18 and May 19 correct.

- **obj-5 example phrasings.** PASS (interim recommendation + dated
  decision request): "Pending your guidance, I recommend we place this
  participant's biospecimens under a documented hold — neither destroyed
  nor released — under SR-9 in the interim. Please confirm a final
  approach by March 17 so we can still meet our April 18 participant
  commitment." / "I suggest we pause any destruction until you weigh in
  — could you decide by March 14?" FAIL (unilateral resolution, no
  escalation): "Per SD-4, we will destroy these specimens on March 11 as
  scheduled." / "SR-9 controls here, so we're retaining the specimens for
  90 days; no further input is needed." / a memo that discusses the
  conflict at length but never asks for a decision or names any decision
  deadline.
- Also fails obj-5 (wrong audience) if the memo is addressed to the
  participant rather than the Principal Investigator, or if it promises
  the participant a resolution rather than surfacing the conflict
  internally.
- **Escalation judgment**: does the memo correctly recognize this as an
  SOP conflict for the Principal Investigator to resolve, not a
  technical question to compute past? Reward memos that convey real
  urgency (the March 11 forced destruction is only three days out)
  without panicking, and that lay out the interim recommendation as a
  genuine holding pattern — not a disguised unilateral decision dressed
  up as a "recommendation."
- **Memo structure and stakeholder framing**: clear addressee, subject
  line, and a scannable structure (conflict stated, dates stated,
  recommendation and ask stated) appropriate for a Principal
  Investigator.
- **Reasoning quality**: does REASONING.md show the date arithmetic
  underlying April 18 and May 19, and explain why escalation (not a
  unilateral call) is the correct move here?
