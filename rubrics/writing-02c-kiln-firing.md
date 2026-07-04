---
test: writing-02c-kiln-firing
canary: "sifaka magenta"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All three sections present: ## Formal, ## Friendly, ## Summary"
    - id: obj-2
      check: "All four facts present in every version"
    - id: obj-3
      check: "Summary is one sentence of <= 25 words (count them)"
    - id: obj-4
      check: "No invented facts in any version"
  subjective:
    - id: sub-quality
      name: "Register fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `writing-02-registers` (same construct, fresh surface).

If the phrase "sifaka magenta" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

### The four facts

The submission must preserve all four across every version:

- (a) **cause** — a cracked flue liner in the salt kiln that needs a full
  rebuild;
- (b) **old date** — September 6;
- (c) **new date** — November 22;
- (d) **compensation** — members who reserved a firing slot get two
  complimentary guest passes.

### obj-1 — all three sections present

PASS phrasings (headings present and correctly labelled):

- `## Formal`, `## Friendly`, `## Summary` each appear as headings.
- Headings in a different order but all three present and named.
- Extra blank lines or a title above the three headings; the three
  required headings still all appear.

FAIL phrasings:

- Only two of the three headings appear (e.g. no `## Summary`).
- The three versions run together as one block with no headings.
- A version is labelled with a different word (`## TL;DR`, `## Board`)
  so the required heading text is absent.

### obj-2 — all four facts in every version

Judge each version (Formal, Friendly, Summary) against facts (a)-(d).
A fact counts as present if its substance survives, even reworded; it is
missing if dropped or made vague enough to lose the specific.

PASS phrasings (fact still carried):

- "a cracked flue liner in the salt kiln needs a full rebuild" (cause);
- "moving from September 6th to November 22nd" (both dates);
- "reserved members each receive two complimentary guest passes"
  (compensation).

FAIL phrasings (fact lost):

- "because of kiln damage" — cause too vague; the cracked flue liner is
  gone.
- "the firing is delayed to November 22nd" — old date (September 6)
  dropped.
- "members will be compensated" — the two-guest-passes specific is gone.

### obj-3 — summary is one sentence of <= 25 words

Count the words in the `## Summary` version. It must be a single
sentence and at most 25 words. A semicolon or comma joining clauses is
still one sentence; a second terminal `.`/`!`/`?` is a second sentence.

PASS phrasings:

- A 24-word single sentence carrying all four facts, one semicolon
  allowed.
- A 22-word single sentence, all four facts, no internal punctuation
  trouble.
- Exactly 25 words, one sentence — at the cap but not over it.

FAIL phrasings:

- 30+ words in one sentence (over the cap, however fluent).
- Two sentences, even if together under 25 words.
- One tight sentence that hit the cap only by dropping a fact — obj-3
  passes on length but obj-2 fails; score both.

### obj-4 — no invented facts

Conventional register scaffolding ("thank you for your patience", "we
will keep you posted") is not an invented fact. New specifics — names,
causes, dates, numbers, prices — are.

PASS phrasings (scaffolding, not invention):

- "We would rather wait than risk an unsafe firing." (tone, no new fact)
- "Thanks for bearing with us." (courtesy, no new fact)
- "The board takes kiln safety seriously." (framing, no new fact)

FAIL phrasings (invented specifics):

- "a full refund of your $40 deposit" — invents a refund and a price.
- "the new kiln will be installed by our contractor, Hollis Forge" —
  invents a name and a replacement not in the source.
- "the firing will now run over two weekends" — invents a schedule
  detail.

### Subjective criteria

- **Register fidelity:** each version unmistakable for its audience — the
  pivot between tones must feel deliberate, not a synonym swap. Formal
  (board minutes) is measured, not stiff; friendly (member newsletter)
  is warm, not unserious.
- **Concision:** every version should be materially tighter than the
  original 74-word paragraph, measured by word count against it. A formal
  register may spend a few words on convention and still come in under.
- **Reasoning quality:** did REASONING.md discuss the tone choices per
  audience and what was deliberately dropped or compressed to fit each
  register and the summary's word cap?
