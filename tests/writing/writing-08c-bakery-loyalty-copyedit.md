---
id: writing-08c-bakery-loyalty-copyedit
category: writing
title: "House-style copyedit against a loyalty-program rule sheet with traps"
deliverables:
  - edited.md
  - changelog.md
---

## Task

You are copyediting a marketing passage against your organization's
**HOUSE STYLE SHEET**. Apply every rule that genuinely applies.
Some things in the passage look like violations but are actually
protected and must be left exactly as written — do not "fix"
anything that is not genuinely wrong under the sheet.

**HOUSE STYLE SHEET:**

> 1. Spell out whole numbers under 12 in body text (e.g., "eight"
>    rather than "8").
> 2. Use the serial (Oxford) comma before the final item in any list
>    of three or more.
> 3. Write "curbside" as one word; never hyphenate it as
>    "curb-side."
> 4. Exclamation points are not permitted in body text.
> 5. In body text, use the "$" symbol rather than spelling out
>    "dollars."
> 6. Write "gray," never "grey."
> 7. Write "storefront" as one word; never as two words ("store
>    front").
> 8. Em dashes are closed on both sides (never "word — word" with a
>    space before and after).

**PASSAGE (to be copyedited):**

> Our bakery team is thrilled to roll out the new Baker's Circle
> rewards program, built for every gray-morning regular who's been
> waiting—at last—for one single loyalty card! For 8 years, our
> customers have asked for one simple way to earn free treats, and
> today we're delivering it.
>
> The rewards card replaces the clunky punch-card system with a
> modern store front experience and free curb-side pickup for every
> order. Early members report that they save 15 dollars a month on
> average, and satisfaction scores rose across every location we
> track: Wickford, Elmswick and Foxhaven.
>
> This launch would not have been possible without our longtime
> supply partner, Curb-Side Provisions, whose logistics crew worked
> side-by-side with ours for 5 months to make the rollout seamless.
> The program was led by our internal Shift 4 Bakers team.
>
> As one member told us in her own words: "Our neighborhood bakery
> has always felt like a cozy grey morning ritual, and this rewards
> card finally makes it official. We're saving almost 20 dollars a
> month, and our whole family loves stopping by."
>
> We're proud of this milestone and even prouder of the road ahead.
> Look for four more flavors landing before the holidays, each one
> designed to pull more joy out of your afternoon — and put a little
> more sweetness back into your week.
>
> Thank you for sticking with us through every gray day and sunny
> one. Our whole team can't wait to see you at the register.

## Deliverables

- `edited.md` — the fully copyedited passage, applying every rule
  that genuinely applies and leaving every protected element exactly
  as written.
- `changelog.md` — a change log listing each change made, with each
  entry citing the specific style-sheet rule number it enforces. Do
  not include an entry for anything left unchanged.

## Constraints

- `edited.md` must apply every genuine style-sheet violation in the
  passage and must not alter: the direct quotation in paragraph 4
  (preserve it verbatim, including "grey" and "20 dollars" exactly
  as written), the brand name "Curb-Side Provisions" (hyphen kept),
  and "Shift 4 Bakers" (the numeral stays; it is a proper-noun
  label, not body text prose).
- `changelog.md` must be at most 250 words (whole file, `wc -w`) and
  must cite a rule number for every entry.
