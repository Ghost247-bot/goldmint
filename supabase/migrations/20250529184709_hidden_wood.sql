-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  product_id uuid NOT NULL REFERENCES products(id),
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can insert own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can delete own wishlist" ON wishlist;

-- Create policies for wishlist
CREATE POLICY "Users can read own wishlist"
  ON wishlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist"
  ON wishlist
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist"
  ON wishlist
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);