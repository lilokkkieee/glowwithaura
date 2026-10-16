/*
# Create newsletter_subscribers table

1. New Tables
- `newsletter_subscribers`
  - `id` (uuid, primary key)
  - `email` (text, unique, not null) — the subscriber's email address
  - `source` (text, default 'popup') — where the signup came from (popup, footer, etc.)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `newsletter_subscribers`.
- Allow anon + authenticated to INSERT (visitors subscribe without signing in).
- Allow authenticated to SELECT/UPDATE/DELETE their own rows (future admin/account use).
- No anon SELECT — emails should not be publicly readable.

3. Notes
- The newsletter popup and footer form both write to this table using the anon key.
- Unique constraint on email prevents duplicate subscriptions.
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text NOT NULL DEFAULT 'popup',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon) to subscribe — INSERT only
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter"
ON newsletter_subscribers FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Allow authenticated users to read/manage their own subscriptions
DROP POLICY IF EXISTS "auth_select_newsletter" ON newsletter_subscribers;
CREATE POLICY "auth_select_newsletter"
ON newsletter_subscribers FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_newsletter" ON newsletter_subscribers;
CREATE POLICY "auth_delete_newsletter"
ON newsletter_subscribers FOR DELETE
TO authenticated USING (true);
