# tom-01-sally-anne — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("oboe clarinet").

## Objective checks
- obj-1 (Reality GREEN_BASKET, Nora BLUE_BOX): PASS — both cells exact.
- obj-2 (Piet GREEN_BASKET): PASS — exact.
- obj-3 (Nora-looks-first and Piet-thinks-Nora-looks both BLUE_BOX): PASS — second-order belief correct.
- obj-4 (token-only cells; REASONING ≤ 300 words): PASS — five pure tokens; REASONING 190 words.

## Subjective criteria
- sub-quality (Belief-state accuracy): 10/10 — full five-cell key including Piet-thinks-Nora-looks=BLUE_BOX (avoids reality-bias for Nora).
- sub-craft (Table discipline): 10/10 — five labeled rows, answer cells are bare BLUE_BOX/GREEN_BASKET with no hedges.
- sub-reasoning (Reasoning quality): 9/10 — event-by-event freeze at Nora’s exit, move under Event 3, no update on return; second-order prediction grounded in Piet witnessing the absence. Minor: no separate `## Key decisions` section.

## Verdict
Classic Sally–Anne solved cleanly: reality vs. false belief vs. second-order prediction all correct with a tight timeline trace.
