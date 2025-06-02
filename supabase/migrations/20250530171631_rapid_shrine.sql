-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS security_settings 
DROP CONSTRAINT IF EXISTS security_settings_user_id_fkey;

-- Add new foreign key referencing profiles
ALTER TABLE security_settings
ADD CONSTRAINT security_settings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id);

-- Update existing data to ensure referential integrity
DELETE FROM security_settings
WHERE user_id NOT IN (SELECT id FROM profiles);

-- Allow service_role to read all profiles for admin dashboard stats
CREATE POLICY IF NOT EXISTS "Service role can read all profiles"
  ON public.profiles
  FOR SELECT
  TO service_role
  USING (true);