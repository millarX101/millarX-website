-- Create lease_analysis_data table for provider intelligence
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS lease_analysis_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT,
  provider_normalized TEXT,  -- lowercase, trimmed for grouping/ML
  vehicle_description TEXT,
  fbt_value NUMERIC,
  residual_value NUMERIC,
  finance_payment NUMERIC,
  payment_frequency TEXT,
  lease_term INTEGER,
  state TEXT,
  vehicle_type TEXT,
  shown_rate NUMERIC,
  -- Calculated results (stored for pattern analysis)
  risk_level TEXT,  -- 'good', 'caution', 'warning'
  extras_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lease_analysis_data ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth required)
CREATE POLICY "Anyone can insert analysis data" ON lease_analysis_data
  FOR INSERT TO anon WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Service role has full access" ON lease_analysis_data
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Index for provider pattern queries
CREATE INDEX IF NOT EXISTS idx_lease_analysis_provider ON lease_analysis_data(provider_normalized);
CREATE INDEX IF NOT EXISTS idx_lease_analysis_created ON lease_analysis_data(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lease_analysis_risk ON lease_analysis_data(risk_level);
