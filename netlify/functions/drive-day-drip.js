// Scheduled Netlify function — runs daily to send drip emails to drive day registrants
// Schedule configured in netlify.toml
//
// Required environment variables (set in Netlify dashboard):
//   SUPABASE_URL        — your Supabase project URL
//   SUPABASE_SERVICE_KEY — Supabase service role key (NOT anon key)
//   RESEND_API_KEY       — Resend API key

// Drip email sequence — each step fires after N days since registration
const DRIP_SEQUENCE = [
  {
    step: 1,
    daysAfterSignup: 3,
    subject: 'What to expect at the Mazda 6e Drive Day',
    buildHtml: (firstName) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b21a8, #4c1d95); color: white; padding: 35px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
    .content { background: #ffffff; padding: 35px 30px; border: 1px solid #e2e8f0; border-top: none; }
    .content h2 { color: #4c1d95; margin-top: 0; }
    .content p { color: #475569; font-size: 16px; }
    .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 25px 0; }
    .spec-item { background: #f8fafc; border-radius: 8px; padding: 15px; text-align: center; }
    .spec-value { font-size: 22px; font-weight: 700; color: #6b21a8; }
    .spec-label { font-size: 13px; color: #64748b; margin-top: 4px; }
    .footer { text-align: center; padding: 25px; color: #94a3b8; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
    .footer a { color: #6b21a8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>The Mazda 6e — What's the buzz?</h1>
      <div class="badge">millarX x Ringwood Mazda</div>
    </div>
    <div class="content">
      <h2>Hey ${firstName},</h2>
      <p>You registered for the Mazda 6e Drive Day — nice move. Here's a quick look at what Mazda is bringing to the table with the 6e.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
        <tr>
          <td width="48%" style="background: #f8fafc; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #6b21a8;">~500km</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Estimated Range</div>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background: #f8fafc; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #6b21a8;">EV</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Fully Electric</div>
          </td>
        </tr>
        <tr><td colspan="3" height="12"></td></tr>
        <tr>
          <td width="48%" style="background: #f8fafc; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #6b21a8;">Sedan</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Sleek Design</div>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background: #f8fafc; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 22px; font-weight: 700; color: #6b21a8;">FBT Exempt</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Tax Savings</div>
          </td>
        </tr>
      </table>

      <p>The 6e is Mazda's first proper crack at an electric sedan, and early impressions suggest they've nailed the driving dynamics. We can't wait to put it through its paces with you.</p>
      <p>We'll be in touch as soon as dates are locked in. Sit tight.</p>
      <p style="margin-bottom: 0;">Cheers,<br><strong>The millarX Team</strong></p>
    </div>
    <div class="footer">
      <p>millarX — Novated leasing without the BS.</p>
      <p><a href="https://millarx.com.au">millarx.com.au</a> &nbsp;|&nbsp; <a href="https://millarx.com.au/privacy">Privacy</a></p>
    </div>
  </div>
</body>
</html>`,
    buildText: (firstName) => `Hey ${firstName},

You registered for the Mazda 6e Drive Day — nice move. Here's a quick look at what Mazda is bringing to the table with the 6e.

- ~500km estimated range
- Fully electric
- Sleek sedan design
- FBT exempt (tax savings on a novated lease)

The 6e is Mazda's first proper crack at an electric sedan, and early impressions suggest they've nailed the driving dynamics. We can't wait to put it through its paces with you.

We'll be in touch as soon as dates are locked in. Sit tight.

Cheers,
The millarX Team`,
  },
  {
    step: 2,
    daysAfterSignup: 7,
    subject: 'Spots are filling up — bring a friend?',
    buildHtml: (firstName) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b21a8, #4c1d95); color: white; padding: 35px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
    .content { background: #ffffff; padding: 35px 30px; border: 1px solid #e2e8f0; border-top: none; }
    .content h2 { color: #4c1d95; margin-top: 0; }
    .content p { color: #475569; font-size: 16px; }
    .cta-box { background: linear-gradient(135deg, #fdf4ff, #fae8ff); border: 1px solid #e9d5ff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
    .cta-box p { margin: 0 0 15px 0; font-size: 16px; color: #475569; }
    .cta-link { display: inline-block; background: #6b21a8; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
    .footer { text-align: center; padding: 25px; color: #94a3b8; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
    .footer a { color: #6b21a8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Know someone who'd love this?</h1>
      <div class="badge">millarX x Ringwood Mazda</div>
    </div>
    <div class="content">
      <h2>Hey ${firstName},</h2>
      <p>Quick update on the Mazda 6e Drive Day — spots are filling up and we're well on the way to capacity.</p>
      <p>If you know someone who'd love to get behind the wheel of the 6e, now's the time to share the link before it's too late.</p>

      <div class="cta-box">
        <p>Share the drive day with a mate:</p>
        <a href="https://millarx.com.au/mazda-6e-drive-day" class="cta-link">Share the link</a>
      </div>

      <p>We're still finalising dates with Ringwood Mazda — expect an update soon.</p>
      <p style="margin-bottom: 0;">Cheers,<br><strong>The millarX Team</strong></p>
    </div>
    <div class="footer">
      <p>millarX — Novated leasing without the BS.</p>
      <p><a href="https://millarx.com.au">millarx.com.au</a> &nbsp;|&nbsp; <a href="https://millarx.com.au/privacy">Privacy</a></p>
    </div>
  </div>
</body>
</html>`,
    buildText: (firstName) => `Hey ${firstName},

Quick update on the Mazda 6e Drive Day — spots are filling up and we're well on the way to capacity.

If you know someone who'd love to get behind the wheel of the 6e, now's the time to share the link before it's too late.

Share: https://millarx.com.au/mazda-6e-drive-day

We're still finalising dates with Ringwood Mazda — expect an update soon.

Cheers,
The millarX Team`,
  },
  {
    step: 3,
    daysAfterSignup: 14,
    subject: 'Mazda 6e Drive Day — dates coming soon',
    buildHtml: (firstName) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6b21a8, #4c1d95); color: white; padding: 35px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
    .content { background: #ffffff; padding: 35px 30px; border: 1px solid #e2e8f0; border-top: none; }
    .content h2 { color: #4c1d95; margin-top: 0; }
    .content p { color: #475569; font-size: 16px; }
    .info-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 20px; margin: 25px 0; }
    .info-box h3 { color: #166534; margin: 0 0 10px 0; }
    .info-box p { color: #15803d; margin: 0; }
    .footer { text-align: center; padding: 25px; color: #94a3b8; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
    .footer a { color: #6b21a8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Dates are nearly locked in</h1>
      <div class="badge">millarX x Ringwood Mazda</div>
    </div>
    <div class="content">
      <h2>Hey ${firstName},</h2>
      <p>Just a quick one — we're getting closer to confirming the Mazda 6e Drive Day dates with Ringwood Mazda.</p>
      <p>The 6e is expected to arrive in June, and we'll be reaching out to confirmed registrants like you first to lock in your preferred time slot.</p>

      <div class="info-box">
        <h3>You're all set</h3>
        <p>No action needed — we'll email you with dates and booking details as soon as they're confirmed. Early registrants get priority.</p>
      </div>

      <p>Thanks for your patience. It'll be worth the wait.</p>
      <p style="margin-bottom: 0;">Cheers,<br><strong>The millarX Team</strong></p>
    </div>
    <div class="footer">
      <p>millarX — Novated leasing without the BS.</p>
      <p><a href="https://millarx.com.au">millarx.com.au</a> &nbsp;|&nbsp; <a href="https://millarx.com.au/privacy">Privacy</a></p>
    </div>
  </div>
</body>
</html>`,
    buildText: (firstName) => `Hey ${firstName},

Just a quick one — we're getting closer to confirming the Mazda 6e Drive Day dates with Ringwood Mazda.

The 6e is expected to arrive in June, and we'll be reaching out to confirmed registrants like you first to lock in your preferred time slot.

You're all set — no action needed. We'll email you with dates and booking details as soon as they're confirmed. Early registrants get priority.

Thanks for your patience. It'll be worth the wait.

Cheers,
The millarX Team`,
  },
]

const TOTAL_STEPS = DRIP_SEQUENCE.length

exports.handler = async (event, context) => {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    console.error('Missing required environment variables')
    return { statusCode: 500, body: 'Missing config' }
  }

  const supabaseHeaders = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  }

  try {
    // Fetch registrants who haven't completed the drip sequence
    const fetchUrl = `${SUPABASE_URL}/rest/v1/drive_day_registrations?select=id,name,email,created_at,last_email_step&last_email_step=lt.${TOTAL_STEPS}&status=neq.cancelled`
    const fetchRes = await fetch(fetchUrl, { headers: supabaseHeaders })

    if (!fetchRes.ok) {
      console.error('Supabase fetch error:', await fetchRes.text())
      return { statusCode: 500, body: 'Database error' }
    }

    const registrants = await fetchRes.json()
    const now = new Date()
    let emailsSent = 0

    for (const reg of registrants) {
      const nextStep = reg.last_email_step + 1
      const drip = DRIP_SEQUENCE.find((d) => d.step === nextStep)
      if (!drip) continue

      // Check if enough days have passed since signup
      const signupDate = new Date(reg.created_at)
      const daysSinceSignup = (now - signupDate) / (1000 * 60 * 60 * 24)

      if (daysSinceSignup < drip.daysAfterSignup) continue

      const firstName = reg.name.split(' ')[0]

      // Send the email
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'millarX <notifications@millarx.com.au>',
            to: [reg.email],
            subject: drip.subject,
            html: drip.buildHtml(firstName),
            text: drip.buildText(firstName),
          }),
        })

        if (!emailRes.ok) {
          console.error(`Failed to send step ${nextStep} to ${reg.email}:`, await emailRes.text())
          continue
        }

        // Update the registrant's drip progress
        const updateUrl = `${SUPABASE_URL}/rest/v1/drive_day_registrations?id=eq.${reg.id}`
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: supabaseHeaders,
          body: JSON.stringify({
            last_email_step: nextStep,
            last_email_sent_at: now.toISOString(),
          }),
        })

        emailsSent++
        console.log(`Sent step ${nextStep} to ${reg.email}`)
      } catch (err) {
        console.error(`Error sending to ${reg.email}:`, err)
      }
    }

    console.log(`Drip run complete: ${emailsSent} emails sent to ${registrants.length} registrants`)
    return {
      statusCode: 200,
      body: JSON.stringify({ emailsSent, totalRegistrants: registrants.length }),
    }
  } catch (error) {
    console.error('Drip function error:', error)
    return { statusCode: 500, body: error.message }
  }
}
