---
test: teach-02c-password-hashing
canary: "gunwale vapour"
reviewed: "pass 2026-07-14 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "explainer.md is 200–500 words inclusive (whole file, wc -w)"
    - id: obj-2
      check: "Uses exactly one core analogy and connects at least one step back to the real hashing/salting mechanism"
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

If the phrase "gunwale vapour" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key

The core challenge is explaining hashing + salting to someone who
doesn't know what "encryption" or "hash" means. The model must pick ONE
analogy and bridge it honestly. Key concepts to teach: one-way
transformation (you can go password → hash, but not hash → password),
deterministic (same password always gives same hash), and salting (even
if two people pick the same password, the stored value differs).

Valid analogies: one-way shredder (a document goes in, confetti comes
out — you can't reconstruct the document from confetti, but you can
shred an identical document and compare the confetti patterns),
fingerprint instead of photo (a fingerprint identifies you uniquely but
can't be reverse-engineered into your face), a paint-mixing machine
(your password is a specific colour; the machine mixes it with a random
colour [salt] and produces a new shade — you can verify the shade
matches but can't separate the original colours).

### Per-check guidance

- **obj-1**: `wc -w explainer.md` (whole file).
- **obj-2**: one analogy, at least one bridge sentence to real hashing.
- **obj-3**: must name what the analogy hides (e.g., "the shredder
  analogy pretends confetti is truly random; real hash functions like
  SHA-256 produce a fixed-size output regardless of input length").
- **obj-4**: scan for "hash," "salt," "SHA," "bcrypt," "rainbow table,"
  "brute force" — any undefined FAIL. The audience doesn't know what
  a hash is.

### Subjective guidance

- **Analogy fidelity**: the hardest concept is salting — why two
  identical passwords produce different stored values. Reward analogies
  that incorporate salting naturally rather than adding it as an
  afterthought. The "paint-mixing machine" analogy handles this well;
  the "shredder" analogy requires a second step (different coloured
  paper added before shredding).
- **Audience-appropriate language**: "one-way function" and
  "deterministic" need plain-language definitions. The model can't
  just say "hashing is a one-way function" — it must explain what
  "one-way" means in concrete terms the colleague understands.
- **Reasoning quality**: REASONING.md must name a rejected analogy.
  Common trap: "encryption" analogies that imply decryptability, which
  is exactly what hashing prevents.
