// Supabase Edge Function: stripe-webhook
// Handles Stripe checkout.session.completed events for Lease Rescue Pack purchases
// Sends branded confirmation email to customer and notification to Ben

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function getCustomerEmailHtml(customerName: string, customerEmail: string, sessionId: string): string {
  const firstName = customerName.split(' ')[0] || 'there'
  const uploadUrl = `https://millarx.com.au/lease-rescue/upload?session_id=${sessionId}&email=${encodeURIComponent(customerEmail)}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Lease Rescue Pack</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">millarX</h1>
              <p style="margin: 10px 0 0; color: #c4b5fd; font-size: 14px;">Novated Leasing, Without the Hidden Costs</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: 600;">
                Thanks for your purchase, ${firstName}!
              </h2>

              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                Your Lease Rescue Pack is ready to go. Here's what happens next:
              </p>

              <!-- Step Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: #7c3aed; font-size: 18px; font-weight: 600;">
                      📄 Next Step: Upload Your Quote
                    </h3>
                    <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
                      Click the button below to securely upload your novated lease quote (PDF or screenshot).
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin: 16px 0;">
                      <tr>
                        <td align="center">
                          <a href="${uploadUrl}"
                             style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                            Upload Your Quote
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                      I'll personally review it and get back to you within <strong>24-48 hours</strong> with:
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What You'll Get -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="color: #10b981; font-size: 18px;">✓</span>
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          <strong>Exact rate calculation</strong> — the real interest rate, not what they show you
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="color: #10b981; font-size: 18px;">✓</span>
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          <strong>Line-by-line breakdown</strong> — exactly what's being financed
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="color: #10b981; font-size: 18px;">✓</span>
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          <strong>Comparison quotes</strong> — see how other lenders stack up
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="color: #10b981; font-size: 18px;">✓</span>
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          <strong>Negotiation scripts</strong> — what to say to get a better deal
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Alternative -->
              <p style="margin: 0 0 20px; color: #64748b; font-size: 14px; line-height: 1.6; text-align: center;">
                Prefer email? Just reply to this email with your quote attached — I'll see it straight away.
              </p>

              <!-- Reminder -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      <strong>Remember:</strong> If you end up leasing with millarX, this $49 gets credited back to you — making this analysis completely free.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #ffffff; font-size: 16px; font-weight: 600;">Ben Millar</p>
              <p style="margin: 0 0 4px; color: #94a3b8; font-size: 14px;">millarX — Novated Leasing</p>
              <p style="margin: 0 0 16px; color: #94a3b8; font-size: 14px;">
                <a href="tel:0492886857" style="color: #94a3b8; text-decoration: none;">0492 886 857</a> ·
                <a href="mailto:ben@millarx.com.au" style="color: #94a3b8; text-decoration: none;">ben@millarx.com.au</a>
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                Blackrock Leasing Pty Ltd | ABN 15 681 267 818 | Australian Credit Licence 569484
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

function getBenNotificationHtml(customerName: string, customerEmail: string, amount: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
  <h2 style="color: #7c3aed;">🎉 New Lease Rescue Pack Purchase!</h2>

  <table style="border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px 16px 8px 0; color: #64748b;">Customer:</td>
      <td style="padding: 8px 0; font-weight: 600;">${customerName}</td>
    </tr>
    <tr>
      <td style="padding: 8px 16px 8px 0; color: #64748b;">Email:</td>
      <td style="padding: 8px 0;"><a href="mailto:${customerEmail}">${customerEmail}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 16px 8px 0; color: #64748b;">Amount:</td>
      <td style="padding: 8px 0; font-weight: 600; color: #10b981;">$${(amount / 100).toFixed(2)}</td>
    </tr>
  </table>

  <p style="color: #475569;">
    The customer has been sent instructions to reply with their quote. Keep an eye out for their email!
  </p>

  <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
    — millarX Website
  </p>
</body>
</html>
`
}

// ============================================
// GMAIL SMTP SENDER
// ============================================

async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  replyTo?: string
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
    replyTo: replyTo || gmailUser,
  })

  await client.close()
}

// ============================================
// STRIPE WEBHOOK HANDLER
// ============================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    // In production, verify the webhook signature
    // For now, we'll parse the event directly
    const event = JSON.parse(body)

    console.log(`Received Stripe event: ${event.type}`)

    // Only handle checkout.session.completed
    if (event.type !== 'checkout.session.completed') {
      return new Response(
        JSON.stringify({ received: true, message: 'Event type not handled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = event.data.object

    // Extract customer details
    const customerEmail = session.customer_details?.email || session.customer_email
    const customerName = session.customer_details?.name || 'Valued Customer'
    const amountTotal = session.amount_total || 4900 // Default to $49

    if (!customerEmail) {
      console.error('No customer email found in session')
      return new Response(
        JSON.stringify({ error: 'No customer email found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing purchase for: ${customerName} <${customerEmail}>`)

    // Store purchase in Supabase (optional - for tracking)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient.from('lease_rescue_purchases').insert({
      email: customerEmail,
      name: customerName,
      amount: amountTotal,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      status: 'completed',
    }).catch(err => {
      // Table might not exist yet - that's okay
      console.log('Could not store purchase (table may not exist):', err.message)
    })

    // Send branded email to customer
    console.log('Sending confirmation email to customer...')
    await sendEmail(
      customerEmail,
      'Your Lease Rescue Pack — Next Steps',
      getCustomerEmailHtml(customerName, customerEmail, session.id),
      'ben@millarx.com.au' // Reply-to Ben
    )

    // Send notification to Ben
    console.log('Sending notification to Ben...')
    await sendEmail(
      'ben@millarx.com.au',
      `💰 New Lease Rescue Pack Purchase - ${customerName}`,
      getBenNotificationHtml(customerName, customerEmail, amountTotal)
    )

    console.log('All emails sent successfully!')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Purchase processed and emails sent',
        customer: customerEmail
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
