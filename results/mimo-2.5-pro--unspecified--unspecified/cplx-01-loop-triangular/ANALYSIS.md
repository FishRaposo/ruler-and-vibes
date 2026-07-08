# ANALYSIS

**Closed-form:** steps = n(n+1)/2

**Asymptotic class:** Θ(n²)

**Derivation:** The inner loop runs from j=i to j=n, giving (n−i+1) iterations per outer loop pass. Summing i=1..n of (n−i+1) equals summing k=1..n of k = n(n+1)/2.
