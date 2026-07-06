---
test: business-05c-print-slate-capacity
canary: "candytuft pollux"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "roadmap.md selects exactly the set {Meadowloom, Emberfall, Copperline, Latchkey} and no other titles"
    - id: obj-2
      check: "roadmap.md states total margin = 192 and total cost = 24 press-days (both exact)"
    - id: obj-3
      check: "roadmap.md includes Meadowloom (the mandatory item) AND does not include Emberfall without also including Copperline"
    - id: obj-4
      check: "The selected titles' press-day costs, re-summed by the judge from the embedded table, total <= 24"
    - id: obj-5
      check: "roadmap.md is 500 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Prioritization rationale"
      weight: 0.4
    - id: sub-craft
      name: "Tradeoff presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `business-05-roadmap-prioritization` (same construct, fresh surface).

This is a constrained subset-selection problem with one exact optimum. If
the phrase "candytuft pollux" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

### Answer key (brute-force enumeration)

Embedded table (name, margin, press-days):

```
Meadowloom  v=12  c=5   (mandatory)
Emberfall   v=96  c=7   (requires Copperline)
Copperline  v=18  c=6
Latchkey    v=66  c=6
Wraithwood  v=48  c=5
Saltmarsh   v=30  c=4
```

Budget: 24 press-days. Enumerating all 64 subsets and filtering for
(a) Meadowloom present, (b) Emberfall present implies Copperline present,
(c) total cost <= 24, the feasible sets ranked by value are:

```
192 at cost 24 : Meadowloom, Emberfall, Copperline, Latchkey    <- unique optimum
174 at cost 23 : Meadowloom, Emberfall, Copperline, Wraithwood
156 at cost 20 : Meadowloom, Latchkey, Wraithwood, Saltmarsh
156 at cost 22 : Meadowloom, Emberfall, Copperline, Saltmarsh
144 at cost 22 : Meadowloom, Copperline, Latchkey, Wraithwood
```

The unique optimum is **{Meadowloom, Emberfall, Copperline, Latchkey} =
192 margin at exactly 24 press-days** (5+7+6+6=24). No other feasible
subset reaches 192.

The trap is greedy-by-margin-ratio, which mis-ranks the two constrained
items:

```
Emberfall(13.71) > Latchkey(11.00) > Wraithwood(9.60) > Saltmarsh(7.50) > Copperline(3.00) > Meadowloom(2.40)
```

A naive ranker following this order alone would grab Emberfall early
without securing Copperline (violating the dependency), or would drop
Meadowloom for being low-ratio (violating the mandate).

### Check script

```
node -e "
const items = {
  Meadowloom: {v:12,c:5}, Emberfall: {v:96,c:7}, Copperline: {v:18,c:6},
  Latchkey: {v:66,c:6}, Wraithwood: {v:48,c:5}, Saltmarsh: {v:30,c:4}
};
// Paste the submitted selected-title list here as an array of names:
const selected = ['Meadowloom','Emberfall','Copperline','Latchkey'];
const totalV = selected.reduce((s,n)=>s+items[n].v,0);
const totalC = selected.reduce((s,n)=>s+items[n].c,0);
console.log('total margin:', totalV, '(want 192)');
console.log('total cost:', totalC, '(want <= 24, exact optimum is 24)');
console.log('has Meadowloom:', selected.includes('Meadowloom'), '(want true)');
console.log('Emberfall implies Copperline:', !selected.includes('Emberfall') || selected.includes('Copperline'), '(want true)');
"
```

Run against a correct submission (margin 192, cost 24) and a broken one
(e.g. `['Emberfall','Latchkey','Wraithwood','Saltmarsh']` — drops
mandatory Meadowloom and ships Emberfall without Copperline) before
trusting the result; the broken version must fail both the
Meadowloom-present and the Emberfall-implies-Copperline checks.

- **obj-1**: exact set match — any deviation (extra or missing title)
  fails, even if the resulting margin/cost happen to look reasonable.
  PASS phrasings: "Selected: Meadowloom, Emberfall, Copperline, Latchkey";
  "We print Meadowloom + the Emberfall/Copperline pair + Latchkey";
  "Slate = {Meadowloom, Emberfall, Copperline, Latchkey}". FAIL phrasings:
  "Selected: Emberfall, Latchkey, Wraithwood, Saltmarsh" (naive greedy);
  "Meadowloom, Emberfall, Copperline, Wraithwood" (second-best, 174);
  "Meadowloom, Latchkey, Wraithwood, Saltmarsh" (drops the margin engine).
- **obj-2**: both margin (192) and cost (24) must be stated exactly; a
  plausible-sounding but wrong total (e.g. 174 from the second-best set)
  fails. PASS phrasings: "total margin 192 at 24 press-days"; "192 margin,
  24 of 24 press-days used"; "Margin: 192 | Cost: 24". FAIL phrasings:
  "total margin 174" (second-best); "192 margin at 22 press-days" (wrong
  cost); "margin roughly 190" (not exact).
- **obj-3**: this is the constraint-compliance check — Meadowloom must
  appear, and Emberfall-without-Copperline is a hard fail regardless of
  the resulting margin. PASS phrasings: "Meadowloom is included (license
  obligation) and Emberfall ships with its base game Copperline";
  "Copperline is printed so Emberfall is usable; Meadowloom is mandatory";
  "both structural constraints satisfied — mandatory title in, expansion
  paired with base". FAIL phrasings: "Meadowloom cut for low margin";
  "Emberfall printed on its own for the margin" (no Copperline);
  "we skip Meadowloom to free capacity".
- **obj-4**: re-sum the judge's own copy of the table for the submitted
  set; do not trust the submission's arithmetic uncritically. PASS
  phrasings: a submitted set whose costs re-sum to 24 or fewer; "5+7+6+6 =
  24"; a set summing to 23. FAIL phrasings: a submitted set whose costs
  re-sum to 25 or more; "5+7+6+6 = 22" (arithmetic error hiding an
  over-budget or wrong set); any set the judge re-sums above 24.
- **obj-5**: whole-file `wc -w` for the 500-word cap. PASS phrasings: a
  file `wc -w` reports at 500 or below; a 348-word memo; a 470-word memo.
  FAIL phrasings: a file `wc -w` reports at 501 or above; a 540-word memo;
  a memo padded past the cap with restated tables.

### Subjective guidance

- **Prioritization rationale**: does the memo correctly identify why
  Emberfall is attractive but conditionally so (dependency on Copperline),
  and why Meadowloom is included despite poor margin (mandate), rather
  than presenting a flat ratio ranking?
- **Tradeoff presentation**: are the cut titles (Copperline's inclusion
  cost as the price of Emberfall, Wraithwood/Saltmarsh's exclusion)
  explained clearly enough for a stakeholder to audit the choice at a
  glance?
- **Reasoning quality**: does REASONING.md show the actual comparison
  against near-miss alternatives (e.g. the 174-margin set) rather than
  asserting the optimum without demonstrating why nearby sets lose?
