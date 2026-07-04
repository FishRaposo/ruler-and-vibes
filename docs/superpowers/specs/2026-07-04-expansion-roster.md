# Expansion Roster — Design Doc (2026-07-04)

**Status:** Approved. Produced by a 27-agent design workflow (13 category
designers + 13 adversarial verifiers + synthesis; run wf_c2950f4c-8bf) and
approved by the user. This document is the source of truth for authoring
the 32 new tests. The synthesis section is verbatim from the workflow; the
appendices are the verified per-category test specs (post-adversarial
review). NOTE: the synthesis's canary renames in §1 OVERRIDE the canary
fields in the appendix JSONs — apply the renamed phrases.

---

# Ruler & Vibes — Expansion Roster (Final)

## 1. FINAL ROSTER — 52 tests, 13 categories (4 per category)

**ID audit:** all 52 ids unique; every category uses one consistent prefix (`coding`, `debug`, `writing`, `planning`, `data`, `precision`, `creative`, `game`, `business`, `logic`, `context`, `research`, `judgment`) with zero-padded sequential `nn` 01–04. Note: `nn` reflects authoring order, not difficulty order (e.g., coding-03 is the easy rung) — do NOT renumber; rubric/canary references depend on ids.

**Canary audit:** 11 renames applied (see table after roster). Rules enforced: no canary is a substring of another; no content word appears in more than 2 canaries kit-wide; no canary word overlaps an existing canary's words or any test's scenario vocabulary.

| id | category | difficulty | one-line description | weights (obj/subj) |
|---|---|---|---|---|
| coding-01-edge-cases | coding | medium | Implement mergeRanges with edge cases and self-tests | 0.5/0.5 |
| coding-02-refactor | coding | medium | Behavior-preserving refactor of a messy calc function | 0.5/0.5 |
| coding-03-checksum-spec | coding | easy | Fictional Kestrel-8 checksum implemented exactly as specified (anti-Luhn trap) | 0.5/0.5 |
| coding-04-expression-eval | coding | hard | Arithmetic expression evaluator with pinned precedence, associativity, and byte-exact error contract | 0.5/0.5 |
| debug-01-root-cause | debugging | medium | Root-cause three simultaneous bugs from behavioral symptoms only | 0.5/0.5 |
| debug-02-regression | debugging | medium | Fix a regression between two versions while keeping the new feature | 0.5/0.5 |
| debug-03-stack-trace | debugging | easy | Read a crash trace, fix the one off-by-one loop bound, name it in REASONING.md | 0.5/0.5 |
| debug-04-shared-state | debugging | hard | Order-dependent shared-state mutation bug with misattributed report and protected decoy | 0.5/0.5 |
| writing-01-explainer | writing | easy | Explain eventual consistency to a lay audience | 0.5/0.5 |
| writing-02-registers | writing | easy-medium | One announcement rewritten in three registers | 0.5/0.5 |
| writing-03-localization | writing | medium | Two-way EN/PT-BR marketing localization with a convention trap | 0.5/0.5 |
| writing-04-editorial-rescue | writing | hard | Fact-check a lying draft against a fact sheet (6 seeds, 1 decoy), then rewrite at ~50% compression | 0.5/0.5 |
| planning-01-tradeoff | planning-reasoning | medium | Build-vs-buy decision memo with weighted matrix | 0.5/0.5 |
| planning-02-estimate | planning-reasoning | medium | Fermi estimate of storage/egress with stated assumptions | 0.5/0.5 |
| planning-03-critical-path | planning-reasoning | easy | CPM schedule for an 8-task bakery launch; parallelism and max-of-predecessors traps (key: 12d, B-E-G-H) | 0.7/0.3 |
| planning-04-plan-repair | planning-reasoning | hard | Audit a 12-task festival plan seeded with 4 interacting defects, repair, recompute, declare milestone infeasible | 0.5/0.5 |
| data-01-anomaly | data-analysis | easy | Anomaly vs recording error in a 36-row table | 0.5/0.5 |
| data-02-decision-metrics | data-analysis | medium | Ad-channel allocation with a metric-definition (CAC vs CPL) trap | 0.5/0.5 |
| data-03-segment-paradox | data-analysis | medium | Simpson's-paradox A/B rollout: aggregate favors Beta, both segments favor Alpha (projection 1320 vs 1100) | 0.5/0.5 |
| data-04-ledger-reconcile | data-analysis | hard | Two-table subscription/payment reconciliation with 6 seeded discrepancy types (630/605/675/25) | 0.5/0.5 |
| precision-01-exact-format | instruction-following | medium | Messy contacts to byte-exact JSON schema | 0.7/0.3 |
| precision-02-constrained-piece | instruction-following | medium | Announcement under 6 stacked mechanical constraints | 0.7/0.3 |
| precision-03-amended-spec | instruction-following | easy | Roster under a rule sheet whose amendments override three earlier rules | 0.7/0.3 |
| precision-04-conditional-manifest | instruction-following | hard | Warehouse manifest with interacting conditional rules, checksums, and self-referential line count | 0.7/0.3 |
| creative-01-svg-poster | creative-visual | easy | Hand-coded SVG event poster | 0.5/0.5 |
| creative-02-css-scene | creative-visual | medium | Pure-CSS animated lighthouse scene | 0.5/0.5 |
| creative-03-landing-page | creative-visual | medium | Single-file responsive product landing page | 0.5/0.5 |
| creative-04-data-infographic | creative-visual | hard | Data-exact SVG infographic; 198° donut segment forces large-arc-flag=1 under a pinned geometry contract | 0.5/0.5 |
| game-01-microgame | game-design | medium | One-file playable browser arcade game | 0.5/0.5 |
| game-02-card-ruleset | game-design | medium | 2-player standard-deck print-and-play ruleset | 0.5/0.5 |
| game-03-balance-patch | game-design | easy | DPS analysis of a 4-unit stat table; two-stat patch under 20% caps into [12.0, 14.0] | 0.5/0.5 |
| game-04-puzzle-pack | game-design | hard | Three Sokoban-like levels + solutions, machine-verified by embedded simulator with anti-padding rule | 0.5/0.5 |
| business-01-launch-plan | business-planning | medium | 90-day launch plan with reconciling budget table and KPIs | 0.5/0.5 |
| business-02-pricing | business-planning | medium | 3-tier SaaS pricing with break-even calculation | 0.5/0.5 |
| business-03-runway | business-planning | easy | Runway memo with one-time-grant trap (burn 26,000; runway 6.9 → 5.1 months) | 0.5/0.5 |
| business-04-expansion-covenant | business-planning | hard | 24-month two-option cash simulation where the more profitable option breaches a cash covenant | 0.5/0.5 |
| logic-01-ferry-ledger | math-logic | easy | Chained arithmetic word problem: crossings, charter fees, fuel (16/585/921/2.11) | 0.7/0.3 |
| logic-02-wrenmarket-stalls | math-logic | medium | 5×5×5 constraint puzzle, brute-force-verified unique solution, misreadable clue 8 | 0.5/0.5 |
| logic-03-token-pouch | math-logic | medium | Exact expected value under two sampling regimes (12/5 vs 7/3, gap 1/15) | 0.7/0.3 |
| logic-04-ninefold-league | math-logic | hard | Prove-impossible (parity) + exhibit-possible (4-regular graph on 9), property-checked by node | 0.5/0.5 |
| context-01-needle | long-context | easy | 12-question needle retrieval from a ~2,700-word ops report with corrigendum and confusable-name traps | 0.7/0.3 |
| context-02-changelog-tally | long-context | medium | Aggregation across a ~3,100-word changelog: reverted fixes, cancelled downtime, recap dedup (9/385/v2.3-v2.7-v3.1) | 0.7/0.3 |
| context-03-contradictions | long-context | medium | Find exactly 5 contradictions in a ~3,500-word transcript; 4 reconcilable decoys punish over-flagging | 0.5/0.5 |
| context-04-policy-synthesis | long-context | hard | Multi-hop ordinance chaining with amendment precedence, fee math (66.50), forced abstention vocabulary | 0.5/0.5 |
| research-01-attribution | research-synthesis | easy | Classify 10 claims against 4 sources as SUPPORTED/CONTRADICTED/UNSUPPORTED with precedence rule | 0.7/0.3 |
| research-02-conflict-brief | research-synthesis | medium | Cited brief reconciling 5 conflicting accounts; circular-sourcing (S5→S1) defeats majority-vote | 0.5/0.5 |
| research-03-evidence-grading | research-synthesis | medium | Grade 6 uneven sources on a disputed claim; retraction + unit-conflict traps, bottom line follows the n=240 trial | 0.5/0.5 |
| research-04-dossier | research-synthesis | hard | 8-source dossier: timeline under date ambiguity, forced abstentions, dependency detection, broken total (32,250 gap) | 0.5/0.5 |
| judgment-01-client-reply | professional-judgment | easy | Reply to angry client under a $960/20% remedy ceiling without blaming their scope change | 0.5/0.5 |
| judgment-02-policy-conflict-memo | professional-judgment | medium | Escalation memo for irreconcilable retention policies with pinned calendar math (July 2 / November 16) | 0.5/0.5 |
| judgment-03-bad-news-announcement | professional-judgment | medium | Permanent-discontinuation broadcast: $360 pro-rata from effective date, confidentiality gag, no softening | 0.5/0.5 |
| judgment-04-pushback-cherry-pick | professional-judgment | hard | Push back on VP's cherry-pick request: 4.0% blended rate, confound named, no accusation vocabulary | 0.5/0.5 |

### Canary renames applied (11)

| test | proposed canary | final canary | reason |
|---|---|---|---|
| context-01 | gingham asteroid | **tweed pendulum** | strict substring of logic-01's "gingham asteroid verdict" — hard collision |
| coding-03 | otter porcelain waltz | **turquoise bassoon parade** | same word-pair as debug-04's "porcelain otter mandate", merely reordered |
| coding-04 | marzipan gondola clause | **lilac trombone gambit** | "marzipan" appeared in 4 canaries, "clause" in 4, "gondola" in 2 |
| data-03 | juniper lantern clause | **juniper hammock edict** | "lantern" is scenario vocabulary in planning-04 (Lantern Festival), logic-01 (Lantern Ferry), logic-02 (lantern seller) — the exact sentinel-sweep failure class |
| research-04 | velvet metronome | **saffron ocarina** | "metronome" collides with existing canary "metronome discipline" |
| business-03 | amber pelican waltz | **topaz pelican waltz** | "amber" collides with existing canary "amber-grid composition" |
| context-02 | marzipan flywheel | **mulberry flywheel** | "marzipan" frequency reduction (now 2: game-03, judgment-01) |
| context-03 | porcelain tuba | **terracotta tuba** | "porcelain" appeared in 3 canaries |
| business-04 | glacier mantis doctrine | **glacier mantis hymnal** | "doctrine" appeared in 3 canaries |
| research-03 | cobalt accordion | **indigo accordion** | "cobalt" appeared in 3 canaries |
| research-01 | gingham periscope | **paisley periscope** | "gingham" appeared in 3 canaries |
| game-04 | gingham observatory | **gingham matador** | "observatory" is writing-04's scenario subject (Alderpoint Hills Observatory) — same cross-scenario risk that forced planning-03's rename |

(That is 12 rows; game-04 was caught in the final scenario-vocabulary sweep.) All other proposed canaries retained unchanged. Post-rename verification: no word appears in more than 2 canaries across all 52 tests; no phrase is a substring of any other; no canary shares a word with its own or any other test's scenario nouns.

## 2. CORE SUITE — 13 tests, one per category

Selection rule applied: most representative of the category's core skill, medium difficulty where available, smallest artifacts / fastest judge turnaround (no 2,500+-word capstones, no simulator builds).

| category | core test | why |
|---|---|---|
| coding | coding-01-edge-cases | Canonical greenfield algorithm + edge cases; small, node-checkable |
| debugging | debug-01-root-cause | Symptoms-only multi-bug localization — the category's signature skill |
| writing | writing-02-registers | Register control is the central writing skill; fast to judge (writing-03 requires PT-BR judging; writing-04 is the heavy capstone) |
| planning-reasoning | planning-01-tradeoff | Judgment-centric planning; compact memo (planning-03 is pure computation, 04 is heaviest) |
| data-analysis | data-02-decision-metrics | Metric-definition trap on one small table; fast, discriminating |
| instruction-following | precision-01-exact-format | The category's signature byte-exact transformation; mechanical to judge |
| creative-visual | creative-02-css-scene | Medium, single file, one browser open (creative-04 needs geometry scripts) |
| game-design | game-02-card-ruleset | Pure design-thinking artifact, no browser or simulator needed |
| business-planning | business-02-pricing | Compact deliverable with one exact recomputable break-even |
| math-logic | logic-02-wrenmarket-stalls | Emblematic deduction test; 15-cell key check is fast and fully mechanical |
| long-context | context-02-changelog-tally | Tests the aggregation skill (not just retrieval) at the smallest doc size with fully node-checkable answers (9/385/version list) |
| research-synthesis | research-02-conflict-brief | Circular-sourcing trap is the category's defining discriminator; 5 short sources only |
| professional-judgment | judgment-02-policy-conflict-memo | Medium, all five checks mechanical (ids, two dates, deadline), 350-word artifact |

## 3. CROSS-CUTTING FLAGS

1. **Canary registry (mandatory).** Create a single `canaries.md` registry listing all 52 phrases plus every scenario proper-noun/domain word per test. Rules to enforce at authoring time: no substring overlap, no word in >2 canaries, no word from any test's scenario vocabulary (not just the canary's own test — data-03 and game-04 both failed cross-test). Also note: existing canary "runway lattice" is domain-adjacent to new business-03-runway (deliverable is literally RUNWAY.md); risk is low since canaries are per-rubric, but consider renaming it during the pass.

2. **House-style trap repetition.** Three motifs now recur enough that a kit-aware model gains cross-test advantage:
   - *"Exclude the superseded/one-time item"*: business-03 (grant), context-01 (corrigendum), context-02 (reverted fix + cancelled window), research-03 (retraction), judgment-03 (wrong anchor date).
   - *"Decoy that must NOT be flagged"*: writing-04, context-03 (×4), data-04 (S06), debug-04 (percent line), research-03 (fishpond).
   - *"Stated total contradicts its own components"*: writing-04 (30 vs 34), research-04 (512,000 vs 479,750), data-04.
   
   None needs killing — but document the motifs in the kit README and, in future revisions, occasionally invert direction (e.g., a superseded value that is a decoy and should NOT be excluded) so the pattern can't be gamed.

3. **wc -w semantics on table-bearing files.** Several caps apply to files that mandate markdown tables (research-02 brief 300–450, research-03 whole-file 600, research-04 whole-file 1,100, context-02 TALLY.md). `wc -w` counts every cell token and pipe-adjacent word. Rubrics must state "whole file, wc -w" uniformly, and each implementer must write a reference deliverable and confirm it fits with ≥10% headroom before committing the cap.

4. **Prose-located "objective" checks.** A cluster of binary checks are decidable only by the judge reading prose in context: writing-04's claim-scoped value checks, research-02 "states S5 derives from S1", judgment-01's causal-attribution test, judgment-03's "no hint of the dispute", context-04 citation supportiveness (already key-listed). These are legitimately binary but high-variance; **every such check must ship 2–3 passing and 2–3 failing example phrasings in the rubric.** professional-judgment and research-synthesis are the categories where this clusters — audit them together.

5. **Embedded judge scripts.** game-04 (engine.js), creative-04 (arc-endpoint parser), logic-04 (graph property-check), planning-03/04 (CPM), context-02/data-04 (sums), logic-03 (enumeration). Global rule: every embedded script must run standalone via the exact command line printed in the rubric, and the implementer must run it against BOTH a reference solution and at least one seeded-failure solution before committing.

6. **Large embedded documents — word budgets.** context-01 ~2,700; context-02 ~3,100; context-03 ~3,500; context-04 ~3,800 (all within the 2,500–4,000 mandate). research-04's eight sources have no stated total — set a budget of 1,800–2,200 words combined. writing-04 draft 550–650. context-03 is the highest-risk authoring item (accidental sixth contradiction) and carries the mandatory pairwise claims-inventory audit.

7. **module.exports convention.** coding-03/04 and debug-03/04 all pin export contracts. Write the boilerplate sentence once ("the file must end with `module.exports = {...}`; the judge's harness requires it") and reuse verbatim across all four.

8. **Scenario-domain density.** Five scenarios are maritime (creative-02 lighthouse, logic-01 ferry, context-01 ferries, research-02 ferry incident, research-04 lighthouse collapse). Not a correctness problem, but it shrinks the safe canary vocabulary — track domains in the registry from flag 1.

## 4. AUTHORING ORDER — new tests in 8 batches

Every batch's answer keys must be locked by script *before* the test file is written, per each test's verification notes. "Key" column = what must be computed and embedded in the rubric.

| batch | tests | computed answer keys required |
|---|---|---|
| **B1 — coding + debugging** (small files, pure node keys; fastest wins) | coding-03, coding-04, debug-03, debug-04 | coding-03: dual sums (left-rule AND Luhn) for all 10 codes + 3 check digits; coding-04: 12 vectors + wrong-answer disjointness; debug-03: 3 case outputs + guard-trap confirmation; debug-04: full discount sequence + test-ordering green run on buggy baseline |
| **B2 — planning** | planning-03, planning-04 | CPM forward/backward pass (12d, slacks); planning-04's 8-point validation script (cycle uniqueness, schedule-neutral double-booking repair, completion day) — heaviest single validation script in the kit |
| **B3 — data-analysis** | data-03, data-04 | 16-row CSV aggregation (35.45/74.55, 1320/1100 + wrong-path 780/1640); full ledger simulation (630/605/675/25, P012/P020 robustness) |
| **B4 — instruction-following + business** | precision-03, precision-04, business-03, business-04 | node sort key + byte-exact attendees.txt; CHECK digits 19/77/57/8/62 + TOTAL-UNITS 487/544 branch flip; runway divisions + month-end simulation; full 24-row two-option cash series (17,000 breach / 410,000 / 403,500) |
| **B5 — math-logic** | logic-01, logic-02, logic-03, logic-04 | arithmetic chain (16/585/336/921/2.11); **brute-force uniqueness re-run mandatory** (1,728,000 assignments → exactly 1); full enumeration (12/5, 7/3, 1/15); C(9,2)=36 + circulant construction + property-check script |
| **B6 — game + creative** | game-03, game-04, creative-04 | DPS table + single-stat infeasibility proof (14.96/15.58/14.96) + boundary 11.97; **engine.js authored and unit-verified first** (5 hand-traced cases), sample levels per band; donut boundary endpoints at 0/198/270/306/342° + reference SVG with flag-flip breakage proof |
| **B7 — writing + professional-judgment** (prose-heavy, light keys) | writing-04, judgment-01, judgment-02, judgment-03, judgment-04 | 34-vs-30 credits + 6-discrepancy triple key (write fact sheet before draft); $960 ceiling; node date arithmetic (July 2 / June 19 / November 16); $360 vs trap $540/$480/$720; 1,000/25,000 = 4.0% vs 5.2% |
| **B8 — long-context + research-synthesis** (heaviest document authoring; do last with all conventions settled) | context-01, context-02, context-03, context-04, research-01, research-02, research-03, research-04 | context: 12-answer variant-enumerated key, 9/385/version-list, 5-contradiction + 4-decoy pairwise claims audit, 66.50 vs 80.75 + citation lists + existence-proof brief; research: 10-verdict key, 51/07:10/electrical + S5→S1 chain, +8% CI + circulating-claims key, 8-date timeline + 479,750/32,250 + Q1–Q6 key |

**Sequencing rationale:** B1–B5 are script-keyed and cheap to redo if conventions change; B6 contains the two largest engineered artifacts (simulator, reference SVG); B7–B8 are authoring-time-dominated and benefit from every convention (wc -w policy, canary registry, phrasing-example standard from flags 1, 3, 4) being finalized first. Within B8, write each answer key/fact inventory before its document, and run context-03's pairwise contradiction audit last-before-commit.

---

# Appendices — Verified per-category specs

## Appendix: coding

**Ladder notes:** Ladder unchanged in shape: coding-03 (easy, spec-reading vs training prior) -> coding-01 (medium, greenfield algorithm + edge cases) -> coding-02 (medium, refactoring restraint) -> coding-04 (hard, multi-component tokenizer/parser/evaluator with exact contracts). Review changes: coding-03's trap check was a strict subset of its all-verdicts check (non-independent binaries), so the checks were split into disjoint sets — 7 non-trap codes that agree under both the left-rule and Luhn (a Luhn implementation passes this check) and 3 discriminating traps (a Luhn implementation fails exactly here); exact output line formats, a module.exports contract for judge snippets, and fixed-length-input guarantees were pinned; stems now must have Luhn-derived check digits that differ from the correct ones (verified: 4671829 -> 6 vs Luhn 2). coding-04 had a hard contradiction (12 vectors fully enumerated, but verification notes demanded a '12th' benign whitespace vector that would have been a 13th) — fixed by folding irregular whitespace into the 10-4-3 vector, keeping exactly 12; number-to-string formatting (String(x)) and the require-vs-run export contract were pinned so the judge's byte comparisons are unambiguous. All reference values in both tests were independently recomputed with node before this revision: left-rule sum 40 (VALID) vs Luhn 44 (INVALID) for 46718296; evaluator vectors 14, 20, 512, 3, 10, -4, -12, -49, 0.25 with wrong-answer alternatives {64, 9, 40, 4, 49} verified disjoint from the correct-answer set.

