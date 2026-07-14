---
id: uxcrit-03b-gdpr-popup-trap
category: ux-critique
title: "Critique a broken GDPR cookie consent flow with a rejection dark pattern"
deliverables:
  - critique.md
---

## Task

Flow description (fictional news site **The Criterion**):

1. First visit → a bottom-sticky cookie banner: "We value your privacy"
   with three buttons arranged left-to-right: [Accept All] in solid
   colour, [Customise] in outline, [Reject All] in the same colour as
   the banner background (effectively invisible against the dark
   background).
2. Tapping "Customise" opens a modal with 47 toggles split across
   9 "Legitimate Interest" vendor categories, each pre-toggled ON.
   There is no "Reject All" or "Confirm Choices" button inside the
   modal — only a faint "Close (x)" in the top-right corner.
3. Closing the modal without toggling anything leaves all 47 vendors
   ON. The banner text changes to "Preferences saved" but the user
   never actively accepted.
4. On the next page load, a full-screen interstitial appears: "To
   continue reading, please accept cookies or subscribe for
   £4.99/month." There is no free, cookie-minimal reading option.
5. The subscription page is reachable, but the £4.99 plan description
   says "ad-free" — the cookie banner never mentioned ads; the user
   is now learning that rejecting cookies means subscribing, and
   that "accept cookies" actually means "accept ad tracking."

Write `critique.md`:

## Problems
(&#8805;3 distinct UX problems)

## Severity
(label each problem P0/P1/P2)

## Fixes
(one concrete fix per problem)

## Deliverables

- `critique.md`

## Constraints

- 120–350 words.
- Must call out: invisible "Reject All" button (or equivalent affordance
  asymmetry), pre-toggled legitimate-interest vendors with no bulk
  reject in the modal, and cookie-consent-to-subscription upsell
  that conflates unrelated choices (three themes).
