# millarX Production Setup Guide

This guide covers everything needed to get the millarX website fully production-ready.

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# millarX Supabase (leads, storage, etc.)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# mxDriveIQ Supabase (shared EV catalog - if using Browse EVs)
VITE_MXDRIVEIQ_SUPABASE_URL=https://your-mxdriveiq-project.supabase.co
VITE_MXDRIVEIQ_SUPABASE_ANON_KEY=your-mxdriveiq-anon-key
```

## Supabase Database Tables

Create these tables in your Supabase project:

### 1. quote_requests
```sql
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  vehicle_price NUMERIC,
  salary NUMERIC,
  lease_term INTEGER,
  vehicle_type TEXT,
  state TEXT,
  source_page TEXT,
  calculation_results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON quote_requests
  FOR INSERT WITH CHECK (true);
```

### 2. employer_inquiries
```sql
CREATE TABLE employer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  employee_count TEXT,
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE employer_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON employer_inquiries
  FOR INSERT WITH CHECK (true);
```

### 3. contact_submissions
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT,
  message TEXT,
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);
```

### 4. lease_analyses
```sql
CREATE TABLE lease_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  analysis_data JSONB,
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lease_analyses ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON lease_analyses
  FOR INSERT WITH CHECK (true);
```

## Email Notifications (Optional)

To receive email notifications when leads come in, set up Supabase Edge Functions:

### 1. Create Edge Function for Email Notifications

Create a new Edge Function called `send-lead-notification`:

```typescript
// supabase/functions/send-lead-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GMAIL_USER = Deno.env.get('GMAIL_USER')
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') || GMAIL_USER

serve(async (req) => {
  const { type, data } = await req.json()

  // Format email based on lead type
  let subject = ''
  let body = ''

  if (type === 'quote_request') {
    subject = `New Quote Request from ${data.name}`
    body = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Vehicle Price: $${data.vehicle_price?.toLocaleString() || 'N/A'}
Salary: $${data.salary?.toLocaleString() || 'N/A'}
Source: ${data.source_page}
    `
  } else if (type === 'employer_inquiry') {
    subject = `New Employer Inquiry from ${data.company_name}`
    body = `
Company: ${data.company_name}
Contact: ${data.contact_name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Employees: ${data.employee_count || 'N/A'}
    `
  } else if (type === 'contact_submission') {
    subject = `New Contact Form from ${data.name}`
    body = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Type: ${data.inquiry_type || 'N/A'}
Message: ${data.message}
    `
  }

  // Send email using Gmail SMTP (via fetch to a mail service)
  // Note: You may want to use a service like SendGrid, Resend, or Mailgun instead

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 2. Set Secrets in Supabase

```bash
supabase secrets set GMAIL_USER=your-email@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=your-app-password
supabase secrets set NOTIFICATION_EMAIL=leads@millarx.com.au
```

### 3. Create Database Webhooks

In Supabase Dashboard > Database > Webhooks, create webhooks for each table to call the Edge Function when new rows are inserted.

## Storage Setup

1. Create a storage bucket called `media` in Supabase Storage
2. Set bucket to **public** for asset access
3. Upload your logo files to `media/logos/`

The site already has direct URLs configured for the logos.

## Deployment Checklist

- [ ] Environment variables set in hosting platform (Vercel/Netlify)
- [ ] Supabase tables created with RLS policies
- [ ] Storage bucket created and logos uploaded
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Test all forms submit successfully
- [ ] Test email notifications (if configured)

## Testing Forms Locally

1. Set environment variables in `.env.local`
2. Run `npm run dev`
3. Submit test data through each form
4. Check Supabase Dashboard > Table Editor to verify data

## Quick Deploy Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Support

If you need help with setup:
- Email: ben@millarx.com.au
- Check Supabase docs: https://supabase.com/docs
