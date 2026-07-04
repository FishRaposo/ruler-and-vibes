---
id: edit-02-consistency-pass
category: copyediting
title: "Enforce internal consistency"
deliverables:
  - corrected.txt
---

## Task

You are copyediting the passage below for **internal consistency**.
There is no external style card — instead, several items are spelled
or formatted inconsistently within the passage itself, along
different axes (a name, a compound term, a unit).

**TIE-BREAK RULE:** for each inconsistent item, normalize every
occurrence to the form used at its FIRST occurrence in the passage.
Do not introduce any other change — leave every already-consistent
sentence exactly as written.

**PASSAGE (to be copyedited):**

> Katarina Voss took over the warehouse night-shift last spring, and
> the change paid off within weeks. Katarina Voss reorganized the
> loading bay so that pallets moved in a single direction, and the
> crew now weighs each pallet once, treating a reading of roughly 40 kg
> as the safe upper limit for a single stack. The night-shift crew, six
> people in total, now rotates through the dock every morning without
> the pileups that used to stall the line.
>
> Katerina Voss also rewrote the intake checklist so new hires could
> follow it without a supervisor standing over them, and within a month
> the whole nightshift had memorized it. Forklifts that once sat idle
> each morning are now back in rotation before the first delivery truck
> arrives. A second reading later in the day found one outlier stack at
> 41 kilograms, which the crew flagged and re-stacked below the limit.
>
> Katarina Voss says the next project is extending the same layout to
> the day shift, though that crew works a different rhythm and may need
> its own version of the night-shift rules rather than a copy of this
> one. Katarina Voss also plans to post the 40 kg limit on a sign above
> the scale so nobody has to ask twice.

## Deliverables

- `corrected.txt` — the fully copyedited passage, with every
  inconsistent item normalized to its first-occurrence form and every
  already-consistent sentence left untouched.

## Constraints

- Detect every inconsistency axis in the passage yourself; none is
  labeled for you.
- Apply the first-occurrence tie-break rule exactly — do not normalize
  to a majority form, a "more correct" form, or any convention external
  to this passage.
- Do not alter anything beyond what the detected inconsistencies
  require.
