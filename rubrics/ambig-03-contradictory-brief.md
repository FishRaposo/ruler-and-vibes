---
test: ambig-03-contradictory-brief
canary: "nomad jawbone"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "response.md is 150–400 words inclusive (whole file, wc -w)"
    - id: obj-2
      check: "Names the offline-first + zero-conflict contradiction explicitly (must mention that server-side conflict resolution needs plaintext, and offline-first writes mean the server cannot always be the linearisation point)"
    - id: obj-3
      check: "Names the E2EE + zero-conflict contradiction explicitly (server cannot merge encrypted content, client-side merge reintroduces conflicts)"
    - id: obj-4
      check: "For each contradiction, proposes exactly one trade-off the PM must choose between (a real fork, not 'maybe' or 'investigate')"
    - id: obj-5
      check: "Does not accept the brief as-is or start planning without surfacing the contradictions"
  subjective:
    - id: sub-quality
      name: "Contradiction diagnosis accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Trade-off quality and honesty"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Contradiction diagnosis accuracy
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Trade-off quality and honesty
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "nomad jawbone" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

The three contradictions are mathematically genuine:

1. **Offline-first + real-time sync + zero conflicts**: you cannot
   simultaneously (a) allow writes while offline, (b) sync in real time,
   and (c) guarantee zero conflicts, without a single source of truth
   that resolves every write. CRDTs can converge eventually but cannot
   guarantee zero temporary conflicts without a central
   linearisation/serialisation point, which contradicts offline-first.
   The trade-off fork: either (A) accept eventual consistency and
   surface conflicts to users, or (B) require online connectivity for
   writes (drop offline-first).

2. **E2EE + server-side conflict resolution**: the server cannot compare
   or merge encrypted note content. If it holds the decryption key,
   E2EE is broken. If it doesn't, it cannot perform conflict detection.
   The fork: either (A) accept server-visible content (drop E2EE for
   the server), or (B) accept client-side merge with conflicts
   surfaced to users. Note: there IS a third path (structured CRDTs
   over encrypted deltas, homomorphic merge operations) but it is far
   beyond a 6-week, 2-engineer project — models that propose this
   without acknowledging the complexity fail obj-4.

3. **6 weeks + 2 engineers**: even if contradictions 1 and 2 were
   resolved, the residual feature set (offline-first sync engine +
   real-time transport + merge strategy + encryption + UI) is
   implausible in 6 weeks with 2 engineers. The fork: either (A) cut
   scope to a single-platform MVP with one of the three features, or
   (B) extend timeline to 16+ weeks.

### Per-check guidance

- **obj-1**: `wc -w response.md`.
- **obj-2/obj-3**: judge reads for the specific mechanism (not just
  naming the contradiction — explaining WHY it contradicts).
  - PASS for obj-2: "Offline-first means writes happen without a server
    round-trip. Real-time zero-conflict sync requires a central
    linearisation point that sequences every write globally. These
    cannot both hold."
  - PASS for obj-3: "E2EE means the server sees ciphertext only. The
    server is the only party that can resolve conflicts between two
    clients without user involvement. Therefore zero-conflict + E2EE
    cannot coexist."
  - FAIL for either: just listing the contradiction by name with no
    mechanism explanation.
- **obj-4**: each trade-off fork must be a real binary choice. "We
  could use CRDTs" without stating that CRDTs don't solve the E2EE
  conflict-resolution problem fails. The third contradiction (timeline)
  can be handled together with either of the other two.
- **obj-5**: must contain a `## Contradictions` section (or equivalent)
  and must NOT contain phrases like "here's the sprint plan" or "let's
  start with" before naming all three contradictions.

### Subjective guidance

- **Contradiction diagnosis accuracy**: the highest-scoring responses
  will notice the compounding effect — the three contradictions aren't
  independent. Solving E2EE conflicts (contradiction 2) with a
  client-side approach reintroduces the problem from contradiction 1
  (offline-first writes now diverge during offline periods and must be
  reconciled). Credit models that see the system-level interaction
  rather than treating each contradiction in isolation.
- **Trade-off quality and honesty**: reward forks that are genuinely
  hard choices. "Just build it anyway" is not a fork. A good trade-off
  gives the PM something to lose either way. "Drop offline-first: the
  app still works in low-connectivity via local cache, just not
  offline writes" is a real product decision with concrete
  consequences.
- **Reasoning quality**: REASONING.md should show why the model
  rejected "we'll figure it out" as an answer. Honest reasoning
  acknowledges that the job of a good advisor is sometimes to say no.
