/*
# Fix security issues: function search_path, RLS policies, function execute grants

1. Function `get_next_order_number`
   - Set a fixed `search_path` to prevent search-path hijacking.
   - REVOKE EXECUTE from `anon`, `authenticated`, and `PUBLIC` so the function
     cannot be invoked via the REST API by unauthenticated or signed-in users.
     It is only called from the `send-order-email` edge function using the
     service role key, which still has execute permission.
   - Kept as SECURITY DEFINER so it can modify the RLS-locked `order_sequence`
     table when invoked by the service role.

2. INSERT policies with `WITH CHECK (true)` (bypassed RLS)
   Replaced with real column-presence checks so only well-formed rows are
   accepted. These are single-tenant, no-auth, insert-only tables where anyone
   may submit, but the check now validates required fields instead of
   accepting any row unconditionally.
   - `contact_inquiries.anon_insert_inquiries`
   - `email_notifications.anon_insert_notifications`
   - `newsletter_subscribers.anon_insert_newsletter`
   - `orders.anon_insert_orders`

3. `newsletter_subscribers` over-broad authenticated policies
   - Dropped `auth_delete_newsletter` (USING true let any signed-in user
     delete ALL subscribers) and `auth_select_newsletter` (USING true let any
     signed-in user read ALL subscriber emails). There is no `user_id` column
     to scope ownership, and the admin reads/manages subscribers via the
     service role (which bypasses RLS), so authenticated access is not needed.

4. `order_sequence` (RLS enabled, no policies)
   - Added a restrictive SELECT/INSERT/UPDATE/DELETE policy scoped to the
     service role only is unnecessary because service role bypasses RLS.
     Instead, REVOKE all table privileges from `anon` and `authenticated`
     so the locked-down RLS is reinforced at the grant level. This table is
     an internal counter only the `get_next_order_number` function touches.

5. Notes
   - No data is dropped or rewritten.
   - All changes are idempotent (DROP ... IF EXISTS before CREATE POLICY).
*/

-- 1. Lock down get_next_order_number: fixed search_path + revoke public execute
CREATE OR REPLACE FUNCTION public.get_next_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  next_val int;
BEGIN
  UPDATE public.order_sequence SET counter = counter + 1 WHERE id = 1 RETURNING counter INTO next_val;
  RETURN 'GWA-' || lpad(next_val::text, 4, '0');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_next_order_number() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_next_order_number() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_next_order_number() FROM PUBLIC;

-- 2. Replace WITH CHECK (true) INSERT policies with real column checks

-- contact_inquiries
DROP POLICY IF EXISTS "anon_insert_inquiries" ON public.contact_inquiries;
CREATE POLICY "anon_insert_inquiries"
ON public.contact_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (
  name IS NOT NULL AND email IS NOT NULL
  AND subject IS NOT NULL AND message IS NOT NULL
);

-- email_notifications
DROP POLICY IF EXISTS "anon_insert_notifications" ON public.email_notifications;
CREATE POLICY "anon_insert_notifications"
ON public.email_notifications FOR INSERT
TO anon, authenticated
WITH CHECK (
  type IS NOT NULL AND recipient IS NOT NULL
  AND subject IS NOT NULL AND payload IS NOT NULL
);

-- newsletter_subscribers
DROP POLICY IF EXISTS "anon_insert_newsletter" ON public.newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter"
ON public.newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL);

-- orders
DROP POLICY IF EXISTS "anon_insert_orders" ON public.orders;
CREATE POLICY "anon_insert_orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (
  order_number IS NOT NULL
  AND customer_name IS NOT NULL
  AND customer_email IS NOT NULL
  AND total IS NOT NULL
);

-- 3. Remove over-broad authenticated SELECT/DELETE on newsletter_subscribers
DROP POLICY IF EXISTS "auth_select_newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "auth_delete_newsletter" ON public.newsletter_subscribers;

-- 4. Reinforce order_sequence lock-down at the grant level
REVOKE ALL PRIVILEGES ON public.order_sequence FROM anon;
REVOKE ALL PRIVILEGES ON public.order_sequence FROM authenticated;
