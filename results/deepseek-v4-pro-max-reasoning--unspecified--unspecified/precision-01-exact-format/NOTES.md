## Approach
Parsed 10 source records, normalized each field per the schema, resolved duplicates by email (case-insensitive merge), sorted by email ascending.

## Key decisions
- Record 4 (JOHN.SMITH@ACME.COM) merged with record 1 (John Smith): record 1 has the earliest joined date (2024-03-14) so its values are preferred.
- Record 8 (wei chen, WEI.CHEN@NOVA.IO) merged with record 3 (Wei Chen, wei.chen@nova.io): record 3 has earlier joined (Jan 5 2024 vs Feb 11 2024), so record 3's values preferred for non-phone. Phone from record 3 is "+1 (555) 010-2233" (digits: 15550102233).
- Record 10 (sofia rossi, joined 2024-06-31): June has 30 days; June 31 is an invalid date → joined = null.
- Date format resolutions: "3/14/2024" → 2024-03-14 (M/D/Y), "2024-01-30" → 2024-01-30 (ISO), "Jan 5 2024" → 2024-01-05, "07/04/2024" → 2024-07-04 (M/D/Y), "15/02/2024" → 2024-02-15 (D/M/Y, inferred from context: Bob O'Brien in Ireland), "March 2, 2024" → 2024-03-02, "2024-06-31" → null (invalid date).
- Phone normalization: strip all punctuation, keep digits with country code. Record 3's "+1 (555) 010-2233" → "15550102233". Record 1's "555-0101" → "5550101" (no country code present). Record 5's "555.0177" → "5550177".
- Liam Murphy (record 9): no join date → null. No phone → null.
