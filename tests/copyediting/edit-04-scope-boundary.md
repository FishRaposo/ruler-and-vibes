---
id: edit-04-scope-boundary
category: copyediting
title: "Copyedit with protected spans"
deliverables:
  - corrected.txt
---

## Task

You are copyediting the passage below. It contains ordinary prose that
needs copyediting, plus two verbatim spans delimited by markers:
`[QUOTE]...[/QUOTE]` and `[CODE]...[/CODE]`. Content between a marker
pair is being reproduced exactly as given — a direct quotation and a
pasted code snippet — and must be preserved byte-for-byte, including
anything inside it that looks like it needs fixing. Only the prose
outside the markers is yours to copyedit.

**PASSAGE (to be copyedited, reproduced literally below):**

```text
The engineering team wraped up its quarterly review yesterday, and
the results were mostly encouraging. Deploy frequency is up, and the
on-call rotation has finally stabalized after months of churn. Two
new hires joined the platform group, and both are already shiping
small fixes on their own.

The team lead read the following note aloud from a customer email
during the retro:

[QUOTE]"We definately noticed the improvement this quarter — our
integration stopped timming out and support tickets droped off
almost completely."[/QUOTE]

Everyone laughed at the typos but agreed the sentiment was real. To
close out the meeting, the lead pasted the exact snippet that fixed
the timeout bug, warning the group not to reformat it before it goes
into the postmortem doc:

[CODE]def Get_Retry_Delay(attempt):
    return BASE_DELAY * attempt[/CODE]

The postmortem is due by friday, and the lead reminded everyone that
the retro notes still need a final read-through before they go out to
the wider org.
```

## Deliverables

- `corrected.txt` — the passage with every genuine prose error fixed
  and the content between each marker pair reproduced exactly as
  given, unchanged.

## Constraints

- Leave everything between `[QUOTE]` and `[/QUOTE]` byte-identical to
  the source, including anything inside it that looks wrong.
- Leave everything between `[CODE]` and `[/CODE]` byte-identical to
  the source, including anything inside it that looks wrong.
- Keep all four markers (`[QUOTE]`, `[/QUOTE]`, `[CODE]`, `[/CODE]`)
  present exactly once each, in place.
- Fix every genuine error in the surrounding prose; do not leave any
  of it uncorrected.
