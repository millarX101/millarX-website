// Supabase Edge Function: notify-quote-upload
// Sends email notification to Ben when a customer uploads their quote
// Called from the LeaseRescueUpload page after successful upload

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getNotificationHtml(
  email: string,
  fileUrl: string,
  notes: string,
  consent: boolean
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 24px;">📄 New Quote Uploaded!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 120px;">Customer:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #7c3aed; font-weight: 600;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Storage Consent:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: ${consent ? '#10b981' : '#ef4444'};">${consent ? 'Yes' : 'No'}</td>
        </tr>
        ${notes ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; vertical-align: top;">Notes:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${notes}</td>
        </tr>
        ` : ''}
      </table>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${fileUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          View Quote File
        </a>
      </div>

      <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
        Time to work your magic! 🪄
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 16px; text-align: center;">
      <p style="margin: 0; color: #64748b; font-size: 12px;">
        Lease Rescue Pack · millarX Website
      </p>
    </div>
  </div>
</body>
</html>
`
}

async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  const client = new SmtpClient()

  const gmailUser = Deno.env.get('GMAIL_USER')
  const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD')

  if (!gmailUser || !gmailAppPassword) {
    throw new Error('Gmail credentials not configured')
  }

  await client.connectTLS({
    hostname: 'smtp.gmail.com',
    port: 465,
    username: gmailUser,
    password: gmailAppPassword,
  })

  await client.send({
    from: `millarX <${gmailUser}>`,
    to: to,
    subject: subject,
    content: htmlContent,
    html: htmlContent,
  })

  await client.close()
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId, email, fileUrl, notes, consent } = await req.json()

    if (!email || !fileUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Sending quote upload notification for: ${email}`)

    // Send notification to Ben
    await sendEmail(
      'ben@millarx.com.au',
      `📄 Quote Uploaded - ${email}`,
      getNotificationHtml(email, fileUrl, notes || '', consent || false)
    )

    console.log('Notification sent successfully!')

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
