---
id: uxcopy-03b-saffron-larder
category: ux-copy
title: Empty State Copy for a Recipe App
deliverables:
  - empty-states.json
---

## Task

Below are four fictional empty-state surfaces, each with a stable
surface key and a one-line context note. Write a heading, body, and CTA
(call-to-action button label) for each.

| Surface key | Context |
|---|---|
| `emptyCookbook` | The user's saved-recipes cookbook has never had a recipe added to it (first-run empty state). |
| `noRecipeMatches` | The user ran a recipe search and it matched zero items. |
| `noMealPlansYet` | The user has not created any meal plans yet (first-run empty state). |
| `clearedShoppingList` | The user has checked off every item on the shopping list; the list is now empty. |

### Writing rules

1. `heading` is **at most 30 characters** and in **Sentence case**:
   first character uppercase, and no later word starts with an uppercase
   letter. (The proper-noun allowlist for this test is **empty** — there
   is no word that is permitted an exception.)
2. `body` is **at most 60 characters** and is exactly **one sentence**
   (a single trailing terminator, none earlier).
3. `cta` is **1–3 words**, verb-first (starts with an imperative verb),
   with no trailing punctuation.
4. Banned words (case-insensitive substrings, checked across heading +
   body + cta together): `sorry`, `oops`, `whoops`, `regrettably`,
   `merely`, `just`, `no matches`.
5. **CTA-intent rule:** the surface type determines the CTA's intent —
   it is not a free choice:
   - **First-run empty states** (`emptyCookbook`, `noMealPlansYet`) get
     an **encouraging create-CTA** (a CTA that starts a first item, e.g.
     "Save recipe", "Start a plan").
   - **Zero-results state** (`noRecipeMatches`) gets a **corrective
     query-changing CTA** (a CTA that changes the search, e.g. "Broaden
     search") — **not** a create-CTA, even though inviting the user to
     add a brand-new recipe is tempting to pair with a state where their
     search came up empty.
   - `clearedShoppingList` gets a **neutral/reassurance CTA** (e.g.
     returning the user to a main view), not a create-CTA and not a
     corrective-search CTA.

## Deliverables

- `empty-states.json` — a single JSON object mapping each of the four
  surface keys above to `{"heading": string, "body": string, "cta":
  string}`.

## Constraints

- Valid JSON, exactly the four embedded surface keys, no extra keys.
- All writing rules above apply to every surface, including the
  per-surface CTA-intent rule.
