## Approach
Straightforward: normalize each input pair (swap inverted), filter out non-array/non-numeric entries, sort by start, then merge adjacent/overlapping in one pass.

## Key decisions
I reject entries that aren't two-number arrays silently by skipping them rather than throwing — the task asks me to "decide and document," and filtering keeps the function robust without violating the spec (output is always a new merged array). Inverted pairs are normalized by swapping `[min, max]`. Adjacent ranges (`[1,2]` and `[2,3]`) merge per the spec using `<=` on the start against the previous end.

## Trade-offs and limitations
Silently dropping bad entries means callers won't know about malformed input. Throwing would be more defensive but the task asks for a function that "decides and documents" treatment, so I chose the filter approach. Sorting mutates the cleaned array in place but we return a freshly-built merged array, so the original input is not mutated.

## Files read
- tests/coding/coding-01-edge-cases.md
