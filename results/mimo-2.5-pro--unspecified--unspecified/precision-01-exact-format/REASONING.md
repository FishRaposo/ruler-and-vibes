# REASONING.md — precision-01-exact-format

## Approach

I processed each record individually, then merged duplicates by email (case-insensitive), keeping the earliest joined date and preferring the record carrying that date for other fields. Sorted final array by email ascending.

## Key decisions

- Record 5 date (07/04/2024): interpreted as M/D/YYYY (July 4) since month ≤ 12.
- Record 10 date (2024-06-31): marked invalid (June has 30 days) → joined: null.
- Record 4 (JOHN.SMITH@ACME.COM): merged with record 1; kept record 1's earlier date and richer data.
- Record 8 (wei.chen@nova.io): merged with record 3; kept record 3's earlier date.

## Trade-offs and limitations

- Date format disambiguation for 07/04/2024 could reasonably be April 7 in D/M locales. Documented the choice.

## Files read

- tests/instruction-following/precision-01-exact-format.md
