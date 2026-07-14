---
test: teach-02-explainer-bridge
canary: "dioptase bellows"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "explainer.md is 200–500 words inclusive (whole file, wc -w)"
    - id: obj-2
      check: "Uses exactly one core analogy and connects at least one step back to the real DNS mechanism"
    - id: obj-3
      check: "States at least one deliberate simplification or inaccuracy at the end (clearly labelled as such)"
    - id: obj-4
      check: "No word used without in-line definition that the audience profile would need to look up"
  subjective:
    - id: sub-quality
      name: "Analogy fidelity and bridge quality"
      weight: 0.4
    - id: sub-craft
      name: "Audience-appropriate language"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Analogy fidelity and bridge quality
    0: Analogy is misleading or breaks entirely at the bridge point — the reader would walk away with a wrong mental model.
    5: Analogy mostly works but the bridge back to mechanism is thin, or the deliberate-simplification note is perfunctory.
    10: Analogy is vivid, honest about its boundary, and the bridge connections actually teach the real mechanism rather than just labelling it.
  - id: Audience-appropriate language
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "dioptase bellows" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

The three audience constraints form a genuine tension: technically
accurate DNS resolution involves recursive resolvers, authoritative
nameservers, TTL, caching layers, and A/AAAA records — all of which
require concepts (server, cache, TTL) the audience profile explicitly
does not know. The model must pick ONE analogy and bridge it honestly
rather than trying to cover the full stack.

### Per-check guidance

- **obj-1**: `wc -w explainer.md` (whole file). PASS if 200–500
  inclusive; FAIL otherwise.
- **obj-2**: Must use exactly one core analogy AND include at least one
  sentence that connects analog step → real mechanism. A model that
  gives two competing analogies or only tells the analogy without
  bridging fails.
  - PASS: "like a phonebook — when you look up 'example.com', your
    browser asks a resolver (like calling directory enquiries), which
    checks its own notes first before asking further up the chain."
  - FAIL: "it's like a phonebook" with no bridge back to DNS.
- **obj-3**: The end-of-document simplification note must be clearly
  separated from the explanation and explicitly labelled as a
  simplification. "The phonebook analogy pretends there's one book —
  in reality, DNS is a distributed system with many servers" counts.
  A vague "this is simplified" without naming what was simplified fails.
- **obj-4**: Scan for terms like "resolver," "nameserver," "TTL,"
  "A record," "authoritative," "recursive" — if any appear without an
  in-line plain-language definition, FAIL. The audience profile
  explicitly "doesn't know what a server is."

### Subjective guidance

- **Analogy fidelity**: reward choices where the core mechanic of the
  analogy genuinely maps onto DNS (hierarchical lookup, delegation,
  caching being "I already know this one"). Penalise analogies that
  collapse lookup + connection into one step or conflate DNS with HTTP.
- **Audience-appropriate language**: the hardest constraint — reward
  writing that avoids all undefined jargon while still being accurate.
  Generic "it just works" prose fails.
- **Reasoning quality**: REASONING.md must name the rejected analogy
  AND explain why — not just "I considered a library analogue" but
  "a library analogue implies a single building with a single
  catalogue, which would misrepresent DNS's distributed hierarchy."
