## Approach
Read the full changelog, identified every Export-module bug fix, every completed maintenance window, and every autosave.interval value change. Tracked the one reverted fix. Excluded the Year in Review section and the cancelled maintenance window per their own descriptions.

## Key decisions
Counted only bug fixes explicitly labeled "Export module:" — the v2.8 GIF export fixes are not labeled "Export module:" and the GIF exporter itself was new in v2.8, so I excluded them from that specific count. Counted v2.4.1's maintenance downtime even though it's listed out of chronological order (the question asks for all releases, and the downtime actually occurred). The v2.1 autosave.interval text introduces the setting for the first time so it's not a "change from a previous value."

## Trade-offs and limitations
The definition of "Export-module bug fix" could reasonably include the GIF export fixes introduced in v2.8 (both involve export functionality), but since they lack the "Export module:" label that every other export fix uses consistently, I excluded them for precision and noted them in the Excluded line.

## Files read
- tests/long-context/context-02-changelog-tally.md
