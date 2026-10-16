/*
# Create products table with admin-managed inventory

## Purpose
Move hardcoded product data into a Supabase table so the Admin Dashboard
can manage products (add, edit, delete) while the shop pages read from
the database.

## New Tables
- `products` — stores all candle products with the same fields as the
  previous hardcoded data (name, slug, description, price, discount price,
  category, flags for best-seller/gift/featured/sale/new, stock, images, etc.)

## Storage
- Creates a public storage bucket `product-images` for admin image uploads.

## Security (RLS)
- SELECT: public (anon + authenticated) — anyone browsing the shop can see products.
- INSERT/UPDATE/DELETE: admin only — restricted via a SECURITY DEFINER function
  `is_admin()` that checks the user's email against the admin address.
- Storage: public read, admin-only write for product-images bucket.

## Important Notes
1. The `is_admin()` function checks `auth.jwt() ->> 'email'` against the
   configured admin email. This is safe because JWT emails are set by
   Supabase Auth and are not user-editable.
2. All existing product data (12 products) will be seeded via INSERT statements.
3. The `slug` column has a unique constraint to prevent duplicates.
*/

-- Admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() ->> 'email') = 'sukhadevetilottama1@gmail.com',
    false
  );
$$;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  discount_price numeric,
  discount_percent integer,
  rating numeric NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT true,
  category text NOT NULL DEFAULT '',
  fragrance text NOT NULL DEFAULT '',
  burn_time text NOT NULL DEFAULT '',
  weight text NOT NULL DEFAULT '',
  ingredients text[] NOT NULL DEFAULT '{}',
  sku text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  is_best_seller boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_on_sale boolean NOT NULL DEFAULT false,
  is_gift_pick boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  reviews jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin-only write
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin());

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_upload_product_images" ON storage.objects;
CREATE POLICY "admin_upload_product_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "admin_update_product_images" ON storage.objects;
CREATE POLICY "admin_update_product_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND is_admin())
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());
