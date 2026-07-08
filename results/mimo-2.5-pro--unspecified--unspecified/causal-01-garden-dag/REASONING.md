# REASONING.md — causal-01-garden-dag

## Approach

I traced each path in the DAG to answer the d-separation and confounding questions. For the numerical verification, I used the law of total probability to marginalize over S.

## Key decisions

- For (c), chose {K} as the minimal adjustment set because it blocks the backdoor path R ← S → K → W at a single node. S would also work but is less precise (blocks at a higher level).
- For (d), identified W as a collider on R → W ← K based on the converging arrowheads.

## Trade-offs and limitations

- Did not compute P(W=1) or P(P=1) since only four values were requested.

## Files read

- tests/causal-reasoning/causal-01-garden-dag.md
