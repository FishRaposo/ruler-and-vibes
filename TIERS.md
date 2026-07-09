# Breadth tiers — Core ⊂ Extended ⊂ Full

Ruler & Vibes uses a **nested breadth ladder** for overall model comparison.
Day suites (`coding-day`, `agent-day`, …) are a separate axis: *which workflow*,
not *how deep the general map*.

Canonical machine-readable lists: **`tiers.json`** (source of truth).
Human + runner lists also live in **`RUN.md`**. The report and
`tools/validate.js` must stay in sync with `tiers.json`.

```
  Core (34)  ⊂  Extended (123)  ⊂  Full (all forms in tests/)
     │                │                    │
     │                │                    └─ item bank + parallel forms
     │                └─ serious general map (base forms)
     └─ fast overall snapshot (base forms)
```

## Core — general snapshot

**Job:** If you only run once per model, get a fair **overall map** across
fields (software, language, analysis, reasoning, planning, creative,
integrity, agentic edit, safety judgment, critical reading).

| Property | Rule |
|----------|------|
| Size | 34 base forms |
| Forms | Base only (no `b`/`c` parallels) |
| Stability | Change rarely; promote into Core deliberately |
| Incomplete | **Provisional** — not a finished overall score |

See `tiers.json` → `tiers.core.tests` or Core list in `RUN.md`.

## Extended — serious general map

**Job:** Deeper multi-field portrait without Full cost. **Always includes
all of Core**, plus a second wave of base forms (second coding/debug,
ops, support, more agentic, product, safety pairs, harder analysis).

| Property | Rule |
|----------|------|
| Size | 123 base forms (34 Core + 89 depth; includes gap-closure promotions + new facets) |
| Forms | Base only |
| Nesting | Every Core test ∈ Extended |
| Incomplete | **Provisional** when Extended is the evaluation unit |

Extended is **not** “every base form in the repo.” Cap and curate so the
middle tier stays runnable. New general-map depth usually lands here
before any Core promotion.

## Full — item bank

**Job:** Everything under `tests/`, including parallel forms (`…-01b-…`,
`…-01c-…`) for multi-run facet medians and research depth.

| Property | Rule |
|----------|------|
| Size | All forms (hundreds) |
| Forms | Base + parallels |
| Default | Prefer Core or Extended for personal model-picking |

## Day suites (orthogonal)

`coding-day`, `agent-day`, `writing-comms`, `analyst`, `product-day`,
`safety-day`, `ops-day`, `support-day`, `critical-day` answer:

> Which model for **this** workflow?

They may overlap Core/Extended tests. That is intentional. Do not confuse
a day-suite score with a Core or Extended general-map score.

## How to choose

| Decision | Suite |
|----------|--------|
| Quick model vs model overall | **Core** |
| Serious multi-field comparison | **Extended** |
| Reliability / full coverage / research | **Full** |
| Pick a daily driver for one job | **day suite** |

## Integrity and reporting

- Record `"suite": "core" | "extended" | "full" | …` in `meta.json`.
- `tools/validate.js` flags incomplete Core/Extended as **PROVISIONAL**.
- `report/index.html` suite filter: `core`, `extended`, `full`, plus day suites.
- Incomplete ladder runs show provisional badges; do not read a partial
  radar as a finished general map.

## Editing the ladder

1. Edit **`tiers.json`** first (keep Core ⊂ Extended; base forms only).
2. Mirror lists into **`RUN.md`** and **`report/index.html`** `SUITES`
   (`node tools/sync-tiers-to-report.js` for the report).
3. Run `node tools/validate.js` (checks tier sync + nesting).
4. Update this file’s size numbers if counts change.

## Gap closure (shipped 2026-07-09)

See `docs/superpowers/specs/2026-07-09-gap-closure-roster.md`.

**Shipped:** Wave A–C base facets + b/c parallels for all 15 new facets.
Extended **123** base forms; Full **759** forms. New categories:
ambiguity, copywriting, ux-critique, teaching. Day suite `copy-day`.
Tools: `implement-gap-closure.js`, `mint-gap-parallels.js` (prefer
editing tests/rubrics directly for small fixes). Default report suite
filter: **core**.
