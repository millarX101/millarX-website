-- ============================================
-- DRIVE DAY REGISTRATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS drive_day_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Preferences
  preferred_day TEXT CHECK (preferred_day IN ('weekday', 'weekend', 'either')),
  bringing_passenger TEXT CHECK (bringing_passenger IN ('yes', 'no')),

  -- Event reference
  event_name TEXT DEFAULT 'mazda-6e-drive-day',

  -- Tracking
  source TEXT DEFAULT 'millarx-website',
  source_page TEXT,

  -- Processing status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_drive_day_email ON drive_day_registrations(email);
CREATE INDEX idx_drive_day_event ON drive_day_registrations(event_name);
CREATE INDEX idx_drive_day_created ON drive_day_registrations(created_at DESC);

-- Updated at trigger
CREATE TRIGGER drive_day_registrations_updated_at
  BEFORE UPDATE ON drive_day_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE drive_day_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON drive_day_registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role full access" ON drive_day_registrations
  FOR ALL TO service_role USING (true) WITH CHECK (true);
