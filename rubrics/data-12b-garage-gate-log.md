---
test: data-12b-garage-gate-log
canary: "brocade rime"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Overall payment rate (total tickets_paid / total cars_entered, across the 19 valid rows excluding the impossible row) is reported within +/-0.5 percentage points of 51.2% (reference value 51.24%; simple average of daily rates 50.95% also falls in band)"
    - id: obj-2
      check: "The impossible row (2025-09-11: tickets_paid 300 > cars_entered 230) is explicitly flagged as a data-quality error and NOT used in headline conclusions — prose-located check. PASS phrasings include 'Sep 11 logs 300 paid tickets against 230 cars entered, which is impossible — excluded from the totals', 'one row fails a basic sanity check (tickets_paid > cars_entered) and is flagged rather than computed through', or 'the 130% payment rate on Sep 11 cannot be real, so that row is dropped from every aggregate'. FAIL phrasings include silently averaging it into the totals with no comment, reporting a 130% payment day as a genuine finding, or 'the best collection day was Sep 11 at 130%'."
    - id: obj-3
      check: "The highest-revenue day (2025-09-14, revenue 6084) is correctly identified AND its below-average payment rate (33.9%, versus the ~51% dataset average) is surfaced as a notable finding rather than celebrated as a pure win — judge recomputes the max-revenue date and its payment rate from the embedded rows and confirms the memo names that date and its low rate. PASS phrasings include 'Sep 14 is the top revenue day at $6,084 but converts only 234/690 = 33.9% of arrivals, well below the ~51% average', or 'the record-revenue day is also the weakest collection day — high traffic, low payment rate, only 2 attendants'. FAIL phrasings include 'Sep 14 was an unambiguous win, repeat the playbook', naming Sep 14 as best without noting its low payment rate, or treating peak revenue as pure success."
    - id: obj-4
      check: "INSIGHTS.md contains an explicit limitations / 'what this data cannot tell us' section naming at least one thing the data cannot establish. PASS phrasings include 'we cannot tell whether more attendants CAUSE a higher payment rate or whether busy-but-orderly days simply get staffed more heavily', 'nothing here records enforcement effort, gate faults, tailgating, permit holders, or nearby events', or 'this cannot establish causation between staffing and collection'. FAIL phrasings include omitting the section entirely, a bare slogan like 'correlation is not causation' with no specifics tied to this data, or claiming the data proves attendants drive collection."
    - id: obj-5
      check: "INSIGHTS.md is at most 600 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Insight prioritization and synthesis"
      weight: 0.4
    - id: sub-craft
      name: "Memo structure and honesty about limits"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Insight prioritization and synthesis
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Memo structure and honesty about limits
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `data-12-cold-start-memo` (same construct, fresh surface).

If the phrase "brocade rime" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute yourself with node before scoring. The dataset has 20 rows;
  exactly one (2025-09-11) has tickets_paid (300) exceeding cars_entered
  (230) and must be excluded from any payment-rate/traffic aggregate.
  Reference values over the 19 valid rows: total cars_entered=7,135,
  total tickets_paid=3,656, weighted overall payment rate=3656/7135=
  51.24% (simple average of daily rates ≈50.95% — either framing is
  fine, the ±0.5pt band covers both). Per-day payment rate ranges from
  about 33.9% to 62.0% across valid rows. Revenue-per-paid-ticket is $12
  for every row except 2025-09-14 ($26/ticket) — a legitimate, not
  impossible, outlier worth noting if the submission catches it (an
  event or special rate). Max-revenue day is 2025-09-14 (revenue $6,084,
  cars_entered 690, tickets_paid 234, payment rate 234/690=33.91%),
  clearly below the ~51% dataset average — a high-traffic day let down by
  weak collection, consistent with it being relatively understaffed
  (attendants_on_duty=2, versus 3-4 on other high-traffic days).
  Attendants vs. payment rate (valid rows): 1 attendant avg rate ≈40.0%,
  2 ≈45.2%, 3 ≈55.1%, 4 ≈61.5% — a real, monotonic relationship a
  careful submission may surface as a fourth finding. Note that the
  excluded Sep 11 row happens to carry the second-highest revenue
  ($3,600); a submission that ranks revenue days must still drop it from
  rate aggregates.
- Insight prioritization and synthesis: this test is open-ended by
  design — there is no posed question. Reward submissions that find
  genuinely load-bearing findings (the overall payment rate, the
  max-revenue day's staffing shortfall, the attendant/payment-rate
  relationship) over filler observations (e.g. "revenue varies by day"),
  and that rank them by actual business stakes rather than by the order
  columns appear in the CSV.
- Memo structure and honesty about limits: reward a limitations section
  that names something real and specific (e.g. "we can't tell whether
  more attendants CAUSE higher collection or whether the garage schedules
  more attendants on days it already expects to run smoothly" — a
  confound, not just "correlation isn't causation" as a slogan) over a
  generic disclaimer. Penalize a submission that treats the
  highest-revenue day as an unqualified success story.
- Reasoning quality: does INSIGHTS.md show the arithmetic behind each
  finding (the payment-rate formula applied to actual totals, the
  specific revenue and payment-rate numbers for Sep 14) rather than
  asserting conclusions? Does it treat the impossible row as a flag, not
  silently drop it without comment or silently include it?
