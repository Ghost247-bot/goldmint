-- Add policy for admins to delete investments
CREATE POLICY "Admins can delete investments"
  ON investments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  ); 