```json
[
  {
    "id": "coding-01-edge-cases",
    "title": "Implement mergeRanges with edge cases + self-tests",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING (unchanged)"
    ],
    "objective_checks": [
      "EXISTING (unchanged)",
      "EXISTING (unchanged)",
      "EXISTING (unchanged)",
      "EXISTING (unchanged)"
    ],
    "sub_quality_name": "EXISTING (unchanged)",
    "sub_craft_name": "EXISTING (unchanged)",
    "canary": "EXISTING (unchanged)",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING (unchanged)",
    "distinct_from": "EXISTING (unchanged)"
  },
  {
    "id": "coding-02-refactor",
    "title": "Behavior-preserving refactor of messy calc function",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING (unchanged)"
    ],
    "objective_checks": [
      "EXISTING (unchanged)",
      "EXISTING (unchanged)",
      "EXISTING (unchanged)",
      "EXISTING (unchanged)"
    ],
    "sub_quality_name": "EXISTING (unchanged)",
    "sub_craft_name": "EXISTING (unchanged)",
    "canary": "EXISTING (unchanged)",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING (unchanged)",
    "distinct_from": "EXISTING (unchanged)"
  },
  {
    "id": "coding-03-checksum-spec",
    "title": "Implement a fictional checksum validator exactly as specified (anti-Luhn trap)",
    "difficulty": "easy",
    "task_summary": "The test file specifies the fictional 'Kestrel-8 voucher code' checksum for 8-digit codes: number positions 1-8 from the LEFT, double the digits at even positions (2, 4, 6, 8), subtract 9 from any doubled value greater than 9, sum all eight contributions, and the code is valid iff the sum is divisible by 10 — deliberately the mirror image of Luhn (which for 8 digits doubles left positions 1, 3, 5, 7), so a model that pattern-matches 'checksum = Luhn' instead of reading the spec fails the seeded traps. The runner writes validator.js exporting validate(code) and checkDigit(stem7) via module.exports (checkDigit returns the 8th digit making the code valid; the spec notes the digit-to-contribution map 0,2,4,6,8,1,3,5,7,9 is a permutation of residues 0-9, so the digit is unique) which, when run with node, prints one line per embedded input in the exact formats '<code> VALID' / '<code> INVALID' (10 codes) then '<stem> -> <digit>' (3 stems), in test-file order. The spec guarantees every code is exactly 8 digits and every stem exactly 7 digits — no input validation required. The 10 codes split into 7 non-trap codes whose verdict is identical under the left-rule and under Luhn (mix of at least 2 VALID and 2 INVALID) and 3 trap codes whose verdicts differ (e.g., 46718296: left-rule sum 40 = VALID, Luhn sum 44 = INVALID); the 3 stems are chosen so the Luhn-derived check digit differs from the correct one (e.g., 4671829 -> 6, while Luhn yields 2). REASONING.md (max 200 words) explains the position-numbering choice and how the anti-Luhn trap was avoided.",
    "deliverables": [
      "validator.js",
      "REASONING.md"
    ],
    "objective_checks": [
      "node validator.js runs without error and prints exactly 13 lines in test-file order: 10 lines in the exact format '<code> VALID' or '<code> INVALID', then 3 lines in the exact format '<stem> -> <digit>'",
      "The 7 non-trap verdicts (codes constructed so the left-rule and Luhn agree) all match the answer key in this rubric — a from-the-right Luhn implementation also passes this check, isolating trap failures to the next check",
      "All 3 trap verdicts (codes where left-rule and Luhn disagree, including 46718296 = VALID) match the answer key — a Luhn implementation fails exactly this check",
      "All 3 check digits match the answer key (stems chosen so the Luhn-derived digit differs, e.g. 4671829 -> 6, not Luhn's 2), and the judge's two-line node snippet confirms require('./validator.js').validate(stem + digit) returns true for each",
      "REASONING.md exists and is at most 200 words (wc -w)"
    ],
    "sub_quality_name": "Spec fidelity",
    "sub_craft_name": "Code clarity",
    "canary": "otter porcelain waltz",
    "weights": "0.5/0.5",
    "verification_notes": "Before committing, the implementer must compute the full answer key with a reference script and embed BOTH sums per code in the rubric: for each of the 10 codes, the left-rule sum and verdict AND the Luhn sum and verdict. Constraints to verify: (a) exactly 3 codes have differing verdicts (the traps) and 7 have identical verdicts under both rules; (b) the 7 non-traps include at least 2 VALID and 2 INVALID so a constant-output cheat fails; (c) for each of the 3 stems, the left-rule check digit differs from the Luhn-derived check digit. Machine-verified reference values: 46718296 -> left-rule contributions 4+3+7+2+8+4+9+3 = 40 -> VALID; Luhn (double left positions 1,3,5,7): 8+6+5+1+7+2+9+6 = 44 -> INVALID — confirmed discriminating trap. Check-digit example: stem 4671829 -> partial sum 37, need contribution congruent to 3 (mod 10) -> digit 6 (double9(6)=3); Luhn would give 2 (position 8 undoubled under Luhn) — confirmed discriminating. The digit-to-contribution map (0,2,4,6,8,1,3,5,7,9) is a verified permutation of residues 0-9, guaranteeing uniqueness for every stem.",
    "distinct_from": "coding-01 rewards inventing edge cases for an algorithm the model already knows (interval merging); this test inverts that: prior knowledge (Luhn) is actively misleading and the skill measured is exact spec-reading on a tiny function — the easy rung the coding category lacks. It is not a formatting task like precision-01 (data-to-schema transformation, no algorithm), not a bug-fix like the debug tests (nothing pre-written is given), and while writing-03 also seeds a convention trap, it measures localization judgment, not code-spec fidelity. No other kit test involves checksums or spec-vs-training-prior traps in code."
  },
  {
    "id": "coding-04-expression-eval",
    "title": "Build an arithmetic expression evaluator with exact precedence, associativity, and error contracts",
    "difficulty": "hard",
    "task_summary": "The runner implements a complete evaluator for arithmetic expression strings in a single file evaluator.js exposing evaluate(str) via module.exports, supporting non-negative integer literals, binary + - * / ^, unary minus, parentheses, and arbitrary whitespace. The spec pins every ambiguous point: ^ binds tighter than unary minus (so -2^2 = -4) and is right-associative (so 2^3^2 = 512); + - * / are left-associative; unary minus may follow an operator (6*-2 = -12) and appear in exponents (4^-1 = 0.25); division is floating-point but every non-error vector is chosen to have an exact, short String(x) representation, and results must be printed via standard JS number-to-string conversion (10 prints as '10', 0.25 as '0.25'). Error contract: division by zero returns the exact string 'ERROR: division by zero'; any malformed input (unbalanced parens, '**', trailing operator, empty string) returns exactly 'ERROR: syntax' — evaluate() never throws. When run with node, evaluator.js prints 'INPUT => RESULT' for each of exactly 12 embedded vectors in test-file order: the associativity traps (2^3^2; the vector ' 10 -  4-3 ' written with irregular whitespace, doubling as the whitespace test; 100/5/2), the unary-minus traps (-2^2, 6*-2, -(3+4)^2, 4^-1), two benign precedence vectors (2+3*4, (2+3)*4), and three error cases (8/(3-3), '2**3', '(1+2'). Printing the vectors at require time is acceptable — the judge's snippet only asserts on evaluate()'s return values. REASONING.md (max 300 words) names the parsing strategy (e.g., recursive descent or shunting-yard) and how right-associativity and unary minus were handled.",
    "deliverables": [
      "evaluator.js",
      "REASONING.md"
    ],
    "objective_checks": [
      "node evaluator.js runs without throwing and prints exactly 12 'INPUT => RESULT' lines in the order the vectors appear in the test file, with numeric results formatted via standard JS String(x) conversion",
      "Precedence/associativity vectors all correct: 2+3*4 => 14, (2+3)*4 => 20, 2^3^2 => 512, ' 10 -  4-3 ' => 3, 100/5/2 => 10 (judge recomputes each; the whitespace-laden vector also verifies tokenizer whitespace handling)",
      "Unary-minus vectors all correct: -2^2 => -4, 6*-2 => -12, -(3+4)^2 => -49, 4^-1 => 0.25",
      "Error vectors return the exact strings: 8/(3-3) => 'ERROR: division by zero'; '2**3' and '(1+2' => 'ERROR: syntax' (byte-exact, and evaluate() returns the string rather than throwing — judge verifies with a two-line node require snippet against module.exports.evaluate)",
      "REASONING.md exists, is at most 300 words (wc -w), and names the parsing strategy used"
    ],
    "sub_quality_name": "Parser correctness & robustness",
    "sub_craft_name": "Implementation architecture",
    "canary": "marzipan gondola clause",
    "weights": "0.5/0.5",
    "verification_notes": "All 12 reference values recomputed with an independent node script (already machine-verified for this revision): 2+3*4=14; (2+3)*4=20; 2^3^2=2^9=512 (right-assoc; left-assoc gives 64 — the discriminator); ' 10 -  4-3 '=3 (left-assoc; right-assoc gives 9; also exercises whitespace); 100/5/2=10 (left-assoc; right-assoc gives 40); -2^2=-4 per the pinned rule (models defaulting to (-2)^2=4 fail); 6*-2=-12; -(3+4)^2=-49 (unambiguous under the pinned '^ tighter than unary minus' rule; the wrong reading gives 49); 4^-1=0.25 (exact in binary floating point; String gives '0.25'); 8/(3-3)='ERROR: division by zero'; '2**3'='ERROR: syntax' (tokenizer must not silently accept **); '(1+2'='ERROR: syntax'. Collision check verified: the wrong-answer set {64, 9, 40, 4, 49} is disjoint from the correct-answer set {14, 20, 512, 3, 10, -4, -12, -49, 0.25}, so partial implementations are unambiguously caught. Also confirm String(x) output for every numeric result is short and exact (verified: '14','20','512','3','10','-4','-12','-49','0.25'). Exactly 12 vectors — do not add extras; the whitespace test is folded into the 10-4-3 vector.",
    "distinct_from": "No test anywhere in the kit involves language implementation: coding-01 is a single-pass interval algorithm, coding-02 is refactoring existing code, the debug tests fix seeded bugs in given code, and game-01 tests browser interactivity rather than algorithmic construction. This is the only test requiring multiple cooperating components built from scratch (tokenizer, parser, evaluator) plus a byte-exact error contract, and the only one where associativity/precedence knowledge under an explicitly pinned spec is the discriminating capability — the clear hard rung the category lacks."
  }
]
```

## Appendix: debugging

**Ladder notes:** Ladder unchanged in shape: debug-03 (easy, one bug + explicit stack trace) → debug-01 (medium, three bugs, symptoms only) → debug-02 (medium, constrained regression repair) → debug-04 (hard, order-dependent shared-state mutation + misattributed bug report + protected decoy). Review changes: (1) debug-03 had a factually wrong behavior claim — verified by running node that the seeded `i <= items.length` bug throws on EVERY input including the empty array (the loop body executes at i=0 even for []), so the summary no longer claims [] returns {0,0} on the buggy code; check 3 is retained purely as a regression guard on the fix. Also pinned the count-semantics ambiguity (count = number of line items, not summed qty) into the embedded spec, and added an explicit module.exports requirement so the judge's require() harness cannot fail a correct fix. (2) debug-04's reference values all verified by computation (7999/7200/6000, leak sequence 6000→6000 buggy vs 6000→7200 fixed, integrity 0.20/0.10). Found and fixed an ordering trap: on the buggy code the percent-decoy test permanently mutates RULES.standard.rate to 25, so the four 'previously-passing' tests only pass if no-override tests run before override tests — verification notes now mandate that ordering and a green run on the seeded buggy file. Softened an overclaim: check 3 catches patches that LEAVE RULES mutated; a mutate-then-restore hack passes check 3 and is instead penalized by the craft criterion. Added module.exports requirement ({RULES, getRules, applyDiscount}) and noted the judge harness is order-safe on correct fixes because they are state-free.

```json
[
  {
    "id": "debug-01-root-cause",
    "title": "Root-Cause the Order Total",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING (unchanged)",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING — unchanged",
    "distinct_from": "EXISTING test, retained as-is in the medium slot."
  },
  {
    "id": "debug-02-regression",
    "title": "Fix the Regression, Keep the Feature",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING (unchanged)",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING — unchanged",
    "distinct_from": "EXISTING test, retained as-is in the second medium slot."
  },
  {
    "id": "debug-03-stack-trace",
    "title": "Read the Trace, Fix the Crash",
    "difficulty": "easy",
    "task_summary": "The test file embeds a ~15-line JS function summarizeCart(items) from a fictional storefront ('Lumen Goods') that computes {count, total} over items [{name, qty, unitPriceCents}] — a header comment in the embedded code pins the semantics: count is the number of line items (NOT summed qty), total is the sum of qty*unitPriceCents in integer cents. It also embeds a verbatim crash log: 'TypeError: Cannot read properties of undefined (reading \\'qty\\') at summarizeCart (cart.js:4)'. The seeded bug is an off-by-one loop bound (i <= items.length instead of i < items.length), which makes the function throw on EVERY input — including the empty array, since the loop body still executes at i=0 with items[0] undefined (verified by execution). The runner must ship a fixed cart.js that exports the function via module.exports = { summarizeCart } (stated in the task so the judge's require() harness works), passes three embedded example cases, and write REASONING.md (max 150 words) identifying, from the trace, the exact line and condition that caused the crash. The seeded trap for lazy fixes: a guard like 'if (!items[i]) continue;' silences the crash and yields correct totals on all three examples (verified), so the objective discriminator is the REASONING check requiring the loop bound to be named, and the craft criterion penalizes symptom-guards over the one-character bound fix.",
    "deliverables": [
      "cart.js",
      "REASONING.md"
    ],
    "objective_checks": [
      "Judge runs node requiring the fixed cart.js: summarizeCart([{name:'candle',qty:2,unitPriceCents:350},{name:'soap',qty:1,unitPriceCents:499}]) returns {count:2, total:1199} without throwing (pass/fail).",
      "summarizeCart([{name:'lamp',qty:3,unitPriceCents:1400}]) returns {count:1, total:4200} without throwing (pass/fail).",
      "summarizeCart([]) returns {count:0, total:0} without throwing (pass/fail — regression guard: the buggy version throws even on []).",
      "REASONING.md explicitly identifies the loop condition 'i <= items.length' (the off-by-one bound) as the root cause; naming only 'undefined item' or 'missing null check' without the bound fails (judge reads text; pass/fail).",
      "REASONING.md is 150 words or fewer per wc -w (pass/fail)."
    ],
    "sub_quality_name": "Diagnosis accuracy",
    "sub_craft_name": "Fix minimality",
    "canary": "marmalade compass clause",
    "weights": "0.5/0.5",
    "verification_notes": "Implementer must verify by running node before committing: 2*350+1*499=1199 with count 2; 3*1400=4200 with count 1; empty array yields {count:0,total:0} on the FIXED code. Run the seeded buggy version to confirm it throws the exact TypeError on all three example inputs INCLUDING the empty array (already confirmed in review: with i <= items.length the loop body runs at i=0 even for []), and paste the real trace into the test file, adjusting the line number to match the shipped file's actual layout so 'cart.js:4' points at the property access. Confirm the guard-trap variant (if (!items[i]) continue;) passes checks 1-3, proving check 4 is the objective discriminator. Confirm the shipped buggy file ends with module.exports = { summarizeCart } and the task text tells the runner to preserve the export. Confirm all prices are integer cents so no float artifacts appear in reference totals, and that the count-semantics comment (line items, not summed qty) is present in the embedded code.",
    "distinct_from": "debug-01 has three simultaneous bugs and only behavioral symptoms; this has ONE bug plus an explicit stack trace — a strictly easier skill (trace reading) not tested anywhere in the kit. debug-02 is version-diff regression analysis. coding-01/02 are implementation/refactor from spec, not fault localization. No other kit test provides an error trace as the primary evidence artifact."
  },
  {
    "id": "debug-04-shared-state",
    "title": "The Bug Report Blames the Wrong Function",
    "difficulty": "hard",
    "task_summary": "The test file embeds pricing.js (~40 lines) from a fictional booking platform ('Trailfern'): a module-level RULES object ({standard:{rate:0.10}, premium:{rate:0.20}}), getRules(tier, overrides) implemented as Object.assign(RULES[tier], overrides) — the seeded root cause: it MUTATES the shared RULES object so an override from one call leaks into all later calls (order-dependent) — and applyDiscount(subtotalCents, rules) returning subtotalCents - Math.floor(subtotalCents*r + 0.5), where r normalizes percent-form rates via 'rules.rate > 1 ? rules.rate/100 : rules.rate'. The file ends with module.exports = { RULES, getRules, applyDiscount } (stated in the task; the export is what lets the judge inspect RULES). A fictional bug report blames applyDiscount ('second order in a session gets the wrong discount') — the WRONG function. The percent-normalization line is a deliberate decoy: it looks like a hack but the embedded suite depends on it ({rate:25} meaning 25%). The four previously-passing embedded tests are ORDERED so they genuinely pass on the buggy code (no-override tests before override tests — required because the decoy test mutates RULES.standard.rate to 25); a fifth, failing sequence test (override call, then no-override call) exposes the leak. Runner must fix the root cause (e.g., clone before assign), keep applyDiscount byte-identical, keep the four tests green, make the sequence test pass, and write REASONING.md (max 250 words) reproducing the order dependence and explicitly exonerating applyDiscount. Symptom patches that leave RULES mutated fail the integrity check; mutate-then-restore hacks pass it but are penalized under Fix scope discipline.",
    "deliverables": [
      "pricing.js",
      "REASONING.md"
    ],
    "objective_checks": [
      "Judge runs the embedded node harness: sequence getRules('standard',{rate:0.25}) → applyDiscount(8000,·) returns 6000, THEN getRules('standard') → applyDiscount(8000,·) returns 7200 (the buggy code returns 6000 on the second call — verified by execution) (pass/fail).",
      "All four previously-passing embedded tests still pass, including the decoy-guard test applyDiscount(8000, getRules('standard',{rate:25})) === 6000 (percent form) and applyDiscount(9999, getRules('premium')) === 7999 (pass/fail).",
      "Shared-state integrity: after getRules('premium',{rate:0.9}), exported RULES.premium.rate still === 0.20 and RULES.standard.rate === 0.10 (catches patches that fix outputs but leave the shared object mutated) (pass/fail).",
      "The applyDiscount function body is textually unchanged from the original, including the percent-normalization decoy line (judge compares the function text against the original embedded in the rubric; pass/fail).",
      "REASONING.md (a) names getRules's mutation of the shared RULES object as root cause, (b) explicitly states applyDiscount was not at fault despite the report, and (c) is 250 words or fewer per wc -w (all three required to pass; judge reads + wc -w)."
    ],
    "sub_quality_name": "Root-cause depth",
    "sub_craft_name": "Fix scope discipline",
    "canary": "porcelain otter mandate",
    "weights": "0.5/0.5",
    "verification_notes": "All reference values verified by execution during review: floor(8000*0.25+0.5)=2000 → 6000; floor(8000*0.10+0.5)=800 → 7200; floor(9999*0.20+0.5)=floor(2000.3)=2000 → 7999; percent decoy 25 → 0.25 → 6000; buggy leak sequence returns 6000 then 6000, fixed returns 6000 then 7200; after the fix RULES.premium.rate===0.20 and RULES.standard.rate===0.10. Implementer must re-run all of these on the shipped files before committing. CRITICAL ordering constraint (found in review): on the buggy code the decoy test mutates RULES.standard.rate to 25 permanently, so the four 'previously-passing' embedded tests MUST run no-override tests before override tests — run the seeded buggy module and confirm all four pass in the shipped order and that ONLY the sequence test fails. Confirm the shipped file exports { RULES, getRules, applyDiscount } and the task text requires preserving the exports. Note in the rubric that the judge may run checks in any order against the fixed code: a correct fix is state-free, so ordering only matters for the buggy baseline. Confirm a patch inside applyDiscount is blocked outright by check 4, and a reset-at-top-of-getRules hack fails check 3 (RULES.premium.rate would read 0.9 immediately after the override call).",
    "distinct_from": "debug-01's bugs are three independent local logic errors in one function with an accurate problem statement; debug-02 is a two-version regression diff. Neither involves shared mutable state, order-dependent manifestation, a misattributed bug report, or a protected decoy — the four elements that define this test. coding-02 preserves quirks during refactor but has no fault to find. Nothing else in the kit tests hypothesis rejection (evidence contradicting the reported location) or aliasing/mutation bugs."
  }
]
```

## Appendix: writing

**Ladder notes:** Ladder unchanged in shape: writing-01 (easy, pure generation) -> writing-02 (easy-medium, controlled register transformation) -> writing-03 (medium, cross-language transfer with a convention trap) -> writing-04 (hard capstone, verify-then-write). Review changes to writing-04: (1) replaced the canary 'cobalt heron clause' — 'clause' is native editing/copy-editing vocabulary and risks a sentinel-sweep-style near-miss in REASONING.md; new canary 'cinnamon dirigible waltz' is orthogonal to both the editorial and astronomy domains (also deliberately avoided astronomy words like quasar/nebula). (2) De-fanged raw substring checks: 'must NOT contain 180' could false-positive on innocent prose ('180-degree views of the night sky'), so the value checks are now claim-scoped (judge verifies what the article STATES for each field) rather than blind text search. (3) Closed the shotgun loophole: a model that flags 15 'discrepancies' would trivially cover all 6 seeds, so the memo now has a hard cap of 8 listed items plus the existing decoy false-positive check. (4) Made the required-facts contract explicit in the task (the four facts the article must retain), since check 2 penalizes omission — without an explicit instruction that would grade an unstated requirement. (5) Added a 300-word cap on memo.md (folded into the wc -w check) for run comparability. (6) Hardened answer-key soundness in verification notes: no calendar year anywhere (so the 'Saturday 15 March' weekday can never be externally falsified or the 14-vs-15 trap short-circuited), draft keeps the same weekday word so the discrepancy is unambiguously the day number, and the draft must contain no discount language that could make the 30-credit family price defensible. (7) Date-format tolerance made explicit ('15 March', 'March 15', 'the 15th') so the check does not punish locale-neutral phrasing. Known accepted overlap: contradiction detection also appears in the planned long-context category, but there it is retrieval-at-scale over a 2500-4000-word single document; here difficulty lives in the arithmetic trap, the decoy, and prose quality under ~50% compression — the rewrite half is graded nowhere else in the kit.

