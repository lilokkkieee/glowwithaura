/*
# Create contact_inquiries table

1. Purpose
- Stores customer inquiries and complaints submitted via the Contact page.
- Each row captures the customer's name, email, phone, subject, and message.
- This is a single-tenant (no-auth) table: any visitor can submit an inquiry,
  and the store owner reads them via the Supabase dashboard or an edge function.

2. New Tables
- `contact_inquiries`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — submitter's full name
  - `email` (text, not null) — submitter's email address
  - `phone` (text, nullable) — submitter's phone number
  - `subject` (text, not null) — inquiry subject line
  - `message` (text, not null) — the inquiry body
  - `created_at` (timestamptz, default now()) — submission timestamp

3. Security
- Enable RLS on `contact_inquiries`.
- Allow `anon` + `authenticated` to INSERT (visitors submit forms without signing in).
- No SELECT/UPDATE/DELETE for anon or authenticated — only the service role
  (used by edge functions) can read inquiries. This keeps customer messages
  private to the store owner.
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_inquiries" ON contact_inquiries;
CREATE POLICY "anon_insert_inquiries"
ON contact_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies: only the service role bypasses RLS.
