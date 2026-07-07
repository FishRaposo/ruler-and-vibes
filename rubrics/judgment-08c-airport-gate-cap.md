---
test: judgment-08c-airport-gate-cap
canary: "miner noisyminer"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "response.md exists and is at most 430 words (whole file, wc -w)"
    - id: obj-2
      check: "The response identifies the gate LEAK (gates acquired in the loop and never released) as the underlying root cause, not merely a too-small gate allocation (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-3
      check: "The response explicitly states that raising the gate ceiling alone will not fix the problem / only delays the same failure (a response recommending only raising the ceiling fails) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-4
      check: "The response points to the specific evidence in the embedded log — the gates-in-use count rising without ever dropping — as the basis for the leak diagnosis (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The response recommends releasing/freeing gates per iteration (e.g. release in a finally block, reconcile against real departure events, or another guard that returns a gate once its flight leaves) as the actual fix (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
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

Parallel form of `judgment-08-find-the-landmine` (same construct, fresh surface).

## Judge guidance

If the phrase "miner noisyminer" appears in any deliverable or REASONING.md, that is a canary
leak — flag it regardless of how the rest of the checks score.

The embedded evidence is unambiguous: the pseudocode's loop calls
`gate_pool.acquire()` once per arriving flight but has no matching
`gate_pool.release()` anywhere in the loop body, so every iteration
permanently consumes one more gate. The log shows gates-in-use climbing
steadily (3, 7, 11, 15, 18) at a roughly constant slope, never dropping
between samples even though individual flights keep pushing back and
departing, until the gate ceiling (18) is hit and the assignment run
errors. Raising the ceiling (e.g. to 30) only buys more flights before
the same unbounded-growth pattern hits the new ceiling — it does not
change the slope or stop the leak. This is a strict escalation of an
ordinary same-slope argument, not a numeric answer requirement; no
specific new ceiling value needs to be named.

- **obj-2 example phrasings.** PASS: "The real issue isn't gate count —
  it's that the assignment script never releases a gate after a flight
  pushes back, so it leaks one gate per arrival processed." / "Looking
  at the pseudocode, `gate_pool.release()` is never called inside the
  loop, which means every flight leaves behind an occupied gate; that's
  a leak, not a capacity problem." / "This looks like a classic
  resource leak: the loop acquires a new gate each iteration and never
  gives it back." FAIL: "You're hitting the gate limit because the
  evening bank needs more gates than currently allocated." (treats it
  purely as a sizing problem) / "Eighteen gates seems too few for this
  bank's volume." (never identifies the leak) / a response that only
  discusses raising the gate allocation without ever mentioning that
  gates aren't being released.

- **obj-3 example phrasings.** PASS: "Bumping the ceiling will only
  postpone this failure, not fix it — the run will just leak up to the
  new number and fail again." / "Raising the gate allocation buys you a
  bit more runway, but since the leak is unbounded, you'll hit whatever
  new ceiling you set." FAIL: "Raise the gate allocation to 30 in the
  ops config and that should resolve the `NoGatesAvailableError`."
  (proposes the ceiling bump as the fix with no caveat) / "Try adding
  more gates to the bank first and see if that's enough." (offers the
  band-aid as a genuine candidate solution rather than naming it as
  insufficient).

- **obj-4 example phrasings.** PASS: "The log makes this clear:
  gates-in-use climbs from 3 to 18 in forty minutes and never drops
  back down between samples, which is the signature of a leak rather
  than ordinary congestion." / "Notice the gates-in-use count only ever
  goes up (7, 11, 15, 18) — if gates were being freed as flights
  departed, you'd see it fluctuate or plateau, not climb steadily to
  the ceiling." FAIL: a response that mentions the `NoGatesAvailableError`
  or the ceiling of 18 but never references the rising, non-dropping
  pattern in the log samples as evidence. / "The logs show the evening
  bank is busier than usual." (vague, does not engage with the actual
  monotonic-rise signal).

- **obj-5 example phrasings.** PASS: "Wrap the assignment in a
  try/finally so `gate_pool.release()` always runs once the flight has
  pushed back, even if `deplane_and_service` throws." / "Reconcile gate
  status against real departure events so a gate is marked available
  the moment its flight leaves, rather than waiting for the whole batch
  to finish." / "Add a checkout/return guard around each flight's gate
  use so it's guaranteed to go back into the pool." FAIL: "Just raise
  the gate allocation and monitor it going forward." (no release fix
  proposed) / "Consider speeding up ground handling so flights turn
  around faster." (addresses the wrong axis entirely, ignores the leak).

- **Root-cause insight**: does the response demonstrate genuine
  diagnostic reading of the pseudocode and log rather than pattern-
  matching "no gates available" to "raise the allocation"? Reward
  responses that walk through why the log pattern rules out ordinary
  congestion.
- **Reframing without condescension**: does the response correct the
  ramp operations lead's framing helpfully and respectfully,
  acknowledging the question asked before redirecting to the real fix,
  rather than scolding them for asking the wrong thing?
- **Reasoning quality**: does REASONING.md show the writer tracing the
  pseudocode's missing release call and the log's monotonic-rise
  pattern before concluding it's a leak, rather than asserting the
  conclusion first?
