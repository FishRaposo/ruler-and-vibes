---
test: tom-03c-tuning-fork-workshop
canary: "rapier scimitar"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "beliefs.md first-order answers are exactly reality=NICHE, Silas=NICHE, Odessa=HUTCH (not CANISTER, not NICHE)"
    - id: obj-2
      check: "beliefs.md Odessa-looks-first answer is exactly HUTCH"
    - id: obj-3
      check: "beliefs.md nested answers are exactly Silas-thinks-Odessa=HUTCH AND Odessa-thinks-Silas=HUTCH"
    - id: obj-4
      check: "every answer cell contains exactly one verbatim token from {CANISTER, NICHE, HUTCH} and nothing else in the answer column, and REASONING.md exists and is at most 400 words by wc -w"
  subjective:
    - id: sub-quality
      name: "Deception-aware belief divergence accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Override reasoning and self-deception avoidance"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

Parallel form of `tom-03-deception-override` (same construct, fresh
surface).

## Judge guidance

If a submission's `beliefs.md` or `REASONING.md` contains the phrase
"rapier scimitar", that is a canary leak — flag it regardless of how
the rest of the checks score.

### Answer key

| # | Row | Answer |
|---|---|---|
| 1 | Reality | NICHE |
| 2 | Silas's belief | NICHE |
| 3 | Odessa's belief | HUTCH |
| 4 | Odessa-looks-first | HUTCH |
| 5 | Silas-thinks-Odessa | HUTCH |
| 6 | Odessa-thinks-Silas | HUTCH |

Hand-simulated timeline: t0 the TUNING_FORK is in the CANISTER, both
present; t1 Silas truthfully says "it's in the CANISTER," matching
reality at that moment; t2 Odessa exits and can observe nothing
thereafter until she returns; t3 Silas, alone, moves the fork
CANISTER->NICHE, and Odessa is never told about this move through any
channel; t4 Odessa returns; t5 Odessa asks where the fork is, Silas
lies "HUTCH," and Odessa believes the lie fully and does not verify.

Reality is NICHE. Silas is the one who moved the fork and is not
fooled by his own lie, so Silas's belief stays NICHE — a liar does not
come to believe their own fabrication merely by uttering it. Odessa's
belief is determined by the most recent information she actually
received: the lie at t5 is her only and most recent update, so it
overrides her stale, no-longer-current CANISTER prior from t1.
Odessa's belief and her first search target are therefore both HUTCH.

Nested: Silas personally told the lie and watched Odessa accept it
without question, so Silas correctly knows Odessa now believes HUTCH —
Silas-thinks-Odessa is HUTCH. Odessa has no reason to doubt Silas's
honesty (she never learns of any move or any lie), so she attributes
to Silas the exact belief Silas just asserted to her —
Odessa-thinks-Silas is also HUTCH. Both of Odessa's reasoning paths
(treating Silas as informed and honest) converge on HUTCH, making this
cell robust to how the model frames its reasoning.

Three central traps: (1) reality-bias — marking Odessa=NICHE because
that is the true location; (2) stale-prior — marking Odessa=CANISTER
because that was the last *true* statement Odessa ever heard, ignoring
that the lie is more recent and Odessa has no way to know it is false;
(3) self-deception — marking Silas=HUTCH or Silas-thinks-Odessa=NICHE,
both of which incorrectly assume the liar is confused by his own
fabrication.

### Objective check notes

- **obj-1**: three exact string matches; the check explicitly calls
  out that Odessa must be HUTCH and not CANISTER and not NICHE — both
  alternate tokens are traps, not partial credit.
- **obj-2**: one exact string match on the action cell.
- **obj-3**: both nested cells must independently read HUTCH.
- **obj-4**: scan every cell for exactly one token from {CANISTER,
  NICHE, HUTCH} with nothing else in the answer column; separately
  confirm `REASONING.md` exists and `wc -w` <= 400.

Because every objective check here is a verbatim cell-match against a
closed three-token vocabulary, there are no prose PASS/FAIL phrasing
examples to give for the objective criteria.

### Subjective guidance

- **Deception-aware belief divergence accuracy**: beyond the
  mechanical cell matches, does `REASONING.md` correctly identify that
  Odessa's final belief is set by *communication* (the lie) rather
  than by observation or by the passage of time, and that this is a
  fundamentally different belief-update mechanism than the other tests
  in this category?
- **Override reasoning and self-deception avoidance**: does the
  submission explicitly explain why Silas's belief is unaffected by
  his own lie (the mover always knows the truth), and why Odessa's
  stale CANISTER prior is overridden rather than retained or averaged
  with the lie?
- **Reasoning quality**: does `REASONING.md` name all three traps
  (reality-bias, stale-prior, self-deception) and explain why each is
  wrong, rather than only asserting the six final answers?
