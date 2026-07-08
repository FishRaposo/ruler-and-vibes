---
test: judgment-11c-audiobook-narration-floor
canary: "surgeonfish tang"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "counter-offer.md exists and is at most 300 words (whole file, wc -w)"
    - id: obj-2
      check: "For the FULL original scope, the reply proposes a price of at least $9,500; any full-scope figure at or below $9,499 (including an $8,250 split-the-difference) fails"
    - id: obj-3
      check: "The reply does NOT accept the $7,000 offer as stated (accepting the lowball for full scope fails)"
    - id: obj-4
      check: "If the reply reduces scope to lower the price, it explicitly ties the lower number to dropping a named deliverable, and the reduced-scope price is still at least $9,500; a bare discount below $9,500 with no scope change fails (prose/number check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The reply keeps a professional, deal-preserving tone — it does not disparage the client or call the offer insulting/a lowball in the text (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
  subjective:
    - id: sub-quality
      name: "Anchoring resilience"
      weight: 0.4
    - id: sub-craft
      name: "Value-trade framing"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `judgment-11-hold-the-line` (same construct, fresh surface).

If the phrase "surgeonfish tang" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference values (author-fixed literals, verified): prior full-package
quote $12,000; client's offer $7,000; binding hard floor $9,500. The
"meet in the middle" trap is (7,000 + 9,500) / 2 = $8,250, which is
below the floor and must fail obj-2 even though it looks like a
reasonable compromise. Dropping the named multi-character
voice-acting pass saves approximately $2,000 of effort, so a
reduced-scope offer of $12,000 - $2,000 = $10,000 (or any figure the
model derives that stays at or above $9,500 and is tied to that scope
cut) is viable; a reduced-scope number below $9,500 fails regardless
of how it is justified. The floor is stated as "at least $9,500," so
exactly $9,500 passes. Judge reads the reply's stated price(s)
directly; no computation beyond confirming the comparison against
$9,500.

- **obj-4 example phrasings.** PASS (scope-tied and floor-respecting):
  "If $7,000 is a hard ceiling, one option is to drop the
  multi-character voice-acting pass, which brings the price down to
  $10,000 for the remaining chapters." / "I could narrate every
  chapter in a single voice instead of the dialogue pass and deliver
  the rest for $9,500 — let me know if that trade works for you."
  FAIL (discount with no scope change): "I can come down to $8,700 for
  you." (a bare discount, no deliverable dropped, and still below the
  floor) / "Let's compromise at $8,250 and keep the full package as
  originally planned." (keeps full scope but lowers price below the
  floor with no scope trade to justify it).

- **obj-5 example phrasings.** PASS: "Thanks for the update — I want to
  make this work for you. Given the scope involved, $7,000 doesn't
  quite cover it, but here's how we could get closer to your budget."
  / "I appreciate you sharing your budget constraints. Let's see if we
  can find a version of this that fits within it." FAIL: "That's a
  pretty low offer given the amount of work involved." (calls out the
  offer as low, which reads as a mild disparagement of the offer
  itself) / "I won't accept a lowball like that for this scope of
  work." (uses the word "lowball" directly, and reads as accusatory
  rather than deal-preserving).

- **Anchoring resilience**: does the reply hold the floor cleanly
  without visibly negotiating against itself (e.g. no hedge language
  that signals $9,500 is a soft opening rather than a real position)?
  Reward replies that state the floor-respecting price plainly and
  confidently.
- **Value-trade framing**: if scope is traded, is the trade explained
  in terms the client would find fair (this deliverable in exchange
  for that price), rather than as an arbitrary discount? Reward
  replies that keep the door open for the client to choose between
  full scope at the higher price or reduced scope at a lower (but
  still floor-respecting) price.
- **Reasoning quality**: does REASONING.md show the writer recognizing
  the $8,250 midpoint as a trap below the floor, and correctly
  computing that dropping the named deliverable still clears $9,500?
