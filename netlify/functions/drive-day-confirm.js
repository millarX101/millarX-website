// Sends confirmation email to the registrant after they sign up for the Mazda 6e Drive Day

exports.handler = async (event, context) => {
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
    const { name, email } = JSON.parse(event.body)

    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name and email are required' }),
      }
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email service not configured' }),
      }
    }

    const firstName = name.split(' ')[0]

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'millarX <notifications@millarx.com.au>',
        to: [email],
        subject: "You're in! Mazda 6e Drive Day with millarX & Ringwood Mazda",
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b21a8, #4c1d95); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 13px; margin-top: 15px; }
    .content { background: #ffffff; padding: 35px 30px; border: 1px solid #e2e8f0; border-top: none; }
    .content h2 { color: #4c1d95; margin-top: 0; }
    .content p { color: #475569; font-size: 16px; }
    .highlight-box { background: linear-gradient(135deg, #fdf4ff, #fae8ff); border: 1px solid #e9d5ff; border-radius: 10px; padding: 20px; margin: 25px 0; }
    .highlight-box h3 { color: #6b21a8; margin: 0 0 10px 0; font-size: 16px; }
    .highlight-box ul { margin: 0; padding-left: 20px; color: #475569; }
    .highlight-box li { margin-bottom: 8px; }
    .footer { text-align: center; padding: 25px; color: #94a3b8; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
    .footer a { color: #6b21a8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You're on the list!</h1>
      <p>Mazda 6e Drive Day</p>
      <div class="badge">millarX x Ringwood Mazda</div>
    </div>
    <div class="content">
      <h2>Hey ${firstName},</h2>
      <p>Thanks for registering your interest in the Mazda 6e Drive Day. We're excited to have you on board.</p>
      <p>The all-new Mazda 6e won't be on the ground until June, but we're working with Ringwood Mazda to lock in dates as soon as cars are available. With only 100 spots up for grabs, you've made a smart move registering early.</p>

      <div class="highlight-box">
        <h3>What happens next?</h3>
        <ul>
          <li>We'll email you as soon as dates are confirmed</li>
          <li>You'll get first pick of available time slots</li>
          <li>We'll share more details about the Mazda 6e closer to the event</li>
        </ul>
      </div>

      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin: 25px 0; border: 1px solid #e2e8f0;">
        <h3 style="color: #4c1d95; margin: 0 0 10px 0; font-size: 16px;">While you wait — curious about novated leasing?</h3>
        <p style="margin: 0 0 12px 0; color: #475569; font-size: 15px;">millarX does novated leasing differently. No hidden fees, no inflated margins, no sales pressure. We show you exactly what you'll pay — the real finance rate, itemised running costs, everything. Our transparent calculator lets you run the numbers yourself before talking to anyone.</p>
        <a href="https://millarx.com.au/novated-leasing" style="display: inline-block; background: #6b21a8; color: white; padding: 10px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Try the Calculator</a>
      </div>

      <p>If you have any questions, just reply to this email or reach out to us at <a href="mailto:info@millarx.com.au" style="color: #6b21a8;">info@millarx.com.au</a>.</p>
      <p style="margin-bottom: 0;">Cheers,<br><strong>The millarX Team</strong></p>
    </div>
    <div class="footer">
      <p>millarX — Novated leasing without the BS.</p>
      <p><a href="https://millarx.com.au">millarx.com.au</a> &nbsp;|&nbsp; <a href="https://millarx.com.au/privacy">Privacy</a></p>
    </div>
  </div>
</body>
</html>
        `,
        text: `Hey ${firstName},

Thanks for registering your interest in the Mazda 6e Drive Day with millarX and Ringwood Mazda.

The all-new Mazda 6e won't be on the ground until June, but we're working with Ringwood Mazda to lock in dates as soon as cars are available. With only 100 spots up for grabs, you've made a smart move registering early.

What happens next?
- We'll email you as soon as dates are confirmed
- You'll get first pick of available time slots
- We'll share more details about the Mazda 6e closer to the event

WHILE YOU WAIT — CURIOUS ABOUT NOVATED LEASING?
millarX does novated leasing differently. No hidden fees, no inflated margins, no sales pressure. We show you exactly what you'll pay — the real finance rate, itemised running costs, everything. Our transparent calculator lets you run the numbers yourself before talking to anyone.

Try the calculator: https://millarx.com.au/novated-leasing

If you have any questions, reply to this email or reach out at info@millarx.com.au.

Cheers,
The millarX Team

---
millarx.com.au
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to send confirmation email' }),
      }
    }

    const result = await response.json()
    console.log('Confirmation email sent:', result.id)

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, emailId: result.id }),
    }
  } catch (error) {
    console.error('Error sending confirmation:', error)
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    }
  }
}
