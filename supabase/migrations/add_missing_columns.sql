-- Add missing columns to quote_requests table
-- Run this in Supabase SQL Editor

-- Add vehicle details columns
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS vehicle_make TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS vehicle_variant TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS vehicle_description TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS need_sourcing_help TEXT DEFAULT 'unsure';

-- Add employment details
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS employer TEXT;

-- Add tracking columns
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quote_requests'
ORDER BY ordinal_position;
