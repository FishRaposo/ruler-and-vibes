---
id: writing-10b-lighthouse-last-watch
category: writing
title: "Sestina on a lighthouse keeper's final watch, with a fixed set of six end-words"
deliverables:
  - sestina.md
---

## Task

Write a **sestina** on the theme of **a lighthouse keeper standing his last
watch before the light is automated and he leaves the island for good**,
using exactly these six end-words, in this numbered order:

1. BEACON
2. TIDE
3. RUST
4. LEDGER
5. GULL
6. SIGNAL

A sestina is a 39-line fixed form: six stanzas of six lines each, plus
a closing 3-line envoi. Every line in the six main stanzas must end
with one of the six words above (used as the literal word or a natural
inflection, e.g. "gulls" or "signal's" is acceptable). The same six
words rotate through a fixed order from stanza to stanza, using the
standard sestina retrograde spiral: if a stanza's end-words in order
are word-numbers (a, b, c, d, e, f), the next stanza's end-words in
order are (f, a, e, b, d, c).

Applying that spiral starting from stanza 1's order 1-2-3-4-5-6 gives
the required end-word order (by word-number) for all six stanzas:

- Stanza 1: 1-2-3-4-5-6 (BEACON, TIDE, RUST, LEDGER, GULL, SIGNAL)
- Stanza 2: 6-1-5-2-4-3 (SIGNAL, BEACON, GULL, TIDE, LEDGER, RUST)
- Stanza 3: 3-6-4-1-2-5 (RUST, SIGNAL, LEDGER, BEACON, TIDE, GULL)
- Stanza 4: 5-3-2-6-1-4 (GULL, RUST, TIDE, SIGNAL, BEACON, LEDGER)
- Stanza 5: 4-5-1-3-6-2 (LEDGER, GULL, BEACON, RUST, SIGNAL, TIDE)
- Stanza 6: 2-4-6-5-3-1 (TIDE, LEDGER, SIGNAL, GULL, RUST, BEACON)

After the six stanzas, write a 3-line envoi that uses all six end-words
somewhere in its three lines, with three of them landing as the final
word of a line.

## Deliverables

- `sestina.md` — the complete sestina: six 6-line stanzas in the exact
  end-word order above, plus the 3-line envoi. Separate stanzas with a
  blank line so stanza boundaries are unambiguous.

## Constraints

- `sestina.md` must contain exactly 39 non-blank lines of verse: six
  stanzas of 6 lines plus a 3-line envoi. Blank lines used to separate
  stanzas are not counted as verse lines.
- Each stanza's six line-ending words, in order, must exactly match the
  required permutation table above — using only the six supplied words
  (or their natural inflections) and no others, with no repeats or
  omissions within a stanza.
- The envoi must use all six end-words somewhere in its three lines,
  with three of them as line-endings. The envoi's internal order is not
  fixed.
- The poem must be on the theme of a lighthouse keeper's final watch
  before the light is automated and he departs the island for good, and
  must be continuous verse with no headings and no bullet or numbered
  list markers.
