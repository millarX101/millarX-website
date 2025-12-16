// Netlify serverless function to send email notifications for all lead types
// Uses Gmail SMTP via Nodemailer

const nodemailer = require('nodemailer')

exports.handler = async (event, context) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const data = JSON.parse(event.body)

    const GMAIL_USER = process.env.GMAIL_USER
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

    // If no Gmail credentials, log and return success (don't block form submission)
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.log('Gmail credentials not configured. Email notification skipped.')
      console.log('Lead data:', JSON.stringify(data, null, 2))
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Lead saved (email notification not configured)' }),
      }
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    })

    // Determine lead type and format email accordingly
    const leadType = data.lead_type || 'contact'
    let subject = ''
    let emailHtml = ''

    switch (leadType) {
      case 'quote_request':
        subject = `New Quote Request: ${data.vehicle_description || data.vehicle_make || 'Vehicle Inquiry'}`
        emailHtml = formatQuoteRequestEmail(data)
        break
      case 'contact':
        subject = `New Contact: ${data.inquiry_type || 'General Inquiry'} from ${data.name || 'Website Visitor'}`
        emailHtml = formatContactEmail(data)
        break
      case 'employer_inquiry':
        subject = `New Employer Lead: ${data.company_name || 'Unknown Company'}`
        emailHtml = formatEmployerEmail(data)
        break
      default:
        subject = `New Lead from millarX Website`
        emailHtml = formatGenericEmail(data)
    }

    // Send email
    await transporter.sendMail({
      from: `millarX Website <${GMAIL_USER}>`,
      to: 'ben@millarx.com.au',
      subject: subject,
      html: emailHtml,
      replyTo: data.email,
    })

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Lead saved and notification sent' }),
    }

  } catch (error) {
    console.error('Error sending notification:', error)
    return {
      statusCode: 200, // Return 200 so form submission still "succeeds"
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Lead saved (notification error)' }),
    }
  }
}

// Format quote request email
function formatQuoteRequestEmail(data) {
  const vehicleInfo = [data.vehicle_make, data.vehicle_model, data.vehicle_variant]
    .filter(Boolean).join(' ') || data.vehicle_description || 'Not specified'

  const calcInputs = data.calculation_inputs || {}
  const calcResults = data.calculation_results || {}

  return `
    <h2>New Quote Request from millarX Website</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email || 'Not provided'}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.phone || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Employer</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.employer || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">State</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.state || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Vehicle</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${vehicleInfo}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Vehicle Price</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${(calcInputs.vehiclePrice || 0).toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Annual Salary</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${(calcInputs.annualSalary || 0).toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Lease Term</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${calcInputs.leaseTermYears || 'Not specified'} years</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Annual KMs</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${(calcInputs.annualKm || 0).toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Fuel Type</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${calcInputs.fuelType || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Est. Annual Savings</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: #5b34c4; font-weight: bold;">$${(calcResults.annualTaxSavings || 0).toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Need Sourcing Help?</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.need_sourcing_help || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Source</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.source_page || data.source || 'Website'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Submitted</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })}</td>
      </tr>
    </table>
  `
}

// Format contact email
function formatContactEmail(data) {
  return `
    <h2>New Contact from millarX Website</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.name || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email || 'Not provided'}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.phone || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Inquiry Type</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.inquiry_type || data.inquiryType || 'General'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.message || 'No message'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Source</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.source_page || 'Contact page'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Submitted</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })}</td>
      </tr>
    </table>
  `
}

// Format employer email
function formatEmployerEmail(data) {
  return `
    <h2>New Employer Inquiry from millarX Website</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.company_name || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Contact Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.contact_name || data.name || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email || 'Not provided'}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.phone || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Employee Count</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.employee_count || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Submitted</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })}</td>
      </tr>
    </table>
    <p style="margin-top: 20px; color: #666;">
      This lead was submitted via the millarX website employers page.
    </p>
  `
}

// Format generic email
function formatGenericEmail(data) {
  const rows = Object.entries(data)
    .filter(([key]) => !['lead_type'].includes(key))
    .map(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      const displayValue = typeof value === 'object' ? JSON.stringify(value) : (value || 'Not provided')
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${label}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${displayValue}</td>
        </tr>
      `
    }).join('')

  return `
    <h2>New Lead from millarX Website</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      ${rows}
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Submitted</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })}</td>
      </tr>
    </table>
  `
}
