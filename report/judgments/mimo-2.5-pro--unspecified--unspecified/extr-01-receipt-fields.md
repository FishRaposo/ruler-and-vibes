# extr-01-receipt-fields — mimo-2.5-pro--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary "zinnia dahlia".

## Objective checks
- obj-1 (exact 7 keys, single object): PASS — keys match schema exactly
- obj-2 (loyalty_number === null): PASS — JSON null, not a partial string
- obj-3 (store_name, date, items): FAIL — store_name is "NORTHGATE PANTRY" not "Northgate Pantry"
- obj-4 (subtotal/tax/total numbers): PASS — 43, 4.3, 47.3 numeric

## Subjective criteria
- sub-quality (Transcription fidelity): 6/10 — items and date exact, but left store header in ALL CAPS against the explicit standard-capitalization rule
- sub-craft (Schema conformance & null discipline): 9/10 — seven keys only, numbers as numbers, loyalty null not "4471-**8-2*9"
- sub-reasoning (Reasoning quality): 7/10 — explains loyalty null via smudge, but miscounts "two" unreadable positions (three asterisks) and never mentions the store-name casing rule

## Verdict
Null discipline on the smudged loyalty field is solid; the only hard miss is store_name casing, which fails obj-3.
