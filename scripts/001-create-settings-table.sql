-- Create settings table if not exists
-- This script creates a key-value settings table for storing site configuration

-- Check if settings table already exists and has the old structure
DO $$
BEGIN
  -- If the table exists with a 'key' column, we're good
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'settings' 
    AND column_name = 'key'
  ) THEN
    RAISE NOTICE 'Settings table already has correct structure';
  ELSE
    -- Drop the old structure if it exists with different columns
    DROP TABLE IF EXISTS settings CASCADE;
    
    -- Create the settings table with key-value structure
    CREATE TABLE settings (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      key text UNIQUE NOT NULL,
      value jsonb NOT NULL,
      updated_at timestamp with time zone DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

    -- Create policies for settings
    CREATE POLICY "Admins can view settings" ON settings
      FOR SELECT USING (true);

    CREATE POLICY "Admins can insert settings" ON settings
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_profiles WHERE id = auth.uid()
        )
      );

    CREATE POLICY "Admins can update settings" ON settings
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM admin_profiles WHERE id = auth.uid()
        )
      );

    RAISE NOTICE 'Settings table created successfully';
  END IF;
END $$;

-- Insert default settings if they don't exist
INSERT INTO settings (key, value) VALUES
  ('site_name', '"TourToHimachal"'),
  ('contact_email', '"info@tourtohimachal.com"'),
  ('contact_phone', '"+91 98765 43210"'),
  ('whatsapp_number', '"+919876543210"'),
  ('address', '"Near Temple Complex, Chintpurni, HP 177106"'),
  ('google_maps_embed', '""'),
  ('facebook_url', '""'),
  ('instagram_url', '""'),
  ('twitter_url', '""'),
  ('youtube_url', '""'),
  ('business_hours', '"Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM"'),
  ('about_text', '"Your trusted partner for exploring the majestic Himachal Pradesh. From spiritual journeys to adventure trips, we make your travel dreams come true."'),
  ('meta_title', '"TourToHimachal - Tours, Travel Packages & Taxi Services"'),
  ('meta_description', '"Discover the magic of Himachal Pradesh with our curated tour packages, reliable taxi services, and personalized travel experiences."'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;
