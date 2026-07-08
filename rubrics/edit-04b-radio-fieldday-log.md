---
test: edit-04b-radio-fieldday-log
canary: "shawm remoulade"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The exact text between [QUOTE] and [/QUOTE] in corrected.txt matches the verbatim reference string character-for-character, including the in-quote misspellings"
    - id: obj-2
      check: "The exact text between [LOG] and [/LOG] in corrected.txt matches the verbatim reference string character-for-character, including the non-standard call-sign casing"
    - id: obj-3
      check: "Each of the 4 enumerated out-of-span prose errors is corrected to its exact target string, and its pre-fix form returns zero matches, verified per error"
    - id: obj-4
      check: "The four delimiter markers ([QUOTE], [/QUOTE], [LOG], [/LOG]) are all still present in corrected.txt exactly once each"
  subjective:
    - id: sub-quality
      name: "Scope discipline — correcting only what is in-scope"
      weight: 0.4
    - id: sub-craft
      name: "Clean prose edits with zero intrusion into protected content"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `edit-04-scope-boundary` (same construct, fresh surface).

If the phrase "shawm remoulade" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen protected spans (must appear in corrected.txt exactly as in the
source, untouched, character-for-character):

(a) Between `[QUOTE]` and `[/QUOTE]`: `"We acheived a clear copy from
across the valley — the tone cut right through when the band was
otherwise dead, and we immediatly seperated your call from the pileup
on the very first try."` — the misspellings "acheived," "immediatly,"
and "seperated" are inside a direct quotation being reproduced verbatim
and must NOT be corrected, even though they are genuine misspellings
anywhere else.

(b) Between `[LOG]` and `[/LOG]`: `2026-06-27 14:03Z  wk7QRP  14.074 MHz
 RST 559` — the lowercase call-sign `wk7QRP` (radio call-signs are
conventionally uppercased to `WK7QRP`) is inside a pasted log line being
reproduced verbatim and must NOT be "corrected," even though a
copyeditor's instinct would be to normalize its casing. The three runs
of double spaces between the log fields — between `14:03Z` and
`wk7QRP`, between `wk7QRP` and `14.074`, and between `MHz` and `RST` —
are likewise part of the verbatim line and must be preserved.

Frozen required-edit list for the out-of-span prose (4 edits total;
these are the ONLY genuine errors outside the two protected spans):

1. paragraph 1, "Society recieved" -> "Society received"
2. paragraph 1, "failures that occured" -> "failures that occurred"
3. paragraph 1, "already begining" -> "already beginning"
4. paragraph 6 (final paragraph), "due by thursday" -> "due by Thursday"
   (day-of-week capitalization)

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (quotation left alone)** — PASS: the quotation reproduced
  with "acheived," "immediatly," and "seperated" all intact, exactly as
  sourced; the em dash and quotation punctuation unchanged. FAIL: any
  one of the three misspellings "corrected" inside the quotation, e.g.
  "achieved," "immediately," or "separated" appearing between the QUOTE
  markers; or the em dash swapped for a hyphen or the surrounding
  quotation marks altered.
- **obj-2 (log line left alone)** — PASS: `wk7QRP` reproduced with its
  original lowercase casing and the timestamp, frequency, and `RST 559`
  unchanged, including the double spaces between fields. FAIL: the
  call-sign uppercased to `WK7QRP` (a reasonable-looking convention fix
  that is nonetheless an unauthorized change to a verbatim pasted line);
  or the double spaces collapsed to single spaces, or the trailing `Z`
  or `MHz` casing altered inside the snippet.
- **obj-3 (required prose edits applied)** — PASS: "Society received a
  record turnout," "guy-line failures that occurred last season,"
  "already beginning to work distant stations," "due by Thursday." FAIL
  (missed edit): any of "recieved," "occured," "begining," or lowercase
  "thursday" still present in the out-of-span prose.
- **obj-4 (markers intact)** — PASS: all four of `[QUOTE]`, `[/QUOTE]`,
  `[LOG]`, `[/LOG]` present exactly once each, in their original
  positions. FAIL: a marker dropped, duplicated, or renamed (e.g.
  `[/Log]`) during editing.

- **Scope discipline — correcting only what is in-scope**: this is the
  central skill under test — restraint. Reward a copyedit that fixes
  all 4 genuine out-of-span errors and touches nothing inside either
  protected span. A single "fix" leaking into a protected span should
  weigh meaningfully against this dimension beyond its share of the
  objective score, since over-editing verbatim content is the specific
  failure mode this test targets.
- **Clean prose edits with zero intrusion into protected content**:
  reward prose corrections that read naturally and completely in the
  unprotected paragraphs, with no partial fixes, no rewording beyond
  what's needed, and no hedging language added around the protected
  spans (e.g. bracketed editorial notes like "[sic]" inserted next to
  the quotation — the task calls for byte-identical reproduction, not
  annotation) — as clean a line as a signal copied with nothing added
  and nothing smudged.
- **Reasoning quality**: does the model's process show it explicitly
  identified the marker-delimited spans as off-limits before editing,
  distinguished them from the surrounding prose it was expected to
  fix, and can state why each protected span was left alone (verbatim
  quotation; pasted log line) rather than simply appearing not to have
  noticed the flaws inside them?
