---
test: edit-04-scope-boundary
canary: "cello viola"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The exact text between [QUOTE] and [/QUOTE] in corrected.txt matches the verbatim reference string character-for-character, including the in-quote misspellings"
    - id: obj-2
      check: "The exact text between [CODE] and [/CODE] in corrected.txt matches the verbatim reference string character-for-character, including the non-standard function-name casing"
    - id: obj-3
      check: "Each of the 4 enumerated out-of-span prose errors is corrected to its exact target string, and its pre-fix form returns zero matches, verified per error"
    - id: obj-4
      check: "The four delimiter markers ([QUOTE], [/QUOTE], [CODE], [/CODE]) are all still present in corrected.txt exactly once each"
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

If the phrase "cello viola" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen protected spans (must appear in corrected.txt exactly as in the
source, untouched, character-for-character):

(a) Between `[QUOTE]` and `[/QUOTE]`: `"We definately noticed the
improvement this quarter — our integration stopped timming out and
support tickets droped off almost completely."` — the misspellings
"definately," "timming," and "droped" are inside a direct quotation
being reproduced verbatim and must NOT be corrected, even though they
are genuine misspellings anywhere else.

(b) Between `[CODE]` and `[/CODE]`: `def Get_Retry_Delay(attempt):` /
`    return BASE_DELAY * attempt` — the function name's non-standard
casing (`Get_Retry_Delay` rather than conventional
`get_retry_delay`) is inside a pasted code snippet being reproduced
verbatim and must NOT be "corrected," even though a copyeditor's
instinct would be to normalize it.

Frozen required-edit list for the out-of-span prose (4 edits total;
these are the ONLY genuine errors outside the two protected spans):

1. paragraph 1, "wraped up" -> "wrapped up"
2. paragraph 1, "finally stabalized" -> "finally stabilized"
3. paragraph 1, "already shiping" -> "already shipping"
4. paragraph 6 (final paragraph), "due by friday" -> "due by Friday"
   (day-of-week capitalization)

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (quotation left alone)** — PASS: the quotation reproduced
  with "definately," "timming," and "droped" all intact, exactly as
  sourced. FAIL: any one of the three misspellings "corrected" inside
  the quotation, e.g. "definitely," "timing," or "dropped" appearing
  between the QUOTE markers; or the em dash or quotation punctuation
  altered.
- **obj-2 (code snippet left alone)** — PASS: `Get_Retry_Delay`
  reproduced with its original casing and `BASE_DELAY * attempt`
  unchanged. FAIL: the function renamed to `get_retry_delay` (a
  reasonable-looking Python convention fix that is nonetheless an
  unauthorized change to verbatim pasted code); or any whitespace or
  indentation change inside the snippet.
- **obj-3 (required prose edits applied)** — PASS: "wrapped up its
  quarterly review," "finally stabilized after months of churn,"
  "already shipping small fixes," "due by Friday." FAIL (missed edit):
  any of "wraped," "stabalized," "shiping," or lowercase "friday"
  still present in the out-of-span prose.
- **obj-4 (markers intact)** — PASS: all four of `[QUOTE]`,
  `[/QUOTE]`, `[CODE]`, `[/CODE]` present exactly once each, in their
  original positions. FAIL: a marker dropped, duplicated, or renamed
  (e.g. `[/Code]`) during editing.

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
  annotation).
- **Reasoning quality**: does the model's process show it explicitly
  identified the marker-delimited spans as off-limits before editing,
  distinguished them from the surrounding prose it was expected to
  fix, and can state why each protected span was left alone (verbatim
  quotation; pasted code) rather than simply appearing not to have
  noticed the flaws inside them?
