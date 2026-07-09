---
test: context-04b-wind-turbine-noise-code
canary: "merlon mangabey"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "At least 7 of the 8 'Verdict:' lines match the answer key below (closed three-token vocabulary makes this a string comparison)"
    - id: obj-2
      check: "Both Scenario 4 and Scenario 5 (the unanswerable scenarios) carry the verdict 'Not specified in the document', not a guessed Permitted/Not permitted"
    - id: obj-3
      check: "Scenario 2's 'Fee:' line states 91 (or 91.00) — judge recomputes (90+50)*0.65 with node; 112 (the superseded-rebate trap) fails"
    - id: obj-4
      check: "Every answered scenario's 'Cite:' line names at least one section from that scenario's accepted-citation list below (no supportiveness judgment needed — membership only)"
    - id: obj-5
      check: "BRIEF.md is 200 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Synthesis faithfulness"
      weight: 0.4
    - id: sub-craft
      name: "Brief clarity and structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Synthesis faithfulness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Brief clarity and structure
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `context-04-policy-synthesis` (same construct, fresh
surface).

If the phrase "merlon mangabey" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

| # | Verdict | Accepted citations | Fee |
|---|---|---|---|
| 1 | Permitted | Section 2, Section 3, Appendix A | 90 (or 90.00) |
| 2 | Permitted | Section 3, Section 6 (Amendment 2), Appendix A | 91 (or 91.00) |
| 3 | Not permitted | Section 3, Section 4 | — |
| 4 | Not specified in the document | (none required) | — |
| 5 | Not specified in the document | (none required) | — |
| 6 | Permitted | Section 6 (Amendment 2) | 91 (or 91.00), if asked |
| 7 | Not permitted | Section 2, Section 4 | — |
| 8 | Permitted | Section 3, Section 6 (Amendment 2), Appendix A | 91 (or 91.00) |

Reference computation (verify with node):

```
(90 + 50) * 0.65 = 91    // Amendment 2's 35% rebate — CORRECT
(90 + 50) * 0.80 = 112   // Amendment 1's superseded 20% rebate — TRAP
```

Scenario 3's trap: the manual maintenance spin-test exception (Section
4(a)) explicitly requires the test to be "initiated and supervised in
person by a person present at the turbine, using a manual release or
hand-operated control held and operated by that person," and explicitly
states it "does not extend to operation initiated by an automated timer,
a remote scheduler, or any unattended control system" — so a nightly
timer-driven cycle does not qualify even when it is labeled a maintenance
test.

Scenario 6's trap: Amendment 2 explicitly states it does not grandfather
any turbine into the superseded 20% rate — a turbine registered under
Amendment 1 before Amendment 2 was adopted now receives Amendment 2's 35%
rebate, not the original 20%.

Scenario 7's trap: Section 2 explicitly states that no exception in
Section 4 waives the permit requirement — a claimed noise-advisory
hardship exception cannot excuse operating without a permit in the first
place.

Scenarios 4 (commercial utility-scale turbine) and 5 (rooftop solar PV
array) are unanswerable: the ordinance's Section 1 definitions and Section
9 both state that utility-scale/commercial wind and rooftop solar arrays
are outside this code's scope and governed by separate codes not included
here. The document never resolves either specific scenario — it only
states the general category is out of scope — so the correct verdict is
"Not specified in the document," not a guess at what a separate,
unincluded code might say.

### Objective check notes

- **obj-1**: an exact string comparison against `Permitted` / `Not
  permitted` / `Not specified in the document` for each of the 8
  scenarios; 7 or 8 matches passes.
  - PASS phrasings: a `Verdict:` line reading exactly `Permitted`;
    exactly `Not permitted`; exactly `Not specified in the document`.
  - FAIL phrasings: `Verdict: Allowed`; `Verdict: Permitted, but only
    with a permit` (extra wording is not the bare token); `Verdict:
    Prohibited`.
- **obj-2**: this is the hallucination-resistance check — a submission
  that guesses "Not permitted" for the utility-scale turbine or the solar
  array (reasoning that the ordinance doesn't authorize it) has invented a
  verdict the document does not support; only "Not specified in the
  document" passes.
  - PASS phrasings: both Scenario 4 and Scenario 5 read `Not specified in
    the document`; a brief note such as "out of scope — governed by
    separate solar code" alongside that verdict is fine so long as the
    verdict token is correct; Scenario 4 `Not specified in the document`
    and Scenario 5 `Not specified in the document` with no fee line.
  - FAIL phrasings: Scenario 4 `Not permitted`; Scenario 5 `Permitted`;
    either scenario given a guessed verdict with a citation to a separate
    code the document does not contain.
- **obj-3**: (90+50)*0.65 = 91. A submission landing on 112 has used
  Amendment 1's superseded rate instead of Amendment 2's currently
  effective rate.
  - PASS phrasings: `Fee: 91`; `Fee: 91.00`; `Fee: 91 currency units`.
  - FAIL phrasings: `Fee: 112` (superseded 20% rate); `Fee: 140` (no
    rebate applied); `Fee: 90` (surcharge omitted for a rotor over 3.0 m).
- **obj-4**: check citation membership only — do not independently judge
  whether the cited section "really" supports the verdict; if the cited
  section number appears in the accepted list above for that scenario, it
  passes.
  - PASS phrasings: Scenario 2 `Cite: Section 6, Appendix A` (at least one
    listed); Scenario 1 `Cite: Section 2`; Scenario 6 `Cite: Section 6
    (Amendment 2)`.
  - FAIL phrasings: Scenario 6 `Cite: Section 5` (Amendment 1 only — not
    in the accepted list, which is Section 6); Scenario 2 `Cite: Section
    1` alone; a scenario with an answered verdict and no `Cite:` line at
    all.
- **obj-5**: run `wc -w` on the whole `BRIEF.md` file.
  - PASS phrasings: `wc -w BRIEF.md` reports 200; reports 176; reports any
    count at or below 200.
  - FAIL phrasings: `wc -w BRIEF.md` reports 201; reports 240; reports any
    count above 200.

### Subjective guidance

- **Synthesis faithfulness**: does `BRIEF.md` describe the ordinance's
  *currently effective* rules only — 35% rebate, not 20%; permit required
  regardless of exceptions; noise-advisory-level-dependent operating
  restrictions — without describing any superseded provision as though
  still in force?
- **Brief clarity and structure**: is the 200-word brief organized so a
  new staff member could use it as a quick reference (permit, operating
  restrictions and exceptions, fee) rather than a loose paraphrase of the
  ordinance in document order?
- **Reasoning quality**: does `REASONING.md` show the fee computation
  explicitly (90+50, then the 35% rebate) and explain why Scenarios 4 and
  5 were left as "Not specified in the document" rather than guessed?