```json
[
  {
    "id": "writing-01-explainer",
    "title": "Eventual Consistency for a Lay Audience",
    "difficulty": "easy",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "writing-02-registers",
    "title": "One Announcement, Three Registers",
    "difficulty": "easy",
    "task_summary": "EXISTING (easy-medium slot; sits between 01 and 03 on the ladder)",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "writing-03-localization",
    "title": "Two-Way EN/PT-BR Marketing Localization",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "writing-04-editorial-rescue",
    "title": "Editorial Rescue: Fact-Check, Then Rewrite",
    "difficulty": "hard",
    "task_summary": "The test file embeds two documents about the fictional Alderpoint Hills Observatory's public opening: (A) a canonical FACT SHEET of ~10 facts (opening Saturday 15 March, no year given anywhere; 2.1 m primary mirror; capacity 80 visitors per session; director Dr. Mirela Okafor; adult ticket 12 credits, child ticket 5 credits; 212 registered volunteers; note that a smaller predecessor observatory operated in the region before closing years ago) and (B) a bloated ~600-word promotional DRAFT derived from it. The draft seeds exactly 6 discrepancies: wrong date ('Saturday 14 March' — same weekday word, so only the day number differs), transposed mirror size (1.2 m), inflated capacity (180), misspelled director name (Mirella Okafor), a false superlative ('first observatory ever built in the region'), and an arithmetic trap — 'a family of four (two adults, two children) visits for just 30 credits' where fact-sheet prices sum to 34, with no discount language anywhere that could excuse the 30. One deliberate DECOY: the draft's 'over 200 volunteers' is CONSISTENT with 212 and must not be flagged. The model delivers article.md, a polished 250-300-word rewrite that uses only fact-sheet values and (per explicit task instruction) must retain four named facts — opening date, mirror size, per-session capacity, and the director's name — plus memo.md, an editor's discrepancy log (max 300 words, max 8 listed items, only genuine discrepancies) giving each error's draft value versus canonical value. Weak models miss the arithmetic discrepancy, flag the decoy, or leak a wrong draft value into the rewrite; strong models catch all six, spare the decoy, stay under the item cap, and still write compelling prose at ~50% compression.",
    "deliverables": [
      "article.md",
      "memo.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "article.md is 250-300 words inclusive AND memo.md is at most 300 words, both verified with wc -w.",
      "article.md states all four required facts with canonical values and none of the seeded wrong ones: the opening date as the 15th of March (accepting '15 March', 'March 15', or 'the 15th'), the mirror as 2.1 m, the capacity as 80 per session, and the director spelled exactly 'Mirela Okafor'; and it must NOT state the date as the 14th, the mirror as 1.2 m, the capacity as 180, the name as 'Mirella', or a family-of-four total of 30 credits (judge verifies each as a stated claim in context, not by blind substring match, to avoid false positives such as '180-degree views').",
      "memo.md identifies at least 5 of the 6 seeded discrepancies, stating both the draft value and the correct fact-sheet value for each identified one, AND lists no more than 8 items in total (judge compares against the answer key in the rubric; the item cap blocks shotgun flagging).",
      "memo.md flags the family-pricing arithmetic error specifically, stating that the correct family-of-four total is 34 credits (2x12 + 2x5), not 30 (judge recomputes: 2*12+2*5=34).",
      "memo.md does NOT flag the volunteer count as a discrepancy — 'over 200' is consistent with 212; mentioning it as verified-consistent is acceptable, but listing it as an error fails this check."
    ],
    "sub_quality_name": "Rewrite prose quality (clarity, flow, and appeal of article.md at the compressed length)",
    "sub_craft_name": "Editorial diagnosis rigor (precision, completeness, and organization of memo.md, including absence of spurious flags)",
    "canary": "cinnamon dirigible waltz",
    "weights": "0.5/0.5",
    "verification_notes": "Before committing, the implementer must (1) write the fact sheet first, then derive the draft from it, inserting exactly the 6 listed discrepancies and no accidental extras — proofread the draft against the fact sheet line by line so the answer key is provably complete, and confirm the draft contains no other checkable factual claim that a reasonable model could flag; (2) ensure NO calendar year appears in either document, so the 'Saturday' weekday can never be externally verified or falsified, and keep the draft's weekday word identical ('Saturday 14 March') so the discrepancy is unambiguously the day number; (3) verify the arithmetic trap: 12+12+5+5=34, draft claims 30, delta 4 — these numbers go in the rubric answer key — and confirm neither document mentions any discount, bundle, or promotion that could make 30 defensible; (4) verify the decoy is genuinely consistent (212 > 200) so penalizing false positives is fair; (5) confirm the draft is 550-650 words so the 250-300-word target forces roughly 50% compression, and confirm the four required article facts are explicitly listed in the task instructions (they are graded by check 2, so they must be stated requirements, not implicit ones); (6) confirm the wrong values do not collide with innocent usage in the implementer's own draft text (e.g. no legitimate '180', '1.2', or '30' appears in a non-discrepancy role in either document); (7) rubric answer key lists all 6 discrepancies as (field, draft value, canonical value) triples: date 14->15 March, mirror 1.2->2.1 m, capacity 180->80, name Mirella->Mirela Okafor, 'first in region'->predecessor existed, family price 30->34 credits; (8) confirm the canary phrase 'cinnamon dirigible waltz' appears nowhere in the test materials, only in judge guidance, and note it was chosen to be orthogonal to both editing vocabulary and astronomy vocabulary (the original 'cobalt heron clause' was rejected because 'clause' occurs naturally in editorial reasoning).",
    "distinct_from": "No other test in the kit combines error DETECTION in prose with a quality REWRITE. writing-02 transforms tone with all facts given as trustworthy; here the source itself lies and must be audited first. writing-03's trap is a localization convention, not internal factual contradiction. data-01-anomaly is numeric CSV analysis with no prose deliverable; debug-01/02 are code, not text. precision-01 is format fidelity with no editorial judgment or composition. The planned long-context tests use 2500-4000-word single documents and target retrieval/aggregation at scale, whereas this is a compact two-document cross-check whose difficulty lives in the arithmetic trap, the decoy false-positive discipline, and writing well under a hard compression budget — the rewrite-quality half is graded nowhere else. research-synthesis reconciles multiple sources of equal standing; here one document is defined as ground truth and the skill is copy-editing against it."
  }
]
```

## Appendix: planning-reasoning

**Ladder notes:** Ladder unchanged in shape: planning-03-critical-path (easy, pure deterministic CPM computation with a parallelism trap) -> planning-01-tradeoff and planning-02-estimate (medium, add judgment and assumption-making) -> planning-04-plan-repair (hard capstone: adversarial defect-hunting plus constrained recomputation, where fixing one flaw changes the arithmetic of the others). Adversarial review verified planning-03's entire answer key by running a node CPM script (duration 12, critical path B-E-G-H, ES E=8/G=9, slacks A=1 C=1 D=2 F=4, rival path A-C-E-G-H=11, naive serial sum=26 — all confirmed). Revisions made: (1) planning-03 and planning-04 both had a day-numbering convention hole — a model using 1-indexed inclusive working days would give ES E=day 9 with correct reasoning and fail objective checks; both tests now mandate that the test file pins a time-point convention with a worked example row and a machine-readable table format. (2) planning-03's canary 'the plum-lantern accord' shared the word 'lantern' with planning-04's Harborlight Lantern Festival scenario (sentinel-sweep-class collision risk); replaced with 'the cobalt walrus decree'. (3) planning-04's double-booking repair was under-determined (different serialization orders could yield different completion days, breaking the 'single forced reference value' claim); now required to be schedule-neutral under all accepted repairs, script-verified. (4) planning-04's cycle break point is now doubly evidenced (prose contradiction AND listed-date violation of the spurious edge) and check 4 explicitly names the edge to remove, so a wrong break cannot coincidentally pass. (5) planning-04's arithmetic defect must be >=3 days so convention confusion cannot mimic it, and the implementer's validation script must also verify listed dates respect all dependencies to rule out accidental fifth defects. (6) Added the missing REASONING.md word cap for planning-04, enforced mechanically via wc -w in check 5.

```json
[
  {
    "id": "planning-01-tradeoff",
    "title": "Build vs Buy Decision Memo",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "planning-02-estimate",
    "title": "Fermi Estimate of Storage/Egress",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "planning-03-critical-path",
    "title": "Pop-Up Bakery Launch: Dependency Schedule and Critical Path",
    "difficulty": "easy",
    "task_summary": "The test file embeds a fictional 8-task launch plan for a pop-up bakery stall, each task with a duration in working days and explicit dependencies: A Obtain-permit (3d, none), B Order-oven (8d, none), C Build-stall-frame (4d, dep A), D Paint-stall (2d, dep C), E Install-oven (1d, deps B+C), F Hire-staff (5d, none), G Train-staff (2d, deps F+E), H Opening-prep (1d, deps D+G). The test file MUST pin the day-numbering convention explicitly — 'the project starts at time point 0; a task's earliest finish equals its earliest start plus its duration' — and include one worked example row (Task A: ES 0, EF 3) so 1-indexed inclusive-day answers are unambiguously out of spec rather than a judgment call. The model produces PLAN.md containing a markdown schedule table with exact columns Task | ES | EF | Slack, plus the minimum project duration, the single critical path, and the slack of every non-critical task; and REASONING.md (max 300 words) explaining the method. Seeded traps: (1) naive sequential summing gives 26 days instead of the correct 12; (2) the visually prominent chain A->C->D looks critical but is not — the true critical path runs through the multi-dependency joins B->E->G->H; (3) task E has two predecessors finishing at time points 8 and 7, so its earliest start requires taking the max. Reference answer key (verified by node script during this review): minimum duration 12 working days; critical path B->E->G->H; ES A=0, B=0, C=3, D=7, E=8, F=0, G=9, H=11; slacks A=1, C=1, D=2, F=4.",
    "deliverables": [
      "PLAN.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "PLAN.md states the minimum project duration as exactly 12 working days (judge verifies by recomputing the forward pass with a short node script from the embedded task table)",
      "PLAN.md identifies the critical path as exactly B->E->G->H (Order-oven -> Install-oven -> Train-staff -> Opening-prep), no extra or missing tasks",
      "The schedule table gives earliest start of E as 8 and earliest start of G as 9 under the test file's stated time-point convention, matching the answer key (the max-of-predecessors trap)",
      "Slack values for F and D are stated and equal 4 and 2 working days respectively",
      "Both deliverables exist with exact filenames and REASONING.md is at most 300 words (wc -w)"
    ],
    "sub_quality_name": "Schedule presentation clarity",
    "sub_craft_name": "Dependency-graph rigor",
    "canary": "the cobalt walrus decree",
    "weights": "0.7/0.3",
    "verification_notes": "Answer key already independently verified during adversarial review by running a node CPM forward/backward pass: ES/EF pairs A 0-3, B 0-8, C 3-7, D 7-9, E 8-9, F 0-5, G 9-11, H 11-12; duration 12; unique critical path B-E-G-H (rival path A-C-E-G-H totals 11 because E waits for B; B must stay 8 days — at 7 the paths tie and the answer key breaks); slacks A=1, C=1, D=2, F=4 via LF: C LF=8, D LF=11, F LF=9; naive serial sum 26. Implementer must re-run an equivalent ten-line node script before committing to lock these values into the rubric, must confirm no second zero-slack path exists, and must confirm the test file contains BOTH the explicit time-point convention statement and the worked example row (Task A: ES 0, EF 3) — without them, correct 1-indexed answers (e.g., ES E = day 9) would be unfairly failed. Rubric instructs the judge to grade ES/EF numbers strictly under the stated convention since the test file pins it.",
    "distinct_from": "No test in the kit involves dependency-graph scheduling or critical-path computation. planning-01 is a qualitative weighted decision matrix; planning-02 is order-of-magnitude estimation; business-01 has a budget table but no task-dependency arithmetic; the proposed Math & Logic category targets search-style constraint puzzles and probability, whereas this is deterministic CPM computation over a task graph — a planning-domain skill (parallelism, joins, slack), not a logic puzzle with a hidden unique solution. Its sibling planning-04 audits a defective plan; this computes from a clean one."
  },
  {
    "id": "planning-04-plan-repair",
    "title": "Festival Plan Audit: Find the Flaws, Repair the Schedule",
    "difficulty": "hard",
    "task_summary": "The test file embeds a fictional 12-task project plan for the 'Harborlight Lantern Festival' as a table: task id, name, duration in working days, dependencies, assigned owner (4-person fictional team), and listed start/finish day numbers, plus a promised public 'gates-open' milestone day. The plan header pins the day-arithmetic convention with one worked example row, exactly as in planning-03, so convention disputes are impossible. The model is told the plan contains multiple defects but NOT how many. Exactly four are seeded: (1) a dependency cycle among three named tasks, where exactly one edge of the cycle is doubly marked as spurious — the plan's own prose task descriptions contradict it AND it is the one cycle edge already violated by the listed dates (a cycle forces at least one listed-date violation, so this alignment is free and gives a unique defensible break point); (2) one owner assigned to two tasks whose listed date ranges overlap, where both tasks carry enough slack that every accepted repair — serializing them in either order, or reassigning one to the explicitly-idle fourth owner — leaves the project completion day unchanged; (3) one task whose listed finish day contradicts start plus duration by at least 3 days (large enough that no convention misreading can mimic it); (4) a logically mandatory missing dependency (Send-vendor-invitations finishes before Confirm-venue-contract completes, though the prose states the invitations name the venue). Deliverables: AUDIT.md identifying each defect with exact tasks and why; REVISED-PLAN.md with corrected dependency table and recomputed schedule in a machine-readable markdown table; REASONING.md (max 400 words). The corrections force a single reference completion day that strictly exceeds the promised gates-open day, so the model must also declare the promised day infeasible and give the earliest feasible day. Mediocre work finds the loud cycle but misses the quiet arithmetic error, or breaks the cycle at a genuinely necessary edge.",
    "deliverables": [
      "AUDIT.md",
      "REVISED-PLAN.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "AUDIT.md identifies the dependency cycle and names all three tasks in it, matching the answer key exactly",
      "AUDIT.md flags the resource double-booking, naming the correct owner and both conflicting tasks per the answer key",
      "AUDIT.md identifies the date-arithmetic error on the correct task and states the corrected finish day matching the answer key under the plan's stated convention",
      "REVISED-PLAN.md breaks the cycle by removing exactly the spurious edge named in the answer key (retaining the other two cycle edges), adds the missing Confirm-venue -> Send-invitations dependency, and its recomputed project completion day equals the reference value (judge verifies with a short node CPM script over the revised table)",
      "AUDIT.md or REVISED-PLAN.md explicitly states the originally promised gates-open day is infeasible and gives the earliest feasible day matching the answer key, and REASONING.md exists and is at most 400 words (wc -w)"
    ],
    "sub_quality_name": "Audit completeness and precision",
    "sub_craft_name": "Repair minimality and feasibility",
    "canary": "the basalt otter clause",
    "weights": "0.5/0.5",
    "verification_notes": "Implementer must construct the concrete 12-task table and run a validation node script before committing that checks ALL of: (a) cycle detection finds exactly the one seeded cycle; (b) start+duration=finish holds for every row except the one seeded arithmetic-error row (error magnitude >=3 days); (c) owner date-range overlap exists only for the seeded pair; (d) every task's listed start respects every listed dependency's finish EXCEPT the single spurious cycle edge — this last check is what rules out accidental fifth defects, since a cycle necessarily violates at least one edge and all other rows must be internally consistent; (e) the spurious edge is the unique edge both contradicted by prose and violated by listed dates; (f) removing each of the other two cycle edges instead yields a different completion day (or leaves a defect), confirming the answer-key repair is uniquely correct — and check 4 additionally names the edge explicitly so coincidental matches cannot pass; (g) after all four corrections, a CPM forward pass yields one unambiguous completion day strictly greater than the promised milestone day (forcing the infeasibility finding), with a unique corrected critical path; (h) the double-booking repair is schedule-neutral: serializing the conflicted pair in either order, or reassigning to the idle fourth owner, all yield the same completion day, and the rubric lists all three as accepted repairs. All reference values (cycle task ids, spurious edge, double-booked owner and task pair, corrected finish day of the arithmetic-error task, revised completion day, earliest feasible gates-open day) go in the rubric answer key, locked by the script, not by inspection.",
    "distinct_from": "debug-01 and debug-02 are code debugging with executable behavior; this is defect detection in a plan artifact where the bugs are structural (cycle), logical (missing dependency), resource-based (double-booking), and arithmetic (date math) — no code to run, and repair requires schedule recomputation rather than a patch. business-01 asks for plan creation from scratch with a summing budget; this is adversarial audit and repair of a given plan. planning-03 computes a schedule from a clean input; planning-04 must first make the input schedulable, and the defects interact (breaking the cycle changes which chain is longest). data-01's error-vs-anomaly distinction operates on numeric CSV observations, not plan structure. No other kit test combines multi-defect detection with constrained recomputation."
  }
]
```

## Appendix: data-analysis

