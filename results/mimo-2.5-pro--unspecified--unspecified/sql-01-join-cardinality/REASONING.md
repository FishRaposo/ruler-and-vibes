# REASONING.md — sql-01-join-cardinality

## Approach

I wrote LEFT JOIN queries for Q3 and Q4 to ensure all 5 customers appear, using COUNT(o.id) which returns 0 for unmatched rows, and COALESCE(SUM(o.amount), 0) to convert NULL to 0 for zero-order customers.

## Key decisions

- Used LEFT JOIN from customer to ord, ensuring zero-order customers (Di, El) are included.
- COUNT(o.id) rather than COUNT(*) because COUNT(*) counts the customer row even with no matching orders.
- COALESCE(SUM(...), 0) to replace NULL with 0 for customers with no orders.

## Trade-offs and limitations

- None — the queries are straightforward given the schema.

## Files read

- tests/sql-reasoning/sql-01-join-cardinality.md
