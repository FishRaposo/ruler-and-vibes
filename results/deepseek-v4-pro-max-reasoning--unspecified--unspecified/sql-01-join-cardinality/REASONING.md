## Approach
Used LEFT JOIN from customer to ord for Q3 and Q4 to preserve zero-order customers, with COALESCE to convert NULL to 0. Q1 is a simple COUNT on customer. Q2 uses COUNT DISTINCT on ord's customer_id.

## Key decisions
SQLite dialect used throughout. The LEFT JOIN is the standard approach for preserving all rows from the left table while joining optional data from the right. COALESCE(SUM(...), 0) handles the case where SUM returns NULL for customers with no matching orders.

## Trade-offs and limitations
The queries assume the data fits the schema exactly as given. No indexes or performance considerations needed at this scale.

## Files read
- tests/sql-reasoning/sql-01-join-cardinality.md
