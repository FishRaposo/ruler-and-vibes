# uxcopy-01-quatrefoil-latch — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("glen vale").

## Objective checks
- obj-1 (6 keys, button+toast each): PASS — Exactly the six action keys; all have non-empty button/toast.
- obj-2 (buttons 1–3 words, no trailing .!…): PASS — e.g. "Save Draft", "Remove Teammate"; all 2 words, no trailing punctuation.
- obj-3 (toasts ≤60 chars, single trailing period): PASS — Longest "Teammate removed." / "Project archived." well under 60; each ends in one `.`.
- obj-4 (no banned substrings): PASS — No click/button/successfully/please/here in any button+toast pair.
- obj-5 (undo string only on two destructives): PASS — removeTeammate/deleteDraft undo "Undo"; other four undo null.

## Subjective criteria
- sub-quality (Label and toast clarity): 9/10 — Buttons name the action ("Invite Teammate", "Delete Draft"); toasts confirm outcomes ("Invitation sent.", "Draft deleted.") without restating the button verb awkwardly.
- sub-craft (Imperative voice and concision): 9/10 — Imperatives Save/Publish/Invite/Archive/Remove/Delete; toasts short passive completions; undo isolated in its own field (not appended to toast).
- sub-reasoning (Reasoning quality): 8/10 — Explicitly separates undo into its own field for the two destructives and lists the banned-word scan; notes minimal toast trade-off without inventing entity names.

## Verdict
Clean constraint-compliant microcopy pack: all objective checks pass, undo correctly off-toast, labels and toasts crisp.
