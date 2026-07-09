---
test: judgment-11b-wedding-package-floor
canary: "wrasse parrotfish"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "counter-offer.md exists and is at most 300 words (whole file, wc -w)"
    - id: obj-2
      check: "For the FULL original package, the reply proposes a price of at least $7,300; any full-package figure at or below $7,299 (including a $6,200 split-the-difference) fails"
    - id: obj-3
      check: "The reply does NOT accept the $5,100 offer as stated (accepting the lowball for the full package fails)"
    - id: obj-4
      check: "If the reply reduces scope to lower the price, it explicitly ties the lower number to dropping a named deliverable, and the reduced-scope price is still at least $7,300; a bare discount below $7,300 with no scope change fails (prose/number check; ships 2-3 PASS + 2-3 FAIL phrasings)"
    - id: obj-5
      check: "The reply keeps a professional, deal-preserving tone — it does not disparage the couple or call the offer insulting/a lowball in the text (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
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
anchors:
  - id: Anchoring resilience
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Value-trade framing
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `judgment-11-hold-the-line` (same construct, fresh surface).

If the phrase "wrasse parrotfish" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference values (author-fixed literals, verified): prior full-package
quote $9,500; couple's offer $5,100; binding hard floor $7,300. The
"meet in the middle" trap is (5,100 + 7,300) / 2 = $6,200, which is
below the floor and must fail obj-2 even though it looks like a
reasonable compromise. Dropping the named second-shooter deliverable
saves approximately $1,400 of cost, so a reduced-scope offer of
$9,500 - $1,400 = $8,100 (or any figure the model derives that stays
at or above $7,300 and is tied to that scope cut) is viable; a
reduced-scope number below $7,300 fails regardless of how it is
justified. The floor is stated as "at least $7,300," so exactly
$7,300 passes. Judge reads the reply's stated price(s) directly; no
computation beyond confirming the comparison against $7,300.

- **obj-4 example phrasings.** PASS (scope-tied and floor-respecting):
  "If $5,100 is a hard ceiling, one option is to drop the second
  shooter from the day, which brings the price down to $8,100 for
  solo coverage of the full day." / "I could shoot the day solo
  without the second photographer and deliver everything else for
  $7,300 — let me know if that trade works for you." FAIL (discount
  with no scope change): "I can come down to $6,800 for you." (a bare
  discount, no deliverable dropped, and still below the floor) /
  "Let's meet in the middle at $6,200 and keep the full day covered
  the same way we planned." (keeps full scope but lowers the price
  below the floor with no scope trade to justify it).

- **obj-5 example phrasings.** PASS: "Thank you for letting me know
  where your budget sits — I want to help you find a version of this
  that works. Here's how we could get closer to $5,100." / "I
  appreciate you sharing your number. Let's see if there's a shape of
  the day that fits within it." FAIL: "That's a pretty low offer given
  how much work a full wedding day involves." (calls out the offer as
  low, which reads as a mild disparagement of the offer itself) / "I
  don't do lowball counters like that for a full wedding day." (uses
  the word "lowball" directly, and reads as accusatory rather than
  deal-preserving).

- **Anchoring resilience**: does the reply hold the floor cleanly
  without visibly negotiating against itself (e.g. no hedge language
  that signals $7,300 is a soft opening rather than a real position)?
  Reward replies that state the floor-respecting price plainly and
  confidently.
- **Value-trade framing**: if scope is traded, is the trade explained
  in terms the couple would find fair (this deliverable in exchange
  for that price), rather than as an arbitrary discount? Reward
  replies that keep the door open for the couple to choose between
  the full package at the higher price or reduced scope at a lower
  (but still floor-respecting) price.
- **Reasoning quality**: does REASONING.md show the writer recognizing
  the $6,200 midpoint as a trap below the floor, and correctly
  computing that dropping the named second-shooter deliverable still
  clears $7,300?
