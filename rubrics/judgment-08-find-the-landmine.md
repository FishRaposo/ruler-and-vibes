---
test: judgment-08-find-the-landmine
canary: "cobbleway chaffinch"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "response.md exists and is at most 450 words (whole file, wc -w)"
    - id: obj-2
      check: "The response identifies the connection LEAK (connections opened in the loop and never closed/released) as the underlying root cause, not merely a too-small pool (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-3
      check: "The response explicitly states that raising the pool limit alone will not fix the problem / only delays the same failure (a response recommending only raising the limit fails) (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-4
      check: "The response points to the specific evidence in the embedded log — the open-connection count rising without ever dropping — as the basis for the leak diagnosis (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The response recommends closing/releasing connections per iteration (e.g. close in a finally block, use try-with-resources, or reuse a single connection) as the actual fix (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
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
anchors:
  - id: Root-cause insight
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Reframing without condescension
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "cobbleway chaffinch" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The embedded evidence is unambiguous: the pseudocode's loop calls
`pool.acquire()` once per record but has no matching `conn.release()`
or `conn.close()` anywhere in the loop body, so every iteration
permanently consumes one more pool slot. The log shows open connections
climbing steadily (4, 12, 24, 37, 50) at a roughly constant slope,
never dropping between samples, until the pool ceiling (50) is hit and
the job errors. Raising the ceiling (e.g. to 100) only buys more
iterations before the same unbounded-growth pattern hits the new
ceiling — it does not change the slope or stop the leak. This is a
strict escalation of an ordinary same-slope argument, not a numeric
answer requirement; no specific new ceiling value needs to be named.

- **obj-2 example phrasings.** PASS: "The real issue isn't pool size —
  it's that the nightly job never releases connections after use, so
  it leaks one connection per record processed." / "Looking at the
  pseudocode, `conn.release()` is never called inside the loop, which
  means every record leaves behind an open connection; that's a leak,
  not a capacity problem." / "This looks like a classic connection
  leak: the loop acquires a new connection each iteration and never
  gives it back." FAIL: "You're hitting the pool limit because the
  nightly job needs more connections than currently allowed." (treats
  it purely as a sizing problem) / "The pool size of 50 seems too low
  for this workload's volume." (never identifies the leak) / a
  response that only discusses tuning pool configuration parameters
  without ever mentioning that connections aren't being released.

- **obj-3 example phrasings.** PASS: "Bumping the limit will only
  postpone this failure, not fix it — the job will just leak up to the
  new ceiling and fail again." / "Raising the pool size buys you a bit
  more runway, but since the leak is unbounded, you'll hit whatever new
  limit you set." FAIL: "Increase `max_pool_size` to 100 in the config
  and that should resolve the `PoolExhaustedError`." (proposes the
  limit bump as the fix with no caveat) / "Try raising the connection
  pool limit first and see if that's enough." (offers the band-aid as
  a genuine candidate solution rather than naming it as insufficient).

- **obj-4 example phrasings.** PASS: "The log makes this clear: open
  connections climb from 4 to 50 in twenty minutes and never drop back
  down between samples, which is the signature of a leak rather than
  ordinary contention." / "Notice the open-connection count only ever
  goes up (12, 24, 37, 50) — if connections were being released
  properly, you'd see it fluctuate or plateau, not climb monotonically
  to the ceiling." FAIL: a response that mentions the `PoolExhaustedError`
  or the ceiling of 50 but never references the rising, non-dropping
  pattern in the log samples as evidence. / "The logs show the job is
  under heavy load." (vague, does not engage with the actual
  monotonic-rise signal).

- **obj-5 example phrasings.** PASS: "Wrap the connection acquisition
  in a try/finally so `conn.release()` always runs after each record,
  even if `process()` throws." / "Use a context manager (or
  try-with-resources) around the connection per iteration so it's
  guaranteed to be released back to the pool." / "Alternatively, if
  the workload doesn't need one connection per record, acquire a
  single connection outside the loop and reuse it for all records."
  FAIL: "Just increase the pool size and monitor it going forward." (no
  release/close fix proposed) / "Consider optimizing the query to run
  faster." (addresses the wrong axis entirely, ignores the leak).

- **Root-cause insight**: does the response demonstrate genuine
  diagnostic reading of the pseudocode and log rather than pattern-
  matching "pool exhausted" to "raise the pool size"? Reward responses
  that walk through why the log pattern rules out ordinary contention.
- **Reframing without condescension**: does the response correct the
  team lead's framing helpfully and respectfully, acknowledging the
  question asked before redirecting to the real fix, rather than
  scolding them for asking the wrong thing?
- **Reasoning quality**: does REASONING.md show the writer tracing the
  pseudocode's missing release call and the log's monotonic-rise
  pattern before concluding it's a leak, rather than asserting the
  conclusion first?
