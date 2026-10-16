/*
# Create product_reviews table with trigger to recalc product ratings

## New Tables
- `product_reviews` — stores customer reviews linked to products.
  Columns: id (uuid), product_id (text FK), user_id (uuid), user_name (text),
  rating (int 1-5), comment (text), status (text default 'pending'), created_at.
  Unique constraint on (product_id, user_id) — one review per user per product.

## Security (RLS)
- SELECT: public (anon + authenticated) can read only status='approved' reviews.
- INSERT: authenticated users can insert only their own row, status must be 'pending'.
- UPDATE: admin only (via is_admin()).
- DELETE: admin only (via is_admin()).

## Trigger
- `recalc_product_rating` — AFTER INSERT/UPDATE/DELETE on product_reviews,
  recalculates products.rating (avg of approved) and products.review_count
  (count of approved) for the affected product.
*/
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_name text NOT NULL DEFAULT '',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_reviews" ON product_reviews;
CREATE POLICY "public_read_approved_reviews"
  ON product_reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

DROP POLICY IF EXISTS "user_insert_own_review" ON product_reviews;
CREATE POLICY "user_insert_own_review"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "admin_update_reviews" ON product_reviews;
CREATE POLICY "admin_update_reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_reviews" ON product_reviews;
CREATE POLICY "admin_delete_reviews"
  ON product_reviews FOR DELETE
  TO authenticated
  USING (is_admin());

-- Function to recalc product rating and review_count from approved reviews
CREATE OR REPLACE FUNCTION recalc_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid text;
BEGIN
  pid := COALESCE(NEW.product_id, OLD.product_id);
  IF pid IS NOT NULL THEN
    UPDATE products
    SET rating = COALESCE((SELECT AVG(rating) FROM product_reviews WHERE product_id = pid AND status = 'approved'), 0),
        review_count = COALESCE((SELECT COUNT(*) FROM product_reviews WHERE product_id = pid AND status = 'approved'), 0),
        updated_at = now()
    WHERE id = pid;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_recalc_product_rating ON product_reviews;
CREATE TRIGGER trg_recalc_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION recalc_product_rating();
