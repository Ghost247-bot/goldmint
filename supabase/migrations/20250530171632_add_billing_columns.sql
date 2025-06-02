-- Add billing address columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS billing_address text,
ADD COLUMN IF NOT EXISTS billing_city text,
ADD COLUMN IF NOT EXISTS billing_state text,
ADD COLUMN IF NOT EXISTS billing_zip text,
ADD COLUMN IF NOT EXISTS billing_country text,
ADD COLUMN IF NOT EXISTS billing_first_name text,
ADD COLUMN IF NOT EXISTS billing_last_name text;

-- Add comment to explain the columns
COMMENT ON COLUMN orders.billing_address IS 'Billing street address';
COMMENT ON COLUMN orders.billing_city IS 'Billing city';
COMMENT ON COLUMN orders.billing_state IS 'Billing state/province';
COMMENT ON COLUMN orders.billing_zip IS 'Billing postal/zip code';
COMMENT ON COLUMN orders.billing_country IS 'Billing country';
COMMENT ON COLUMN orders.billing_first_name IS 'Billing first name';
COMMENT ON COLUMN orders.billing_last_name IS 'Billing last name'; 