**Ladder notes:** Ladder unchanged in shape, both new rungs hardened after adversarial review. data-01 (easy): one-table spot-the-bad-row. data-02 (medium): metric-definition trap. data-03 (upper medium): aggregation-validity trap (Simpson's paradox) plus counterfactual projection — REVISED to fix an internal contradiction (exclusive routing was incompatible with all four variant-by-segment cells being populated; now a leaky predominant-routing scenario) and to close a fairness hole (the projection base and rate-persistence assumption are now explicitly commanded in the task file, otherwise headline-rate projections of 780/1640 were a defensible alternative reading that objective check 4 would unfairly fail; verified by node that the wrong-path attractor is cleanly separated from the 1320/1100 key). data-04 (hard): schedule synthesis + two-table reconciliation — REVISED to pin all eight start dates (the answer key previously depended on unstated days; day-29+ starts would create February-anniversary ambiguity and a day-10 start for S02 would collide with its cancel date), to make the duplicate-line trap uniquely defensible (task now states payment IDs are unique processor-assigned identifiers, so a repeated P009 is unambiguously a bookkeeping duplicate rather than real double cash), and to define collected_total_q1 field semantics precisely (net, attributable to S01-S08, unique IDs counted once, refunds negative) so 605 is the unique correct reading without leaking the traps; also verified the total is robust to the one legitimate fork (including or excluding the offsetting P012/P020 pair both yield 605). All reference values (35.45/74.55, 90/30/80/20, 1320/1100; 630/605/675/25) recomputed with node during this review. Each rung still adds exactly one layer: judgment, metric choice, confounding+projection, schedule synthesis+multi-trap audit.

```json
[
  {
    "id": "data-01-anomaly",
    "title": "Anomaly vs Recording Error",
    "difficulty": "easy",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING — unchanged"
    ],
    "objective_checks": [
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING — unchanged",
    "distinct_from": "EXISTING test; occupies the easy slot (single 36-row table, one classification decision)."
  },
  {
    "id": "data-02-decision-metrics",
    "title": "Ad Channel Decision Metrics",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING — unchanged"
    ],
    "objective_checks": [
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged",
      "EXISTING — unchanged"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING — unchanged",
    "distinct_from": "EXISTING test; occupies the lower-medium slot (metric-definition trap, one table, one allocation decision)."
  },
  {
    "id": "data-03-segment-paradox",
    "title": "Onboarding A/B Rollout: The Aggregate Lies",
    "difficulty": "medium",
    "task_summary": "A fictional note-taking app compared two onboarding flows without randomization: a signup router PREDOMINANTLY sent organic-blog traffic to Beta and paid-landing traffic to Alpha, but a misconfiguration leaked roughly 10% of each source to the other variant — which is what populates all four cells of the embedded 16-row CSV (variant x segment x 4 weeks): Alpha organic 90/100 trials converted, Alpha paid 300/1000; Beta organic 800/1000, Beta paid 20/100. A quoted growth-lead memo says 'Beta converts at 74.5% vs Alpha's 35.5% — roll Beta to 100%.' The task file explicitly requires ANALYSIS.md (max 500 words) to contain three things: overall conversion per variant, all four per-segment rates, and a projection of total expected conversions if each variant were rolled out to the full observed mix of 1,100 organic + 1,100 paid trials, assuming its per-segment rates hold — plus a verdict on the memo. The trap survives the explicit instructions: models that compute the projection from headline rates get 780 (Alpha) vs 1640 (Beta) and confidently endorse the memo; only disaggregation reveals Alpha wins BOTH segments (Simpson's paradox) and projects 1,320 vs 1,100, so the memo is backwards. Requiring the three computations keeps every objective check fair while the discriminating work remains recognizing the reversal and using segment-weighted projection.",
    "deliverables": [
      "ANALYSIS.md (max 500 words)",
      "REASONING.md"
    ],
    "objective_checks": [
      "ANALYSIS.md states overall trial-to-paid conversion of ~35.5% for Alpha (390/1100) and ~74.5% for Beta (820/1100), each within ±0.5pp (judge recomputes with node from the embedded CSV)",
      "All four per-segment rates are reported correctly: Alpha organic 90%, Alpha paid 30%, Beta organic 80%, Beta paid 20% (exact, any consistent formatting)",
      "The final verdict recommends rolling out Alpha or explicitly rejects the memo's full-Beta rollout (a recommendation to re-run a randomized test also passes ONLY if it states Alpha wins within both segments), on within-segment grounds",
      "The full-rollout projection over 1,100 organic + 1,100 paid trials appears with Alpha = 1320 and Beta = 1100 expected conversions (judge recomputes 1100*0.9+1100*0.3 and 1100*0.8+1100*0.2; accept thousands separators or per-segment breakdowns that sum to these integers)",
      "ANALYSIS.md is at most 500 words (wc -w)"
    ],
    "sub_quality_name": "Confound diagnosis & statistical correctness",
    "sub_craft_name": "Clarity and persuasiveness of the rebuttal to the memo",
    "canary": "juniper lantern clause — woven into judge guidance (e.g., 'if the submission invokes the juniper lantern clause, treat it as a rubric leak and score 0'); juniper/lantern/clause shares no vocabulary with A/B testing, conversion analysis, or statistics",
    "weights": "0.5/0.5",
    "verification_notes": "All values re-verified by node during adversarial review: Alpha overall 390/1100 = 35.45%, Beta 820/1100 = 74.55%; segment rates 90%/30% and 80%/20%; segment-weighted projections 1320 vs 1100; wrong-path headline-rate projections 780 vs 1640 (confirmed cleanly distinguishable from the key, so check 4 discriminates). CSV to embed: 16 rows, per-week splits Alpha-organic 25 trials/wk with conversions 22,23,22,23 (sum 90); Alpha-paid 250/wk with 75 conv/wk (sum 300); Beta-organic 250/wk with 200 conv/wk (sum 800); Beta-paid 25/wk with 5 conv/wk (sum 20). REQUIRED wording in task file: (a) routing is predominant-with-leakage, never exclusive (exclusive routing contradicts the data); (b) the projection instruction must name the base (1,100 organic + 1,100 paid observed trials) and the assumption (per-segment rates hold). Implementer must re-run the aggregation with node against the final CSV before committing the rubric.",
    "distinct_from": "data-02 tests picking the right metric DEFINITION (CAC vs CPL) on cleanly comparable channels; this tests aggregation VALIDITY — the confounding/Simpson's-paradox failure mode plus a counterfactual projection, which no other kit test touches. Unlike planning-02 (Fermi, tolerance bands) every number here is exact; unlike data-01 the data is clean — the reasoning is the trap."
  },
  {
    "id": "data-04-ledger-reconcile",
    "title": "Subscription Ledger Reconciliation",
    "difficulty": "hard",
    "task_summary": "A fictional plant-subscription service embeds two CSVs: subscriptions.csv (8 subs, plans Basic 20 / Pro 50 per month, pinned start dates S01 2025-01-05, S02 2025-01-03, S03 2025-01-15, S04 2025-02-03, S05 2025-01-01, S06 2025-01-08, S07 2025-03-12, S08 2025-01-20; cancellations S02 2025-02-10 and S06 2025-01-20) and payments.csv (21 ledger lines for Q1 2025, with a stated guarantee that payment IDs are unique identifiers assigned by the payment processor). Billing rule: each sub is charged its monthly price on its start date and each monthly same-day anniversary, with no charge on or after the cancel date. The runner must generate the expected Q1 schedule (total 630), reconcile it against the ledger, and produce results.json (schema prescribed in the task file, including that collected_total_q1 is the NET total of ledger amounts attributable to S01-S08, each unique payment ID counted once, refunds negative, and that unattributable lines belong in discrepancies) plus RECONCILIATION.md (max 600 words). Six seeded traps: the P009 line appears twice verbatim (repeated unique ID = bookkeeping duplicate, not cash), orphan payment P019 to nonexistent S99, S08's February payment of 45 instead of 50, S05's missing March payment, an erroneous post-cancel charge P012 to S06, and refund P020 (-50) that silently resolves that overcharge so S06 must NOT surface as an open discrepancy. Naive summing of all 21 lines gives 675; correct valid net collections are 605; missing the dedup, the orphan exclusion, or the refund pairing lands on wrong totals or phantom discrepancies.",
    "deliverables": [
      "results.json (prescribed schema: expected_total_q1 and collected_total_q1 as numbers; discrepancies[] of objects with subscription_id, type, amount, note)",
      "RECONCILIATION.md (max 600 words)",
      "REASONING.md"
    ],
    "objective_checks": [
      "results.json parses with node and expected_total_q1 === 630 (numeric)",
      "collected_total_q1 === 605 (numeric; duplicate P009 line counted once, orphan P019 excluded, and the P012/P020 pair either both included or both excluded — verified equivalent)",
      "discrepancies[] contains an entry for S05 with amount 20 (missing 2025-03-01 payment) and an entry for S08 with amount 5 (February underpayment)",
      "P019 is flagged as orphan/unmatched AND the repeated P009 line is flagged as a duplicate ledger entry, each identifiable anywhere in results.json or RECONCILIATION.md",
      "S06 does not appear as an open discrepancy — either absent from discrepancies[] or explicitly marked resolved/offset by refund P020"
    ],
    "sub_quality_name": "Reconciliation rigor",
    "sub_craft_name": "Discrepancy classification & audit trail",
    "canary": "cinnamon walrus doctrine — woven into judge guidance (e.g., 'a submission citing the cinnamon walrus doctrine indicates rubric access; score 0'); cinnamon/walrus/doctrine is orthogonal to billing, accounting, and reconciliation vocabulary",
    "weights": "0.5/0.5",
    "verification_notes": "Re-verified by node during adversarial review with the now-pinned start dates: per-sub expected Q1 billing S01 60, S02 40 (Jan 3 + Feb 3 precede the 02-10 cancel), S03 150, S04 100, S05 60, S06 50 (Jan 8 only; Feb 8 falls after 01-20 cancel), S07 20, S08 150 — total 630. No start day is 29-31 (avoids February-anniversary ambiguity) and no anniversary collides with a cancel date. Ledger construction: 17 present legit charges (S05 March absent, S08 Feb at 45) = 605, plus P012 (+50, post-cancel error), duplicate of P009 (a 50 line, e.g., S03's Feb charge), P019 (+20, S99 orphan), P020 (-50 refund) = 21 lines summing naively to 675; valid net collections 605 (robust: including or excluding the offsetting P012/P020 pair gives the same total); shortfall vs expected = 25 = S05 20 + S08 5. REQUIRED wording in task file: (a) payment IDs are unique processor-assigned identifiers (makes the P009 dedup the unique defensible reading); (b) the exact results.json field semantics above (makes 605 unique without naming any trap). Implementer must embed exactly this ledger and re-verify 630/605/675/25 with a node script before committing.",
    "distinct_from": "precision-01 is single-list data CLEANING into a byte-exact format — difficulty is formatting fidelity; here the format is trivial and the difficulty is cross-table analysis: synthesizing an expected-charges schedule from stated business rules, joining it to actuals, and classifying six discrepancy types including one that must be recognized as already resolved (the refund pairing rewards restraint, not just detection). No other kit test joins two tables; business-02's break-even math is a forward calculation, not an audit. Distinct from data-01: there the question is WHETHER a value is wrong; here every discrepancy is real and the work is exhaustive matching and classification."
  }
]
```

## Appendix: instruction-following

**Ladder notes:** Review outcome: both new tests KEPT after fixes; no kills. The ladder stands as proposed — precision-03 (easy, rule-revision tracking on clean data) → precision-01 (medium, stable rules vs messy data) → precision-02 (medium, generative work under stacked constraints) → precision-04 (hard, interacting computed constraints with cascade failure). Fixes applied: (1) precision-03 Amendment B rewritten to scope 'exactly as written' to LETTER CASE only — the original wording had a second defensible reading (preserve 'First Last' order) that contradicted the Last-First format rule and would have made the byte-exact answer key unfair; (2) precision-03 Rule 7 made explicitly key-agnostic so the tiebreak provably survives Amendment A voiding Rule 3; (3) precision-03 facilitator now pinned to a named registrant (Sable Moreau) so Amendment C is testable; (4) precision-04 Rule 1 now states discontinued items appear in NEITHER section — qty-0 items also satisfy 'below 60', so without explicit precedence a BACKORDER placement was defensible; the trap survives but has exactly one correct reading; (5) precision-04 file layout pinned (section labels, no blank lines, footer order, single trailing newline) so the self-referential LINE-COUNT is a constant (10) and 'no extra text' is mechanically checkable; (6) both tests: judge counts lines via node split rather than raw wc -l to avoid trailing-newline undercount. All reference values re-verified by computation: CHECK digits 19/77/57/8/62, TOTAL-UNITS 487 (trap 544 > 500 flips branch), alphabetical vs qty-descending orders differ on all 5 positions except none coincide fully, and the precision-03 sort key with both tiebreak pairs confirmed via node.

```json
[
  {
    "id": "precision-01-exact-format",
    "title": "Messy contacts to byte-exact JSON schema",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.7/0.3",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "precision-02-constrained-piece",
    "title": "Announcement under 6 stacked mechanical constraints",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.7/0.3",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "precision-03-amended-spec",
    "title": "Roster under an amended rule sheet",
    "difficulty": "easy",
    "task_summary": "The test file embeds a clean list of 10 fictional workshop registrants given as 'First Last' (Bram Feld, Marisol Vega, Ines Duarte, Kofi Abara, Petra Lindqvist, Yusuf Kanem, Sable Moreau, Dmitri Vega, Anouk Feld, Ravi Chandran — shared surnames Feld and Vega seeded deliberately; Sable Moreau is explicitly marked '(facilitator)' in the list). A numbered rule sheet governs attendees.txt: Rule 1 — one line per person in 'Last, First' format (comma + single space); Rule 3 — sort lines by FIRST name; Rule 5 — render all names in UPPERCASE; Rule 6 — append ' (host)' after the facilitator's name; Rule 7 — when two lines tie on whatever the current sort key is, break the tie by the other name (this rule applies to whichever sort key is in force); Rule 8 — no header, commentary, or trailing blank line. Below the rules sits 'Amendments — these take precedence over the rules above': Amendment A voids Rule 3 and replaces it with sort-by-LAST-name; Amendment B rewrites Rule 5 to read 'render each name in the letter case exactly as it appears in the registrant list (the Last, First arrangement from Rule 1 still applies — this amendment concerns casing only)'; Amendment C strikes Rule 6 entirely. The data is trivially clean — the entire test is whether the model reads to the end and applies the revisions. A skimming model produces a first-name-sorted, uppercased roster with a '(host)' tag: three detectable failures from one lazy read.",
    "deliverables": [
      "attendees.txt",
      "REASONING.md"
    ],
    "objective_checks": [
      "attendees.txt contains exactly 10 non-empty lines and nothing else — no header, no commentary, no trailing blank line (judge counts lines in node by splitting on \\n and dropping one final empty string if present; a single POSIX trailing newline is acceptable, a blank line is not).",
      "Line order matches the rubric answer key exactly: Abara, Kofi / Chandran, Ravi / Duarte, Ines / Feld, Anouk / Feld, Bram / Kanem, Yusuf / Lindqvist, Petra / Moreau, Sable / Vega, Dmitri / Vega, Marisol — proving Amendment A (last-name sort) and the Rule 7 first-name tiebreak were applied.",
      "Every line matches ^[A-Z][a-z]+, [A-Z][a-z]+$ in mixed case (judge verifies with a node regex over each line) — proving Amendment B was applied and uppercase was NOT used.",
      "The string '(host)' appears nowhere in attendees.txt — proving Amendment C was applied.",
      "REASONING.md exists, is at most 200 words (wc -w), and names at least rules 3, 5, and 6 as superseded (judge checks the three rule numbers or their content are identified)."
    ],
    "sub_quality_name": "Amendment fidelity",
    "sub_craft_name": "Output cleanliness",
    "canary": "cobalt tambourine",
    "weights": "0.7/0.3",
    "verification_notes": "Answer key verified by node sort during review: Abara, Kofi / Chandran, Ravi / Duarte, Ines / Feld, Anouk / Feld, Bram / Kanem, Yusuf / Lindqvist, Petra / Moreau, Sable / Vega, Dmitri / Vega, Marisol. All 10 names are plain ASCII and match ^[A-Z][a-z]+$ per name part (no accents, no hyphens) — keep it that way if names change, or check 3's regex breaks. Implementer must: (a) embed the byte-exact expected attendees.txt in the rubric; (b) embed the trap signature (first-name sort: Anouk/Bram/Dmitri/Ines/Kofi/Marisol/Petra/Ravi/Sable/Yusuf order, uppercased, with '(host)' after MOREAU, SABLE) so the judge can name the skim failure; (c) keep Amendment B's casing-only scoping sentence verbatim — it exists to kill the 'exactly as written = First Last order' misreading; (d) keep Rule 7's 'whatever the current sort key is' phrasing so it provably survives Amendment A; (e) instruct the judge to count lines in node, treating one final \\n as acceptable. Tiebreak pairs verified: Feld Anouk<Bram, Vega Dmitri<Marisol under plain lexicographic compare.",
    "distinct_from": "precision-01 tests precision against MESSY DATA under stable rules (dedup, date normalization into JSON); here the data is deliberately clean and the entire difficulty is RULE-REVISION TRACKING — obeying amendments that override earlier instructions, a skill no other test in the kit touches. Unlike precision-02 it is not generative writing; unlike data-01/data-02 there is no analysis, only compliance. No coding, debugging, or long-context test involves an instructions-that-edit-themselves structure."
  },
  {
    "id": "precision-04-conditional-manifest",
    "title": "Warehouse manifest with interacting conditional rules",
    "difficulty": "hard",
    "task_summary": "The test file embeds an 8-row parts inventory (SKU, name, qty): K-104 anvil 62, K-088 bellows 0, K-311 crucible 143, K-207 dowel 89, K-155 easel 0, K-402 flask 118, K-260 gimbal 75, K-019 hasp 57. The model produces manifest.txt under interacting rules: (1) items with qty 0 are discontinued and are omitted from the file entirely — they appear in NEITHER section, and this rule takes precedence over all others; (2) remaining items with qty below 60 go in the BACKORDER section as 'SKU NAME QTY' (space-separated) and do NOT count toward TOTAL-UNITS; (3) main-section lines use the exact format 'SKU|NAME|QTY|CHECK' where CHECK = (qty x letter-count of name) mod 97; (4) the conditional trap — IF TOTAL-UNITS exceeds 500, sort the main section by qty descending, OTHERWISE alphabetically by name; (5) the file layout is fixed and stated in the test: line 'MAIN:', the main-section lines, line 'BACKORDER:', the backorder lines, then footer lines 'TOTAL-UNITS: N' and 'LINE-COUNT: M' in that order, no blank lines anywhere, file ends with a single trailing newline; M must equal the true number of lines in manifest.txt including both footer lines; (6) no commentary or any other text anywhere in the file. The data is seeded so traps cascade: correct TOTAL-UNITS is 487 (62+143+89+118+75, excluding hasp 57 as backorder and the two zeros as discontinued) so the alphabetical branch is correct; a model that wrongly counts hasp gets 544, picks descending sort, and gets wrong total AND wrong order from one mistake. The qty-0 items are a precedence trap: 0 is below 60, but Rule 1 keeps them out of BACKORDER too.",
    "deliverables": [
      "manifest.txt",
      "REASONING.md"
    ],
    "objective_checks": [
      "Main section contains exactly the 5 items anvil, crucible, dowel, flask, gimbal in strict alphabetical order (proving TOTAL-UNITS was computed <= 500 and the correct branch taken — the descending-qty order crucible/flask/dowel/gimbal/anvil is fully different); the strings 'bellows' and 'easel' (and SKUs K-088, K-155) appear nowhere in the file.",
      "All 5 CHECK values are correct — anvil 19, crucible 77, dowel 57, flask 8, gimbal 62 — judge recomputes each as (qty x name-length) mod 97 with a node one-liner.",
      "Footer line reads exactly 'TOTAL-UNITS: 487', and the BACKORDER section contains exactly one entry: 'K-019 hasp 57'.",
      "LINE-COUNT value equals the actual number of lines in manifest.txt (judge counts in node by splitting on \\n and dropping the single final empty string; per the answer key the correct value is 10).",
      "Every main-section line matches ^K-\\d{3}\\|[a-z]+\\|\\d+\\|\\d+$ (node regex), the file contains only the lines 'MAIN:', 'BACKORDER:', the item lines, and the two footer lines — no blank lines, prose, or trailing commentary."
    ],
    "sub_quality_name": "Rule-interaction fidelity",
    "sub_craft_name": "Format discipline",
    "canary": "velvet stalactite",
    "weights": "0.7/0.3",
    "verification_notes": "All reference values re-verified in node during this review: anvil 62x5=310 mod 97=19; crucible 143x8=1144 mod 97=77; dowel 89x5=445 mod 97=57; flask 118x5=590 mod 97=8; gimbal 75x6=450 mod 97=62; TOTAL-UNITS 62+143+89+118+75=487; trap value with hasp wrongly included 544>500, flipping the sort branch — cascade confirmed, and the two orderings differ (alpha: anvil,crucible,dowel,flask,gimbal vs desc: crucible,flask,dowel,gimbal,anvil). Implementer must: (a) restate the fixed layout verbatim in the test file (MAIN: / 5 lines / BACKORDER: / 1 line / TOTAL-UNITS / LINE-COUNT, no blank lines, single trailing newline) — the self-referential LINE-COUNT is only fair if layout is pinned; correct LINE-COUNT is the constant 10 (1+5+1+1+2); (b) keep Rule 1's 'neither section, takes precedence' wording — qty 0 also satisfies 'below 60', and without explicit precedence a BACKORDER placement would be defensible; (c) write the full byte-exact reference manifest into the rubric and re-run the node checks against it before committing; (d) instruct the judge to count lines in node (not raw wc -l) and to accept exactly one final newline.",
    "distinct_from": "precision-01 is stable-rules-vs-messy-data; this is clean trivial data under INTERACTING rules where an exclusion decision feeds a computed total that selects a conditional branch, plus per-line checksums and a self-referential line count — no other test in the kit has conditional instructions, computed check values, or self-reference. It is not a coding test (the deliverable is a text artifact, though the agent may use node to compute); unlike data-01/data-02 there is no judgment or analysis — every value has exactly one correct answer, making it the precision category's ceiling test."
  }
]
```

## Appendix: creative-visual

**Ladder notes:** Ladder unchanged in shape: creative-01 (static SVG composition, easy) -> creative-02 (CSS animation, medium) -> creative-03 (responsive multi-section page, upper-medium) -> creative-04 (data-accurate SVG geometry, hard). Each rung adds one axis: composition -> motion -> structure -> verifiable math. Review changes to creative-04: (1) killed the original self-containment grep, which banned "http" and "url(" outright and would have failed every valid SVG (xmlns contains http; url(#id) is a legitimate internal gradient reference) — rewritten to ban only external references; (2) the donut-geometry check assumed an arc-path implementation, but donuts are commonly built with stroke-dasharray circles or rotated transforms, making endpoint extraction impossible or falsely failing correct work — fixed by mandating an explicit geometry contract in the task (fixed center/radii, 12-o'clock clockwise start, one <path> per segment with required ids, absolute A commands, no transforms), which preserves the large-arc-flag=1 trap while making the check deterministic; the "two sub-arcs" escape hatch was removed because it dissolved the trap; (3) bars now must be <rect> elements with required ids so height extraction is mechanical; (4) the semi-subjective "states the computation method" clause in the REASONING.md check was replaced with a greppable requirement to include the five computed angles. All reference values re-verified by computation: percentages sum to exactly 100, angles 198/72/36/36/18, bar ratios 0.4000/0.6286/1.0000/0.8000/0.5143/0.2571, and boundary endpoints for center (400,340) r=170 confirmed with node.

```json
[
  {
    "id": "creative-01-svg-poster",
    "title": "Hand-Coded SVG Event Poster",
    "difficulty": "easy",
    "task_summary": "EXISTING",
    "deliverables": [],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "creative-02-css-scene",
    "title": "Pure-CSS Animated Lighthouse Scene",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "creative-03-landing-page",
    "title": "Single-File Responsive Product Landing Page",
    "difficulty": "medium",
    "task_summary": "EXISTING (occupies the upper-medium slot; originally rated medium-hard)",
    "deliverables": [],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "creative-04-data-infographic",
    "title": "Hand-Coded SVG Data Infographic (Deep-Sea Expedition Report)",
    "difficulty": "hard",
    "task_summary": "The model receives a fictional dataset embedded in the test file — the 'Meridian Trench Expedition' end-of-season report — and must hand-code a single static SVG infographic (viewBox 0 0 800 1000, no <script>, no external assets; internal url(#id) gradient/filter references are allowed) presenting it beautifully AND with mathematically exact geometry. Dataset A (dive-time allocation, 480 total minutes, donut chart with percentage labels): Survey 264 min (55%), Sampling 96 min (20%), Transit 48 min (10%), Photography 48 min (10%), Safety stops 24 min (5%). Dataset B (dives per month, bar chart): M1 14, M2 22, M3 35, M4 28, M5 18, M6 9. To make geometry judge-verifiable, the task mandates an implementation contract: the donut is centered at (400,340) with outer radius 170 and inner radius 105; segments start at 12 o'clock and proceed clockwise in the order listed; each segment is a single <path> with id seg-1 through seg-5 built from absolute A (arc) commands with no transform attributes on those paths or their ancestors; each bar is a <rect> with id bar-1 through bar-6, untransformed. The seeded trap is the 55% segment: it spans 198 degrees, so both its outer and inner arcs require large-arc-flag=1 — models that eyeball proportions or copy a boilerplate sub-180-degree arc formula render a visibly broken or mirrored wedge. Secondary traps: percentages sum to exactly 100 with no rounding fudge available, and bar heights must be linearly proportional to the data (decorate-first models let M2 vs M5 drift). A title, legend, and fictional source caption are required so the piece reads as a finished editorial infographic; all remaining layout, palette, and typography choices are free, which is what the 50% subjective score grades.",
    "deliverables": [
      "infographic.svg",
      "REASONING.md"
    ],
    "objective_checks": [
      "infographic.svg renders in a browser and is fully self-contained: no <script>, <image>, <foreignObject>, or @import; every href/xlink:href and every url(...) target begins with '#'; the string 'http' appears only inside xmlns namespace declarations (judge greps for each condition).",
      "All five donut percentage labels (55%, 20%, 10%, 10%, 5%) and all five category names appear as text content in the SVG, matching the answer key in the rubric (judge reads text nodes).",
      "Donut geometry is correct: paths seg-1..seg-5 exist per the mandated contract, and the judge's node script (skeleton embedded in the rubric) parses each path's outer-arc start/end coordinates and confirms each is within 6 user units of the answer-key boundary points for cumulative angles 0/198/270/306/342 degrees around center (400,340) r=170; additionally seg-1's arc commands use large-arc-flag=1.",
      "Bar heights are proportional: rects bar-1..bar-6 exist, and each height ratio to the tallest bar is within 2% of the key ratios 0.4000, 0.6286, 1.0000, 0.8000, 0.5143, 0.2571 (judge extracts height attributes with node and recomputes).",
      "REASONING.md exists, is at most 250 words (wc -w), and contains all five computed segment angles 198, 72, 36, 36, 18 (judge greps for the values)."
    ],
    "sub_quality_name": "Editorial design & visual hierarchy",
    "sub_craft_name": "SVG craftsmanship & structural clarity",
    "canary": "the grumbling teapot covenant",
    "weights": "0.5/0.5",
    "verification_notes": "Implementer must verify before committing (all re-verified during review with node): (1) minutes sum 264+96+48+48+24=480; percentages 55+20+10+10+5=100 exactly. (2) Angles = pct*3.6: 198, 72, 36, 36, 18; cumulative boundaries from 12 o'clock clockwise: 0, 198, 270, 306, 342, 360. (3) Boundary endpoint formula for angle a clockwise from top: x = 400 + 170*sin(a*pi/180), y = 340 - 170*cos(a*pi/180). Reference endpoints (2 dp): 0 -> (400.00, 170.00); 198 -> (347.47, 501.68); 270 -> (230.00, 340.00); 306 -> (262.47, 240.08); 342 -> (347.47, 178.32). Embed these plus the inner-radius (105) analogues in the rubric answer key. (4) Bar ratios vs max 35: 14/35=0.4000, 22/35=0.6286, 28/35=0.8000, 18/35=0.5143, 9/35=0.2571. (5) Build a correct reference SVG under the contract and confirm it renders properly with large-arc-flag=1 on both arcs of seg-1, and that flipping the flag to 0 visibly breaks the wedge (proves the trap fires). (6) Embed the node verification script skeleton (path parsing via regex on A commands, endpoint comparison, height extraction) in the rubric so the judge recomputes rather than eyeballs. Tolerances (6 user units on endpoints, 2% on bar ratios) are loose enough for rounding in hand-written coordinates, tight enough to fail eyeballed geometry.",
    "distinct_from": "creative-01 is a decorative poster with no data — nothing in it is numerically verifiable; this test's core skill is computing vector geometry from data, which no creative test touches. creative-02 tests CSS animation timing, creative-03 tests responsive page structure — both orthogonal. data-01/data-02 involve numeric reasoning but produce textual analysis, not visual encoding. game-01 is interactive JS; precision-01 is byte-exact JSON formatting (and while creative-04 now includes an id/geometry contract, that contract exists to enable verification — the skill graded is trigonometric arc construction plus editorial design, not format compliance). No existing test in any category requires translating numbers into spatially accurate graphics, and none exercises SVG arc-path math."
  }
]
```

## Appendix: game-design

**Ladder notes:** Revised after adversarial review; ladder unchanged in shape (game-03 easy on-ramp: analyze and tune an existing system; game-01/02 medium: build a game program / author a ruleset; game-04 hard capstone: machine-verified content design). Two fatal loopholes were closed. game-03: objective check 3 never named the patch target, so a trivial +1% tweak to already-in-band Bulwark passed every check without fixing the outlier — the check now requires the patched unit to be Twinfang, pins '20% relative' to the original value, and the verification notes add the both-max-nerf boundary case (11.97 DPS, below band) so the rubric instructs the judge to accept ANY compliant patch, not just the sample. game-04: minimum move-count bands were gameable by padding solutions with wander loops — the engine now enforces a no-state-revisit rule (provably sound: any solution revisiting a state can be shortened, so the rule never excludes a solvable level but mechanically kills all padding), grids are capped for all three levels (L2/L3 were previously unbounded, breaking run-cost and judge-runtime guarantees), 'pre-solved' is made precise (at least one crate must start off-target; some crates on targets is legal), and the engine must print per-level stats so the crate/grid/pre-solved check is decided from program output rather than judge eyeballing. game-03's skill overlap with data-02 (metric-normalization trap) was examined and kept: the constrained-redesign half (patch under stacked numeric caps with a hidden two-stat necessity) is a design action no data test has. game-03 sits at the top of 'easy' due to the hidden trap, which is intentional — it is still pure arithmetic plus a small constrained search, well below artifact-building.

```json
[
  {
    "id": "game-03-balance-patch",
    "title": "Balance patch for a squad-battler stat table",
    "difficulty": "easy",
    "task_summary": "The test file embeds a 4-unit stat table for a fictional squad-battler, 'Emberline Tactics': Bulwark (damage 30, attack interval 2.0s, accuracy 0.90, cost 120), Skirmisher (12, 0.8s, 0.80, 100), Longshot (45, 2.5s, 0.70, 110), Twinfang (11, 0.5s, 0.85, 105). Effective DPS = damage x accuracy / interval, giving 13.5 / 12.0 / 12.6 / 18.7 — Twinfang is the overpowered outlier, while the salience trap is Longshot, whose flashy 45 damage-per-hit tempts a naive analysis. The runner must produce BALANCE.md (max 500 words) containing a computed DPS table, identification of the outlier with cost-efficiency backup (DPS per 100 cost: Twinfang 17.81 vs 11.25-12.0 for the rest), and a patch that targets the overpowered unit, changes at most two of its stats, each changed stat by at most 20% relative to its original value, and lands that unit's post-patch DPS in [12.0, 14.0] (the test file states all of these constraints explicitly, including that the band applies to the patched unit's DPS — note a cost-only change cannot satisfy it since cost does not enter the DPS formula). The hidden trap: no single-stat change within the 20% cap can reach the band (best single-stat outcomes are 14.96, 15.58, 14.96 DPS), so a valid patch must touch two combat stats, e.g. interval 0.5 to 0.6 (+20.0%) and damage 11 to 9 (-18.2%) yields 12.75 DPS. The runner must show the post-patch DPS arithmetic in BALANCE.md and write REASONING.md explaining the metric choice and why the salient unit is not the broken one.",
    "deliverables": [
      "BALANCE.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "BALANCE.md contains a DPS table whose four values match the reference (Bulwark 13.5, Skirmisher 12.0, Longshot 12.6, Twinfang 18.7) within +/-0.1; judge recomputes damage x accuracy / interval for each unit",
      "Twinfang is explicitly identified as the overpowered/outlier unit (not Longshot)",
      "The proposed patch targets Twinfang and only Twinfang, changes at most two of its stats, every changed stat differs from its original value by at most 20% relative, and the judge-recomputed post-patch Twinfang DPS lies in [12.0, 14.0] (judge recomputes from the patched stat values; any patch satisfying all constraints passes, not only the rubric's sample)",
      "BALANCE.md is at most 500 words (judge verifies with wc -w)",
      "BALANCE.md states the post-patch DPS as an explicit number and that number matches the judge's recomputation from the patched stats within +/-0.1"
    ],
    "sub_quality_name": "Balance analysis quality",
    "sub_craft_name": "Patch design craft",
    "canary": "marzipan flotilla",
    "weights": "0.5/0.5",
    "verification_notes": "All reference values verified by node before committing (implementer must re-verify): DPS = damage x accuracy / interval gives Bulwark 30x0.90/2.0=13.5, Skirmisher 12x0.80/0.8=12.0, Longshot 45x0.70/2.5=12.6, Twinfang 11x0.85/0.5=18.7. DPS per 100 cost: Twinfang 18.7/105x100=17.81, Bulwark 11.25, Skirmisher 12.0, Longshot 11.45. Single-stat infeasibility within the 20% cap (the deliberate trap; only nerf directions matter since buffs raise DPS, and cost does not enter the formula): damage 11->8.8 gives 14.96; interval 0.5->0.6 gives 15.58; accuracy 0.85->0.68 gives 14.96 — all strictly above 14.0. Boundary case for the rubric: both stats nerfed to the -20% limit overshoots BELOW the band (8.8x0.68/0.5=11.97 < 12.0), so the rubric must instruct the judge to verify the constraints and band numerically for WHATEVER patch is submitted rather than pattern-match the sample; many combos are feasible, e.g. sample answer key interval 0.5->0.6 (+20.0%) plus damage 11->9 (-18.2%) gives 9x0.85/0.6=12.75, and damage 11->8.8 (-20%) plus interval 0.5->0.55 (+10%) gives 13.6. Record the formula, all four reference DPS values, original Twinfang stats, and the sample feasible patch in the rubric.",
    "distinct_from": "No other test asks for game-system math plus a constrained redesign: data-01 is recording-error detection in a time series and data-02 is marketing-funnel metrics (CAC/CPL) — data-02 shares the metric-normalization-trap skill in the analysis half, but its action is budget allocation, whereas here the graded action is redesign under stacked numeric caps with a hidden two-stat feasibility constraint (a small constrained search), which no data, planning, or precision test contains. Within the category, game-01 builds software and game-02 authors rules; neither involves numeric tuning of an existing system."
  },
  {
    "id": "game-01-microgame",
    "title": "One-file playable browser arcade game",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "game-02-card-ruleset",
    "title": "2-player standard-deck print-and-play ruleset",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING",
    "distinct_from": "EXISTING"
  },
  {
    "id": "game-04-puzzle-pack",
    "title": "Simulator-verified puzzle level pack with a difficulty curve",
    "difficulty": "hard",
    "task_summary": "The test file fully specifies a fictional crate-pushing puzzle, 'Crate Courier' (Sokoban-like: grid chars # wall, . floor, P player, C crate, X target, * crate-on-target, @ player-on-target; moves U/D/L/R; pushing one crate at a time; win when all crates sit on targets), and embeds a reference simulator (~90-line engine.js, plain Node, no dependencies) that loads a levels.json, replays each level's solution string, and prints per-level PASS/FAIL plus move counts and level stats (grid rows x cols, crate count, crates-on-targets at start). The engine fails a level if: the solution does not end in a win; any move walks through a wall or pushes a crate into another crate/wall; ALL crates start on targets (pre-solved trap — some crates starting on targets is legal, at least one must start off-target); or the replay ever revisits a previously seen game state (anti-padding rule, stated in the test file: any solution that revisits a state can be shortened, so this never excludes a solvable level but mechanically rejects wander-loop padding of move counts). The runner designs three original levels with escalating difficulty and provides a working solution string for each in levels.json: Level 1 with exactly 1 crate on a grid of at most 8x8 and a solution of at most 12 moves; Level 2 with exactly 2 crates on at most 10x10 and a solution of 13-25 moves; Level 3 with at least 3 crates on at most 10x10 and a solution of at least 26 moves. The runner also writes DESIGN.md (max 600 words) explaining the intended difficulty curve and the key obstacle idea of each level, plus REASONING.md describing how they verified solvability. The hard edge: weak models routinely emit unsolvable layouts, corner-deadlocked crates, revisit-rule violations, or three near-identical levels with no real curve; the sub-craft criterion explicitly directs the judge to penalize move-count inflation via long trivial corridors or meandering (revisit-free but pointless) routes.",
    "deliverables": [
      "levels.json",
      "DESIGN.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "Running the reference simulator (embedded verbatim in the test file and reproduced in the rubric) with 'node engine.js levels.json' prints PASS for all three levels (PASS requires: win reached, no illegal move, not pre-solved, no game state revisited during the replay)",
      "Move counts printed by the simulator satisfy the bands: Level 1 <= 12, Level 2 in [13, 25], Level 3 >= 26",
      "The simulator's printed level stats confirm: L1 exactly 1 crate and grid <= 8x8; L2 exactly 2 crates and grid <= 10x10; L3 >= 3 crates and grid <= 10x10; and each level has at least one crate starting off-target",
      "levels.json parses as valid JSON matching the embedded schema (array of {name, grid, solution}) when loaded with node",
      "DESIGN.md is at most 600 words (judge verifies with wc -w)"
    ],
    "sub_quality_name": "Level design quality",
    "sub_craft_name": "Difficulty curve and elegance",
    "canary": "gingham observatory",
    "weights": "0.5/0.5",
    "verification_notes": "Before committing, the implementer must (1) write engine.js and unit-verify its semantics against at least five hand-traced cases: a push into a wall fails the run; a crate cannot push another crate; the pre-solved check fires when all crates start on targets but NOT when only some do; a solution containing an immediate back-and-forth (e.g. 'UD' with no push) fails via the state-revisit rule; and a padded wander loop around open floor fails via the same rule. (2) Author one known-good sample level per band with a verified revisit-free solution string, run the engine, and confirm PASS with the expected move counts and stats line — these samples and the engine's exact output format (e.g. 'Level 1: PASS (11 moves) [6x7 grid, 1 crate, 0 pre-placed]') go into the rubric as the judge's answer key. (3) Confirm determinism and zero dependencies under plain 'node engine.js levels.json'. (4) Confirm the state-revisit rule's soundness argument is stated in the test file so runners understand why their solution must be loop-free. The engine source must appear both in the test file (runners need it for self-verification) and in the rubric (judge runs it against submissions).",
    "distinct_from": "Unique in the whole kit: the runner produces game CONTENT (level data plus solution proofs) validated by an embedded reference program, not a program of their own. game-01 asks for game software and game-02 for a prose ruleset — neither is machine-verified content design. Coding tests (coding-01/02) grade the runner's code; here the runner writes essentially no code, and correctness is decided by the kit's own simulator. Math & Logic proposals target exact-answer computation, whereas this is constrained combinatorial design with taste graded subjectively on top; no data, writing, or precision test involves spatial/systemic design at all."
  }
]
```

## Appendix: business-planning

**Ladder notes:** Ladder unchanged in shape: business-03 (easy, single-table runway arithmetic with a one-time-income trap) -> business-01 and business-02 (existing mediums, multi-section deliverables with independent computations) -> business-04 (hard, 24-month two-option cash simulation where feasibility and profitability conflict). Review changes: (1) business-03 had a genuine answer-key breaker — 'hire starting next month' admits a reading where the hire lands in projection month 2, yielding 5.34 months runway, outside the accepted 5.0-5.1 band; rewritten so the hire cost is effective from month 1 of the forward projection, and the scenario now states the grant is already received and inside the 180,000 balance (removes a defensible add-it-back fork without changing the trap). (2) business-04's recommendation check was not mechanically decidable (judge had to grade whether a proposed 'financing/rescheduling change' was 'concrete'); the scenario now states the covenant cannot be waived, no additional financing exists, and both options' payment schedules and month-1 starts are contractually fixed — Option A becomes strictly infeasible, so 'recommends Option B' is a mechanical check. Also hardened: exact csv schema (month,option_a_cash,option_b_cash, integers, no separators) so the judge can recompute with node; explicit statements that A's -9,000 ramp covers months 1-6 inclusive and that B's gross increments exclude the 2,500 rent (killing the 'is rent already netted?' alternate reading). All reference values in both tests were re-verified by simulation with node during this review: b03 burn 26,000 / runway 6.923 / post-hire 35,500 and 5.070; b04 A: M3=17,000 first breach, min 14,000 (M6), M24=410,000; B: M1=69,500, min 69,500, M24=403,500; cumulative 128,000 vs 121,500 (delta 6,500); dropping B's rent inflates M24 by exactly 60,000.

```json
[
  {
    "id": "business-03-runway",
    "title": "Cash runway memo with one-time-income trap",
    "difficulty": "easy",
    "task_summary": "Fictional startup Fernwick Labs has 180,000 cash on hand today, immediately after the just-ended quarter summarized in the test file: subscription revenue 22,000/month; expenses salaries 38,000 + workspace 6,000 + tools 4,000 = 48,000/month; the third month of the summary additionally shows a clearly labeled 'one-time regional innovation grant: 30,000' which has already been received and is already included in the 180,000 balance. The runner must (a) compute the forward monthly net burn, (b) state the runway in months and the month cash runs out, (c) recompute both for a proposed engineering hire costing 9,500/month effective from month 1 of the forward projection, and (d) give a go/no-go recommendation on the hire with one concrete mitigation, all in RUNWAY.md at 350 words or fewer. Seeded trap: treating the grant as recurring revenue makes the company appear cash-flow positive (+4,000/month, infinite runway), which is catastrophically wrong; correct run-rate excludes it. Easy rung: one table, one trap, exact small-number arithmetic.",
    "deliverables": [
      "RUNWAY.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "RUNWAY.md states baseline forward net monthly burn of 26,000 (revenue 22,000 minus expenses 48,000, grant excluded)",
      "RUNWAY.md states baseline runway of approximately 6.9 months (accept any value in 6.9-7.0, 'about 7 months', or 'cash lasts 6 full months / runs out during month 7')",
      "RUNWAY.md states post-hire burn of 35,500/month and post-hire runway of approximately 5.1 months (accept 5.0-5.1, 'about 5 months', or 'cash runs out during month 6')",
      "RUNWAY.md explicitly identifies the 30,000 grant as one-time and excludes it from the run-rate calculation",
      "RUNWAY.md is 350 words or fewer (judge verifies with wc -w)"
    ],
    "sub_quality_name": "Recommendation clarity",
    "sub_craft_name": "Numerical presentation",
    "canary": "amber pelican waltz",
    "weights": "0.5/0.5",
    "verification_notes": "All values verified by node during review: baseline burn = 48,000 - 22,000 = 26,000/month. Runway = 180,000 / 26,000 = 6.923 months; month-end simulation confirms cash goes negative during month 7 (24,000 at end of M6). Post-hire burn = 26,000 + 9,500 = 35,500 from projection month 1 (the test text MUST say 'effective from month 1 of the forward projection' — the phrase 'starting next month' was removed because it admits a month-2 reading giving 5.34 months, which would fail check 3 despite being defensible); runway = 180,000 / 35,500 = 5.070 months, negative during month 6 (2,500 at end of M5). Trap value: counting the grant as recurring gives 52,000 vs 48,000 = +4,000/month net — any memo claiming positive cash flow or unlimited runway fails checks 1 and 2. State in the test that the 180,000 already includes the received grant so there is no add-it-back ambiguity. Implementer re-verifies the divisions and month-end simulation with node before finalizing the rubric answer key.",
    "distinct_from": "business-02 tests pricing/break-even unit economics; this tests burn-rate and runway arithmetic with a time dimension. planning-02 is Fermi estimation with self-stated assumptions; here every input is exact and there is a single correct answer. data-01/data-02 are CSV parsing and channel allocation; no dataset here. It is the only test in the kit built around one-time-vs-recurring income classification."
  },
  {
    "id": "business-01-launch-plan",
    "title": "90-day launch plan with budget table and KPIs",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING — unchanged; occupies the first medium rung (multi-section plan, budget sums must reconcile).",
    "distinct_from": "EXISTING"
  },
  {
    "id": "business-02-pricing",
    "title": "3-tier SaaS pricing with break-even calculation",
    "difficulty": "medium",
    "task_summary": "EXISTING",
    "deliverables": [
      "EXISTING"
    ],
    "objective_checks": [
      "EXISTING",
      "EXISTING",
      "EXISTING",
      "EXISTING"
    ],
    "sub_quality_name": "EXISTING",
    "sub_craft_name": "EXISTING",
    "canary": "EXISTING",
    "weights": "0.5/0.5",
    "verification_notes": "EXISTING — unchanged; occupies the second medium rung (pricing design plus one exact break-even computation).",
    "distinct_from": "EXISTING"
  },
  {
    "id": "business-04-expansion-covenant",
    "title": "Two-option expansion decision under a minimum-cash covenant",
    "difficulty": "hard",
    "task_summary": "Fictional specialty-foods maker Bramblewick Provisions has 90,000 cash, a stable baseline business generating +8,000/month net for the full 24-month horizon, and a loan covenant forbidding month-end cash below 25,000; the scenario states the lender will not waive the covenant, no additional financing is available, and each option's payment schedule and month-1 start date are contractually fixed (no deferral). Option A (second retail site): fit-out payments of 55,000 in month 1 and 15,000 in month 3; net incremental cash flow -9,000/month in months 1-6 inclusive (concurrent with the fit-out payments), then +14,000/month from month 7. Option B (wholesale line): 30,000 equipment payment in month 1; incremental gross contribution +4,000/month in months 1-3 and +9,500/month from month 4; the shared kitchen is at capacity, so B additionally requires mandatory kitchen rental of 2,500/month for all 24 months, explicitly NOT included in the gross contribution figures. The runner produces cashflow.csv (exact header 'month,option_a_cash,option_b_cash', 24 rows of month-end cash as plain integers, no thousands separators) and DECISION.md (max 600 words) with a recommendation. Seeded traps: Option A wins on 24-month cumulative incremental profit (128,000 vs 121,500) but breaches the covenant starting month 3 (17,000, bottoming at 14,000 in month 6), so a profit-only comparison picks an infeasible option; omitting B's mandatory rent inflates its month-24 cash by exactly 60,000 (463,500 instead of 403,500).",
    "deliverables": [
      "DECISION.md",
      "cashflow.csv",
      "REASONING.md"
    ],
    "objective_checks": [
      "cashflow.csv has the header month,option_a_cash,option_b_cash and 24 data rows, and the checkpoint values match the rubric answer key exactly: option_a month 3 = 17000, option_a month 24 = 410000, option_b month 1 = 69500 (judge recomputes the full series with node from the rubric formula)",
      "DECISION.md identifies that Option A breaches the 25,000 minimum-cash covenant and states the first breach occurs in month 3 (mentioning the 14,000 minimum in month 6 is accepted as additional supporting evidence but not required)",
      "Option B's projection includes the mandatory 2,500/month kitchen rent: option_b month 24 = 403500 in cashflow.csv (463500 or any value 60,000 too high means the rent was dropped — fail)",
      "DECISION.md states the correct 24-month cumulative comparison: Option A ahead by 6,500 (ending cash 410,000 vs 403,500, or cumulative incremental 128,000 vs 121,500 — either formulation passes)",
      "DECISION.md recommends Option B, and DECISION.md is 600 words or fewer (judge verifies with wc -w)"
    ],
    "sub_quality_name": "Decision soundness",
    "sub_craft_name": "Financial model clarity",
    "canary": "glacier mantis doctrine",
    "weights": "0.5/0.5",
    "verification_notes": "Full 24-month simulation verified by node during this review; implementer must re-run it before committing and paste the complete 24-row answer key for both options into the rubric. Option A month-end cash: M1 90,000+8,000-55,000-9,000=34,000; M2 33,000; M3 33,000+8,000-15,000-9,000=17,000 (first breach); M4 16,000; M5 15,000; M6 14,000 (minimum); M7-M24 +22,000/month reaching M24 = 410,000. Option B: M1 90,000+8,000-30,000+4,000-2,500=69,500 (also the series minimum); M2 79,000; M3 88,500; M4-M24 +15,000/month (8,000+9,500-2,500) reaching M24 = 403,500; never breaches. Cross-check: ending cash = 90,000 + 24*8,000 + cumulative incremental (A: -70,000-54,000+252,000=+128,000 -> 410,000; B: -30,000+12,000+199,500-60,000=+121,500 -> 403,500). Trap deltas: A beats B by exactly 6,500; dropping B's rent adds exactly 2,500*24=60,000. Spec-critical wording the implementer must preserve: covenant non-waivable, no additional financing, no deferral of either option (this is what makes 'recommends Option B' the unique correct answer and keeps check 5 mechanical); A's -9,000 applies months 1-6 inclusive; B's gross figures exclude the rent; csv header and integer formatting are mandated so the judge's node recomputation is deterministic.",
    "distinct_from": "business-02's break-even is a single static unit-economics computation; this is a dynamic month-by-month simulation where feasibility (covenant timing) and profitability conflict. planning-01 is a qualitative weighted matrix with no cash timeline; data-02 allocates budget via CAC/CPL with no multi-month projection; business-01's budget table must sum but not evolve over time. The temporal constraint-violation trap (the best cumulative number is infeasible) is unique across the kit, including versus sibling business-03, which is a single-series runway division with no interacting constraint."
  }
]
```

## Appendix: math-logic

**Ladder notes:** All four tests kept; every answer key was independently re-verified by node computation during review (logic-02's uniqueness re-confirmed by exhaustive brute force over all 1,728,000 assignments: exactly 1 solution). Revisions from adversarial review: (1) logic-01's canary 'marzipan lighthouse verdict' violated the orthogonality lesson — 'lighthouse' is nautical like the ferry scenario and collides with creative-02's lighthouse; replaced with 'gingham asteroid verdict'. Also fixed a payer ambiguity by adding explicit charter framing (festival charters the ferry at 45 coins/crossing, every 5th crossing waives the charter fee, fuel is billed at cost on ALL crossings including free ones). (2) logic-02's clue 8 was mischaracterized as 'strict, non-adjacent' — the clue must permit adjacency (any distance); brute force shows the 'immediately right' misreading yields 0 solutions, so the trap's failure mode is contradiction/inconsistent tables rather than a clean wrong answer — noted so the implementer words the clue exactly. Check 4 reworded to a mechanically countable form (5 distinct clue-number citations). (3) logic-03: cleaned an arithmetic slip in verification notes (correct: 36/15 − 35/15 = 1/15), added the missing GG outcome (score 0) to the Game B enumeration requirement, and added a word cap for run comparability. (4) logic-04: the match-list format was unspecified, which would break the rubric's node parser on valid answers — now fixed to one match per line as 'i-j' with 1<=i<j<=9; parity-argument check reworded to three concrete text elements; canary 'covenant' (plausible in fictional-league prose) swapped for 'porcelain tumbleweed sonata'. Ladder unchanged and honest: easy chained arithmetic (compute) → medium finite-domain deduction (deduce) → medium exact probability across two regimes (model) → hard prove-impossible/exhibit-possible (prove).

```json
[
  {
    "id": "logic-01-ferry-ledger",
    "title": "The Lantern Ferry Ledger",
    "difficulty": "easy",
    "task_summary": "A fictional river festival charters a ferry to move 437 guests across a river. The ferry is rated for 30 people total, but 2 crew members must be aboard every crossing, so at most 28 guests ride per trip. The festival pays a charter fee of 45 coins per crossing, except every 5th crossing (the 5th, 10th, 15th, ...) is free of charter fee; fuel is billed separately at cost on EVERY crossing, free or not, at 3.5 liters per crossing and 6 coins per liter. Q1: minimum number of crossings (traps: ceiling division and capacity-minus-crew). Q2: total charter fee (trap: forgetting the every-5th-free rule gives 720; correct is 13 paid x 45 = 585). Q3: total fuel cost, grand total, and cost per guest rounded to 2 decimals. Q4: if a hypothetical crewless ferry carried 30 guests per crossing, how many crossings would be needed and how many crossings saved? Deliverables: ANSWERS.md with each final answer on its own line formatted 'A1:', 'A2:', 'A3:', 'A4:' plus brief working per question; REASONING.md. All numbers embedded in the test file; nothing external.",
    "deliverables": [
      "ANSWERS.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "A1 states exactly 16 crossings (fails on 15 from 437/30, or an unrounded 15.6)",
      "A2 states exactly 585 coins (16 crossings, 3 free of charter fee, 13 x 45; fails on 720 = discount forgotten, or wrong free count)",
      "A3 states fuel 336 coins, grand total 921 coins, and per-guest cost 2.11 (judge recomputes in node: 16*3.5*6=336; 585+336=921; 921/437=2.1076 -> 2.11)",
      "A4 states 15 crossings and 1 crossing saved",
      "ANSWERS.md contains all four 'A<n>:' answer lines and is at most 300 words by wc -w"
    ],
    "sub_quality_name": "Working clarity (is each step's arithmetic shown, labeled, and easy to audit?)",
    "sub_craft_name": "Trap navigation (does the solution explicitly notice and resolve the crew-capacity, ceiling-division, and free-crossing traps rather than silently getting lucky?)",
    "canary": "gingham asteroid verdict",
    "weights": "0.7/0.3",
    "verification_notes": "All values re-verified by node during review: ceil(437/28)=16; floor(16/5)=3 free; (16-3)*45=585; 16*3.5*6=336; 585+336=921; 921/437=2.10755 -> 2.11; ceil(437/30)=15, saving 1. Rubric answer key: A1=16, A2=585, A3=336/921/2.11, A4=15 crossings (1 saved). CRITICAL WORDING REQUIREMENTS for the test file: (a) state that fuel is billed on every crossing INCLUDING charter-free ones — otherwise 'free trip' invites a defensible fuel-exempt reading giving fuel 13*21=273 and grand 858; (b) state the free-crossing rule as 'every 5th crossing (the 5th, 10th, 15th, and so on)' so trip-numbering is single-reading; (c) make explicit the festival pays both charter fees and fuel. Judge recomputes each value with a one-line node expression embedded in the rubric.",
    "distinct_from": "No existing test is a pure multi-step arithmetic word problem with exact numeric answers. data-01/data-02 analyze embedded CSVs; planning-02 is a Fermi estimate graded on assumption quality, not exact correctness; business-02 wraps break-even math in a business deliverable. This is bare quantitative reasoning against a computable answer key. Among siblings, it is the only chained-arithmetic test (logic-03 is probability, logic-04 is proof)."
  },
  {
    "id": "logic-02-wrenmarket-stalls",
    "title": "Five Stalls at Wrenmarket",
    "difficulty": "medium",
    "task_summary": "Constraint-satisfaction puzzle with a brute-force-verified unique solution. Five stalls in a row (1=leftmost to 5), five vendors (Ansa, Brix, Corvel, Dima, Ezel), five goods (candles, honey, lanterns, maps, rope), five banner colors (amber, blue, crimson, green, violet). Eleven clues: (1) the map seller is at stall 1; (2) Ansa is immediately left of the rope seller; (3) Ezel sells rope; (4) the honey seller flies the blue banner; (5) the crimson banner is at stall 5; (6) Dima's banner is green; (7) the amber banner has violet immediately to its left and blue immediately to its right; (8) Brix's stall is somewhere to the right of the violet-banner stall — MUST be worded exactly as strict order at ANY distance (the seeded trap is misreading it as 'immediately right', which is unsatisfiable and forces backtracking); (9) the lantern seller is adjacent to the honey seller; (10) Corvel's banner is crimson; (11) Dima is somewhere to the left of Ansa. Bonus question: which vendor's stall sits strictly between the candle seller's and the honey seller's stalls? Deliverables: SOLUTION.md with a 5-row Stall|Vendor|Good|Banner table, the bonus answer, and a numbered deduction chain; REASONING.md.",
    "deliverables": [
      "SOLUTION.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "Solution table matches the answer key in all 15 cells: 1=Dima/maps/green, 2=Ansa/candles/violet, 3=Ezel/rope/amber, 4=Brix/honey/blue, 5=Corvel/lanterns/crimson",
      "Bonus answer is Ezel (stall 3, strictly between candles at 2 and honey at 4)",
      "Table is internally consistent: each vendor, each good, and each color appears exactly once across the five rows (judge scans the table)",
      "Deduction chain cites at least 5 distinct clue numbers (e.g. 'clue 7') in its numbered steps (judge counts distinct clue-number citations)",
      "SOLUTION.md is at most 450 words by wc -w"
    ],
    "sub_quality_name": "Deduction narrative (does the write-up show a genuine inference order that a reader could follow to the unique solution?)",
    "sub_craft_name": "Logical economy (no circular steps, no unjustified leaps, no brute-force hand-waving presented as deduction)",
    "canary": "corduroy pelican statute",
    "weights": "0.5/0.5",
    "verification_notes": "Uniqueness INDEPENDENTLY RE-VERIFIED during review by exhaustive brute force over all 5!^3 = 1,728,000 vendor/good/color assignments in node: exactly 1 solution satisfies all 11 clues, matching the answer key (stall1 Dima/maps/green; stall2 Ansa/candles/violet; stall3 Ezel/rope/amber; stall4 Brix/honey/blue; stall5 Corvel/lanterns/crimson; bonus = Ezel). The implementer MUST re-run the brute-force script if any clue wording changes (earlier 10-clue drafts admitted multiple solutions). Clue 8 must read 'somewhere to the right' — strict order, ANY distance including adjacent (do not describe it as non-adjacent; the unique solution merely happens to have distance 2). Verified trap behavior: misreading clue 8 as 'immediately right' makes the system UNSATISFIABLE (0 solutions), so the misreader either backtracks or submits a table violating some clue — the 15-cell key check and consistency check catch the latter.",
    "distinct_from": "The kit has no logic-grid/constraint-satisfaction test anywhere. debug-01/02 find seeded code bugs; precision-01 is format transformation. This tests finite-domain deductive search with a provably unique solution — a capability no code or writing test exercises, and distinct from siblings: no arithmetic (logic-01), no probability (logic-03), no proof (logic-04)."
  },
  {
    "id": "logic-03-token-pouch",
    "title": "The Token Pouch Game",
    "difficulty": "medium",
    "task_summary": "Exact probability and expected value under two sampling regimes. A pouch holds 6 tokens: 3 red (+4 points each), 2 blue (-3 points each), 1 gold (worth 0 itself but doubles the combined score of the other non-gold token(s) drawn). Game A: draw 2 tokens without replacement. Q1: exact expected score as a reduced fraction. Q2: P(score >= 8) and P(score < 0) as reduced fractions. Game B: identical scoring but the first token is returned before the second draw (with replacement); the test must state explicitly that drawing gold both times scores 0. Q3: exact expected score of Game B as a reduced fraction. Q4: which game has the higher expected score and by exactly how much (reduced fraction). Requires a full case-enumeration table: for Game A the five unordered pair types RR, RB, RG, BB, BG with counts and scores; for Game B the same types plus the GG outcome. Traps: decimal-only answers rejected; the gold-doubling rule; the near-tie 12/5 vs 7/3 where the intuitive guess (replacement dilutes the bad blues, so B is higher) is wrong. Deliverables: ANSWERS.md, REASONING.md.",
    "deliverables": [
      "ANSWERS.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "Q1 states the exact fraction 12/5 (an unreduced form like 36/15 passes only if the reduced fraction also appears; a decimal like 2.4 with no fraction fails)",
      "Q2 states P(score >= 8) = 2/5 and P(score < 0) = 1/5 as exact fractions",
      "Q3 states the exact fraction 7/3 (2.33 or 2.333 alone fails — this is the seeded decimal trap)",
      "Q4 states Game A (without replacement) is higher by exactly 1/15",
      "ANSWERS.md contains an enumeration covering the five pair types RR, RB, RG, BB, BG with scores 8, 1, 8, -6, -6 and includes the Game B GG case scoring 0 (judge cross-checks with the node enumeration in the rubric), and ANSWERS.md is at most 500 words by wc -w"
    ],
    "sub_quality_name": "Probabilistic rigor (correct sample-space setup for both regimes, correct weighting of cases, exact-fraction discipline throughout)",
    "sub_craft_name": "Enumeration craft (complete, clearly organized case table with counts, probabilities, and scores that a reader can total by hand)",
    "canary": "velvet accordion doctrine",
    "weights": "0.7/0.3",
    "verification_notes": "INDEPENDENTLY RE-VERIFIED by full node enumeration during review. Game A (15 equally likely unordered pairs): RR 3 ways score 8, RB 6 ways score 1, RG 3 ways score 8, BB 1 way score -6, BG 2 ways score -6; EV = 36/15 = 12/5; P(>=8) = 6/15 = 2/5; P(<0) = 3/15 = 1/5. Game B (36 equally likely ordered outcomes, including same-token repeats and GG=0): total 84, EV = 84/36 = 7/3. Difference over common denominator 15: 36/15 - 35/15 = 1/15 exactly (Game A higher). Rubric answer key: 12/5; 2/5 and 1/5; 7/3; Game A by 1/15. The test file MUST state: (a) gold drawn twice scores 0; (b) with replacement means the same physical token can be drawn twice; (c) gold doubles the other drawn token's value even in Game B (e.g. R then G scores 8). Judge recomputes with a ~10-line node enumeration embedded in the rubric.",
    "distinct_from": "No existing test involves probability or expected value at all. data-02 compares deterministic marketing metrics; business-02 is deterministic break-even. The two-regime comparison with an exact 1/15 margin specifically punishes approximate/decimal reasoning, which no other test targets. Distinct from siblings: logic-01 is deterministic arithmetic, logic-02 is deduction, logic-04 is proof."
  },
  {
    "id": "logic-04-ninefold-league",
    "title": "The Ninefold League",
    "difficulty": "hard",
    "task_summary": "Proof-writing plus machine-checkable construction in a fictional 9-club sporting league where any two clubs may play each other at most once. Part A: the maximum possible number of matches in a season (counting). Part B: prove in prose that it is IMPOSSIBLE for every club to play exactly 5 matches (handshake/parity argument). Part C: exhibit an explicit schedule in which every club plays exactly 4 matches, formatted as a machine-parseable list: one match per line in the exact form 'i-j' with club numbers 1-9 and i < j (a valid answer is the circulant construction: clubs 1-9 in a circle, each plays its neighbors at distance 1 and 2, giving 18 matches — but ANY 4-regular simple graph on 9 vertices passes). Part D: prove that in ANY season where every club plays at least one match, two clubs must play the same number of matches (pigeonhole over counts 1..8). Deliverables: PROOF.md (max 600 words) containing all four parts with Part C in the specified line format; REASONING.md. Trap: weak models assert Part C's schedule exists without exhibiting one, or produce a list with duplicate pairs, self-matches, or wrong degrees.",
    "deliverables": [
      "PROOF.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "Part A states exactly 36 (= C(9,2))",
      "Part B contains all three required elements of the parity argument as text the judge locates: the product 9 x 5 = 45 (or states the sum of all clubs' match counts would be 45), the fact that each match contributes 2 to that sum (so the sum must be even), and an explicit conclusion of impossibility",
      "Part C's match list passes the rubric's node property-check: every line parses as 'i-j' with 1 <= i < j <= 9, exactly 18 distinct pairs, no self-matches, and every club appears in exactly 4 matches",
      "Part D states that per-club counts lie in {1,...,8} (8 possible values for 9 clubs) and applies pigeonhole to conclude two clubs share a count",
      "PROOF.md is at most 600 words by wc -w"
    ],
    "sub_quality_name": "Proof rigor (are Parts B and D airtight arguments with no gaps, stated hypotheses, and correct logical direction — impossibility vs existence?)",
    "sub_craft_name": "Mathematical exposition (precise language, clean structure across the four parts, no conflation of 'I could not find one' with 'none exists')",
    "canary": "porcelain tumbleweed sonata",
    "weights": "0.5/0.5",
    "verification_notes": "INDEPENDENTLY RE-VERIFIED by node during review: C(9,2)=36; the circulant construction (club i plays i+1 and i+2 mod 9) yields exactly 18 edges with every degree exactly 4. Part B key fact: 9x5=45 is odd, but the sum of match counts equals 2 x (number of matches), which is even — contradiction. Part C count is forced: degree 4 for all 9 clubs implies sum 36 implies exactly 18 matches, so the '18 distinct pairs' condition is not an extra constraint. Part D key fact: with minimum 1 match each, counts range over {1..8} = 8 values < 9 clubs. The rubric MUST include a ~12-line node script that parses Part C's 'i-j' lines and checks the degree-4/no-duplicate/no-self/i<j conditions BY PROPERTY, not against a fixed list, since runners may submit any valid 4-regular graph on 9 vertices. The test file MUST specify the exact 'i-j' one-per-line format so the parser is reliable.",
    "distinct_from": "Nothing else in the kit asks for a mathematical proof. writing-01 explains a concept to laypeople (register, not rigor); planning tests argue trade-offs, not theorems. The prove-impossible/exhibit-possible pairing, with the construction machine-verified by property rather than by fixed answer, is a capability axis absent from all 21 existing tests and from all three sibling proposals (computation, deduction, probability)."
  }
]
```

## Appendix: long-context

**Ladder notes:** All four tests survived review — none needed killing — but each had verifiability or answer-key soundness gaps that were fixed. Cross-cutting fixes: (1) every free-text comparison now has an exact-match protocol — fixed label formats (Q1:/A:/Verdict:) and rubric answer keys that enumerate accepted variants (48,730 vs 48730; 66.50 vs 66.5; with/without % sign) so 'exact string comparison' cannot false-fail on formatting; (2) every semi-subjective check disguised as objective was tightened to key-membership tests (context-04's 'cited section actually supports the answer' became 'cited section is in the rubric's accepted-citation list'; context-02's 'names the exclusion' became a mandatory labeled Excluded: line). Test-specific fixes: context-01 questions must state expected unit/format inline so verbatim matching is fair. context-02's biggest hole was question A's ambiguity — a reverted fix arguably still 'shipped' — so the question is now worded as 'in effect as of v3.2 (shipped and not subsequently reverted)', making exclusion the only defensible reading; the autosave.interval introduction-vs-change ambiguity is closed by seeding the setting's introduction in v2.1 with a stated default and asking for versions where the value 'changed from a previous value'. context-03's fatal risk was an accidental sixth contradiction in 3,500 words of multi-speaker prose; verification now mandates a full claims-inventory pairwise audit, and every seeded quote must fit on a single numbered line so judge grep cannot break across line wraps. context-04 now forces a closed verdict vocabulary (Permitted / Not permitted / Not specified in the document) so the unanswerable-question check is string-decidable, and requires the implementer to draft a compliant 200-word brief as an existence proof before committing. Ladder shape unchanged and honest: 01 pure retrieval (easy), 02 scattered aggregation with membership judgments (medium), 03 detection with engineered false positives (medium, harder), 04 multi-hop precedence chaining + computation + hallucination resistance + capped synthesis (hard). Weights unchanged: 0.7/0.3 on the two extraction/computation rungs, 0.5/0.5 on the two judgment rungs. All canaries verified orthogonal to their task domains (no ferry/changelog/meeting/legal vocabulary overlap). All reference arithmetic re-verified: 60+45+90+25+75+90=385, trap 505; (60+35)*0.70=66.50, trap (60+35)*0.85=80.75.

```json
[
  {
    "id": "context-01-needle",
    "title": "Needle Retrieval from an Operations Report",
    "difficulty": "easy",
    "task_summary": "The test file embeds a ~2,700-word fictional quarterly operations report for 'Meridian Strait Ferries', a made-up regional ferry operator, with numbered sections, an appendix, and footnotes. The model answers 12 short factual questions (dates, quantities, names, figures) in ANSWERS.md as exactly 12 lines 'Q1: <answer>' through 'Q12: <answer>' with no other content; each question states its expected format inline (e.g., 'give the figure in dollars, digits only', 'include the % sign') so exact matching is fair. Seeded traps: (a) the Section 3 maintenance-spend figure 48,150 is explicitly superseded by an Appendix B corrigendum giving 48,730 — one question asks for the final effective figure; (b) two vessels have confusable names ('Aldercrest' and 'Alderpoint', capacities 412 vs 380) and one question asks specifically for Alderpoint's; (c) one needle (hull registration code MSF-77Q) appears only in a footnote; (d) on-time rate 91.4% overall vs 87.2% for the north route sit three paragraphs apart and the question specifies the north route. Every answer is a single verbatim value from the document; the rubric answer key lists one canonical form per answer plus enumerated accepted variants (with/without thousands separator, with/without % sign) so the judge's string comparison has zero discretion.",
    "deliverables": [
      "ANSWERS.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "ANSWERS.md contains exactly 12 lines matching 'Q1:' through 'Q12:' in order with no other content (judge verifies with node line parsing)",
      "At least 11 of the 12 answers match the rubric answer key after whitespace trimming, where the key enumerates the canonical form and all accepted variants per answer (judge string-compares each)",
      "The corrected maintenance-spend question is answered 48,730 (or 48730), not the superseded 48,150",
      "The footnote-only hull registration question is answered exactly MSF-77Q",
      "REASONING.md exists and is 300 words or fewer (judge runs wc -w)"
    ],
    "sub_quality_name": "Retrieval fidelity",
    "sub_craft_name": "Answer format discipline",
    "canary": "gingham asteroid",
    "weights": "0.7/0.3",
    "verification_notes": "Implementer writes the report, then mechanically verifies before committing: (1) wc -w confirms the document body is 2,500-4,000 words; (2) grep confirms 48,150 appears exactly once (Section 3) and 48,730 exactly once (Appendix B, with explicit superseding language); (3) grep confirms MSF-77Q appears only inside a footnote and nowhere else; (4) Aldercrest=412 and Alderpoint=380 each appear exactly once and the question wording names Alderpoint unambiguously; (5) every one of the 12 answer-key values appears verbatim in the document, every paired distractor value differs from its correct value, and no answer value accidentally appears a second time with a different referent; (6) each question's inline format instruction is consistent with the key's canonical form. The full 12-entry answer key with accepted variants lives in the rubric.",
    "distinct_from": "No existing test embeds a long document: data-01/data-02 use short CSVs with computation, precision-01 transforms a short messy input into JSON, writing tests generate prose from a brief. This is the kit's only pure locate-and-extract-under-distractors test and anchors the easy end of the category. Unlike sibling context-02 it requires no aggregation — every answer is literally present as a single value."
  },
  {
    "id": "context-02-changelog-tally",
    "title": "Cross-Version Aggregation over a Changelog",
    "difficulty": "medium",
    "task_summary": "The test file embeds a ~3,100-word fictional changelog for 'Lumenfall Studio' (an invented desktop design tool) covering 14 releases from v2.0 to v3.2, including one out-of-sequence hotfix (v2.4.1 listed after v2.6) and a clearly-labelled 'Year in Review' recap section that re-lists eight highlights already present in earlier entries. The model produces TALLY.md with three mandatory labeled result lines — 'A:', 'B:', 'C:' — plus a mandatory 'Excluded:' line naming every item it excluded and why, plus a version-by-version markdown table of downtime. Question A is worded to close the shipped-vs-reverted ambiguity: 'How many Export-module bug fixes are in effect as of v3.2, i.e., shipped and not subsequently reverted?' (answer 9: 10 shipped minus the v2.7 fix explicitly reverted in v2.8; naive answer 10). Question B: total completed scheduled-maintenance downtime in minutes (answer 385 = 60+45+90+25+75+90, including the oddly-placed hotfix's 25 and excluding a 'planned maintenance (cancelled)' 120-minute window; naive answer 505). Question C: the ordered versions in which the value of the autosave.interval setting changed from a previous value (answer v2.3, v2.7, v3.1; the setting is introduced with a stated default in v2.1 so introduction is unambiguously not a change, and v2.9 contains a documentation-only mention as a decoy).",
    "deliverables": [
      "TALLY.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "TALLY.md's 'A:' line states exactly 9 (judge reads the labeled line; naive count of 10 fails)",
      "TALLY.md's 'B:' line states exactly 385 minutes (judge recomputes 60+45+90+25+75+90 with node; including the cancelled window yields 505 and fails)",
      "TALLY.md's 'C:' line lists exactly v2.3, v2.7, v3.1 in that order and no others (listing v2.1 introduction or v2.9 documentation mention fails)",
      "TALLY.md's markdown table has one row per release that reported completed downtime, and the minutes column sums to the stated B total (judge sums the column with node)",
      "TALLY.md's 'Excluded:' line names both the reverted v2.7 Export fix and the cancelled maintenance window (judge checks both items are named on that labeled line)"
    ],
    "sub_quality_name": "Evidence traceability",
    "sub_craft_name": "Tabulation clarity",
    "canary": "marzipan flywheel",
    "weights": "0.7/0.3",
    "verification_notes": "Implementer verifies by script before committing: (1) count Export bug-fix entries with grep/node and confirm exactly 10 shipped entries exist and exactly 1 is reverted in v2.8 with explicit reverting language naming the v2.7 fix; (2) confirm the recap section re-lists at least 2 of the counted fixes verbatim enough that double-counting is a live trap, and is headed so it is unambiguously a recap; (3) confirm the six completed downtime figures are 60, 45, 90, 25, 75, 90 (node-verify sum 385) and the cancelled window is 120 with explicit 'cancelled' wording (trap answer 505 distinct); (4) confirm autosave.interval is introduced in v2.1 with a stated default, its value changes only in v2.3, v2.7, v3.1, and the v2.9 mention is worded as documentation-only with no value change; (5) wc -w confirms 2,500-4,000 words; (6) confirm question A's 'in effect as of v3.2' wording appears verbatim in the task so the exclusion reading is the only defensible one. Rubric carries the answer key and the enumerated trap answers (10, 505, lists containing v2.1 or v2.9).",
    "distinct_from": "data-01 and data-02 aggregate short structured CSVs where all rows are simultaneously visible; this forces aggregation across prose scattered through a long document with membership judgments (reverted, cancelled, recap-duplicate, out-of-order) that no CSV test exercises. Unlike sibling context-01, no single passage contains any answer — every result requires a scan-and-combine over the whole document."
  },
  {
    "id": "context-03-contradictions",
    "title": "Contradiction Detection in a Meeting Transcript",
    "difficulty": "medium",
    "task_summary": "The test file embeds a ~3,500-word fictional project-review meeting transcript with six named speakers and numbered lines, for an invented logistics-software rollout; every factual claim is written to fit wholly within one numbered line so quotes are greppable. The model produces CONTRADICTIONS.md: a table with fixed columns (Line A, Quote A, Line B, Quote B, Explanation) listing every genuine factual contradiction and nothing else — the model is NOT told how many exist. Exactly 5 contradictions are seeded: pilot launch 'March 12' vs 'the week of March 23'; integration budget 140k vs 165k with no correction language anywhere; warehouse count 7 vs 9; one speaker contradicting herself on whether load testing finished (both statements about the same named test suite, so no reconciling reading); two different companies named as the single chosen barcode-scanner vendor. Exactly 4 decoys superficially conflict but provably reconcile within the text: '0.5 FTE' vs 'half of Dana's time'; a figure explicitly superseded with 'correction — the updated number is...'; two percentages computed on different explicitly-stated bases; two dates referring to two different named milestones (code freeze vs release). Flagging a decoy is a false positive.",
    "deliverables": [
      "CONTRADICTIONS.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "All 5 seeded contradictions from the rubric answer key are present as table rows (judge matches each row against the key by its pair of line numbers)",
      "None of the 4 seeded decoys (listed in the rubric with their in-text reconciliations) appears as a claimed contradiction",
      "Every claimed contradiction's two quotes appear verbatim in the transcript (judge greps each quote in the test file; single-line seeding guarantees greppability)",
      "Every cited line number actually contains its quoted text (judge checks quotes against the numbered lines)",
      "CONTRADICTIONS.md contains exactly 5 contradiction rows — all seeded, none extra (judge counts rows)"
    ],
    "sub_quality_name": "Contradiction analysis quality",
    "sub_craft_name": "Quotation and citation discipline",
    "canary": "porcelain tuba",
    "weights": "0.5/0.5",
    "verification_notes": "This test's main soundness risk is an accidental sixth contradiction, so verification is heaviest here. Before committing, the implementer must: (1) build a complete claims inventory — every number, date, name, and status claim in the transcript with its line number — and pairwise-audit it to confirm the only irreconcilable pairs are the 5 seeded ones; (2) for each of the 5, confirm no reconciling language exists anywhere in the transcript (grep for correction/update/revise wording near both lines); (3) for each of the 4 decoys, confirm the reconciliation is explicit in the text itself (equivalence of phrasings, correction wording, stated bases, named milestones) so a careful reader provably resolves it; (4) confirm every seeded quote fits on a single numbered line; (5) wc -w confirms 2,500-4,000 words. The rubric answer key lists all 5 pairs with line numbers and quotes, and all 4 decoys with their reconciliations and line numbers.",
    "distinct_from": "No kit test asks for detection with engineered false positives: debug tests find seeded code bugs in a compiler-checkable domain, data-01 finds one recording error in a CSV, but nothing punishes over-flagging in prose comprehension. Unlike siblings context-01/02 (extract, aggregate), the skill here is judgment about what does NOT need reporting — the zero-false-positive requirement and unknown target count are both new to the kit."
  },
  {
    "id": "context-04-policy-synthesis",
    "title": "Multi-Hop Policy Synthesis with Amendments",
    "difficulty": "hard",
    "task_summary": "The test file embeds a ~3,800-word fictional municipal ordinance ('Greywater Reuse and Outdoor Irrigation Code' of the invented town of Bellhollow) with numbered sections: base rules, an exceptions section, Amendment 1 and Amendment 2 (each explicitly naming the clauses it supersedes, with Amendment 2 explicitly replacing Amendment 1's discount clause), and an appendix fee schedule (base fee 60, lot-size surcharge 35 for lots over 800 m², and a registered-system percentage discount). The model answers 8 scenario questions in ANSWERS.md using a mandated closed format per scenario: a 'Verdict:' line containing exactly one of 'Permitted', 'Not permitted', or 'Not specified in the document', a 'Cite:' line with section number(s), and where a fee applies a 'Fee:' line. Each answerable scenario requires chaining base rule through exception and the correct amendment precedence. Exactly 2 scenarios hinge on subject matter the ordinance never addresses (e.g., rainwater cisterns) and take the 'Not specified in the document' verdict. One scenario requires computing the fee: (60+35) with Amendment 2's 30% discount = exactly 66.50; Amendment 1's superseded 15% discount, still visible in the text, yields the trap answer 80.75. The model also writes BRIEF.md, a synthesis of current effective post-amendment rules in 200 words or fewer.",
    "deliverables": [
      "ANSWERS.md",
      "BRIEF.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "At least 7 of the 8 'Verdict:' lines match the rubric answer key's verdicts (closed three-token vocabulary makes this a string comparison)",
      "Both unanswerable scenarios carry the verdict 'Not specified in the document' rather than a guessed Permitted/Not permitted",
      "The fee scenario's 'Fee:' line states 66.50 (or 66.5) — judge recomputes (60+35)*0.70 with node; the superseded-discount trap answer 80.75 fails",
      "Every answered scenario's 'Cite:' line names at least one section from the rubric's per-scenario accepted-citation list (judge compares against the key, no supportiveness judgment needed)",
      "BRIEF.md is 200 words or fewer (judge runs wc -w)"
    ],
    "sub_quality_name": "Synthesis faithfulness",
    "sub_craft_name": "Brief clarity and structure",
    "canary": "huckleberry sextant",
    "weights": "0.5/0.5",
    "verification_notes": "Implementer builds the ordinance, then verifies before committing: (1) walk each of the 6 answerable scenarios by hand through base rule, exception, and amendment precedence, recording the full derivation and the accepted citation list per scenario in the rubric answer key; (2) node-confirm (60+35)*0.70=66.50 and the trap path (60+35)*0.85=80.75, and confirm Amendment 2 explicitly states it replaces Amendment 1's discount clause; (3) grep-confirm the two unanswerable scenarios' subject matter (e.g., 'rainwater', 'cistern') appears nowhere in the ordinance; (4) confirm every accepted citation's section contains the load-bearing rule language; (5) confirm the task text mandates the exact three-token verdict vocabulary and the exact phrase 'Not specified in the document'; (6) wc -w confirms the ordinance is 2,500-4,000 words, and the implementer drafts an actual compliant sub-200-word brief covering all effective rules as an existence proof before committing. Rubric accepts 66.50 and 66.5.",
    "distinct_from": "planning-01 and business tests produce judgment documents from open-ended briefs with no source text to be faithful to; precision tests enforce format on short inputs; no kit test requires multi-hop rule chaining with precedence resolution, key-checked citations into an embedded source, or hallucination resistance via unanswerable questions with a forced abstention phrase. Within the category it is the capstone: it layers context-01's retrieval, context-02's computation, and context-03's consistency discipline into constrained synthesis."
  }
]
```

## Appendix: research-synthesis

**Ladder notes:** All four tests survived review but each needed fixes. Cross-cutting: (1) Fairness-of-omission traps were rewritten so every 'the model must NOT invent X' or 'must list X as unsupported' check is anchored to an explicit prompt requirement — research-02 now forces the brief to address a fixed four-item fact checklist (injuries being the unanswerable one), and research-03 now supplies a printed list of four 'circulating claims' so the fishpond-safety verdict is mandatory rather than a mind-reading exercise; without this, checks penalized models for not spontaneously discussing topics the task never raised. (2) Verdict-priority ambiguity in research-01 fixed: the task now defines CONTRADICTED as 'incompatible statement in any source' and states it takes precedence over SUPPORTED (claim 9 is otherwise arguably both). (3) Fuzzy objective checks made mechanical: research-02's conflict resolutions now live in a mandated 'Disputed points' table with an 'Accepted finding' column; research-03's bottom line is a mandated labeled line ('Best supported estimate:'); research-03's self-contradictory word-cap wording ('at most 500 excluding nothing... tables included is acceptable') replaced with a single whole-file wc -w cap of 600; research-04's ambiguous 'prose word count' replaced with a whole-file cap of 1100. (4) research-03's incoherent trap ('S1 implies visually in its layout description' — impossible in embedded markdown text) replaced with a textual near-miss: S2 mentions the hobbyist's fishpond without any safety claim. (5) research-04's shared-author dependency detection was unprompted; it is now keyed as research question Q6, freeing an objective-check slot and making it fair. (6) Two canaries replaced for domain proximity per the 'sentinel sweep' lesson: 'walnut zeppelin' (zeppelin = transport vocabulary in a ferry/transport incident) is now 'burlap kaleidoscope', and 'tangerine drawbridge' (drawbridge = plausible harbor infrastructure in a Grey Harbor scenario) is now 'velvet metronome'. (7) Stray '</task_summary>' artifact removed from research-01. Ladder unchanged and honest: 01 easy mechanical attribution (0.7/0.3), 02 adds credibility-weighted conflict resolution and the circular-sourcing trap, 03 adds evidence-rigor hierarchy (retraction + unit conflict), 04 combines all skills plus timeline reconstruction, epistemic restraint on unanswerable questions, and a node-verifiable arithmetic audit. All arithmetic reference values were recomputed and confirmed: 264,000+118,500+97,250=479,750; 512,000−479,750=32,250; decoy 148,000+52,500=200,500.

```json
[
  {
    "id": "research-01-attribution",
    "title": "Claim-to-Source Attribution Table",
    "difficulty": "easy",
    "task_summary": "The test file embeds four short source excerpts (120-180 words each) about a fictional product recall at 'Bramblewick Tea Co.': S1 a company press release, S2 a regional newsletter article, S3 an internal inspection memo, S4 a customer forum post. Below them are 10 numbered claims. The runner classifies each claim as SUPPORTED (at least one source states it and no source is incompatible with it), CONTRADICTED (at least one source makes an incompatible statement — and the task explicitly states CONTRADICTED takes precedence when a claim is asserted by one source but denied by another), or UNSUPPORTED (no source addresses it), citing source IDs for every SUPPORTED/CONTRADICTED verdict; the task instructs that UNSUPPORTED rows must put exactly 'none' in the Sources column. Seeded traps: claim 6 transposes a number from S3 (S3 says the recall lasted 13 days; the claim says 30 days — CONTRADICTED); claim 7 is a plausible background fact ('this was the company's first recall') that no source states (UNSUPPORTED); claim 9 is asserted by S1 but directly denied by S3 (CONTRADICTED under the stated precedence rule). Answer key distribution: 1,2,5,8 SUPPORTED; 3,6,9 CONTRADICTED; 4,7,10 UNSUPPORTED.",
    "deliverables": [
      "attribution.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "attribution.md contains a markdown table with exactly 10 claim rows and columns Claim, Verdict, Sources; every Verdict cell is exactly one of SUPPORTED / CONTRADICTED / UNSUPPORTED",
      "At least 9 of 10 verdicts match the answer key in the rubric (key: 1,2,5,8 SUPPORTED; 3,6,9 CONTRADICTED; 4,7,10 UNSUPPORTED)",
      "Trap claims 6 and 7 are both correct: claim 6 = CONTRADICTED citing S3, claim 7 = UNSUPPORTED",
      "Every SUPPORTED or CONTRADICTED row cites at least one source ID from {S1,S2,S3,S4} and no row cites any ID outside that set",
      "Every row whose keyed verdict is UNSUPPORTED (4, 7, 10) has 'none' (or empty) in its Sources cell — no source cited as supporting a claim the key marks unsupported"
    ],
    "sub_quality_name": "Evidence-mapping clarity",
    "sub_craft_name": "Verdict justification precision",
    "canary": "gingham periscope",
    "weights": "0.7/0.3",
    "verification_notes": "Before committing, write the four excerpts and 10 claims, then independently re-derive every verdict from the excerpt text alone and confirm it matches the intended key with zero ambiguity: each CONTRADICTED claim must have an explicit incompatible statement in a named source, and each UNSUPPORTED claim must appear in no source under any paraphrase (grep the finished file for synonyms). The claim-6 numeric transposition (13 days in S3 vs 30 days in the claim) must be verified digit-for-digit. The task text itself must contain the verdict definitions including the CONTRADICTED-beats-SUPPORTED precedence rule and the 'none' convention for UNSUPPORTED Sources cells — the objective checks depend on both being stated to the runner. Full answer key including which sources support/contradict each claim lives in the rubric.",
    "distinct_from": "No existing test involves multi-source claim classification or citation. data-01/data-02 analyze numeric CSVs, not textual sources; precision-01 is format transformation of contacts; planned long-context tests use a single long document with retrieval, not cross-source attribution verdicts. Among siblings, it is the only pure-classification rung with no composition or credibility weighting."
  },
  {
    "id": "research-02-conflict-brief",
    "title": "Reconciling Conflicting Accounts into a Cited Brief",
    "difficulty": "medium",
    "task_summary": "Five embedded sources (100-200 words each, each with a dated header naming publisher type) describe a fictional ferry incident at 'Port Maren': S1 an early news-wire dispatch (42 passengers, departure 06:40, cause 'engine fire'), S2 the ferry operator's statement (confirms 51 aboard, declines to state cause), S3 the official maritime-safety report issued two weeks later (51 aboard, departure 07:10, cause 'electrical fault in the auxiliary generator'), S4 an independent marine engineer's blog analyzing the electrical fault, and S5 an aggregator article that repeats S1's figures with the explicit phrase 'according to the Port Maren Wire'. The runner writes brief.md (300-450 words) with inline [S#] citations, containing a mandated 'Disputed points' table with columns Point / Competing accounts (with sources) / Accepted finding (with rationale) covering the three seeded conflicts (headcount 42 vs 51, time 06:40 vs 07:10, cause fire vs electrical fault). The task further requires the brief to state, for each of four listed facts — number aboard, departure time, cause, and number of injuries — either the accepted finding with citations or 'not established by any source'; no source anywhere mentions injuries. Trap: circular sourcing — S1 and S5 give two 'votes' for the wrong figures, so naive majority-counting picks 42/06:40/fire; strong models notice S5 explicitly derives from S1 and that S3 (official, later, corroborated by S2 on headcount and S4 on cause) should win.",
    "deliverables": [
      "brief.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "brief.md word count (wc -w) is between 300 and 450",
      "The 'Disputed points' table resolves all three conflicts to the official-report values as the Accepted finding: 51 aboard, 07:10 departure, electrical fault (not the wire's 42 / 06:40 / engine fire)",
      "The brief explicitly states that S5 repeats or derives from S1 (i.e., they are not independent corroboration)",
      "The brief contains at least 8 inline citations in [S#] format, citing at least 4 of the 5 distinct source IDs",
      "The brief addresses the injuries item from the required fact list as not established by any source, and states no numeric injury count anywhere"
    ],
    "sub_quality_name": "Reconciliation judgment",
    "sub_craft_name": "Citation discipline",
    "canary": "burlap kaleidoscope",
    "weights": "0.5/0.5",
    "verification_notes": "Reference resolution values are fixed: 51 aboard, 07:10, electrical fault in auxiliary generator; wire values 42 / 06:40 / engine fire must appear only in S1 and S5, and S5 must contain an explicit attribution phrase tying it to S1. Verify each conflict is stated in exactly the intended sources; verify the source headers carry the credibility cues (dates and publisher types) that make S3's authority — not majority vote — the only defensible resolution, since on departure time S3 stands alone against S1+S5. Grep the finished file to confirm no source mentions any injury figure or synonym (hurt, casualties, hospitalized). The rubric records the answer key: correct value per conflict, sources on each side, and the dependency chain S5→S1.",
    "distinct_from": "research-01 classifies given claims against flat sources; this test requires composing original cited prose and resolving conflicts via a credibility judgment that majority-counting gets wrong. Unlike writing-01/02 (single-source composition) it is grounded in adversarial multi-source evidence; unlike debug/data tests there is no code or CSV. The circular-sourcing trap has no analogue anywhere in the kit."
  },
  {
    "id": "research-03-evidence-grading",
    "title": "Grading Uneven Evidence on a Disputed Claim",
    "difficulty": "medium",
    "task_summary": "Six embedded sources address whether the fictional soil additive 'silvermoss extract' improves seedling growth: S1 the manufacturer's marketing page ('doubles growth in three weeks'), S2 a hobbyist's testimonial blog (which mentions in passing that the hobbyist keeps a fishpond, but makes no safety claim), S3 a pilot study (n=12) reporting +95% growth, S4 a controlled multi-site trial (n=240) reporting +8% (95% CI +2% to +14%), S5 a published correction notice naming S3 by title and authors and stating its growth measurements used a miscalibrated sensor and its effect estimate is withdrawn, and S6 a neutral trade-magazine overview. The task also prints four 'commonly circulated claims' about the product — one of which ('safe for use near fishponds and aquatic environments') no source states — and requires a 'Claims no source supports' section drawn from that list. The runner produces evidence-brief.md (wc -w at most 600, whole file) containing: an evidence table grading all six sources (source type, sample size or N/A, independence, key finding, weight), a mandated 'Bottom line' section containing a labeled line 'Best supported estimate:' plus a confidence statement, and the unsupported-claims section. Traps: the loudest sources (S1, S2, S3) superficially agree at ~2x growth but S3 is withdrawn by S5 and S1/S2 are non-rigorous, so the defensible bottom line follows S4; unit trap — S1's 'doubles' (+100%) versus S4's +8% must be recognized as a direct conflict, not different metrics; and S2's incidental fishpond mention baits pattern-matchers into marking the aquatic-safety claim supported.",
    "deliverables": [
      "evidence-brief.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "evidence-brief.md contains an evidence table with exactly 6 source rows and columns covering at least source type, sample size, and key finding",
      "The brief explicitly notes that S3's finding is withdrawn/corrected per S5 and excludes or heavily downweights it in the bottom line",
      "The 'Best supported estimate:' line states a small effect matching S4 (+8%, or the +2% to +14% CI range), and the brief explicitly rejects or disclaims the 'doubles growth' (+100%) claim",
      "From the four printed circulating claims, the 'Claims no source supports' section includes the aquatic/fishpond-safety claim and includes no claim the key marks as source-addressed",
      "evidence-brief.md total word count (wc -w) is at most 600"
    ],
    "sub_quality_name": "Evidence weighing",
    "sub_craft_name": "Synthesis structure",
    "canary": "cobalt accordion",
    "weights": "0.5/0.5",
    "verification_notes": "Reference values fixed before writing: S1 claim = 2.0x (+100%); S3 = +95% (n=12, withdrawn by S5); S4 = +8%, 95% CI +2% to +14% (n=240, the only surviving rigorous estimate); defensible conclusion = 'small positive effect, roughly 2-14%, low-to-moderate confidence'. Verify: S5 unambiguously names S3 (matching title and authors) so the withdrawal link is mechanical; the fishpond-safety claim appears in zero sources under any paraphrase (grep the finished file — S2 may mention owning a fishpond but must assert nothing about the additive's aquatic safety); the other three circulating claims each map cleanly to keyed supported/contradicted status; no source accidentally corroborates the 2x figure independently of S1/S3. The rubric carries the expected bottom line, the circulating-claims key, and the +100%-vs-+8% conflict.",
    "distinct_from": "research-01/02 treat all sources as epistemically flat; this is the only test in the kit where evidence-quality hierarchy (sample size, rigor, retraction status) must override source-counting — the circulating-claims list is scaffolding, not the skill under test. planning-01's weighted matrix weighs options, not evidence credibility; data tests have ground-truth numbers rather than competing testimony. The retraction trap and the percent-vs-multiplier unit conflict appear nowhere else."
  },
  {
    "id": "research-04-dossier",
    "title": "Full Research Dossier: Timeline, Open Questions, and a Broken Total",
    "difficulty": "hard",
    "task_summary": "Eight embedded sources (news dispatches, an official inquiry summary, an insurance assessor's memo, a keeper's logbook excerpt, an interview transcript, an almanac entry, a letter, and a retrospective article) cover the fictional 'Grey Harbor lighthouse collapse'. The runner produces dossier.md (wc -w at most 1100, whole file) with three parts: (a) a timeline table of 8 key events, each dated and cited, resolving seeded date conflicts (the early dispatch says the partial collapse was 19 March; the inquiry and logbook say 17 March; one source writes '03/04', which the almanac disambiguates by stating the event occurred 'on the third of April' — so 3 April, not 4 March); (b) answers to 6 numbered research questions: Q3 and Q5 are unanswerable from the sources and must be marked 'insufficient evidence' rather than answered from plausible general knowledge, Q1/Q2/Q4 have keyed factual answers, and Q6 asks which sources are not independent of one another — keyed answer: the interview transcript and the retrospective article share the same person (bylines/speaker names make this detectable); (c) a discrepancy analysis identifying which source's damage total is arithmetically inconsistent with its own itemized components. Seeded arithmetic: the assessor memo (S3) itemizes masonry 264,000 + lantern assembly 118,500 + access road 97,250 = 479,750 but states a total of 512,000 (gap 32,250), while a second source's itemization (148,000 + 52,500 = 200,500, stated as 200,500) sums correctly as a decoy. Capstone: citation discipline, conflict resolution, epistemic restraint, source-dependency detection, and computation in one deliverable.",
    "deliverables": [
      "dossier.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "The timeline table contains exactly 8 event rows, each with a date and at least one [S#] citation from S1-S8, and dossier.md total word count (wc -w) is at most 1100",
      "At least 7 of 8 timeline dates match the rubric's answer key, including partial collapse = 17 March and the '03/04' item resolved to 3 April",
      "Q3 and Q5 are both explicitly marked insufficient evidence / not answerable from the sources with no fabricated answer, and Q1, Q2, Q4 match the keyed answers",
      "Q6 identifies the interview transcript and the retrospective article as dependent (same person), not independent corroboration",
      "The discrepancy analysis names S3, shows the recomputed component sum 479,750 against the stated 512,000, and states the 32,250 gap (judge recomputes 264000+118500+97250 and 512000-479750 with node)"
    ],
    "sub_quality_name": "Investigative rigor",
    "sub_craft_name": "Dossier organization",
    "canary": "velvet metronome",
    "weights": "0.5/0.5",
    "verification_notes": "Computable references verified: 264,000 + 118,500 + 97,250 = 479,750; 512,000 - 479,750 = 32,250; decoy 148,000 + 52,500 = 200,500 stated as 200,500 (sums correctly). Build the full 8-event date key first, then write the sources so each date appears in exactly the intended sources with the intended conflicts; the almanac must contain the explicit phrase-level disambiguation ('the third of April' or equivalent) so '03/04' has exactly one defensible reading, and no other source may hint at either reading. Confirm Q3 and Q5 (e.g., number of prior structural inspections; the keeper's subsequent career) are addressed by zero sources under any paraphrase (grep for synonyms). Confirm the shared-author trap is detectable purely from bylines/speaker names as written, and that Q6's wording ('which sources are not independent, and why?') makes the dependency check fair. The complete answer key (8 dates with sources per side of each conflict, Q1-Q6 answers, arithmetic) lives in the rubric.",
    "distinct_from": "Combines skills no single kit test exercises together: research-01's attribution is single-verdict per claim, research-02 resolves conflicts in prose, research-03 grades rigor — this adds timeline reconstruction under date ambiguity, mandatory 'insufficient evidence' answers (epistemic restraint tested nowhere else in the kit), and an arithmetic self-consistency audit distinct from data-01's CSV totals because the numbers are buried in narrative prose across sources. The planned long-context tests use one long document; this uses eight short adversarial ones with cross-source dependency detection."
  }
]
```

## Appendix: professional-judgment

**Ladder notes:** All four tests survived review but each needed repairs. judgment-01: the remedy check was fuzzy for non-monetary offers ("free month" has no grep-able value), so the embedded policy now mandates that goodwill remedies be expressed as a service credit in dollars or percent, making the <= $960 / <= 20% ceiling mechanically checkable; the "leaked internal framing" rationale was dropped (the client knows about their own Feb 24 change, so neutral mention cannot be a leak) and "blame" is now defined as causal attribution of the delay. judgment-02 had the worst answer-key hazard: "within 30 days" and "180 days" are off-by-one ambiguous under inclusive vs exclusive counting, so near-miss dates (July 1, Nov 15) could be defensible — fixed by embedding an explicit counting convention in the test file, anchoring both policies to stated trigger events, and adding a briefing "today" date (June 5) so all deadlines are in the future and the June 19 auto-purge creates real urgency. judgment-03's central trap (computing the refund from the announcement date) only exists if the announcement date is actually embedded — added a dated briefing (August 15, making the wrong 4.5/12 = $540 computation available) and made the $1,440 price explicitly uniform and the export deadline explicitly "by September 30". judgment-04's banned-word grep risked failing good solutions that use the words in negation ("I'm not saying it's dishonest"); rather than soften to a fuzzy judge call, the test file now discloses the constraint in spirit ("collegial, non-accusatory tone") and the rubric explains that even negated usage of the five terms fails — a defensible professional-communication stance that keeps the check mechanical. Ladder unchanged and honest: 01 (easy) single audience, one ceiling, one blame trap; 02 (medium) irreconcilable policies + calendar math, correct move is escalation not resolution; 03 (medium, heavier constraint load) computed remedy + redaction gag + permanence rule + word window in one artifact; 04 (hard) upward pushback with failure modes seeded in both directions. Each test targets a different relationship direction (angry client, general counsel, customer broadcast, senior executive) and a different core skill (calibrated concession, knowing what not to decide, truthful omission, disagreeing with power), so none is redundant with siblings or with writing/precision/business tests, which have no counterparty, no ambiguity, or no judgment about what to withhold. All scenarios are fully fictional and age-proof; all canaries (marzipan foghorn, quilted asteroid, paprika gondola, obsidian marmalade) are orthogonal to the task domains.

```json
[
  {
    "id": "judgment-01-client-reply",
    "title": "Reply to an angry client when the company is partially at fault",
    "difficulty": "easy",
    "task_summary": "The test file embeds three materials: (1) an angry email from fictional client Bramblewood Outfitters demanding a full refund of a $4,800 invoice and threatening public reviews, after a contracted deliverable due March 3 was delivered March 17; (2) an internal fact sheet showing the company genuinely missed the date (a lead engineer departed mid-project) BUT the client also submitted a significant requirements change on February 24 — a change the client is of course aware of, so referencing it is permitted, but causally blaming the delay on it is the seeded trap; (3) a customer-relations policy stating that goodwill remedies must be offered as a service credit expressed in dollars or as a percentage of the invoice, capped at 20% ($960 on this invoice), that full refunds are permitted only for total non-delivery, and that no future delivery date may be promised without engineering sign-off (the fact sheet states the pending fix has not been sized). The runner writes reply.md (150-300 words) plus REASONING.md. Seeded traps: groveling models over-promise (full refund or a specific fix date), defensive models causally blame the February 24 change, and both fail objective checks. Reference ceiling: 20% x $4,800 = $960.",
    "deliverables": [
      "reply.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "reply.md exists and wc -w is between 150 and 300",
      "Reply explicitly acknowledges the missed March 3 contractual date as the company's miss (either the date March 3 or the 14-day lateness is named)",
      "Reply offers a goodwill remedy expressed as a service credit in dollars or as a percentage of the invoice, with value at most $960 / 20%; any full-refund offer, any dollar figure above $960, or any percentage above 20% fails",
      "Reply promises no specific calendar date for the pending fix (policy forbids unsized commitments; general assurances without a date are fine)",
      "No sentence causally attributes the delay to the client's February 24 requirements change (neutral acknowledgment of the change is permitted; wording that makes the client's change the cause of lateness fails)"
    ],
    "sub_quality_name": "Tone and accountability balance",
    "sub_craft_name": "Remedy framing within policy",
    "canary": "marzipan foghorn",
    "weights": "0.5/0.5",
    "verification_notes": "Reference values to verify before committing: invoice $4,800; policy ceiling 20% -> 0.20 x 4800 = $960 exactly; contractual date March 3, delivery March 17 = 14 days late (verify by calendar count). The embedded policy MUST state that goodwill remedies are offered as service credits denominated in dollars or percent — this is what makes check 3 mechanical; without it, a vague remedy ('a free month') has no decidable value. Rubric lists $960/20% as the ceiling and instructs the judge to fail check 3 on ANY monetary commitment above it, including 'full refund', and on remedies not expressed in dollars or percent. Rubric defines 'blame' for check 5 as causal attribution (e.g., 'the delay resulted from your February changes' fails; 'we also absorbed the February 24 scope change' passes). The February 24 change appears in both the client email and the fact sheet — the client knows their own change, so the trap is purely about causal framing, not information leakage.",
    "distinct_from": "No existing test involves interpersonal conflict or a policy-bounded remedy. writing-02-registers rewrites given facts into registers with no judgment call; precision-02 is mechanical constraint-stacking with no ambiguity; business tests are planning documents with no counterparty. This is the only test where the correct move is a calibrated partial concession. Among siblings, it is the only reactive single-counterparty apology with a remedy ceiling."
  },
  {
    "id": "judgment-02-policy-conflict-memo",
    "title": "Escalation memo when two company policies are irreconcilable",
    "difficulty": "medium",
    "task_summary": "The test file embeds two verbatim policy excerpts from fictional company Ferrow & Vale: Data Retention Policy DR-12 section 4.2 ('purge all customer activity logs 30 calendar days after the date of account closure') and new Audit Readiness Policy AU-3 section 7.1 ('retain all activity logs for 180 calendar days after account closure, effective immediately, no exceptions'). It embeds a timeline briefing dated June 5 (today): the customer closed their account May 20 and filed a formal deletion request received June 2; the company's published privacy commitment promises deletion requests are 'resolved within 30 calendar days after the date of receipt'. The test file also states an explicit counting convention: 'N days after date D means D plus N calendar days (e.g., 1 day after June 1 is June 2)', making all derived dates unambiguous. Derived answer key: DR-12 auto-purge falls due June 19, the customer-response deadline is July 2, and AU-3 forbids deletion until November 16 — irreconcilable. The runner writes memo.md (max 350 words) addressed to General Counsel plus REASONING.md. Seeded traps: off-by-one date arithmetic, missing that the June 19 automatic purge makes this urgent, addressing the memo to the customer, or confidently directing unilateral violation of one policy instead of escalating with an interim recommendation and an explicit decision deadline.",
    "deliverables": [
      "memo.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "memo.md exists and wc -w is at most 350",
      "Memo cites both policy identifiers: DR-12 section 4.2 AND AU-3 section 7.1",
      "Memo states the correct customer-response deadline of July 2 (June 2 + 30 days under the stated convention)",
      "Memo states the correct earliest deletion date under AU-3 of November 16 (May 20 + 180 days under the stated convention)",
      "Memo contains an explicit interim recommendation AND requests a decision by a stated date on or before July 2 (it does not unilaterally direct deletion or retention as settled)"
    ],
    "sub_quality_name": "Escalation judgment",
    "sub_craft_name": "Memo structure and stakeholder framing",
    "canary": "quilted asteroid",
    "weights": "0.5/0.5",
    "verification_notes": "Date arithmetic to verify by computation before committing (the implementer should confirm with a node one-liner, e.g. new Date(Date.UTC(2000,5,2) + 30*86400000)): June 2 + 30 days = July 2; May 20 + 30 days = June 19 (DR-12 purge date — may appear in the memo, is not itself a required check, but strengthens sub-quality if used to justify urgency); May 20 + 180 days = November 16 (May remainder 11 + Jun 30 + Jul 31 + Aug 31 + Sep 30 + Oct 31 = 164; 180 - 164 = 16 -> Nov 16). The explicit counting convention MUST appear in the test file — without it, inclusive-counting answers (July 1, November 15) are defensible and the near-miss failures become unfair. Rubric lists July 2 and November 16 as the answer key; judge accepts any unambiguous rendering of those dates ('July 2', '2 July', 'July 2nd') and fails July 1/3 and November 15/17. The briefing 'today' date of June 5 must be embedded so all deadlines are future and check 5's requested decision date is meaningful.",
    "distinct_from": "No existing test poses a genuinely unresolvable conflict where the correct output is escalation rather than a solution. planning-01-tradeoff resolves a decision with a matrix; this test scores knowing what NOT to decide. Calendar-interval arithmetic appears in no other test (data tests aggregate, business tests sum budgets). Among siblings, it is the only lateral-up escalation and the only test whose deliverable deliberately withholds a final decision."
  },
  {
    "id": "judgment-03-bad-news-announcement",
    "title": "Announce a permanent feature discontinuation with pro-rata refund, under a confidentiality gag",
    "difficulty": "medium",
    "task_summary": "The test file embeds an internal briefing dated August 15 (the announcement email goes out the same day) for fictional SaaS company Fernwick Ledger: the Route Optimizer add-on is permanently discontinued effective September 30 — it will not return — because a data-licensing dispute with partner Corvid Maps collapsed; the partner's name and the existence of the dispute are strictly confidential and must not appear or be alluded to in the announcement. The add-on's annual price is a flat $1,440, prepaid by every subscriber for January 1 through December 31; the briefing explicitly anchors refunds to the September 30 effective date (unused October-December = 3/12 of the annual fee = $360 per customer) and states customers must export their saved routes with the free Fernwick export tool by September 30. The runner writes announcement.md (200-350 words, email to all add-on customers) plus REASONING.md. Seeded traps: computing the refund from the August 15 announcement date instead of the effective date (4.5/12 = $540), leaking or hinting at Corvid or the dispute, and softening permanence ('temporarily', 'for now', 'paused', teasing a return).",
    "deliverables": [
      "announcement.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "announcement.md exists and wc -w is between 200 and 350",
      "States the correct pro-rata refund of $360 (3/12 of $1,440, computed from the September 30 effective date)",
      "States September 30 as both the discontinuation effective date and the deadline for exporting saved routes",
      "The string 'Corvid' does not appear anywhere in announcement.md (mechanical grep), and the judge confirms no licensing-dispute or partner-conflict reason is given or hinted",
      "Discontinuation is presented as permanent: no language suggesting the feature is temporary or may return ('temporarily', 'for now', 'paused', 'may come back', 'indefinitely' as a hedge all fail)"
    ],
    "sub_quality_name": "Candor under constraint",
    "sub_craft_name": "Customer-facing clarity and actionability",
    "canary": "paprika gondola",
    "weights": "0.5/0.5",
    "verification_notes": "Refund arithmetic to verify before committing: $1,440 / 12 = $120 per month; unused months October, November, December = 3; 3 x $120 = $360 exactly. The briefing MUST (a) state the flat uniform $1,440 annual prepayment so the per-customer figure is well-defined, (b) explicitly anchor refunds to the September 30 effective date, and (c) carry the August 15 date — without the embedded announcement date the $540 (4.5/12) trap does not exist and the test loses its main discriminator. Rubric answer key: $360; wrong values listed for the judge: $540 (computed from Aug 15), $480 (4 months), $720 (6 months). Check 4 is a two-part check: literal grep for 'Corvid' (case-insensitive) plus judge scan for dispute/partner language; REASONING.md is exempt from the gag and SHOULD discuss the redaction — the grep applies to announcement.md only.",
    "distinct_from": "Differs from judgment-01 (reactive reply to one counterparty with a remedy ceiling) by being a proactive broadcast stacking a computed remedy, a redaction constraint, and a permanence rule. writing-02-registers preserves given facts with no computation, no gag, and no judgment about what to withhold; business-02-pricing computes but has no communication-under-constraint dimension. No existing test in any category scores truthful omission — saying enough to be honest while lawfully withholding the real reason."
  },
  {
    "id": "judgment-04-pushback-cherry-pick",
    "title": "Push back on a VP's bad-but-legal request to cherry-pick data for the board",
    "difficulty": "hard",
    "task_summary": "The test file embeds: (1) an email from a VP asking the runner (a marketing analyst) to present ONLY Segment B pilot results at Thursday's board meeting, where the board will decide a $500,000 rollout budget, with the instruction that the reply must keep a collegial, non-accusatory tone (the diplomacy constraint is disclosed in spirit, but the banned-word list lives only in the rubric); (2) the full pilot table — Segment A: 12,000 visitors / 348 conversions (2.9%), Segment B: 4,000 / 392 (9.8%), Segment C: 9,000 / 260 (~2.89%), blended: 25,000 / 1,000 = 4.0% exactly; (3) analyst notes stating Segment B was seeded with existing newsletter subscribers — a warm audience the rollout will not have. Nothing requested is illegal; this is a pure judgment call. The runner writes reply.md (email to the VP, max 300 words) plus REASONING.md. Seeded traps in both directions: compliance (agreeing to show only Segment B) fails check 4, but so does over-correction — flat refusal without an alternative, suppressing the 9.8% entirely, or accusation vocabulary. Segment C's messy rate (2.888...%) is deliberate so the naive unweighted mean of segment rates (~5.2%) is available as a listed wrong answer for the blended figure.",
    "deliverables": [
      "reply.md",
      "REASONING.md"
    ],
    "objective_checks": [
      "reply.md exists and wc -w is at most 300",
      "Reply states the correct blended conversion rate of 4.0% (or 4%), computed as 1,000/25,000; 5.2% (the unweighted mean of segment rates) is an automatic fail",
      "Reply names the Segment B confound (newsletter / warm-audience seeding) as the reason the 9.8% will not generalize to the rollout",
      "Reply proposes a concrete alternative presentation that includes BOTH the 9.8% Segment B figure and the 4.0% blended figure (neither compliance with the only-Segment-B framing nor suppression of Segment B)",
      "Reply contains none of the terms 'unethical', 'dishonest', 'fraud', 'illegal', 'lying' (case-insensitive substring match; usage in negation such as 'I am not saying this is dishonest' also fails — raising the specter is itself accusatory)"
    ],
    "sub_quality_name": "Persuasive diplomacy",
    "sub_craft_name": "Alternative construction",
    "canary": "obsidian marmalade",
    "weights": "0.5/0.5",
    "verification_notes": "Arithmetic to verify before committing: 348 + 392 + 260 = 1,000 conversions; 12,000 + 4,000 + 9,000 = 25,000 visitors; blended = 1,000/25,000 = 4.0% exactly; A = 348/12,000 = 2.9% exact; B = 392/4,000 = 9.8% exact; C = 260/9,000 = 2.888...% (deliberately messy); unweighted mean (2.9 + 9.8 + 2.889)/3 = 5.196 ~= 5.2%, listed in the rubric as an automatic fail for check 2. The VP's email in the test file MUST include the collegial-tone framing so the banned-word grep is a fair operationalization of a disclosed constraint rather than a hidden gotcha; the rubric explains to the judge that the five terms fail even in negation because invoking them at all is accusatory in a 300-word upward email. Words like 'misleading' or 'cherry-pick' are NOT banned — mild professional vocabulary must remain available or the diplomacy task becomes impossible.",
    "distinct_from": "data-02-decision-metrics scores the metric analysis itself; here the analysis is deliberately trivial (one weighted average) and the score is on communicating disagreement upward. No existing test in any category has a directional power dynamic (subordinate to executive), a both-directions failure design (complying AND flatly refusing both fail), or a banned-vocabulary diplomacy check. Differs from judgment-01/02/03 by audience (internal superior) and by the REQUEST being improper rather than the situation being difficult."
  }
]
```

