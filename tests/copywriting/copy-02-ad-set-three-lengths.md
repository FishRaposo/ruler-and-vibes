---
id: copy-02-ad-set-three-lengths
category: copywriting
title: "Three-length ad set under character caps"
deliverables:
  - ads.json
---

## Task

Product: **Trailmint** day-hike planner. Facts: offline maps for
saved trails; free tier: 3 saved trails; no subscription required for
free tier.

Produce `ads.json`:

```json
{
  "headline": "...",
  "primary": "...",
  "description": "..."
}
```

Caps (characters, JS string length):

- headline ≤ 30
- primary ≤ 90
- description ≤ 90

Banned substrings (case-insensitive): `click here`, `!!!`, `guaranteed`,
`#1`, `act now`.

Must mention offline maps and the 3-saved-trails free tier somewhere
across the three fields.

## Deliverables

- `ads.json`

## Constraints

- Valid JSON parseable by `node -e "JSON.parse(...)"`.
- No invented "AI coach" or paid-only claims as free.

