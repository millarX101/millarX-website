// Netlify serverless function to send email notifications for employer leads
// Uses Resend email service (free tier: 100 emails/month, then $20/month for 5000)

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
    const RESEND_API_KEY = process.env.RESEND_API_KEY

    // If no Resend API key, log and return success (don't block form submission)
    if (!RESEND_API_KEY) {
      console.log('No RESEND_API_KEY configured. Email notification skipped.')
      console.log('Employer lead data:', JSON.stringify(data, null, 2))
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Lead saved (email notification not configured)' }),
      }
    }

    // Format the email content
    const emailHtml = `
      <h2>New Employer Inquiry from millarX Website</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.company_name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Contact Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.contact_name || 'Not provided'}</td>
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

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'millarX Website <notifications@millarx.com.au>',
        to: ['ben@millarx.com.au'],
        subject: `New Employer Lead: ${data.company_name || 'Unknown Company'}`,
        html: emailHtml,
        reply_to: data.email,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Resend API error:', errorText)
      // Don't fail the whole request if email fails
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Lead saved (email notification failed)' }),
      }
    }

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
