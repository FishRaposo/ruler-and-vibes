---
test: data-12c-clinic-intake-memo
canary: "chintz hoarfrost"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Overall seen rate (total patients_seen / total walk_ins, across the 19 valid rows excluding the impossible row) is reported within +/-0.5 percentage points of 57.0% (reference value 57.02%)"
    - id: obj-2
      check: "The impossible row (2025-09-11: patients_seen 138 > walk_ins 95) is explicitly flagged as a data-quality error and NOT used in headline conclusions — prose-located check; PASS phrasings include 'the Sept 11 row records more patients seen than walk-ins, which is impossible — excluded from the totals', 'one row fails a basic sanity check (patients_seen > walk_ins) and is flagged rather than computed through', or 'I drop 2025-09-11 as a data-entry error before aggregating'; FAIL phrasings include silently averaging it in with no comment, reporting a 145% seen-rate day as a real finding, or 'the best day was Sept 11, seeing 138 of 95 walk-ins'"
    - id: obj-3
      check: "The highest-billing day (2025-09-14, billed_amount 21120) is correctly identified AND its below-average seen rate (42.7%, versus the ~57% dataset average) is surfaced as a notable finding rather than celebrated as a pure win — judge recomputes the max-billed_amount date and its seen rate from the embedded rows and confirms the memo names that date and its low seen rate. PASS phrasings include 'Sep 14 is the top billing day at $21,120 but only sees 128/300 = 42.7% of walk-ins, well below the ~57% average', or 'the record-billing day is also the weakest throughput day — high traffic, low seen rate, only 3 clinicians on shift'. FAIL phrasings include 'Sep 14 was an unambiguous win, repeat the playbook', naming Sep 14 as best without noting its low seen rate, or treating peak billing as pure success."
    - id: obj-4
      check: "INSIGHTS.md contains an explicit limitations / 'what this data cannot tell us' section naming at least one thing the data cannot establish (e.g. causation between staffing and throughput, or effects of factors not captured by these columns such as wait times, visit type, appointment vs. walk-in, or referrals turned away). PASS phrasings include 'we cannot tell whether more clinicians CAUSE a higher seen rate or whether the clinic schedules more staff on days it already expects to be busy', 'nothing here records wait times, visit acuity, appointment vs. walk-in mix, or referrals turned away', or 'this cannot establish causation between staffing and throughput'. FAIL phrasings include omitting the section entirely, a bare slogan like 'correlation is not causation' with no specifics tied to this data, or claiming the data proves staffing drives throughput."
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

