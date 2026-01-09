// Netlify serverless function to send employer signup notifications via Resend
// Sends notification email to ben@millarx.com.au when an employer requests onboarding

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
    const { companyName, companyEmail } = JSON.parse(event.body)

    // Validate required fields
    if (!companyName || !companyEmail) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Company name and email are required' }),
      }
    }

    // Get Resend API key from environment
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email service not configured' }),
      }
    }

    // Current timestamp in Sydney timezone
    const timestamp = new Date().toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      dateStyle: 'full',
      timeStyle: 'short'
    })

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'millarX Website <notifications@millarx.com.au>',
        to: ['ben@millarx.com.au'],
        subject: `New Employer Sign Up Request: ${companyName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b21a8, #4c1d95); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .info-box { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #64748b; width: 120px; flex-shrink: 0; }
    .value { font-weight: 600; color: #1e293b; }
    .action-box { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center; }
    .action-box h3 { color: #166534; margin: 0 0 10px 0; }
    .action-box p { color: #15803d; margin: 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Employer Sign Up Request</h1>
      <p>${timestamp}</p>
    </div>
    <div class="content">
      <p>A new employer has requested access to the MXDriveIQ employer portal.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="label">Company</span>
          <span class="value">${companyName}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">${companyEmail}</span>
        </div>
      </div>

      <div class="action-box">
        <h3>Action Required</h3>
        <p>Send the secure employer onboarding link to <strong>${companyEmail}</strong></p>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from the millarX website.</p>
      <p>Partner page employer sign-up form</p>
    </div>
  </div>
</body>
</html>
        `,
        text: `
NEW EMPLOYER SIGN UP REQUEST
${timestamp}

A new employer has requested access to the MXDriveIQ employer portal.

Company: ${companyName}
Email: ${companyEmail}

ACTION REQUIRED:
Send the secure employer onboarding link to ${companyEmail}

---
This is an automated notification from the millarX website.
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to send notification email' }),
      }
    }

    const result = await response.json()
    console.log('Email sent successfully:', result.id)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Sign up request submitted successfully',
        emailId: result.id
      }),
    }
  } catch (error) {
    console.error('Error processing employer signup:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    }
  }
}
