-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS addresses 
DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;

-- Add new foreign key referencing profiles
ALTER TABLE addresses
ADD CONSTRAINT addresses_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id);

-- Update existing data to ensure referential integrity
DELETE FROM addresses
WHERE user_id NOT IN (SELECT id FROM profiles);