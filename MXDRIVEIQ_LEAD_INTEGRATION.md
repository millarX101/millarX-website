# mxDriveIQ Lead Integration Guide

**Purpose:** Connect millarX website leads to mxDriveIQ for administration and quoting

---

## Architecture Overview

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   millarX Website   │     │  Supabase (millarX) │     │     mxDriveIQ       │
│  (Netlify Frontend) │────▶│   - quote_requests  │────▶│  - Admin Dashboard  │
│                     │     │   - contact_forms   │     │  - Lead Management  │
│  Forms submit to    │     │   - employer_inqs   │     │  - Quote Generation │
│  Supabase directly  │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

---

## Option 1: View Leads Directly in millarX Supabase (Quickest)

The simplest approach - just view leads in Supabase Dashboard:

### Setup:
1. Go to https://supabase.com/dashboard
2. Select project: `ktsjfqbosdmataezkcbh`
3. Go to **Table Editor**
4. View tables:
   - `quote_requests` - Calculator/quote form submissions
   - `contact_submissions` - Contact form submissions
   - `employer_inquiries` - Employer form submissions
   - `lease_analyses` - Lease analysis submissions

### Pros:
- Zero development needed
- Works immediately
- Can export to CSV

### Cons:
- Separate from mxDriveIQ workflow
- No CRM features
- Manual process

---

## Option 2: Sync Leads to mxDriveIQ Database (Recommended)

Forward leads from millarX Supabase to mxDriveIQ Supabase in real-time.

### Step 1: Create Leads Table in mxDriveIQ Supabase

Run this SQL in mxDriveIQ Supabase (project: `blqiytekevhbstlgybws`):

