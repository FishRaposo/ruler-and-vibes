## Approach
Encoded the CPTs from the task, computed marginal probabilities P(R=1) and P(K=1) via the law of total probability, computed joint P(R=1 and K=1) using conditional independence given S, and compared against the product to demonstrate that P(R and K) ≠ P(R)*P(K), confirming marginal dependence.

## Key decisions
The CPTs specify that R and K are generated independently given S, so P(R,K|S) = P(R|S)P(K|S). This is used to compute the joint without needing a full 2×2×2 enumeration table.

## Files read
- tests/causal-reasoning/causal-01-garden-dag.md
