/*
# Fix customer order history, COD totals, and admin order permissions

1. Modified Table
- `orders.cod_charge` (numeric, not null, default 0) — the one-time COD handling fee stored separately from shipping.
- Existing orders keep their data and receive a zero COD charge by default.

2. New Function
- `get_my_orders()` — returns only orders whose `user_id` equals the currently authenticated user's ID, ordered newest first. It includes the order number, date, items, payment details, COD charge, status, and totals needed by customer order history.

3. Security Changes
- `get_my_orders()` is SECURITY DEFINER with a fixed search path and is callable only by authenticated users.
- Anonymous users cannot call the customer order-history function.
- `admin_update_order_status()` now verifies the authenticated caller is the configured admin email before changing an order.
- Anonymous users cannot execute the admin status-update function.

4. Important Notes
- Guest order tracking continues to use the existing order-number plus email/phone verification function.
- No orders are deleted, renamed, or recreated.
- COD totals are calculated by the order submission function and stored in `cod_charge` and `total`.
*/

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS cod_charge numeric NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION get_my_orders()
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
  cod_charge numeric,
  total numeric,
  coupon text,
  status text,
  payment_method text,
  payment_reference text,
  payment_status text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.id,
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.shipping_address,
    o.items,
    o.subtotal,
    o.discount,
    o.shipping,
    o.cod_charge,
    o.total,
    o.coupon,
    o.status,
    o.payment_method,
    o.payment_reference,
    o.payment_status,
    o.created_at
  FROM orders o
  WHERE o.user_id = auth.uid()
  ORDER BY o.created_at DESC;
$$;

REVOKE ALL ON FUNCTION get_my_orders() FROM PUBLIC;
REVOKE ALL ON FUNCTION get_my_orders() FROM anon;
GRANT EXECUTE ON FUNCTION get_my_orders() TO authenticated;

CREATE OR REPLACE FUNCTION admin_update_order_status(p_order_id uuid, p_status text, p_payment_status text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(COALESCE(auth.jwt() ->> 'email', '')) <> 'sukhadevetilottama1@gmail.com' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE orders SET
    status = p_status,
    payment_status = COALESCE(p_payment_status, payment_status)
  WHERE id = p_order_id;
  RETURN FOUND;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_update_order_status(uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION admin_update_order_status(uuid, text, text) TO authenticated;