```sql
-- Inbound leads from millarX website
CREATE TABLE website_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source tracking
  source TEXT DEFAULT 'millarx-website',
  source_lead_id UUID,  -- Original ID from millarX Supabase
  lead_type TEXT,       -- 'quote_request', 'contact', 'employer', 'lease_analysis'

  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- For quote requests
  employer TEXT,
  state TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_variant TEXT,
  vehicle_price NUMERIC,
  lease_term INTEGER,
  fuel_type TEXT,
  annual_salary NUMERIC,
  annual_km INTEGER,

  -- Calculation results from website
  calculation_inputs JSONB,
  calculation_results JSONB,

  -- For employer inquiries
  company_name TEXT,
  employee_count TEXT,

  -- For contact submissions
  inquiry_type TEXT,
  message TEXT,

  -- For lease analyses
  analysis_data JSONB,

  -- CRM fields
  status TEXT DEFAULT 'new',  -- new, contacted, qualified, quoted, converted, lost
  assigned_to TEXT,
  notes TEXT,
  follow_up_date TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE website_leads ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (admin access)
CREATE POLICY "Authenticated users can view all leads"
  ON website_leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON website_leads FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert leads"
  ON website_leads FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Indexes for common queries
CREATE INDEX idx_website_leads_status ON website_leads(status);
CREATE INDEX idx_website_leads_created ON website_leads(created_at DESC);
CREATE INDEX idx_website_leads_email ON website_leads(email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER website_leads_updated_at
  BEFORE UPDATE ON website_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Step 2: Create Lead Forwarding Edge Function (millarX Supabase)

Create this file at `supabase/functions/forward-lead/index.ts`:

```typescript
// Supabase Edge Function: forward-lead
// Forwards leads from millarX to mxDriveIQ

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// mxDriveIQ Supabase credentials (set these as secrets)
const MXDRIVEIQ_URL = Deno.env.get('MXDRIVEIQ_SUPABASE_URL')
const MXDRIVEIQ_SERVICE_KEY = Deno.env.get('MXDRIVEIQ_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, table, record } = await req.json()

    if (type !== 'INSERT') {
      return new Response(JSON.stringify({ message: 'Ignored non-INSERT' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!MXDRIVEIQ_URL || !MXDRIVEIQ_SERVICE_KEY) {
      console.log('mxDriveIQ credentials not configured')
      return new Response(JSON.stringify({ message: 'mxDriveIQ not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Connect to mxDriveIQ Supabase
    const mxdriveiq = createClient(MXDRIVEIQ_URL, MXDRIVEIQ_SERVICE_KEY)

    // Map the lead based on source table
    let leadData: any = {
      source: 'millarx-website',
      source_lead_id: record.id,
      lead_type: table,
      name: record.name || record.contact_name || '',
      email: record.email || '',
      phone: record.phone || '',
      created_at: record.created_at || new Date().toISOString(),
    }

    switch (table) {
      case 'quote_requests':
        leadData = {
          ...leadData,
          employer: record.employer,
          state: record.state || record.calculation_inputs?.state,
          vehicle_make: record.vehicle_make,
          vehicle_model: record.vehicle_model,
          vehicle_variant: record.vehicle_variant,
          vehicle_price: record.calculation_inputs?.vehiclePrice,
          lease_term: record.calculation_inputs?.leaseTermYears,
          fuel_type: record.calculation_inputs?.fuelType,
          annual_salary: record.calculation_inputs?.annualSalary,
          annual_km: record.calculation_inputs?.annualKm,
          calculation_inputs: record.calculation_inputs,
          calculation_results: record.calculation_results,
        }
        break

      case 'employer_inquiries':
        leadData = {
          ...leadData,
          name: record.contact_name,
          company_name: record.company_name,
          employee_count: record.employee_count,
        }
        break

      case 'contact_submissions':
        leadData = {
          ...leadData,
          inquiry_type: record.inquiry_type || record.inquiryType,
          message: record.message,
        }
        break

      case 'lease_analyses':
        leadData = {
          ...leadData,
          analysis_data: record.analysis_data,
        }
        break
    }

    // Insert into mxDriveIQ
    const { data, error } = await mxdriveiq
      .from('website_leads')
      .insert(leadData)
      .select()
      .single()

    if (error) {
      console.error('mxDriveIQ insert error:', error)
      throw error
    }

    console.log(`Lead forwarded to mxDriveIQ: ${data.id}`)

    return new Response(JSON.stringify({
      success: true,
      mxdriveiq_lead_id: data.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error forwarding lead:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

### Step 3: Deploy and Configure

```bash
# In millarX project directory
cd "c:\Users\User\Desktop\millarX website\millarx-website"

# Deploy the forward-lead function
npx supabase functions deploy forward-lead

# Set the mxDriveIQ credentials as secrets
npx supabase secrets set MXDRIVEIQ_SUPABASE_URL=https://blqiytekevhbstlgybws.supabase.co
npx supabase secrets set MXDRIVEIQ_SERVICE_ROLE_KEY=your-mxdriveiq-service-role-key
```

**To get the mxDriveIQ service role key:**
1. Go to mxDriveIQ Supabase Dashboard
2. Settings → API
3. Copy the `service_role` key (NOT the anon key)

### Step 4: Create Webhooks to Forward Leads

In millarX Supabase Dashboard → Database → Webhooks, create these:

| Name | Table | Event | Function |
|------|-------|-------|----------|
| forward-quote-request | quote_requests | INSERT | forward-lead |
| forward-employer-inquiry | employer_inquiries | INSERT | forward-lead |
| forward-contact-submission | contact_submissions | INSERT | forward-lead |
| forward-lease-analysis | lease_analyses | INSERT | forward-lead |

---

## Option 3: Build Admin UI in mxDriveIQ (Full Solution)

If mxDriveIQ is a React/Next.js app, add a leads management page:

### Basic Leads Dashboard Component

```tsx
// pages/admin/leads.tsx or app/admin/leads/page.tsx

'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Lead {
  id: string
  lead_type: string
  name: string
  email: string
  phone: string
  status: string
  created_at: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_price?: number
  company_name?: string
  message?: string
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'quoted', 'converted', 'lost']
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  quoted: 'bg-orange-100 text-orange-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-800',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchLeads()

    // Real-time subscription
    const subscription = supabase
      .channel('website_leads')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'website_leads'
      }, () => {
        fetchLeads()
      })
      .subscribe()

    return () => { subscription.unsubscribe() }
  }, [filter])

  async function fetchLeads() {
    setLoading(true)
    let query = supabase
      .from('website_leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query
    if (error) console.error(error)
    setLeads(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const updates: any = { status }
    if (status === 'contacted') updates.contacted_at = new Date().toISOString()
    if (status === 'converted') updates.converted_at = new Date().toISOString()

    const { error } = await supabase
      .from('website_leads')
      .update(updates)
      .eq('id', id)

    if (!error) fetchLeads()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Website Leads</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Leads</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {leads.map(lead => (
            <div key={lead.id} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {lead.lead_type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600">{lead.email} • {lead.phone || 'No phone'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleString('en-AU')}
                  </p>
                </div>
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Lead details */}
              <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                {lead.lead_type === 'quote_requests' && (
                  <p>
                    <strong>Vehicle:</strong> {[lead.vehicle_make, lead.vehicle_model].filter(Boolean).join(' ') || 'Not specified'} •
                    <strong> Price:</strong> ${lead.vehicle_price?.toLocaleString() || 'N/A'}
                  </p>
                )}
                {lead.lead_type === 'employer_inquiries' && (
                  <p><strong>Company:</strong> {lead.company_name}</p>
                )}
                {lead.lead_type === 'contact_submissions' && lead.message && (
                  <p><strong>Message:</strong> {lead.message}</p>
                )}
              </div>
            </div>
          ))}

          {leads.length === 0 && (
            <p className="text-center text-gray-500 py-8">No leads found</p>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## Quick Start Checklist

### Minimum Setup (View in Supabase):
- [ ] Go to millarX Supabase Dashboard
- [ ] View Table Editor → quote_requests, contact_submissions, etc.
- [ ] That's it - leads are already being captured!

### Full Integration (Sync to mxDriveIQ):
- [ ] Run SQL to create `website_leads` table in mxDriveIQ Supabase
- [ ] Create `forward-lead` Edge Function in millarX
- [ ] Set mxDriveIQ service role key as secret
- [ ] Create webhooks in millarX Supabase
- [ ] Build/add admin UI in mxDriveIQ

---

## Testing

1. Submit a test form on the millarX website
2. Check millarX Supabase → Table Editor → quote_requests (should appear)
3. If forwarding is set up, check mxDriveIQ Supabase → website_leads
4. Verify email notification arrives (if webhooks configured)

---

## Troubleshooting

### Leads not appearing in millarX Supabase:
- Check browser console for errors
- Verify Supabase URL and anon key in Netlify env vars
- Check RLS policies allow anonymous inserts

### Leads not forwarding to mxDriveIQ:
- Check Edge Function logs in Supabase Dashboard
- Verify MXDRIVEIQ_SERVICE_ROLE_KEY is set correctly
- Ensure webhook is created and enabled

### Email notifications not sending:
- Check send-lead-email function logs
- Verify Gmail credentials are set as secrets
- Ensure webhooks are configured for the right tables
