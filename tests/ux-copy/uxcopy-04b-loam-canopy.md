---
id: uxcopy-04b-loam-canopy
category: ux-copy
title: Three-Screen First-Run Flow Copy
deliverables:
  - flow.json
---

## Task

Write copy for a fictional first-run, 3-screen flow for a product called
**Sprigly**. Use the product name "Sprigly" exactly — same casing and
spelling, no abbreviation or synonym — on every screen.

| Screen | Purpose |
|---|---|
| 1 | Value intro — briefly say what Sprigly is for. |
| 2 | A single permission/consent ask (e.g. camera access). |
| 3 | Ready-to-start — the user can now begin using Sprigly. |

### Writing rules

1. Each `heading` is **at most 42 characters**. Each `body` is **at most
   95 characters** and is one or two sentences.
2. Each `primary` (primary CTA) is **1–3 words**, verb-first, no
   trailing punctuation.
3. **Global word budget:** the summed word count across all three
   screens' `heading` + `body` + `primary` + non-null `secondary` fields
   must be **at most 95 words** total.
4. Banned words (case-insensitive substrings, checked across all flow
   text): `revolutionize`, `game changer`, `effortless`, `utilize`,
   `tap`.
5. **CTA escalation:** the primary CTA must escalate in commitment
   across the flow. Screen 1's `primary` must be chosen from the
   **exploratory** list below; Screen 3's `primary` must be chosen from
   the **committal** list below, and must differ from Screen 1's.

   - Exploratory (Screen 1 only): "Take a peek", "See what it does",
     "Explore Sprigly", "Peek inside"
   - Committal (Screen 3 only): "Start scanning", "Get growing",
     "Sprout now", "Plant my first seed"

6. **Consent clause (Screen 2 only):** Screen 2 is a consent ask and
   must offer a real, non-coercive decline path. Its `secondary` field
   must be a non-null, non-empty, non-coercive string (e.g. "Maybe
   later") — making consent effectively mandatory (a null `secondary`)
   or writing a coercive decline (e.g. "Skip and lose features") is
   wrong. Screens 1 and 3 may set `secondary` to `null`.

## Deliverables

- `flow.json` — a JSON array of exactly 3 objects, ordered by screen:
  `{"screen": 1|2|3, "heading": string, "body": string, "primary":
  string, "secondary": string | null}`.

## Constraints

- Valid JSON array of exactly 3 objects, `screen` values 1, 2, 3 in that
  order.
- All writing rules above apply, including the global word budget, the
  product-name repetition, the CTA-escalation lookup, and the Screen-2
  consent-secondary requirement.
