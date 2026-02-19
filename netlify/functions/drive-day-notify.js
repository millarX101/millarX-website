// Netlify serverless function to send drive day registration notifications via Resend
// Sends notification email to ben@millarx.com.au when someone registers for a drive day

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
    const { name, email, phone, preferred_day, bringing_passenger } = JSON.parse(event.body)

    // Validate required fields
    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name and email are required' }),
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

    const preferredDayDisplay = preferred_day
      ? preferred_day.charAt(0).toUpperCase() + preferred_day.slice(1)
      : 'Not specified'

    const passengerDisplay = bringing_passenger === 'yes' ? 'Yes' : bringing_passenger === 'no' ? 'No' : 'Not specified'

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
        subject: `Mazda 6e Drive Day Registration: ${name}`,
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
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .info-box { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-weight: 600; color: #1e293b; margin-top: 2px; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Mazda 6e Drive Day</h1>
      <p>New Registration</p>
      <div class="badge">millarX x Ringwood Mazda</div>
    </div>
    <div class="content">
      <p>Someone just registered interest for the Mazda 6e Drive Day.</p>

      <div class="info-box">
        <div class="info-row">
          <div class="label">Name</div>
          <div class="value">${name}</div>
        </div>
        <div class="info-row">
          <div class="label">Email</div>
          <div class="value">${email}</div>
        </div>
        <div class="info-row">
          <div class="label">Phone</div>
          <div class="value">${phone || 'Not provided'}</div>
        </div>
        <div class="info-row">
          <div class="label">Preferred Day</div>
          <div class="value">${preferredDayDisplay}</div>
        </div>
        <div class="info-row">
          <div class="label">Bringing a Passenger</div>
          <div class="value">${passengerDisplay}</div>
        </div>
      </div>

      <p style="color: #64748b; font-size: 14px;">Registered at ${timestamp}</p>
    </div>
    <div class="footer">
      <p>This is an automated notification from the millarX website.</p>
      <p>Mazda 6e Drive Day landing page registration</p>
    </div>
  </div>
</body>
</html>
        `,
        text: `
MAZDA 6E DRIVE DAY — NEW REGISTRATION
${timestamp}

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Preferred Day: ${preferredDayDisplay}
Bringing a Passenger: ${passengerDisplay}

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
    console.log('Drive day notification sent:', result.id)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        emailId: result.id
      }),
    }
  } catch (error) {
    console.error('Error sending drive day notification:', error)
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
