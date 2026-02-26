-- ============================================
-- KISSFM PARTNERSHIP LEADS
-- ============================================

CREATE TABLE IF NOT EXISTS kissfm_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  employer TEXT,

  -- Tracking
  source TEXT DEFAULT 'kissfm',
  source_page TEXT DEFAULT '/kissfm',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Processing status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new',
    'contacted',
    'quoting',
    'settled',
    'closed'
  )),

  -- Settlement tracking (for KissFM donation calculation)
  settled_at TIMESTAMPTZ,
  donation_paid BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kissfm_leads_email ON kissfm_leads(email);
CREATE INDEX idx_kissfm_leads_status ON kissfm_leads(status);
CREATE INDEX idx_kissfm_leads_created ON kissfm_leads(created_at DESC);
CREATE INDEX idx_kissfm_leads_settled ON kissfm_leads(settled_at) WHERE settled_at IS NOT NULL;

-- Updated at trigger
CREATE TRIGGER kissfm_leads_updated_at
  BEFORE UPDATE ON kissfm_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE kissfm_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (website form)
CREATE POLICY "Allow anonymous insert" ON kissfm_leads
  FOR INSERT TO anon WITH CHECK (true);

-- Service role has full access
CREATE POLICY "Service role full access" ON kissfm_leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);
