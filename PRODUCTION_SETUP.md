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

## Email Notifications

The email notification Edge Function is already created at `supabase/functions/send-lead-email/`. It uses [Resend](https://resend.com) for reliable email delivery.

### 1. Set Up Resend

1. Create a free account at [resend.com](https://resend.com)
2. Add and verify your domain (millarx.com.au)
3. Create an API key

### 2. Set Secrets in Supabase

```bash
# Login to Supabase CLI (if not already)
npx supabase login

# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Set the required secrets
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
npx supabase secrets set NOTIFICATION_EMAIL=leads@millarx.com.au
npx supabase secrets set FROM_EMAIL="millarX <notifications@millarx.com.au>"
```

### 3. Deploy the Edge Function

```bash
# Deploy the email notification function
npx supabase functions deploy send-lead-email

# Verify it's deployed
npx supabase functions list
```

### 4. Create Database Webhooks

In Supabase Dashboard > Database > Webhooks, create webhooks to trigger emails on new inserts:

**Webhook 1: Quote Requests**
- Name: `notify-quote-request`
- Table: `quote_requests`
- Events: INSERT
- Type: Supabase Edge Functions
- Function: `send-lead-email`
- HTTP Headers: `Content-Type: application/json`

**Webhook 2: Employer Inquiries**
- Name: `notify-employer-inquiry`
- Table: `employer_inquiries`
- Events: INSERT
- Type: Supabase Edge Functions
- Function: `send-lead-email`

**Webhook 3: Contact Submissions**
- Name: `notify-contact-submission`
- Table: `contact_submissions`
- Events: INSERT
- Type: Supabase Edge Functions
- Function: `send-lead-email`

**Webhook 4: Lease Analyses**
- Name: `notify-lease-analysis`
- Table: `lease_analyses`
- Events: INSERT
- Type: Supabase Edge Functions
- Function: `send-lead-email`

### 5. Test the Webhook

After setting up, submit a test form on your website. You should receive a nicely formatted HTML email within seconds.

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
