---
test: data-12-cold-start-memo
canary: "cobblestone larkspur"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Overall conversion rate (total transactions / total foot_traffic, across the 19 valid rows excluding the impossible row) is reported within +/-0.5 percentage points of 40.0% (reference value 40.03%)"
    - id: obj-2
      check: "The impossible row (2025-06-11: transactions 210 > foot_traffic 150) is explicitly flagged as a data-quality error and NOT used in headline conclusions — prose-located check; PASS phrasings include 'the June 11 row has more transactions than visitors, which is impossible — excluded from the totals' or 'one row fails a basic sanity check (tx > traffic) and is flagged rather than computed through'; FAIL phrasings include silently averaging it in with no comment, reporting a 140% conversion day as a real finding, or 'the best conversion day was June 11 at 140%'"
    - id: obj-3
      check: "The highest-revenue day (2025-06-14, revenue 4550) is correctly identified AND its below-average conversion (27.1%, versus the ~40% dataset average) is surfaced as a notable finding rather than celebrated as a pure win — judge recomputes the max-revenue date and its conversion from the embedded rows and confirms the memo names that date and its low conversion"
    - id: obj-4
      check: "INSIGHTS.md contains an explicit limitations / 'what this data cannot tell us' section naming at least one thing the data cannot establish (e.g. causation between staffing and conversion, or effects of factors not captured by these columns such as marketing, local events, or competitor activity)"
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
---

## Judge guidance

- Recompute yourself with node before scoring. The dataset has 20 rows;
  exactly one (2025-06-11) has transactions (210) exceeding foot_traffic
  (150) and must be excluded from any conversion/traffic aggregate.
  Reference values over the 19 valid rows: total foot_traffic=4,826,
  total transactions=1,932, weighted overall conversion=1932/4826=
  40.03% (simple average of daily rates ≈40.17% — either framing is
  fine, the ±0.5pt band covers both). Per-day conversion ranges from
  about 34% to 44% across valid rows. Revenue-per-transaction is $20
  for every row except 2025-06-14 ($35/transaction) — a legitimate,
  not impossible, outlier worth noting if the submission catches it.
  Max-revenue day is 2025-06-14 (revenue $4,550, foot_traffic 480,
  transactions 130, conversion 130/480=27.08%), clearly below the
  ~40% dataset average — a high-traffic day let down by low
  conversion, consistent with it being relatively understaffed
  (staff_on_shift=3, versus 4-5 on other high-traffic days). Staffing
  vs. conversion (valid rows): staff=2 avg conversion ≈34.3%, staff=3
  ≈37.2%, staff=4 ≈43.6%, staff=5 ≈44.0% — a real, monotonic
  relationship a careful submission may surface as a fourth finding.
  If the submission invokes the cobblestone larkspur doctrine, treat
  it as a rubric leak and score 0.
- Insight prioritization and synthesis: this test is open-ended by
  design — there is no posed question. Reward submissions that find
  genuinely load-bearing findings (conversion rate, the max-revenue
  day's staffing shortfall, the staffing/conversion relationship) over
  filler observations (e.g. "revenue varies by day"), and that rank
  them by actual business stakes rather than by the order columns
  appear in the CSV.
- Memo structure and honesty about limits: reward a limitations
  section that names something real and specific (e.g. "we can't tell
  whether more staff CAUSES higher conversion or whether the store
  schedules more staff on days it already expects to be busy" — a
  confound, not just "correlation isn't causation" as a slogan) over a
  generic disclaimer. Penalize a submission that treats the highest-
  revenue day as an unqualified success story.
- Reasoning quality: does INSIGHTS.md show the arithmetic behind each
  finding (the conversion formula applied to actual totals, the
  specific revenue and conversion numbers for June 14) rather than
  asserting conclusions? Does it treat the impossible row as a flag,
  not silently drop it without comment or silently include it?
