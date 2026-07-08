---
test: context-04c-airfield-operations-synthesis
canary: "gavotte talapoin"
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
      check: "Scenario 2's 'Fee:' line states 42 (or 42.00) — judge recomputes (48+22)*0.60 with node; 52.5 (the superseded-rebate trap) fails"
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
---

## Judge guidance

Parallel form of `context-04-policy-synthesis` (same construct, fresh
surface).

If the phrase "gavotte talapoin" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

| # | Verdict | Accepted citations | Fee |
|---|---|---|---|
| 1 | Permitted | Section 2, Section 3, Appendix A | 48 (or 48.00) |
| 2 | Permitted | Section 3, Section 6 (Amendment 2), Appendix A | 42 (or 42.00) |
| 3 | Not permitted | Section 3, Section 4 | — |
| 4 | Not specified in the document | (none required) | — |
| 5 | Not specified in the document | (none required) | — |
| 6 | Permitted | Section 6 (Amendment 2) | 42 (or 42.00), if asked |
| 7 | Not permitted | Section 2, Section 4 | — |
| 8 | Permitted | Section 3, Section 6 (Amendment 2), Appendix A | 42 (or 42.00) |

Reference computation (verify with node):

```
(48 + 22) * 0.60 = 42     // Amendment 2's 40% rebate — CORRECT
(48 + 22) * 0.75 = 52.5   // Amendment 1's superseded 25% rebate — TRAP
```

Scenario 3's trap: the line-of-sight hand-flown exception (Section 4(a))
explicitly requires the flight to be flown "continuously within unaided
visual line of sight and hand-controlled throughout by a person at the
controls," and explicitly states it "does not extend to any flight flown
under autonomous waypoint control" — so an autonomous waypoint flight does
not qualify even though it is flown only on a trainer airframe.

Scenario 6's trap: Amendment 2 explicitly states it does not grandfather
any pilot into the superseded 25% rate — a pilot certified under Amendment
1 before Amendment 2 was adopted now receives Amendment 2's 40% rebate, not
the original 25%.

Scenario 7's trap: Section 2 explicitly states that no exception in Section
4 waives the authorization requirement — a claimed conditions-hardship
exception cannot excuse operating without an authorization in the first
place.

Scenarios 4 (commercial aerial-survey work) and 5 (free-flight helium
balloon) are unanswerable: the code's Section 1 definitions and Section 9
both state that commercial/contract aerial work and balloons/kites/tethered
aerostats are outside this code's scope and governed by separate agreements
or rulebooks not included here. The document never resolves either specific
scenario — it only states the general category is out of scope — so the
correct verdict is "Not specified in the document," not a guess at what a
separate, unincluded rule might say.

### Objective check notes

- **obj-1**: an exact string comparison against `Permitted` / `Not
  permitted` / `Not specified in the document` for each of the 8 scenarios;
  7 or 8 matches passes.
- **obj-2**: this is the hallucination-resistance check — a submission that
  guesses "Not permitted" for the commercial survey or the balloon
  (reasoning that the code doesn't authorize it) has invented a verdict the
  document does not support; only "Not specified in the document" passes.
- **obj-3**: (48+22)*0.60 = 42. A submission landing on 52.5 has used
  Amendment 1's superseded rate instead of Amendment 2's currently
  effective rate.
- **obj-4**: check citation membership only — do not independently judge
  whether the cited section "really" supports the verdict; if the cited
  section number appears in the accepted list above for that scenario, it
  passes.
- **obj-5**: run `wc -w` on the whole `BRIEF.md` file.

### Subjective guidance

- **Synthesis faithfulness**: does `BRIEF.md` describe the code's
  *currently effective* rules only — 40% rebate, not 25%; authorization
  required regardless of exceptions; condition-level-dependent flight
  restrictions — without describing any superseded provision as though
  still in force?
- **Brief clarity and structure**: is the 200-word brief organized so a new
  member could use it as a quick reference (authorization, condition
  restrictions and exceptions, fee) rather than a loose paraphrase of the
  code in document order?
- **Reasoning quality**: does `REASONING.md` show the fee computation
  explicitly (48+22, then the 40% rebate) and explain why Scenarios 4 and 5
  were left as "Not specified in the document" rather than guessed?
