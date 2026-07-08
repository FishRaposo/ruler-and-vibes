## Approach
Transcribed the receipt directly: extracted store name, date (ISO format), three line items in order, and the three numeric totals. The loyalty number "4471-**8-2*9" has two masked/obscured characters: the middle two digits are replaced with asterisks and the second-to-last digit is also an asterisk. Only digits 4,4,7,1,8,2,9 are visible — the card number is not readable in full, so loyalty_number = null.

## Key decisions
The receipt explicitly notes "(card smudged at register)" and the number contains asterisks in place of actual digits. I cannot reconstruct those digits without guessing, and the schema says to use null when the field cannot be read in full. No partial reconstruction.

## Trade-offs and limitations
A human might note "4471-**8-2*9" and identify it as a 12-digit number with two unknown pairs (** and *). But the task says "do not guess, partially reconstruct, or invent any digits" — so null is the only compliant answer.

## Files read
- tests/structured-extraction/extr-01-receipt-fields.md
