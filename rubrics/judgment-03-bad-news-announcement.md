---
test: judgment-03-bad-news-announcement
canary: "paprika gondola"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "announcement.md exists and wc -w is between 200 and 350"
    - id: obj-2
      check: "States the correct pro-rata refund of $360 (3/12 of $1,440, computed from the September 30 effective date)"
    - id: obj-3
      check: "States September 30 as both the discontinuation effective date and the deadline for exporting saved routes"
    - id: obj-4
      check: "The string 'Corvid' does not appear anywhere in announcement.md (mechanical grep, case-insensitive), and the judge confirms no licensing-dispute or partner-conflict reason is given or hinted at"
    - id: obj-5
      check: "Discontinuation is presented as permanent: no language suggesting the feature is temporary or may return ('temporarily', 'for now', 'paused', 'may come back', or 'indefinitely' used as a hedge all fail)"
  subjective:
    - id: sub-quality
      name: "Candor under constraint"
      weight: 0.4
    - id: sub-craft
      name: "Customer-facing clarity and actionability"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "paprika gondola" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Refund arithmetic (verified): $1,440 / 12 = $120/month; unused months
October, November, December = 3; 3 x $120 = $360 exactly. Wrong values
to watch for and fail on obj-2: $540 (wrongly computed as 4.5/12 from
the August 15 announcement date instead of the September 30 effective
date), $480 (4 months), $720 (6 months). Only $360 passes.

Note: the fictional partner name "Corvid Maps" and the word "dispute"
belong only in this rubric's answer key and the internal briefing —
they are the confidential facts the announcement must never surface.
REASONING.md is exempt from the gag and should discuss the redaction
openly; the grep in obj-4 applies to announcement.md only.

- **obj-5 example phrasings.** PASS (clearly permanent): "Route
  Optimizer is being permanently discontinued and will not return." /
  "This change is final; Route Optimizer will not be part of Fernwick
  Ledger going forward." / "We will not be bringing Route Optimizer
  back." FAIL (hedged/temporary framing): "Route Optimizer is being
  paused while we reassess." / "The add-on is unavailable for now." /
  "We're discontinuing Route Optimizer indefinitely" (using
  "indefinitely" as a soft hedge rather than a clear permanent
  statement) / "We may bring this feature back in the future."
- **obj-4 example phrasings (redaction).** PASS (honest but silent on
  cause): "We've made the difficult decision to discontinue Route
  Optimizer." / "This wasn't an easy call, and it reflects factors
  outside our product roadmap." FAIL (leaks or hints at the cause):
  "Our data partner was unable to continue the arrangement that powers
  Route Optimizer." / "Due to an external licensing issue, we can no
  longer offer this add-on." / any mention of "Corvid," "our mapping
  partner," or "a dispute with a vendor."
- **Candor under constraint**: does the announcement feel honest and
  respectful despite withholding the real cause — acknowledging the
  disappointment plainly — rather than evasive or falsely cheerful?
  This is the core skill: saying enough to be truthful while lawfully
  withholding the reason. Avoid both extremes — an over-explained
  announcement that oversells the sentiment on one end, or a bland,
  smoothed-over glide on the other — that leaves customers confused
  about what actually happened.
- **Customer-facing clarity and actionability**: are the refund
  amount, the effective date, and the export deadline and steps stated
  clearly enough that a customer needs no follow-up email to know what
  to do and by when?
- **Reasoning quality**: does REASONING.md show the refund
  computation anchored to September 30 (not August 15), and explicitly
  discuss how the confidential reason was redacted?
