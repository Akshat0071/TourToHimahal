-- Add Cloudinary public_id to media table for reliable Cloudinary deletions
-- Run this in Supabase SQL editor or via your migration process.

ALTER TABLE media
ADD COLUMN IF NOT EXISTS public_id TEXT;

CREATE INDEX IF NOT EXISTS idx_media_public_id ON media(public_id);
