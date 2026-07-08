-- Schema and data
CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  name TEXT,
  region TEXT
);

CREATE TABLE ord (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount INTEGER
);

INSERT INTO customer (id, name, region) VALUES
  (1, 'Ash', 'North'),
  (2, 'Bo', 'North'),
  (3, 'Cy', 'South'),
  (4, 'Di', 'South'),
  (5, 'El', 'West');

INSERT INTO ord (id, customer_id, amount) VALUES
  (101, 1, 50),
  (102, 1, 50),
  (103, 1, 30),
  (104, 2, 40),
  (105, 3, 20),
  (106, 3, 20),
  (107, 3, 60);

-- Q1: Total number of customers
SELECT COUNT(*) AS total_customers FROM customer;

-- Q2: Number of customers with at least one order
SELECT COUNT(DISTINCT customer_id) AS customers_with_orders FROM ord;

-- Q3: Per-customer order count (all 5 customers)
SELECT c.id, c.name, COUNT(o.id) AS order_count
FROM customer c
LEFT JOIN ord o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Q4: Per-customer total spend (all 5 customers)
SELECT c.id, c.name, COALESCE(SUM(o.amount), 0) AS total_spend
FROM customer c
LEFT JOIN ord o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY c.id;
