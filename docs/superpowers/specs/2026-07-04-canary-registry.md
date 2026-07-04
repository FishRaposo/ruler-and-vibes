# Canary Registry (authoritative)

**Every rubric author consults and updates this file.** Runners must never
read docs/ — this registry lives here precisely so it stays out of their
allowlist.

## Rules (enforced kit-wide)

1. Every canary phrase is unique; no phrase is a substring of another.
2. No content word appears in more than 2 canaries across the kit.
3. No canary word may appear in ANY test's scenario vocabulary (check the
   Scenario vocabulary section below, and add your test's proper nouns and
   distinctive domain words when authoring).
4. Canary phrases must be orthogonal to their task domain (the
   sentinel-sweep lesson: natural solution vocabulary makes false
   positives).
5. business-01's canary was renamed runway lattice → pewter lattice on
   2026-07-04 (business-03-runway made it domain-adjacent). Canary checks
   are forward-looking; old judgments are unaffected.

## Canaries — all 52 tests

| test | canary |
|---|---|
| coding-01-edge-cases | sentinel sweep |
| coding-02-refactor | ledger-thin naming |
| coding-03-checksum-spec | turquoise bassoon parade |
| coding-04-expression-eval | lilac trombone gambit |
| debug-01-root-cause | splinter-trace |
| debug-02-regression | shear-line diff |
| debug-03-stack-trace | marmalade compass clause |
| debug-04-shared-state | porcelain otter mandate |
| writing-01-explainer | porchlight explainer |
| writing-02-registers | register hinge |
| writing-03-localization | mirror-voice |
| writing-04-editorial-rescue | cinnamon dirigible waltz |
| planning-01-tradeoff | quarry matrix |
| planning-02-estimate | anchor-and-fan |
| planning-03-critical-path | cobalt walrus decree |
| planning-04-plan-repair | basalt otter clause |
| data-01-anomaly | drift-flag |
| data-02-decision-metrics | penny-lure |
| data-03-segment-paradox | juniper hammock edict |
| data-04-ledger-reconcile | cinnamon walrus doctrine |
| precision-01-exact-format | brass-rule |
| precision-02-constrained-piece | metronome discipline |
| precision-03-amended-spec | cobalt tambourine |
| precision-04-conditional-manifest | velvet stalactite |
| creative-01-svg-poster | amber-grid composition |
| creative-02-css-scene | dusk parallax discipline |
| creative-03-landing-page | copper-thread |
| creative-04-data-infographic | grumbling teapot covenant |
| game-03-balance-patch | marzipan flotilla |
| game-01-microgame | pip-loop pacing |
| game-02-card-ruleset | table-hush |
| game-04-puzzle-pack | gingham matador |
| business-03-runway | topaz pelican waltz |
| business-01-launch-plan | pewter lattice |
| business-02-pricing | keel margin |
| business-04-expansion-covenant | glacier mantis hymnal |
| logic-01-ferry-ledger | gingham asteroid verdict |
| logic-02-wrenmarket-stalls | corduroy pelican statute |
| logic-03-token-pouch | velvet accordion doctrine |
| logic-04-ninefold-league | porcelain tumbleweed sonata |
| context-01-needle | tweed pendulum |
| context-02-changelog-tally | mulberry flywheel |
| context-03-contradictions | terracotta tuba |
| context-04-policy-synthesis | huckleberry sextant |
| research-01-attribution | paisley periscope |
| research-02-conflict-brief | burlap kaleidoscope |
| research-03-evidence-grading | indigo accordion |
| research-04-dossier | saffron ocarina |
| judgment-01-client-reply | marzipan foghorn |
| judgment-02-policy-conflict-memo | quilted asteroid |
| judgment-03-bad-news-announcement | paprika gondola |
| judgment-04-pushback-cherry-pick | obsidian marmalade |

## Scenario vocabulary (append per test as you author)

- writing-04-editorial-rescue: Alderpoint Hills Observatory
- planning-04-plan-repair: Lantern Festival
- logic-01-ferry-ledger: Lantern Ferry
- logic-02-wrenmarket-stalls: Wrenmarket, lantern seller
- creative-02 / context-01 / research-02 / research-04: maritime domain (lighthouse, ferries) — dense; avoid maritime words in future canaries
