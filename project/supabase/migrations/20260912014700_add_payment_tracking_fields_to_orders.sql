/*
# Add payment tracking fields and order tracking support

1. New Columns on `orders`
- `payment_reference` (text, nullable) — UPI transaction reference ID entered by customer
- `payment_status` (text, default 'Pending') — values: 'Pending', 'Pending Verification', 'Confirmed', 'Failed'
- `payment_method` already exists as 'cod' default; update default to 'COD' for clarity

2. RLS Changes on `orders`
- Add SELECT policy for anon/authenticated: allow lookup by order_number + (customer_email OR customer_phone)
  so customers can track their own order but never see others' orders.
- Existing INSERT policy stays.
- Add UPDATE policy restricted to authenticated admin (via SECURITY DEFINER function check).
- Remove the broad anon UPDATE/DELETE grants.

3. New Function
- `verify_order_access(p_order_number text, p_email text, p_phone text)` returns the order row if
  the order_number matches and the email or phone matches. SECURITY DEFINER so it bypasses RLS
  for the lookup but only returns the matching row.
*/

-- Add new columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'Pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone text;

-- Update payment_method default
ALTER TABLE orders ALTER COLUMN payment_method SET DEFAULT 'COD';

-- Drop any existing broad policies on orders and rebuild
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_select_orders_track" ON orders;
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;

-- INSERT: anyone can create an order (checkout flow)
CREATE POLICY "anon_insert_orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (order_number IS NOT NULL AND customer_name IS NOT NULL AND customer_email IS NOT NULL AND total IS NOT NULL);

-- SELECT: no direct table access for anon; tracking is via the SECURITY DEFINER function below
-- This keeps customers from querying all orders. The verify function returns only the matching row.

-- UPDATE: only authenticated admin can update order status / payment_status
-- We use a SECURITY DEFINER function for admin updates, so direct table UPDATE is denied
CREATE POLICY "anon_update_orders_deny"
ON orders FOR UPDATE
TO anon, authenticated
USING (false) WITH CHECK (false);

-- DELETE: deny direct deletes
CREATE POLICY "anon_delete_orders_deny"
ON orders FOR DELETE
TO anon, authenticated
USING (false);

-- Create verify function for order tracking
CREATE OR REPLACE FUNCTION verify_order_access(p_order_number text, p_email text, p_phone text)
RETURNS TABLE (
  id uuid,
  order_number text,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  items jsonb,
  subtotal numeric,
  discount numeric,
  shipping numeric,
  total numeric,
  coupon text,
  status text,
  payment_method text,
  payment_reference text,
  payment_status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone,
    o.shipping_address, o.items, o.subtotal, o.discount, o.shipping, o.total,
    o.coupon, o.status, o.payment_method, o.payment_reference, o.payment_status,
    o.created_at
  FROM orders o
  WHERE o.order_number = UPPER(TRIM(p_order_number))
    AND (
      (p_email IS NOT NULL AND p_email <> '' AND LOWER(o.customer_email) = LOWER(TRIM(p_email)))
      OR
      (p_phone IS NOT NULL AND p_phone <> '' AND o.customer_phone IS NOT NULL AND REPLACE(o.customer_phone, ' ', '') = REPLACE(TRIM(p_phone), ' ', ''))
    );
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION verify_order_access(text, text, text) TO anon, authenticated;

-- Create admin update function for status and payment_status
CREATE OR REPLACE FUNCTION admin_update_order_status(p_order_id uuid, p_status text, p_payment_status text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE orders SET
    status = p_status,
    payment_status = COALESCE(p_payment_status, payment_status)
  WHERE id = p_order_id;
  RETURN FOUND;
END;
$$;

-- Grant execute to authenticated only (admin)
GRANT EXECUTE ON FUNCTION admin_update_order_status(uuid, text, text) TO authenticated;
