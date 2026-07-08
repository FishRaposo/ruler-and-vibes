# REASONING.md — context-02-changelog-tally

## Approach

I read the changelog carefully, tracking each Export-module fix and whether it was reverted. I identified that v2.8 explicitly reverted the v2.6 watermark overlay fix. For maintenance, I excluded the v2.6 cancelled window. For autosave changes, I distinguished between introducing, changing, and merely mentioning the setting.

## Key decisions

- **Export fixes (A):** Counted all Export-module fixes shipped and not reverted. The v2.6 watermark fix was reverted in v2.8, so excluded from the count.
- **Maintenance (B):** Excluded the v2.6 cancelled window (120 min). Included v2.4.1 (25 min) per its chronological position.
- **Autosave changes (C):** v2.1 introduces the setting (doesn't count). v2.3, v2.7, and v3.1 each change the value.
- **Excluded items:** Documented each exclusion with reasoning.

## Trade-offs and limitations

- The v2.4.1 hotfix is listed out of order in the changelog but was released between v2.4 and v2.5 chronologically. I included it in maintenance totals.

## Files read

- tests/long-context/context-02-changelog-tally.md
