// Supabase Edge Function: send-lead-email
// Sends email notifications when new leads are created via Gmail SMTP
// Supports: quote_requests, employer_inquiries, contact_submissions, lease_analyses

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Gmail configuration
const GMAIL_USER = Deno.env.get('GMAIL_USER')
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') || GMAIL_USER

interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.log('Gmail credentials not configured, skipping email')
    console.log('Would have sent:', { to: payload.to, subject: payload.subject })
    return false
  }

  const client = new SmtpClient()

  try {
    await client.connectTLS({
      hostname: 'smtp.gmail.com',
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_APP_PASSWORD,
    })

    await client.send({
      from: GMAIL_USER,
      to: payload.to,
      subject: payload.subject,
      content: payload.text || '',
      html: payload.html,
    })

    await client.close()
    console.log('Email sent successfully via Gmail')
    return true
  } catch (error) {
    console.error('Gmail send error:', error)
    try {
      await client.close()
    } catch {}
    return false
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatQuoteRequestEmail(record: any): EmailPayload {
  const inputs = record.calculation_inputs || {}
  const results = record.calculation_results || {}

  const vehicleInfo = [
    record.vehicle_make,
    record.vehicle_model,
    record.vehicle_variant,
  ].filter(Boolean).join(' ') || inputs.selectedEV || 'Not specified'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b21a8, #4c1d95); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
    .section { margin-bottom: 20px; }
    .section h3 { color: #6b21a8; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .label { color: #64748b; }
    .value { font-weight: 600; }
    .highlight { background: #6b21a8; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Quote Request</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
    </div>
    <div class="content">
      <div class="section">
        <h3>Contact Details</h3>
        <div class="row"><span class="label">Name</span><span class="value">${record.name || 'Not provided'}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${record.email || 'Not provided'}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${record.phone || 'Not provided'}</span></div>
        <div class="row"><span class="label">Employer</span><span class="value">${record.employer || 'Not provided'}</span></div>
        <div class="row"><span class="label">State</span><span class="value">${record.state || inputs.state || 'Not provided'}</span></div>
      </div>

      <div class="section">
        <h3>Vehicle Details</h3>
        <div class="row"><span class="label">Vehicle</span><span class="value">${vehicleInfo}</span></div>
        <div class="row"><span class="label">Price</span><span class="value">${formatCurrency(inputs.vehiclePrice || 0)}</span></div>
        <div class="row"><span class="label">Type</span><span class="value">${inputs.fuelType || 'Not specified'}</span></div>
        <div class="row"><span class="label">Lease Term</span><span class="value">${inputs.leaseTermYears || 'N/A'} years</span></div>
        <div class="row"><span class="label">Sourcing Help</span><span class="value">${record.need_sourcing_help || 'unsure'}</span></div>
      </div>

      <div class="section">
        <h3>Calculator Results</h3>
        <div class="row"><span class="label">Annual Salary</span><span class="value">${formatCurrency(inputs.annualSalary || 0)}</span></div>
        <div class="row"><span class="label">Pay Period</span><span class="value">${inputs.payPeriod || 'monthly'}</span></div>
        <div class="row"><span class="label">Est. Tax Savings</span><span class="value">${formatCurrency(results.annualTaxSavings || 0)}/year</span></div>
        <div class="row"><span class="label">FBT Exempt</span><span class="value">${results.fbtExempt ? 'Yes' : 'No'}</span></div>
      </div>

      <div class="highlight">
        <p style="margin: 0; font-size: 14px;">Net Cost per ${inputs.payPeriod || 'month'}</p>
        <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold;">${formatCurrency(results.netCostPerPeriod || 0)}</p>
      </div>

      <div class="section">
        <h3>Source Info</h3>
        <div class="row"><span class="label">Source Page</span><span class="value">${record.source_page || record.source || 'Direct'}</span></div>
        ${record.utm_source ? `<div class="row"><span class="label">UTM Source</span><span class="value">${record.utm_source}</span></div>` : ''}
        ${record.utm_campaign ? `<div class="row"><span class="label">UTM Campaign</span><span class="value">${record.utm_campaign}</span></div>` : ''}
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from millarX website.</p>
      <p>Lead ID: ${record.id}</p>
    </div>
  </div>
</body>
</html>
`

  const text = `
NEW QUOTE REQUEST
${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

CONTACT DETAILS
Name: ${record.name || 'Not provided'}
Email: ${record.email || 'Not provided'}
Phone: ${record.phone || 'Not provided'}
Employer: ${record.employer || 'Not provided'}
State: ${record.state || inputs.state || 'Not provided'}

VEHICLE DETAILS
Vehicle: ${vehicleInfo}
Price: ${formatCurrency(inputs.vehiclePrice || 0)}
Type: ${inputs.fuelType || 'Not specified'}
Lease Term: ${inputs.leaseTermYears || 'N/A'} years

CALCULATOR RESULTS
Annual Salary: ${formatCurrency(inputs.annualSalary || 0)}
Est. Tax Savings: ${formatCurrency(results.annualTaxSavings || 0)}/year
Net Cost per ${inputs.payPeriod || 'month'}: ${formatCurrency(results.netCostPerPeriod || 0)}
FBT Exempt: ${results.fbtExempt ? 'Yes' : 'No'}

Source: ${record.source_page || record.source || 'Direct'}
Lead ID: ${record.id}
`

  return {
    to: NOTIFICATION_EMAIL!,
    subject: `New Quote Request: ${record.name || 'Unknown'} - ${vehicleInfo}`,
    html,
    text,
  }
}

function formatEmployerInquiryEmail(record: any): EmailPayload {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d9488, #0f766e); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .label { color: #64748b; }
    .value { font-weight: 600; }
    .badge { display: inline-block; background: #0d9488; color: white; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Employer Inquiry</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
    </div>
    <div class="content">
      <div class="row"><span class="label">Company</span><span class="value">${record.company_name || 'Not provided'}</span></div>
      <div class="row"><span class="label">Contact Name</span><span class="value">${record.contact_name || 'Not provided'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${record.email || 'Not provided'}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${record.phone || 'Not provided'}</span></div>
      <div class="row"><span class="label">Employees</span><span class="value"><span class="badge">${record.employee_count || 'Not specified'}</span></span></div>
      <div class="row"><span class="label">Source</span><span class="value">${record.source_page || 'Direct'}</span></div>
    </div>
    <div class="footer">
      <p>This is an automated notification from millarX website.</p>
      <p>Lead ID: ${record.id}</p>
    </div>
  </div>
</body>
</html>
`

  const text = `
NEW EMPLOYER INQUIRY
${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

Company: ${record.company_name || 'Not provided'}
Contact: ${record.contact_name || 'Not provided'}
Email: ${record.email || 'Not provided'}
Phone: ${record.phone || 'Not provided'}
Employees: ${record.employee_count || 'Not specified'}
Source: ${record.source_page || 'Direct'}

Lead ID: ${record.id}
`

  return {
    to: NOTIFICATION_EMAIL!,
    subject: `New Employer Inquiry: ${record.company_name || 'Unknown'} (${record.employee_count || 'N/A'} employees)`,
    html,
    text,
  }
}

function formatContactSubmissionEmail(record: any): EmailPayload {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b21a8, #4c1d95); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .label { color: #64748b; }
    .value { font-weight: 600; }
    .message { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px; }
    .message-label { color: #6b21a8; font-weight: 600; margin-bottom: 10px; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
    </div>
    <div class="content">
      <div class="row"><span class="label">Name</span><span class="value">${record.name || 'Not provided'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${record.email || 'Not provided'}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${record.phone || 'Not provided'}</span></div>
      <div class="row"><span class="label">Type</span><span class="value">${record.inquiry_type || record.inquiryType || 'General'}</span></div>
      <div class="row"><span class="label">Source</span><span class="value">${record.source_page || 'Direct'}</span></div>

      <div class="message">
        <div class="message-label">Message</div>
        <p style="margin: 0; white-space: pre-wrap;">${record.message || 'No message provided'}</p>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from millarX website.</p>
      <p>Submission ID: ${record.id}</p>
    </div>
  </div>
</body>
</html>
`

  const text = `
NEW CONTACT FORM SUBMISSION
${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

Name: ${record.name || 'Not provided'}
Email: ${record.email || 'Not provided'}
Phone: ${record.phone || 'Not provided'}
Type: ${record.inquiry_type || record.inquiryType || 'General'}
Source: ${record.source_page || 'Direct'}

MESSAGE:
${record.message || 'No message provided'}

Submission ID: ${record.id}
`

  return {
    to: NOTIFICATION_EMAIL!,
    subject: `Contact Form: ${record.name || 'Unknown'} - ${record.inquiry_type || record.inquiryType || 'General Inquiry'}`,
    html,
    text,
  }
}

function formatLeaseAnalysisEmail(record: any): EmailPayload {
  const analysisData = record.analysis_data || {}

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ea580c, #c2410c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .label { color: #64748b; }
    .value { font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Lease Analysis Request</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
    </div>
    <div class="content">
      <div class="row"><span class="label">Name</span><span class="value">${record.name || 'Not provided'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${record.email || 'Not provided'}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${record.phone || 'Not provided'}</span></div>
      <div class="row"><span class="label">Provider</span><span class="value">${analysisData.providerName || 'Not specified'}</span></div>
      <div class="row"><span class="label">Vehicle</span><span class="value">${analysisData.vehicleDescription || 'Not specified'}</span></div>
      <div class="row"><span class="label">FBT Value</span><span class="value">${analysisData.fbtValue ? formatCurrency(analysisData.fbtValue) : 'N/A'}</span></div>
      <div class="row"><span class="label">Payment</span><span class="value">${analysisData.financePayment ? formatCurrency(analysisData.financePayment) : 'N/A'} / ${analysisData.paymentFrequency || 'month'}</span></div>
      <div class="row"><span class="label">Source</span><span class="value">${record.source_page || 'Direct'}</span></div>
    </div>
    <div class="footer">
      <p>This is an automated notification from millarX website.</p>
      <p>Analysis ID: ${record.id}</p>
    </div>
  </div>
</body>
</html>
`

  const text = `
NEW LEASE ANALYSIS REQUEST
${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

Name: ${record.name || 'Not provided'}
Email: ${record.email || 'Not provided'}
Phone: ${record.phone || 'Not provided'}
Provider: ${analysisData.providerName || 'Not specified'}
Vehicle: ${analysisData.vehicleDescription || 'Not specified'}
FBT Value: ${analysisData.fbtValue ? formatCurrency(analysisData.fbtValue) : 'N/A'}
Payment: ${analysisData.financePayment ? formatCurrency(analysisData.financePayment) : 'N/A'} / ${analysisData.paymentFrequency || 'month'}
Source: ${record.source_page || 'Direct'}

Analysis ID: ${record.id}
`

  return {
    to: NOTIFICATION_EMAIL!,
    subject: `Lease Analysis: ${record.name || record.email || 'Unknown'} - ${analysisData.providerName || 'Provider Review'}`,
    html,
    text,
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, table, record } = await req.json()

    // Only process INSERT events
    if (type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Ignored non-INSERT event' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing ${table} notification for record: ${record.id}`)

    let emailPayload: EmailPayload

    switch (table) {
      case 'quote_requests':
        emailPayload = formatQuoteRequestEmail(record)
        break
      case 'employer_inquiries':
        emailPayload = formatEmployerInquiryEmail(record)
        break
      case 'contact_submissions':
        emailPayload = formatContactSubmissionEmail(record)
        break
      case 'lease_analyses':
        emailPayload = formatLeaseAnalysisEmail(record)
        break
      default:
        console.log(`Unknown table: ${table}`)
        return new Response(
          JSON.stringify({ message: `Unknown table: ${table}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const sent = await sendEmail(emailPayload)

    return new Response(
      JSON.stringify({
        success: true,
        emailSent: sent,
        table,
        recordId: record.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
