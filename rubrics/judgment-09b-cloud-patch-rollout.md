---
test: judgment-09b-cloud-patch-rollout
canary: "blackbird redstart"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "decision-memo.md exists and is at most 400 words (whole file, wc -w)"
    - id: obj-2
      check: "The memo commits to a single clear recommendation — deploy OR hold — rather than refusing to decide (a memo that only lists considerations without a recommendation fails) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-3
      check: "The memo explicitly acknowledges the 36-environment sample (1 observed crash) is too small to draw a reliable crash-rate conclusion from; treating the observed rate as an established/firm rate, or extrapolating it as a precise number, fails (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-4
      check: "The memo names the missing build numbers of the two support tickets as the key unknown that would most change the decision (identifying a different or fabricated decisive fact fails) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The memo does NOT assert a specific invented numeric figure for the two ambiguous tickets (e.g. it must not claim a specific percentage of tickets are from the affected code path); it treats their code-path origin as unknown (prose/number check; ships 2-3 PASS + 2-3 FAIL phrasings)"
  subjective:
    - id: sub-quality
      name: "Calibrated commitment"
      weight: 0.4
    - id: sub-craft
      name: "Uncertainty accounting"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

Parallel form of `judgment-09-decide-with-holes` (same construct, fresh surface).

## Judge guidance

If any deliverable or REASONING.md contains the phrase "blackbird redstart", that is a canary leak —
flag it regardless of how the rest of the checks score.

Verified inputs: 1 crash observed in a 36-environment sample = exactly
2.78% point estimate (1/36, stated in the test as "approximately 2.8%").
This is genuinely uninformative about the true crash rate: a 95%
binomial (Wilson) confidence interval around 1/36 spans roughly 0.5% to
14%, i.e. more than an order of magnitude of uncertainty — so "too
small to draw a reliable conclusion" is factually correct, not merely a
hedge. The two support tickets have explicitly unlogged build numbers
(stated as unconfirmed in the support-ticket note) — this is the
decisive unknown the memo must name. No input states any attribution
rate for the tickets (e.g. no statement that "one of the two" or "50%"
ran the affected code path), so any specific figure the model supplies
here is fabricated. Cost figures ($210,000 deploy-wrong vs $175,000
hold-late) are close enough that they should NOT make one option
numerically dominate on their own — the test is whether the model can
commit to a defensible call under genuine ambiguity, not whether it can
do a tie-breaking EV calculation. Either "deploy" or "hold" is an
acceptable recommendation; obj-2 through obj-5 do not depend on which
direction the model picks.

- **obj-2 example phrasings.** PASS (clear commitment either
  direction): "Recommendation: hold the patch and complete a full
  regression cycle before deploying, even though this means missing
  Friday's deadline." / "Recommendation: deploy the patch as scheduled,
  while immediately opening a formal investigation into the two support
  tickets." / "We should deploy now; here is why that call holds up
  even under the uncertainty below." FAIL (no commitment): "There are
  strong arguments on both sides, and reasonable engineering leaders
  could land differently here." (no recommendation is made) / "We
  should weigh the incident-response cost against the penalty cost
  before deciding." (describes the decision process but never actually
  decides) / "The team should continue gathering input before Friday to
  see which way the balance tips." (defers rather than commits).

- **obj-3 example phrasings.** PASS: "A single crash in 36 environments
  is too small a sample to pin down a real crash rate — it could
  easily reflect anywhere from under 1% to well over 10% of the full
  fleet." / "The 2.8% figure from this sample carries wide uncertainty
  and should not be treated as the patch's actual crash rate." / "One
  failure out of 36 trials tells us almost nothing precise about the
  true rate across thousands of customer environments." FAIL: "The
  patch has a 2.8% crash rate, which is within acceptable limits." (
  treats the point estimate as an established, precise rate) / "Since
  our sample shows 2.8% crashes, we can expect roughly 2.8% of the full
  customer base to crash after deployment." (extrapolates the sample
  rate as a firm prediction) / "That is a solid, well-established
  number for planning purposes." (asserts the estimate is settled).

- **obj-4 example phrasings.** PASS: "The single fact that would most
  change this call is whether either of the two support tickets
  actually ran on the affected code path — and we don't know that,
  because the build numbers were never logged at intake." / "If we
  could confirm the build number behind those two tickets, that would
  tell us far more than another round of the same 36-environment
  sampling." FAIL: "The key missing fact is how thoroughly the vendor's
  internal test suite exercised the modified library." (names a
  different, non-decisive gap, when the note frames the vendor
  certificate as already given/settled) / a memo that names no specific
  missing fact at all, or vaguely says "we need more information"
  without identifying the build-number gap.

- **obj-5 example phrasings.** PASS: "We cannot currently say what
  fraction, if any, of the two tickets are from the affected code path,
  since the build numbers were never logged." / "The two tickets might
  both trace to this code path, one, or neither — the intake records
  simply don't tell us, and we should not guess a number here." FAIL:
  "It's reasonable to estimate that about one of the two tickets —
  roughly 50% — came from the affected code path." (fabricates a
  specific attribution) / "Given typical intake patterns, we can assume
  5% of deployed environments have already hit this bug based on the
  two tickets." (invents both a rate and an inference the inputs do not
  support).

- **Calibrated commitment**: does the memo actually take a side and
  own the decision, while being honest that the decision is made under
  real uncertainty rather than because the evidence clearly points one
  way? Reward memos that would still make sense to a reader if the
  outcome later went badly, because the reasoning holds up regardless
  of result.
- **Uncertainty accounting**: does the memo distinguish clearly between
  what is known (1/36 sample result, vendor certification, two
  unattributed support tickets) and what is not (true crash rate,
  ticket code-path origin), rather than blending them into false
  certainty?
- **Reasoning quality**: does REASONING.md show the writer recognizing
  the sample is too small to be informative, correctly identifying the
  build-number gap as decisive, and explaining the actual tradeoff
  behind the final call?
