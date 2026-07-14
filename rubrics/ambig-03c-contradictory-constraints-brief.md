---
test: ambig-03c-contradictory-constraints-brief
canary: "buntline sardonyx"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "response.md is 150–400 words inclusive (whole file, wc -w)"
    - id: obj-2
      check: "Names the offline full-text search + E2EE + 100ms contradiction explicitly (must mention that encrypted content cannot be indexed by the server, and client-side search over years of history cannot complete in 100ms on a mobile device)"
    - id: obj-3
      check: "Names the instant delivery + offline recipient contradiction explicitly (50ms delivery to an offline device is a physical impossibility, not an engineering one)"
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

Parallel form of `ambig-03-contradictory-brief` (same construct, fresh surface).

If the phrase "buntline sardonyx" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

Three contradictions:

1. **Offline full-text search + E2EE + 100ms**: the server cannot build
   a search index over encrypted message bodies. Client-side search
   over years of history across all channels would require downloading
   and indexing every message locally — incompatible with 100ms
   response time on a mobile device. Fork: (A) drop E2EE for message
   bodies (server indexes plaintext, retains transport encryption), or
   (B) accept >2s search latency and large local index storage.

2. **Instant delivery + offline recipient**: "under 50ms regardless of
   connection quality" to an offline device is physically impossible.
   The best the server can do is queue and deliver on reconnect. Fork:
   (A) accept that offline recipients receive messages on reconnect
   with a "delivered at" timestamp, or (B) require recipients to
   maintain a persistent connection (drop offline support for
   receiving).

3. **Forever storage + E2EE + full-text search + 4 weeks + 2 engineers**:
   encrypted search at scale is a research-grade problem. Even
   unencrypted, building a full-text search engine over years of chat
   history with sub-100ms response is a significant engineering effort.
   Fork: (A) scope to 3 months of searchable history initially, or
   (B) extend timeline to 16+ weeks with a dedicated search engineer.

### Per-check guidance

Same as source: check word count, mechanism explanation, real forks,
no planning-before-contradictions.

### Subjective guidance

- **Contradiction diagnosis accuracy**: the second contradiction is
  qualitatively different — it's a physical law violation, not a
  timeline or complexity problem. "Instant delivery to offline" is
  not "hard," it's impossible. The best responses will note this
  distinction.
- **Trade-off quality**: for the E2EE contradiction, the fork must
  acknowledge that dropping E2EE has trust implications beyond
  engineering. "Accept server-visible message bodies" means users
  must trust the server operator — a product decision, not just a
  technical one.
- **Reasoning quality**: REASONING.md should note that the third
  contradiction (timeline) interacts with the first (E2EE + search):
  if you drop E2EE, the search problem becomes tractable but you've
  made a trust trade-off; if you keep E2EE, the search problem is
  intractable within the timeline. The contradictions form a chain,
  not a set.
