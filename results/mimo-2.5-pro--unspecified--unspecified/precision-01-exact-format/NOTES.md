# Notes

## Date format resolutions

- **Record 1** (3/14/2024): M/D/YYYY format → 2024-03-14. Unambiguous (month ≤ 12).
- **Record 2** (2024-01-30): ISO format → 2024-01-30.
- **Record 3** (Jan 5 2024): Named month → 2024-01-05.
- **Record 4** (2024-03-20): ISO format → 2024-03-20.
- **Record 5** (07/04/2024): M/D/YYYY → 2024-07-04. Could be read as D/M/YYYY (April 7), but 07 ≤ 12 and the user's locale isn't specified; M/D/YYYY is the more common US convention for slash-separated dates. Documented judgment call.
- **Record 6** (15/02/2024): D/M/YYYY → 2024-02-15. Month (02) ≤ 12; day (15) > 12, so D/M is the only valid reading.
- **Record 7** (March 2, 2024): Named month → 2024-03-02.
- **Record 8** (2024-02-11): ISO format → 2024-02-11.
- **Record 10** (2024-06-31): **Invalid** — June has only 30 days. Set `joined: null` per the rule that dates that cannot exist are invalid.

## Duplicate merges

- **John Smith** (records 1 and 4): Same email `john.smith@acme.com`. Record 1 has joined 2024-03-14, record 4 has 2024-03-20. Kept earlier date (2024-03-14). Used record 1's name ("John Smith") and phone ("5550101") since record 4 has neither.
- **Wei Chen** (records 3 and 8): Same email `wei.chen@nova.io`. Record 3 has joined 2024-01-05, record 8 has 2024-02-11. Kept earlier date (2024-01-05). Used record 3's name ("Wei Chen") and phone ("15550102223" → kept as "15550102233").

## Other notes

- **Record 9** (Liam Murphy): No join date provided. Set `joined: null`.
- **Record 5** (Fatima Al-Sayed): Phone "555.0177" stripped to digits "5550177".
- **Record 3** (Chen, Wei): Name reversed from "Chen, Wei" to "Wei Chen". Phone "+1 (555) 010-2233" → "15550102233".
- **Record 6** (bob o'brien): Name capitalized to "Bob O'Brien".
