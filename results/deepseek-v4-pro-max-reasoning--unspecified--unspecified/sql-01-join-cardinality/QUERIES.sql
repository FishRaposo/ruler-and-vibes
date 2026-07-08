-- Assume the schema is already loaded. Run against SQLite.

-- Q1: Total number of customers
SELECT COUNT(*) AS total_customers FROM customer;

-- Q2: Number of customers who have placed at least one order
SELECT COUNT(DISTINCT customer_id) AS customers_with_orders FROM ord;

-- Q3: Per-customer order count (all 5 customers, zero-order show 0)
SELECT c.id, c.name, COUNT(o.id) AS order_count
FROM customer c
LEFT JOIN ord o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Q4: Per-customer total spend (all 5 customers, zero-order show 0)
SELECT c.id, c.name, COALESCE(SUM(o.amount), 0) AS total_spend
FROM customer c
LEFT JOIN ord o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY c.id;
