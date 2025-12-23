-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '"919876543210"'),
  ('business_phone', '"+91 98765 43210"'),
  ('business_email', '"info@himachalyatra.com"'),
  ('business_address', '{"street": "Near Temple Complex", "city": "Chintpurni", "state": "Himachal Pradesh", "pincode": "177106"}'::jsonb),
  ('office_hours', '{"weekdays": "9:00 AM - 7:00 PM", "saturday": "9:00 AM - 5:00 PM", "sunday": "10:00 AM - 4:00 PM"}'::jsonb),
  ('auto_reply_text', '"Thank you for contacting TourToHimachal! We have received your inquiry and will respond within 12 hours."'),
  ('seo_defaults', '{"title_suffix": " | Himachal Yatra", "default_description": "Discover Himachal Pradesh with curated tour packages and reliable taxi services."}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (name, type, capacity, luggage_capacity, features, base_fare, per_km_rate) VALUES
  ('Swift Dzire', 'sedan', 4, 2, ARRAY['AC', 'Music System', 'First Aid Kit'], 1500, 12),
  ('Toyota Innova', 'suv', 6, 4, ARRAY['AC', 'Music System', 'First Aid Kit', 'Spacious'], 2500, 16),
  ('Tempo Traveller', 'tempo', 12, 8, ARRAY['AC', 'Music System', 'First Aid Kit', 'Push Back Seats'], 4000, 22),
  ('Maruti Ertiga', 'mpv', 6, 3, ARRAY['AC', 'Music System', 'First Aid Kit'], 2000, 14)
ON CONFLICT DO NOTHING;

-- Insert sample routes
INSERT INTO taxi_routes (from_location, to_location, distance_km, estimated_time, base_fare) VALUES
  ('Chandigarh', 'Shimla', 120, '4 hours', 2500),
  ('Chandigarh', 'Manali', 310, '8 hours', 5500),
  ('Delhi', 'Shimla', 350, '8 hours', 6000),
  ('Delhi', 'Manali', 540, '12 hours', 9000),
  ('Shimla', 'Manali', 250, '7 hours', 4500),
  ('Chandigarh', 'Dharamshala', 250, '6 hours', 4500),
  ('Chandigarh', 'Chintpurni', 100, '3 hours', 2000)
ON CONFLICT DO NOTHING;
