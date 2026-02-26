-- ============================================
-- ADD REFERRAL SOURCE TO QUOTE REQUESTS
-- "How did you hear about us?" field
-- ============================================

ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Index for marketing analytics
CREATE INDEX IF NOT EXISTS idx_quote_requests_referral ON quote_requests(referral_source)
  WHERE referral_source IS NOT NULL;
