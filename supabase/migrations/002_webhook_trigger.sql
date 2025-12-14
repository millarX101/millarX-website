-- ============================================
-- WEBHOOK TRIGGER FOR NEW LEADS
-- ============================================
-- This triggers the Edge Function when a new quote_request is inserted

-- Enable the pg_net extension for HTTP calls (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to call the Edge Function
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  payload JSONB;
BEGIN
  -- Get the Edge Function URL from a config table or hardcode it
  -- In production, you'd set this via Supabase secrets
  edge_function_url := current_setting('app.settings.edge_function_url', true);

  -- If not configured, skip the webhook
  IF edge_function_url IS NULL OR edge_function_url = '' THEN
    RAISE NOTICE 'Edge function URL not configured, skipping webhook';
    RETURN NEW;
  END IF;

  -- Build the payload
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'quote_requests',
    'record', row_to_json(NEW)::jsonb,
    'old_record', NULL
  );

  -- Make async HTTP call to Edge Function
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_new_quote_request ON quote_requests;
CREATE TRIGGER on_new_quote_request
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();


-- ============================================
-- ALTERNATIVE: Database Webhook (Supabase native)
-- ============================================
-- Instead of pg_net, you can use Supabase's native database webhooks
-- Go to: Supabase Dashboard > Database > Webhooks > Create
--
-- Settings:
-- - Name: new_lead_webhook
-- - Table: quote_requests
-- - Events: INSERT
-- - URL: https://YOUR_PROJECT.supabase.co/functions/v1/process-lead
-- - Headers: Add Authorization header with service role key
--
-- This is often more reliable than pg_net for production use.


-- ============================================
-- HELPER VIEW: Lead Summary
-- ============================================
-- Quick view of recent leads with key info

CREATE OR REPLACE VIEW lead_summary AS
SELECT
  id,
  name,
  email,
  phone,
  employer,
  readiness,
  status,
  calculation_inputs->>'fuelType' AS vehicle_type,
  (calculation_inputs->>'vehiclePrice')::numeric AS vehicle_price,
  (calculation_results->>'annualTaxSavings')::numeric AS annual_savings,
  (calculation_results->>'netCostPerPeriod')::numeric AS net_cost,
  calculation_results->>'fbtExempt' AS fbt_exempt,
  mxdriveiq_id,
  quote_generated,
  created_at
FROM quote_requests
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON lead_summary TO authenticated;
GRANT SELECT ON lead_summary TO service_role;
