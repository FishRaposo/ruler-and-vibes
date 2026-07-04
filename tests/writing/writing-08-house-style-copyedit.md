---
id: writing-08-house-style-copyedit
category: writing
title: "House-style copyedit against a rule sheet with traps"
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

> 1. Spell out whole numbers under 10 in body text (e.g. "nine," not
>    "9").
> 2. Use the serial (Oxford) comma in lists of three or more items.
> 3. Write "email," never "e-mail."
> 4. No exclamation points.
> 5. Use "%" rather than the word "percent" in body text.
> 6. Write "toward," never "towards."
> 7. Write "website," never "web site."
> 8. Em dashes take no surrounding spaces (never " — " with a space
>    on each side).

**PASSAGE (to be copyedited):**

> Our team is thrilled to announce the launch of the new customer
> portal, built to move your workflow toward—finally—a single
> dashboard! For 9 years, our customers have asked for one place to
> manage billing, support, and integrations, and today we're
> delivering it.
>
> The portal replaces the clunky e-mail-based request system with a
> modern web site experience. Early testers report that ticket
> resolution time dropped by 42 percent, and satisfaction scores rose
> across every region we track: North America, Europe and
> Asia-Pacific.
>
> This launch would not have been possible without our longtime
> integration partner, E-Mailer Pro, whose API team worked
> side-by-side with ours for 6 months to make the migration seamless.
> The rollout was led by our internal Tier 3 Support group.
>
> As one beta customer told us in her own words: "Our support team
> has been moving towards a self-serve model for years, and this
> portal finally gets us there. We cut our average response time by
> nearly 40 percent, and our staff has never been happier."
>
> We're proud of this milestone and even prouder of the road ahead.
> Look for three more integrations landing before year-end, each one
> designed to pull more busywork out of your team's day — and put
> more time back on the clock.
>
> Thank you for building toward this future with us. The whole team
> is excited for what comes next.

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
  (preserve it verbatim, including "towards" and "40 percent" exactly
  as written), the brand name "E-Mailer Pro" (hyphen kept), and "Tier
  3 Support" (the numeral stays; it is a proper-noun label, not body
  text prose).
- `changelog.md` must be at most 250 words (whole file, `wc -w`) and
  must cite a rule number for every entry.
