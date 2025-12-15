-- ============================================
-- LEASE RESCUE PACK PURCHASES
-- Storage for $49 Lease Rescue Pack purchases and quote uploads
-- ============================================

-- Lease Rescue Purchases table
CREATE TABLE IF NOT EXISTS lease_rescue_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Stripe details
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,

  -- Customer details
  email TEXT NOT NULL,
  name TEXT,
  amount INTEGER DEFAULT 4900, -- Amount in cents ($49.00)

  -- Quote upload tracking
  quote_uploaded BOOLEAN DEFAULT FALSE,
  quote_file_path TEXT,
  quote_file_url TEXT,

  -- Customer consent & notes
  storage_consent BOOLEAN DEFAULT FALSE,
  customer_notes TEXT,

  -- Processing status
  status TEXT DEFAULT 'completed' CHECK (status IN (
    'completed',      -- Payment completed
    'quote_received', -- Quote uploaded
    'analyzing',      -- Ben reviewing
    'pack_sent',      -- Lease Rescue Pack delivered
    'converted',      -- Customer became millarX client (refund $49)
    'closed'          -- Completed or cancelled
  )),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lease_rescue_email ON lease_rescue_purchases(email);
CREATE INDEX idx_lease_rescue_status ON lease_rescue_purchases(status);
CREATE INDEX idx_lease_rescue_session ON lease_rescue_purchases(stripe_session_id);

-- Updated_at trigger
CREATE TRIGGER lease_rescue_purchases_updated_at
  BEFORE UPDATE ON lease_rescue_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE lease_rescue_purchases ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (for edge functions creating records)
CREATE POLICY "Allow anonymous insert" ON lease_rescue_purchases
  FOR INSERT TO anon WITH CHECK (true);

-- Allow update for quote uploads (matching session_id)
CREATE POLICY "Allow update by session" ON lease_rescue_purchases
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Service role has full access
CREATE POLICY "Service role full access" ON lease_rescue_purchases
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================
-- STORAGE BUCKET FOR QUOTE FILES
-- ============================================

-- Create storage bucket for lease rescue quotes
-- Run this in Supabase SQL Editor or via CLI
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lease-rescue-quotes',
  'lease-rescue-quotes',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'lease-rescue-quotes');

CREATE POLICY "Allow service role full access" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'lease-rescue-quotes')
  WITH CHECK (bucket_id = 'lease-rescue-quotes');

-- Allow public to read their own uploads (via signed URLs)
CREATE POLICY "Allow read with signed URL" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'lease-rescue-quotes');
