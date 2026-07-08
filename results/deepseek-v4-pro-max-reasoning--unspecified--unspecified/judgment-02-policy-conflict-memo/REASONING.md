## Approach
Mapped out the conflict between DR-12 (purge at 30 days) and AU-3 (retain for 180 days) for an account closed May 20. Calculated all relevant deadlines using the counting convention "N days after D means D + N." Recommended retaining the logs as the reversible choice.

## Key decisions
AU-3 is "effective immediately" and says "no exceptions" — this is a hard conflict with DR-12. I did not declare either policy the winner; instead I escalated with a specific date (June 12) for a decision, one week before DR-12's June 19 purge deadline. The interim recommendation to retain is asymmetric: you can always delete later, but you cannot recover deleted logs.

## Trade-offs and limitations
The privacy-commitment deadline (July 2) falls between the DR-12 and AU-3 deadlines. I recommended not responding to the deletion request until the policy conflict is resolved. This delays the customer's request but avoids committing to an action that may later be determined to violate one of the policies.

## Files read
- tests/professional-judgment/judgment-02-policy-conflict-memo.md
