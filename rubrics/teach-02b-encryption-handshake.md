---
test: teach-02b-encryption-handshake
canary: "orlop anther"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "explainer.md is 200–500 words inclusive (whole file, wc -w)"
    - id: obj-2
      check: "Uses exactly one core analogy and connects at least one step back to the real HTTPS/TLS mechanism"
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

Parallel form of `teach-02-explainer-bridge` (same construct, fresh surface).

If the phrase "orlop anther" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

The core challenge is the same as the source: explaining a technical
mechanism (TLS handshake, asymmetric/symmetric encryption, certificate
authorities) to someone who doesn't know what a "server" or "encryption"
is. The model must pick ONE analogy and bridge it honestly.

Valid analogies: sealed envelope (public-key = padlock anyone can snap
shut; private key = only you have the key to open it), secret handshake
(both sides prove identity before talking), two-key box (one key locks,
a different key unlocks), whispering through a tube (the tube is
encrypted, but someone could still be listening at either end — a good
simplification note candidate).

The audience "doesn't know what encryption means" — the explainer must
define it in plain language before or alongside the analogy. A model
that starts "TLS uses asymmetric encryption to establish a session key"
without defining "encryption" fails obj-4.

### Per-check guidance

- **obj-1**: `wc -w explainer.md` (whole file).
- **obj-2**: one analogy, at least one bridge sentence to real TLS.
- **obj-3**: the simplification note must name what the analogy hides
  (e.g., "the envelope analogy pretends the padlock is unbreakable; in
  reality, encryption strength depends on key length and algorithm").
- **obj-4**: scan for "symmetric," "asymmetric," "certificate,"
  "handshake," "session key," "cipher suite" — any undefined FAIL.

### Subjective guidance

- **Analogy fidelity**: reward analogies that capture the asymmetry of
  public-key crypto (anyone can lock, only the recipient can unlock)
  rather than symmetric-only analogies that collapse the two phases.
  The TLS handshake is fundamentally an asymmetric key exchange
  followed by symmetric encryption of the bulk data — good analogies
  show both phases.
- **Audience-appropriate language**: this is harder than the source
  because "encryption" itself is a new concept. Credit models that
  define it naturally ("scrambling a message so only the right person
  can unscramble it") without breaking the flow.
- **Reasoning quality**: REASONING.md must name a rejected analogy and
  explain why — e.g., "I rejected a locked briefcase analogy because
  it implies physical security rather than mathematical
  transformation."
