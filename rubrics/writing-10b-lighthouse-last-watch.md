---
test: writing-10b-lighthouse-last-watch
canary: "haversack duffel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "sestina.md has exactly 39 NON-BLANK lines of verse: six stanzas of 6 lines plus a 3-line envoi (blank lines separating stanzas are not counted as verse lines); judge counts non-blank lines and confirms the 6x6-plus-3 block structure"
    - id: obj-2
      check: "The six line-ending words of each stanza exactly match the required sestina permutation table below, using only the six supplied end-words (BEACON, TIDE, RUST, LEDGER, GULL, SIGNAL) or their natural inflections — judge checks each stanza's ending words, in order, against the frozen table; any stanza with a wrong order, a wrong word, a repeat, or an omission fails this check"
    - id: obj-3
      check: "The 3-line envoi uses all six end-words somewhere in its three lines, with three of them appearing as line-endings (the envoi's specific end-word order is not pinned, only that all six appear and three are line-final)"
    - id: obj-4
      check: "No end-word other than the six supplied (or natural inflections) is used to end any line, and within each stanza each of the six is used exactly once as a line-ending (no repeats or omissions)"
    - id: obj-5
      check: "sestina.md is on the theme of a lighthouse keeper's final watch before automation and departure, and is continuous verse with no headings and no bullet or numbered list markers"
  subjective:
    - id: sub-quality
      name: "Poetic quality and thematic coherence within the form"
      weight: 0.4
    - id: sub-craft
      name: "Naturalness of the forced end-words (do they land as meaning, not as filler)"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `writing-10-sestina` (same construct, fresh surface).

If the phrase "haversack duffel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

**Frozen permutation table (word-numbers: 1=BEACON, 2=TIDE, 3=RUST,
4=LEDGER, 5=GULL, 6=SIGNAL).** This is the single source of truth for
obj-2; verified via the standard sestina retrograde spiral
(next stanza = [f,a,e,b,d,c] applied to the previous stanza's order):

- Stanza 1: 1-2-3-4-5-6 (BEACON, TIDE, RUST, LEDGER, GULL, SIGNAL)
- Stanza 2: 6-1-5-2-4-3 (SIGNAL, BEACON, GULL, TIDE, LEDGER, RUST)
- Stanza 3: 3-6-4-1-2-5 (RUST, SIGNAL, LEDGER, BEACON, TIDE, GULL)
- Stanza 4: 5-3-2-6-1-4 (GULL, RUST, TIDE, SIGNAL, BEACON, LEDGER)
- Stanza 5: 4-5-1-3-6-2 (LEDGER, GULL, BEACON, RUST, SIGNAL, TIDE)
- Stanza 6: 2-4-6-5-3-1 (TIDE, LEDGER, SIGNAL, GULL, RUST, BEACON)

To check obj-1/obj-2/obj-3/obj-4 mechanically: split the file into
blocks separated by blank lines. There should be 7 blocks: six with
exactly 6 lines (the stanzas) and one with exactly 3 lines (the
envoi). For each of the first six blocks, take the last word of each
line (strip trailing punctuation, allow simple plural/possessive
inflection, e.g. "gulls" or "signal's" both count as their base
word), map it to its word-number 1-6, and compare the resulting
6-number sequence to the corresponding row of the table above. Any
mismatch — wrong word, wrong order, a repeat, or an outside word —
fails obj-2 and/or obj-4 for that stanza. For the envoi (block 7),
confirm all six words appear anywhere in its 3 lines, and that at
least three distinct lines end on one of the six words (three
line-endings total, since there are only 3 lines); the specific
end-word order is not checked.

A reference deliverable was authored and verified by script: all six
stanzas matched the table exactly, the envoi carried 3 lines with all
six words present and three as line-endings (ledger, beacon, tide), for
a total of 39 non-blank lines. A deliberately broken variant (stanza 2
line-endings swapped in position — line 1 made to end on BEACON and
line 2 on SIGNAL instead of the required SIGNAL-then-BEACON order) was
also run through the same check and correctly failed obj-2 on stanza 2
while every other stanza still passed — confirming the check
discriminates a genuine violation rather than passing everything by
default.

- **obj-5 example phrasings (theme presence).** PASS: a poem whose
  images and address are clearly about a keeper's last night tending a
  lighthouse before it is automated — logging the final entry, watching
  the lamp for the last time, packing to leave the island. PASS: a poem
  framed as the keeper recalling decades of watches while walking down
  to the boat that will take him off the rock for good, the tower now
  someone else's machine to run. FAIL (theme absent or generic): a
  technically correct sestina about, say, a sailor's shore leave in a
  harbor town with no connection to a lighthouse keeper's watch or
  departure, using the six words only as abstract props with no
  thematic throughline. FAIL (theme only nominally gestured at): a poem
  that mentions "the tower" once in passing while the other 38 lines
  describe an unrelated storm at sea, with no sense of a keeper's
  service ending or of automation replacing him actually present.

- **Poetic quality and thematic coherence**: does the poem sustain a
  real emotional arc about a lighthouse keeper's last watch and
  departure across all six stanzas and the envoi, with concrete imagery
  rather than generic filler lines built only to hit the end-word?
- **Naturalness of the forced end-words**: do BEACON/TIDE/RUST/LEDGER/
  GULL/SIGNAL feel load-bearing to each line's meaning — arrived at
  through the sentence's own logic — rather than bolted on with an
  awkward inversion or throwaway clause purely to end the line on the
  required word?
- **Reasoning quality**: does the model's process show it derived or
  checked the required stanza-by-stanza permutation before drafting
  (rather than guessing at an order), and that it planned each stanza's
  content around its fixed end-words rather than writing free verse and
  patching end-words in afterward?
