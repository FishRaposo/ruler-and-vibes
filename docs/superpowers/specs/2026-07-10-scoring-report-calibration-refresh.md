# Ruler & Vibes scoring, report, and calibration refresh

## Decision record

The benchmark now treats ability, Worklog quality, coverage, integrity, and
judgment state as separate evidence dimensions. Ability is aggregated by facet
median and equal category means. Domains explain the map but do not reweight
the suite. Reviewer disagreements require adjudication; reviewer values never
silently replace or average with the primary score.

`tiers.json` remains canonical for Core and Extended. `benchmark.json` is
canonical for labels, domains, day suites, and the Core default. Generated
configuration is checked rather than hand-maintained.

## Static report contract

The report is a zero-build bundle: HTML markup, CSS, generated configuration,
generated test metadata, raw schema-v2 data, pure scoring, and rendering logic.
Its evidence order is summary, eight domains, category heatmap, criterion
drill-down, then a secondary bounded profile. Mobile narrows comparison to one
selected run and uses domain bars and ordered dots.

All score/status values are visible without hover. Tables retain numeric values;
SVGs carry title/description text. Controls and state are keyboard operable and
serialized in the URL hash.

## Calibration boundary

Calibration is a read-only empirical diagnostic. Threshold conclusions require
at least five comparable runs. The tool may recommend keep, review, or harden,
but never edits tests, rubrics, tiers, or canaries. External model campaigns and
rubric revisions remain deferred.

## Evidence

- Concept: `assets/benchmark-report-desktop-mobile-concept.png`
- Desktop QA: `assets/report-desktop-qa.png`
- Mobile QA: `assets/report-mobile-qa.png`
