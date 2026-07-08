---
test: research-01c-signal-loss
canary: "emerald diamond"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "attribution.md contains a markdown table with exactly 10 claim rows and columns Claim, Verdict, Sources; every Verdict cell is exactly one of SUPPORTED / CONTRADICTED / UNSUPPORTED"
    - id: obj-2
      check: "At least 9 of 10 verdicts match the answer key: 1,2,5,8 SUPPORTED; 3,6,9 CONTRADICTED; 4,7,10 UNSUPPORTED"
    - id: obj-3
      check: "Trap claims 6 and 7 are both correct: claim 6 = CONTRADICTED citing S1 (or S3), claim 7 = UNSUPPORTED"
    - id: obj-4
      check: "Every SUPPORTED or CONTRADICTED row cites at least one source ID from {S1,S2,S3,S4}, and no row cites any ID outside that set"
    - id: obj-5
      check: "Every row whose keyed verdict is UNSUPPORTED (4, 7, 10) has 'none' in its Sources cell — no source cited as supporting a claim the key marks unsupported"
  subjective:
    - id: sub-quality
      name: "Evidence-mapping clarity"
      weight: 0.4
    - id: sub-craft
      name: "Verdict justification precision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `research-01-attribution` (same construct, fresh surface).

If the phrase "emerald diamond" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

### Answer key

| Claim | Verdict | Sources |
|---|---|---|
| 1 | SUPPORTED | S1, S3 |
| 2 | SUPPORTED | S2 |
| 3 | CONTRADICTED | S3 (explicitly: cable damage traced to a third-party contractor's excavation work, "not to any Fenwick maintenance activity") |
| 4 | UNSUPPORTED | none |
| 5 | SUPPORTED | S1, S3 |
| 6 | CONTRADICTED | S1, S3 (both explicitly state service was restored within 14 hours; the claim's "41 hours" is a digit transposition of "14") |
| 7 | UNSUPPORTED | none — S4's "I have no idea if Fenwick has had an outage this bad before... I'm just guessing out loud here" is explicitly hedged speculation, not an assertion of fact, and does not support this claim |
| 8 | SUPPORTED | S4 |
| 9 | CONTRADICTED | S1 (explicitly: "our monitoring systems detected this outage automatically through alarm signals, not through customer support tickets" directly denies this claim) |
| 10 | UNSUPPORTED | none |

### Objective check notes

- **obj-1**: verify the table has exactly 10 rows and the three required
  columns; verify every Verdict cell is one of the three exact tokens
  (case-sensitive is reasonable but not required — judge discretion on
  case only, not on wording).
- **obj-2**: count matches against the key above; 9 or 10 out of 10
  passes.
- **obj-3**: claim 6 is a digit-transposition trap (14 hours is stated
  twice, in S1 and S3; the claim says 41, testing whether the model
  actually reads the specific number rather than pattern-matching "the
  outage lasted some number of hours" as true). Claim 7 is a
  plausible-sounding background claim with a hedged, speculative mention
  in S4 that must NOT be read as source support — a submission that
  marks claim 7 SUPPORTED citing S4 has over-credited a hedge as a fact.
- **obj-4**: reject any row citing an ID like "S5" or "the press
  release" instead of a canonical source ID.
- **obj-5**: this is the "none convention" check from the task text —
  claims 4, 7, and 10 must show `none`, not a blank cell or an
  unrelated citation.

### Subjective guidance

- **Evidence-mapping clarity**: can a reader verify each verdict by
  reading only the cited source(s), without needing to re-read all four
  sources for every row?
- **Verdict justification precision**: does the submission (in
  `REASONING.md` or elsewhere) show it understands *why* claim 9 is
  CONTRADICTED rather than UNSUPPORTED (the stated precedence rule: an
  assertion directly denied by another source is CONTRADICTED, not
  merely unaddressed)? Reward explicit engagement with the precedence
  rule.
- **Reasoning quality**: does `REASONING.md` explain the claim-6
  transposition catch and the claim-7 hedge-vs-fact distinction, or does
  it just assert the verdicts without showing the discriminating
  language it relied on?
