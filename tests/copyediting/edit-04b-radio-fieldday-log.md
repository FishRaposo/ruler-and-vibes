---
id: edit-04b-radio-fieldday-log
category: copyediting
title: "Copyedit around reproduced inserts"
deliverables:
  - corrected.txt
---

## Task

You are copyediting the passage below. It contains ordinary prose that
needs copyediting, plus two verbatim spans delimited by markers:
`[QUOTE]...[/QUOTE]` and `[LOG]...[/LOG]`. Content between a marker
pair is being reproduced exactly as given — a direct quotation and a
pasted log line — and must be preserved byte-for-byte, including
anything inside it that looks like it needs fixing. Only the prose
outside the markers is yours to copyedit.

**PASSAGE (to be copyedited, reproduced literally below):**

```text
The Windward Amateur Radio Society recieved a record turnout for its
summer field day on the ridge last weekend. Contact counts climbed
across every band, and the club's portable mast held steady all night
after the guy-line failures that occured last season. Two new licensees
joined the operating roster, and both are already begining to work
distant stations without any coaching.

During the debrief, the station captain read aloud a message that a
listener had emailed the club after hearing the beacon:

[QUOTE]"We acheived a clear copy from across the valley — the tone cut
right through when the band was otherwise dead, and we immediatly
seperated your call from the pileup on the very first try."[/QUOTE]

Everyone grinned at the spelling but agreed the report was sincere. To
wrap the debrief, the captain projected the raw log line for the
milestone contact, warning nobody to tidy it up before it lands in the
year-end bulletin:

[LOG]2026-06-27 14:03Z  wk7QRP  14.074 MHz  RST 559[/LOG]

The bulletin is due by thursday, and the captain reminded the roster
that the field-day writeup still needs one more pass before it reaches
the regional digest.
```

## Deliverables

- `corrected.txt` — the passage with every genuine prose error fixed
  and the content between each marker pair reproduced exactly as
  given, unchanged.

## Constraints

- Leave everything between `[QUOTE]` and `[/QUOTE]` byte-identical to
  the source, including anything inside it that looks wrong.
- Leave everything between `[LOG]` and `[/LOG]` byte-identical to
  the source, including anything inside it that looks wrong.
- Keep all four markers (`[QUOTE]`, `[/QUOTE]`, `[LOG]`, `[/LOG]`)
  present exactly once each, in place.
- Fix every genuine error in the surrounding prose; do not leave any
  of it uncorrected.
