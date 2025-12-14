-- ============================================
-- MILLARX WEBSITE DATABASE SCHEMA
-- ============================================

-- Quote Requests (main lead capture)
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  employer TEXT,
  readiness TEXT CHECK (readiness IN ('exploring', 'ready', 'comparing')) DEFAULT 'exploring',

  -- Calculator inputs (JSONB for flexibility)
  calculation_inputs JSONB NOT NULL DEFAULT '{}',

  -- Calculator results (JSONB for flexibility)
  calculation_results JSONB NOT NULL DEFAULT '{}',

  -- Tracking
  source TEXT DEFAULT 'millarx-website',
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Processing status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new',
    'pending_api_config',
    'sent_to_crm',
    'quote_sent',
    'api_error',
    'converted',
    'closed'
  )),

  -- mxDriveIQ integration
  mxdriveiq_id TEXT,
  quote_generated BOOLEAN DEFAULT FALSE,
  api_error TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_quote_requests_email ON quote_requests(email);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_quote_requests_created ON quote_requests(created_at DESC);


-- Contact Submissions (general inquiries)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT CHECK (inquiry_type IN ('employee', 'employer', 'dealer', 'other')),
  message TEXT,

  source_page TEXT,
  status TEXT DEFAULT 'new',

  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Employer Inquiries (B2B leads)
CREATE TABLE IF NOT EXISTS employer_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  employee_count TEXT CHECK (employee_count IN ('1-50', '51-200', '201-500', '500+')),

  status TEXT DEFAULT 'new',
  notes TEXT,

  -- mxDriveIQ integration
  mxdriveiq_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Lease Analyses (competitor quote checks - optional storage)
CREATE TABLE IF NOT EXISTS lease_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User who ran the analysis (optional - they can be anonymous)
  email TEXT,

  -- Analysis inputs
  provider_name TEXT,
  vehicle_description TEXT,
  fbt_value NUMERIC,
  residual_value NUMERIC,
  finance_payment NUMERIC,
  payment_frequency TEXT,
  lease_term INTEGER,
  state TEXT,
  vehicle_type TEXT,
  balloon_includes_gst BOOLEAN,
  shown_rate NUMERIC,

  -- Analysis results
  analysis_score TEXT CHECK (analysis_score IN ('good', 'caution', 'warning')),
  issues_found JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER employer_inquiries_updated_at
  BEFORE UPDATE ON employer_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_analyses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for website forms)
CREATE POLICY "Allow anonymous insert" ON quote_requests
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON employer_inquiries
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON lease_analyses
  FOR INSERT TO anon WITH CHECK (true);

-- Service role has full access (for edge functions)
CREATE POLICY "Service role full access" ON quote_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON contact_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON employer_inquiries
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON lease_analyses
  FOR ALL TO service_role USING (true) WITH CHECK (true);
