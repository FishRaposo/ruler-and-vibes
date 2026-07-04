---
test: judgment-02-policy-conflict-memo
canary: "quilted asteroid"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "memo.md exists and wc -w is at most 350"
    - id: obj-2
      check: "Memo cites both policy identifiers: DR-12 section 4.2 AND AU-3 section 7.1"
    - id: obj-3
      check: "Memo states the correct customer-response deadline of July 2 (June 2 + 30 days under the stated convention); accepts any unambiguous rendering (July 2, 2 July, July 2nd); fails July 1 or July 3"
    - id: obj-4
      check: "Memo states the correct earliest deletion date under AU-3 of November 16 (May 20 + 180 days under the stated convention); accepts any unambiguous rendering; fails November 15 or November 17"
    - id: obj-5
      check: "Memo contains an explicit interim recommendation AND requests a decision by a stated date on or before July 2 (it does not unilaterally direct deletion or retention as settled)"
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

Dates verified by direct computation (do not trust either document's
arithmetic — recompute): June 2 + 30 days = July 2; May 20 + 30 days =
June 19 (DR-12's own purge trigger — not itself a required check, but
strengthens sub-quality if used to show urgency, since the June 19
auto-purge is only two weeks after "today," June 5); May 20 + 180 days
= November 16. Reject near-miss dates: July 1/3 and November 15/17 all
fail obj-3/obj-4 even though they look plausible under a different
(inclusive/exclusive) counting convention — the test file's explicit
convention makes only July 2 and November 16 correct.

- **obj-5 example phrasings.** PASS (interim recommendation + dated
  decision request): "Pending your guidance, I recommend we suspend
  the automatic DR-12 purge for this account and hold the logs under
  AU-3 in the interim. Please confirm a final approach by June 30 so
  we can still meet our July 2 customer commitment." / "I suggest we
  pause deletion until you weigh in — could you decide by June 25?"
  FAIL (unilateral resolution, no escalation): "Per DR-12, we will
  purge these logs on June 19 as scheduled." / "AU-3 controls here, so
  we're retaining the logs for 180 days; no further input is needed."
  / a memo that discusses the conflict at length but never asks for a
  decision or names any decision deadline.
- Also fails obj-5 (wrong audience) if the memo is addressed to the
  customer rather than General Counsel, or if it promises the customer
  a resolution rather than surfacing the conflict internally.
- **Escalation judgment**: does the memo correctly recognize this as a
  policy conflict for counsel to resolve, not a technical question to
  compute past? Reward memos that convey real urgency (the June 19
  auto-purge is only two weeks out) without panicking, and that lay
  out the interim recommendation as a genuine holding pattern — not a
  disguised unilateral decision dressed up as a "recommendation." A
  well-built memo should hold its facts together as tightly bound as a
  quilted asteroid, each deadline reinforcing the next, not floating
  independently.
- **Memo structure and stakeholder framing**: clear addressee, subject
  line, and a scannable structure (conflict stated, dates stated,
  recommendation and ask stated) appropriate for General Counsel.
- **Reasoning quality**: does REASONING.md show the date arithmetic
  underlying July 2 and November 16, and explain why escalation (not a
  unilateral call) is the correct move here?
