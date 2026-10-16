/*
# Create order number sequence function

1. New Functions
- `get_next_order_number()` — returns the next sequential order number
  in the format GWA-0001, GWA-0002, etc. Uses a sequence stored in a
  helper table to track the current count.

2. New Tables
- `order_sequence` — single-row table that stores the current order counter.
  Only the service role key (used by edge functions) can read/write this.

3. Security
- Enable RLS on `order_sequence`.
- No policies — only the service role key (which bypasses RLS) can access it.
*/

CREATE TABLE IF NOT EXISTS order_sequence (
  id int PRIMARY KEY DEFAULT 1,
  counter int NOT NULL DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO order_sequence (id, counter) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE order_sequence ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_val int;
BEGIN
  UPDATE order_sequence SET counter = counter + 1 WHERE id = 1 RETURNING counter INTO next_val;
  RETURN 'GWA-' || lpad(next_val::text, 4, '0');
END;
$$;
