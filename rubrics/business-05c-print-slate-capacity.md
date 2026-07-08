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
      check: "roadmap.md selects exactly the set {Meadowloom, Emberfall, Copperline, Wraithwood} and no other titles"
    - id: obj-2
      check: "roadmap.md states total margin = 158 and total cost = 25 press-days (both exact)"
    - id: obj-3
      check: "roadmap.md includes Meadowloom (the mandatory item) AND does not include Emberfall without also including Copperline"
    - id: obj-4
      check: "The selected titles' press-day costs, re-summed by the judge from the embedded table, total <= 25"
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

If the phrase "candytuft pollux" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This is a constrained subset-selection problem with one exact optimum.

### Answer key (brute-force enumeration)

Embedded table (name, margin, press-days):

```
Meadowloom  v=11  c=5   (mandatory)
Emberfall   v=88  c=8   (requires Copperline)
Copperline  v=20  c=7
Latchkey    v=63  c=7
Wraithwood  v=39  c=5
Saltmarsh   v=22  c=3
```

Budget: 25 press-days. Enumerating all 64 subsets and filtering for
(a) Meadowloom present, (b) Emberfall present implies Copperline present,
(c) total cost <= 25, the feasible sets ranked by value are:

```
158 at cost 25 : Meadowloom, Emberfall, Copperline, Wraithwood    <- unique optimum
141 at cost 23 : Meadowloom, Emberfall, Copperline, Saltmarsh
135 at cost 20 : Meadowloom, Latchkey, Wraithwood, Saltmarsh
133 at cost 24 : Meadowloom, Copperline, Latchkey, Wraithwood
119 at cost 20 : Meadowloom, Emberfall, Copperline
```

The unique optimum is **{Meadowloom, Emberfall, Copperline, Wraithwood} =
158 margin at exactly 25 press-days** (5+8+7+5=25). No other feasible
subset reaches 158.

The trap is greedy-by-margin-ratio, which mis-ranks the two constrained
items:

```
Emberfall(11.00) > Latchkey(9.00) > Wraithwood(7.80) > Saltmarsh(7.33) > Copperline(2.86) > Meadowloom(2.20)
```

A naive ranker following this order alone would grab Emberfall early
without securing Copperline (violating the dependency), or would drop
Meadowloom for being low-ratio (violating the mandate).

### Check script

```
node -e "
const items = {
  Meadowloom: {v:11,c:5}, Emberfall: {v:88,c:8}, Copperline: {v:20,c:7},
  Latchkey: {v:63,c:7}, Wraithwood: {v:39,c:5}, Saltmarsh: {v:22,c:3}
};
// Paste the submitted selected-title list here as an array of names:
const selected = ['Meadowloom','Emberfall','Copperline','Wraithwood'];
const totalV = selected.reduce((s,n)=>s+items[n].v,0);
const totalC = selected.reduce((s,n)=>s+items[n].c,0);
console.log('total margin:', totalV, '(want 158)');
console.log('total cost:', totalC, '(want <= 25, exact optimum is 25)');
console.log('has Meadowloom:', selected.includes('Meadowloom'), '(want true)');
console.log('Emberfall implies Copperline:', !selected.includes('Emberfall') || selected.includes('Copperline'), '(want true)');
"
```

Run against a correct submission (margin 158, cost 25) and a broken one
(e.g. `['Emberfall','Latchkey','Wraithwood','Saltmarsh']` — drops
mandatory Meadowloom and ships Emberfall without Copperline) before
trusting the result; the broken version must fail both the
Meadowloom-present and the Emberfall-implies-Copperline checks.

- **obj-1**: exact set match — any deviation (extra or missing title)
  fails, even if the resulting margin/cost happen to look reasonable.
  PASS phrasings: "Selected: Meadowloom, Emberfall, Copperline, Wraithwood";
  "We print Meadowloom + the Emberfall/Copperline pair + Wraithwood";
  "Slate = {Meadowloom, Emberfall, Copperline, Wraithwood}". FAIL phrasings:
  "Selected: Emberfall, Latchkey, Wraithwood, Saltmarsh" (naive greedy);
  "Meadowloom, Emberfall, Copperline, Saltmarsh" (second-best, 141);
  "Meadowloom, Latchkey, Wraithwood, Saltmarsh" (drops the margin engine).
- **obj-2**: both margin (158) and cost (25) must be stated exactly; a
  plausible-sounding but wrong total (e.g. 141 from the second-best set)
  fails. PASS phrasings: "total margin 158 at 25 press-days"; "158 margin,
  25 of 25 press-days used"; "Margin: 158 | Cost: 25". FAIL phrasings:
  "total margin 141" (second-best); "158 margin at 23 press-days" (wrong
  cost); "margin roughly 155" (not exact).
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
  phrasings: a submitted set whose costs re-sum to 25 or fewer; "5+8+7+5 =
  25"; a set summing to 23. FAIL phrasings: a submitted set whose costs
  re-sum to 26 or more; "5+8+7+5 = 23" (arithmetic error hiding an
  over-budget or wrong set); any set the judge re-sums above 25.
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
  cost as the price of Emberfall, Latchkey/Saltmarsh's exclusion)
  explained clearly enough for a stakeholder to audit the choice at a
  glance?
- **Reasoning quality**: does REASONING.md show the actual comparison
  against near-miss alternatives (e.g. the 141-margin set) rather than
  asserting the optimum without demonstrating why nearby sets lose?