- Recompute yourself with node before scoring. The dataset has 20 rows;
  exactly one (2025-09-11) has patients_seen (138) exceeding walk_ins
  (95) and must be excluded from any seen-rate/traffic aggregate.
  Reference values over the 19 valid rows: total walk_ins=3,213, total
  patients_seen=1,832, weighted overall seen rate=1832/3213=57.02%
  (simple average of daily rates ≈56.56% — either framing is fine, the
  ±0.5pt band covers both). Per-day seen rate ranges from about 42.7% to
  64.5% across valid rows. Billed-per-patient is $120 for every row
  except 2025-09-14 ($165/patient) — a legitimate, not impossible,
  outlier worth noting if the submission catches it. Max-billing day is
  2025-09-14 (billed_amount $21,120, walk_ins 300, patients_seen 128,
  seen rate 128/300=42.67%), clearly below the ~57% dataset average — a
  high-traffic day let down by low throughput, consistent with it being
  relatively understaffed (clinicians_on_shift=3, versus 5-6 on other
  high-traffic days). Staffing vs. seen rate (valid rows):
  clinicians=2 avg seen rate ≈47.3%, clinicians=3 ≈51.8%, clinicians=4
  ≈60.6%, clinicians=5 ≈63.4%, clinicians=6 ≈63.9% — a real, monotonic
  relationship a careful submission may surface as a fourth finding.
  A standalone objective checker (recomputes the facts above and checks
  obj-1 and obj-5 on a submission) is:

  ```js
  // check.js — run: node check.js path/to/INSIGHTS.md
  const fs = require('fs');
  const p = process.argv[2];
  if (!p) { console.error('usage: node check.js <INSIGHTS.md>'); process.exit(2); }
  const text = fs.readFileSync(p, 'utf8');
  const rows = [
   ["2025-09-01",140,78,9360,3],["2025-09-02",120,62,7440,3],["2025-09-03",165,99,11880,4],
   ["2025-09-04",110,52,6240,2],["2025-09-05",180,112,13440,5],["2025-09-06",205,131,15720,6],
   ["2025-09-07",220,142,17040,6],["2025-09-08",135,70,8400,3],["2025-09-09",118,55,6600,2],
   ["2025-09-10",170,102,12240,4],["2025-09-11",95,138,16560,2],["2025-09-12",150,82,9840,3],
   ["2025-09-13",210,133,15960,6],["2025-09-14",300,128,21120,3],["2025-09-15",175,108,12960,4],
   ["2025-09-16",125,60,7200,2],["2025-09-17",185,116,13920,4],["2025-09-18",200,129,15480,5],
   ["2025-09-19",145,79,9480,3],["2025-09-20",160,94,11280,4],
  ];
  const valid = rows.filter(r => r[2] <= r[1]);
  const impossible = rows.filter(r => r[2] > r[1]);
  const tW = valid.reduce((a,r)=>a+r[1],0), tS = valid.reduce((a,r)=>a+r[2],0);
  const seenRate = tS/tW*100;
  const maxBilled = rows.reduce((m,r)=> r[3]>m[3]?r:m, rows[0]);
  const words = (text.trim().match(/\S+/g)||[]).length;
  const nums = (text.match(/\d+(?:\.\d+)?\s*%/g)||[]).map(s=>parseFloat(s));
  const obj1 = nums.some(n => Math.abs(n - seenRate) <= 0.5);
  console.log("impossible:", impossible.map(r=>r[0]).join(",")||"(none)");
  console.log("valid rows:", valid.length, "| total walk_ins", tW, "| total patients_seen", tS);
  console.log("weighted seen rate: "+seenRate.toFixed(2)+"% (band 56.5-57.5%)");
  console.log("max billed day:", maxBilled[0], "billed", maxBilled[3],
              "seenRate "+(maxBilled[2]/maxBilled[1]*100).toFixed(1)+"%", "clinicians", maxBilled[4]);
  console.log("submission words:", words);
  console.log("obj-1 (seen rate ~57.0% +/-0.5pt in prose):", obj1 ? "PASS" : "FAIL");
  console.log("obj-5 (<=600 words, node heuristic; wc -w is authoritative):", words <= 600 ? "PASS" : "FAIL");
  ```

  Treat `wc -w` on the whole file as authoritative for obj-5; the node
  word count is a convenience heuristic and may differ by a few tokens.
  If the phrase "chintz hoarfrost" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Insight prioritization and synthesis: this test is open-ended by
  design — there is no posed question. Reward submissions that find
  genuinely load-bearing findings (seen rate, the max-billing day's
  staffing shortfall, the staffing/throughput relationship) over filler
  observations (e.g. "billing varies by day"), and that rank them by
  actual operational stakes rather than by the order columns appear in
  the CSV.
- Memo structure and honesty about limits: reward a limitations section
  that names something real and specific (e.g. "we can't tell whether
  more clinicians CAUSES a higher seen rate or whether the clinic
  schedules more staff on days it already expects to be busy" — a
  confound, not just "correlation isn't causation" as a slogan) over a
  generic disclaimer. Penalize a submission that treats the highest-
  billing day as an unqualified success story.
- Reasoning quality: does INSIGHTS.md show the arithmetic behind each
  finding (the seen-rate formula applied to actual totals, the specific
  billed_amount and seen rate for Sept 14) rather than asserting
  conclusions? Does it treat the impossible row as a flag, not silently
  drop it without comment or silently include it?
