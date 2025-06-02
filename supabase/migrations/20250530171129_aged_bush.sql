-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS payment_methods 
DROP CONSTRAINT IF EXISTS payment_methods_user_id_fkey;

-- Add new foreign key referencing profiles
ALTER TABLE payment_methods
ADD CONSTRAINT payment_methods_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id);

-- Update existing data to ensure referential integrity
DELETE FROM payment_methods
WHERE user_id NOT IN (SELECT id FROM profiles);