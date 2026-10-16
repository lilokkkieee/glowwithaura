/*
# Create custom_candle_requests table

1. Purpose
   Stores customer requests for custom/bespoke candles. Each row captures
   the customer's contact details plus their customization choices (candle
   type, fragrance preference, color, size, quantity, and any free-form notes).

2. New Tables
   - `custom_candle_requests`
     - `id` (uuid, primary key)
     - `name` (text, not null) — customer's full name
     - `email` (text, not null) — customer's email for follow-up
     - `phone` (text, nullable) — optional phone number
     - `candle_type` (text, not null) — e.g. Pillar, Jar, Votive, Taper, Tealight
     - `fragrance_type` (text, not null) — e.g. Floral, Woody, Citrus, Custom
     - `fragrance_details` (text, nullable) — specific fragrance notes the customer wants
     - `color` (text, not null) — desired candle color
     - `size` (text, not null) — e.g. Small, Medium, Large
     - `quantity` (integer, not null, default 1) — number of candles requested
     - `notes` (text, nullable) — any additional custom details from the customer
     - `status` (text, not null, default 'pending') — request processing status
     - `created_at` (timestamptz, default now())

3. Security
   - Enable RLS on `custom_candle_requests`.
   - Allow anon + authenticated INSERT so any visitor can submit a custom request.
   - No SELECT/UPDATE/DELETE for anon or authenticated — only the owner (via service role / admin) reads these.
*/

CREATE TABLE IF NOT EXISTS custom_candle_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  candle_type text NOT NULL,
  fragrance_type text NOT NULL,
  fragrance_details text,
  color text NOT NULL,
  size text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_candle_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_custom_candle" ON custom_candle_requests;
CREATE POLICY "anon_insert_custom_candle" ON custom_candle_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_custom_candle" ON custom_candle_requests;
CREATE POLICY "anon_select_custom_candle" ON custom_candle_requests FOR SELECT
  TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "anon_update_custom_candle" ON custom_candle_requests;
CREATE POLICY "anon_update_custom_candle" ON custom_candle_requests FOR UPDATE
  TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "anon_delete_custom_candle" ON custom_candle_requests;
CREATE POLICY "anon_delete_custom_candle" ON custom_candle_requests FOR DELETE
  TO anon, authenticated USING (false);
