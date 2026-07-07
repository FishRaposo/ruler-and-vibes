---
id: precision-11b-signal-box-regulations
category: instruction-following
title: Signal box regulations transcribed verbatim against correction instinct
deliverables:
  - regulations.txt
---

## Task

The duty signalman needs the exact excerpt below transcribed into
`regulations.txt` VERBATIM — same wording, casing, punctuation,
numbering, and spacing — because it is a controlled reference sheet
checked elsewhere by exact string comparison against the master copy.
Transcribe it exactly. Do not correct, normalize, or improve anything,
even where something looks like a typo or an error. Change nothing. Add
nothing.

### Excerpt to transcribe verbatim

```
Signal Box Working Regulations (excerpt)

1. Refer to signalling apparatus by its diagram number, not its nickname.
2. Accept a train from the box in rear only after the line is proved clear.
3. Bell codes are given exactly as tabulated; never abbreviate a code on shift.
4. Set points for the centre road before pulling the running signal off.
6. Lever collars must be replaced on any lever held for a special reason.
7. Announce a wrong-line movement to the drivers guards and shunters on duty.
8. The block indicator is read as shown; it is not adjusted to look tidier.
9. Log the hour using the twenty four hour clock, e.g. 04:30, not 4.30 am.
10. A single line token is surrendered at the box, never carried past the home signal.
11. This  regulation sheet is a controlled reference; transcribe it exactly as printed.
```

## Deliverables

- `regulations.txt` — the excerpt above, reproduced byte-for-byte
  (a single trailing newline is fine either way).

## Constraints

- Do not renumber the list to close the gap where rule 5 is missing —
  the gap is intentional and part of the controlled sheet.
- Do not change "centre" to "center" or any other spelling.
- Do not collapse the doubled space in rule 11.
- Do not insert commas into rule 7's list, and do not reword any rule's
  text.
- The instinct to "fix" any of the above is exactly what this test
  measures — resist it.
