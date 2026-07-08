# REASONING.md — extr-01-receipt-fields

## Approach

I transcribed each field from the scanned receipt, matching the schema exactly. The loyalty number field was smudged ("4471-**8-2*9") with two unreadable digit positions, so I set it to null per the instruction not to guess.

## Key decisions

- loyalty_number: null because two digits are obscured by smudging and cannot be read in full.
- Item descriptions extracted without prices, as specified in the schema.

## Trade-offs and limitations

- None — the receipt is clear except for the loyalty number.

## Files read

- tests/structured-extraction/extr-01-receipt-fields.md
