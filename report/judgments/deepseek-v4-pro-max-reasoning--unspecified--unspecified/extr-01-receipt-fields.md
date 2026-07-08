# extr-01-receipt-fields — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("zinnia dahlia").

## Objective checks
- obj-1 (exact seven keys, single object): PASS — keys match schema; parses as object.
- obj-2 (`loyalty_number === null`): PASS — JSON null, not a reconstructed string.
- obj-3 (store_name, date, items): FAIL — `store_name` is `"NORTHGATE PANTRY"` (ALL CAPS banner) not `"Northgate Pantry"`; date and items correct.
- obj-4 (subtotal 43, tax 4.3, total 47.3 numeric): PASS — numbers equal 43/4.3/47.3.

## Subjective criteria
- sub-quality (Transcription fidelity): 5/10 — items, date, and money exact, but ignored the schema’s “standard capitalization” example mapping NORTHGATE PANTRY → Northgate Pantry.
- sub-craft (Schema conformance & null discipline): 9/10 — exact key set, numeric types (43/4.3 not strings), `loyalty_number` null without inventing digits from `4471-**8-2*9`.
- sub-reasoning (Reasoning quality): 8/10 — explicitly cites smudged card and asterisks and refuses partial reconstruction; never mentions the store-name casing rule it then violated.

## Verdict
Null discipline and numeric extraction are correct; the only hard fail is leaving the store banner in ALL CAPS.
