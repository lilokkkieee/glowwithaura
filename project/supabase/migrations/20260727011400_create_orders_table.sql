/*
# Create orders table to store all customer order details

1. New Tables
- `orders` — stores every order placed on the store with full customer
  and order details so the owner can see them in the admin dashboard.
- `id` (uuid, primary key)
- `order_number` (text, unique — human-readable order ID like GWA-0001)
- `customer_name` (text)
- `customer_email` (text)
- `customer_phone` (text, nullable)
- `shipping_address` (text, nullable)
- `items` (jsonb — array of {name, quantity, price, fragrance})
- `subtotal` (numeric)
- `discount` (numeric, default 0)
- `shipping` (numeric, default 0)
- `total` (numeric)
- `coupon` (text, nullable)
- `status` (text, default 'pending' — pending, processing, shipped, delivered, cancelled)
- `user_id` (uuid, nullable — links to auth.users if customer was logged in)
- `created_at` (timestamp)

2. Security
- Enable RLS on `orders`.
- Allow anon + authenticated INSERT (edge function uses service role key which
  bypasses RLS, but this covers anon-key calls too).
- No SELECT/UPDATE/DELETE for anon or authenticated — only the admin dashboard
  (via edge function with service role key) can read orders.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  shipping numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  coupon text,
  status text NOT NULL DEFAULT 'pending',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);
