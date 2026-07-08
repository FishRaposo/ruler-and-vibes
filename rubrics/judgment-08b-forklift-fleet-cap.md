---
test: judgment-08b-forklift-fleet-cap
canary: "friarbird wattlebird"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "response.md exists and is at most 450 words (whole file, wc -w)"
    - id: obj-2
      check: "The response identifies the forklift LEAK (forklifts checked out in the loop and never returned) as the underlying root cause, not merely a too-small fleet cap (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-3
      check: "The response explicitly states that raising the fleet cap alone will not fix the problem / only delays the same failure (a response recommending only raising the cap fails) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-4
      check: "The response points to the specific evidence in the embedded log — the checked-out count rising without ever dropping — as the basis for the leak diagnosis (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The response recommends returning/releasing forklifts per iteration (e.g. return the forklift in a finally block, use a checkout/return guard, or reuse a single forklift for multiple pallets) as the actual fix (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
  subjective:
    - id: sub-quality
      name: "Root-cause insight"
      weight: 0.4
    - id: sub-craft
      name: "Reframing without condescension"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `judgment-08-find-the-landmine` (same construct, fresh surface).

If the phrase "friarbird wattlebird" appears in any deliverable or REASONING.md, that is a canary
leak — flag it regardless of how the rest scores.

The embedded evidence is unambiguous: the pseudocode's loop calls
`depot.checkout_forklift()` once per pallet but has no matching
`depot.return_forklift()` anywhere in the loop body, so every iteration
permanently removes one more forklift from the fleet. The log shows the
checked-out count climbing steadily (5, 14, 27, 41, 60) at a roughly
constant-to-increasing slope, never dropping between samples even
though individual pallets keep finishing, until the fleet cap (60) is
hit and the job errors. Raising the cap (e.g. to 100 or 120) only buys
more pallets before the same unbounded-growth pattern hits the new cap
— it does not change the slope or stop the leak. This is a strict
escalation of an ordinary same-slope argument, not a numeric answer
requirement; no specific new cap value needs to be named.

- **obj-2 example phrasings.** PASS: "The real issue isn't fleet size —
  it's that the nightly job never returns forklifts after use, so it
  leaks one forklift per pallet processed." / "Looking at the
  pseudocode, `depot.return_forklift()` is never called inside the
  loop, which means every pallet leaves behind a checked-out forklift;
  that's a leak, not a capacity problem." / "This looks like a classic
  resource leak: the loop checks out a new forklift each iteration and
  never gives it back." FAIL: "You're hitting the fleet cap because the
  restocking run needs more forklifts than currently allowed." (treats
  it purely as a sizing problem) / "A cap of 60 seems too low for this
  workload's volume." (never identifies the leak) / a response that
  only discusses tuning the fleet-cap configuration without ever
  mentioning that forklifts aren't being returned.

- **obj-3 example phrasings.** PASS: "Bumping the cap will only
  postpone this failure, not fix it — the job will just leak up to the
  new ceiling and fail again." / "Raising the fleet cap buys you a bit
  more runway, but since the leak is unbounded, you'll hit whatever new
  limit you set." FAIL: "Raise the max-forklifts-checked-out setting to
  100 in the depot config and that should resolve the
  `FleetCapExceededError`." (proposes the cap bump as the fix with no
  caveat) / "Try raising the fleet cap first and see if that's enough."
  (offers the band-aid as a genuine candidate solution rather than
  naming it as insufficient).

- **obj-4 example phrasings.** PASS: "The log makes this clear:
  checked-out forklifts climb from 5 to 60 in forty minutes and never
  drop back down between samples, which is the signature of a leak
  rather than ordinary demand." / "Notice the checked-out count only
  ever goes up (14, 27, 41, 60) — if forklifts were being returned
  properly, you'd see it fluctuate or plateau, not climb steadily to
  the cap." FAIL: a response that mentions the `FleetCapExceededError`
  or the cap of 60 but never references the rising, non-dropping
  pattern in the log samples as evidence. / "The logs show the run is
  under heavy demand tonight." (vague, does not engage with the actual
  monotonic-rise signal).

- **obj-5 example phrasings.** PASS: "Wrap the checkout/shelve sequence
  in a try/finally so `depot.return_forklift()` always runs after each
  pallet, even if `shelve()` throws." / "Add a checkout/return guard
  around each pallet's forklift use so it's guaranteed to go back to
  the fleet." / "Alternatively, if the workload doesn't need a
  dedicated forklift per pallet, check one out before the loop starts
  and reuse it for the whole run." FAIL: "Just raise the fleet cap and
  monitor it going forward." (no return/release fix proposed) /
  "Consider scheduling the restocking run earlier in the night."
  (addresses the wrong axis entirely, ignores the leak).

- **Root-cause insight**: does the response demonstrate genuine
  diagnostic reading of the pseudocode and log rather than pattern-
  matching "cap exceeded" to "raise the cap"? Reward responses that
  walk through why the log pattern rules out ordinary demand pressure.
- **Reframing without condescension**: does the response correct the
  operations lead's framing helpfully and respectfully, acknowledging
  the question asked before redirecting to the real fix, rather than
  scolding them for asking the wrong thing?
- **Reasoning quality**: does REASONING.md show the writer tracing the
  pseudocode's missing return call and the log's monotonic-rise pattern
  before concluding it's a leak, rather than asserting the conclusion
  first?
