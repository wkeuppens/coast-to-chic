/**
 * stripe-webhook Edge Function
 * Receives Stripe payment events and sends confirmation emails via Resend.
 *
 * Setup:
 * 1. dashboard.stripe.com → Webhooks → Add endpoint
 *    URL: https://rxjoajurtgkcuicnbzmc.supabase.co/functions/v1/stripe-webhook
 *    Event: checkout.session.completed
 * 2. Copy signing secret → Supabase → Settings → Secrets → STRIPE_WEBHOOK_SECRET
 * 3. Add RESEND_API_KEY to Supabase secrets
 */

import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const WHATSAPP_URL = 'https://chat.whatsapp.com/BazCDyy7n0wDcAhFwyq1xV'
const BROCHURE_URL = 'https://www.followthecoast.com/download/FTC_Iceland_2027_v7.12.05.pdf'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get('RESEND_API_KEY')
  if (!key) { console.log('[webhook] No RESEND_API_KEY — skipping email to', to); return }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      from: 'Follow The Coast <hello@followthecoast.com>',
      to: [to],
      subject,
      html,
    }),
  })
  if (!res.ok) console.error('[webhook] Resend error:', await res.json())
  else console.log('[webhook] Email sent to', to)
}

function emailBase(body: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:40px 24px">
  <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.5;margin-bottom:32px">Follow The Coast</p>
  ${body}
  <hr style="border:none;border-top:1px solid #eee;margin:40px 0"/>
  <p style="font-size:11px;opacity:0.4">Follow The Coast · hello@followthecoast.com</p>
  </body></html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const sig = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  let event: Stripe.Event

  try {
    const body = await req.text()
    if (sig && webhookSecret) {
      event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret)
    } else {
      // Dev mode: parse without verification
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    console.error('Webhook signature error:', err)
    return json({ error: 'Invalid signature' }, 400)
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const meta = session.metadata ?? {}
  const email = session.customer_email ?? ''
  const name = meta.customerName ?? 'Runner'
  const productType = meta.productType ?? 'unknown'
  const amount = session.amount_total ? `€${(session.amount_total / 100).toFixed(2)}` : ''

  console.log(`[webhook] ${productType} payment from ${email}`)

  // ── Iceland stage ──────────────────────────────────────────────────────────
  if (productType === 'iceland_stage') {
    const stageNum = meta.stageNumber ?? '?'
    await sendEmail(email, `Iceland 2027 — Stage #${stageNum} confirmed`, emailBase(`
      <h1 style="font-size:28px;font-weight:400;margin-bottom:8px">Stage #${stageNum} is yours.</h1>
      <p style="opacity:0.6;margin-bottom:32px">Iceland 2027 · June 12 – July 13</p>
      <p>Hi ${name},</p>
      <p>Your registration for Stage #${stageNum} of the Follow The Coast Iceland relay is confirmed. ${amount ? `Total paid: ${amount}.` : ''}</p>
      <p>Here's what happens next:</p>
      <ul>
        <li>You'll receive your full stage guide 6 weeks before your stage date</li>
        <li>Join the Iceland 2027 WhatsApp group to connect with the team</li>
        <li>Download the brochure for a full overview of the project</li>
      </ul>
      <p style="margin-top:32px">
        <a href="${WHATSAPP_URL}" style="background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;font-size:13px">Join WhatsApp group</a>
      </p>
      <p style="margin-top:16px">
        <a href="${BROCHURE_URL}" style="color:#1a1a1a;font-size:13px">Download brochure →</a>
      </p>
      <p style="margin-top:32px;opacity:0.6">Questions? Reply to this email.</p>
    `))
  }

  // ── EU Stage registration ──────────────────────────────────────────────────
  else if (productType === 'stage') {
    const stageNum = meta.stageNumber ?? '?'
    await sendEmail(email, `Stage #${stageNum} registered — Follow The Coast`, emailBase(`
      <h1 style="font-size:28px;font-weight:400;margin-bottom:8px">Stage #${stageNum} registered.</h1>
      <p>Hi ${name},</p>
      <p>Your Follow The Coast stage registration is confirmed. ${amount ? `Total paid: ${amount}.` : ''}</p>
      <p>Your stage guide with all logistics will be sent closer to your stage date. Reply to this email with any questions.</p>
      <p style="margin-top:32px">
        <a href="${WHATSAPP_URL}" style="color:#1a1a1a;font-size:13px">Join the community →</a>
      </p>
    `))
  }

  // ── Books ──────────────────────────────────────────────────────────────────
  else if (productType === 'book') {
    const books = meta.selectedBooks?.split(',').join(', ') ?? 'your order'
    await sendEmail(email, 'Your Follow The Coast books are on their way', emailBase(`
      <h1 style="font-size:28px;font-weight:400;margin-bottom:8px">Order confirmed.</h1>
      <p>Hi ${name},</p>
      <p>Your order of ${books} is confirmed. ${amount ? `Total paid: ${amount}.` : ''}</p>
      <p>Books are shipped by our fulfilment partner. Allow 5–7 working days for delivery within Europe.</p>
      <p style="opacity:0.6;margin-top:32px">Questions about your order? Reply to this email.</p>
    `))
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  else if (productType === 'event') {
    const eventId = meta.eventId ?? 'event'
    const eventNames: Record<string, string> = {
      ftk_35km: 'Follow The Kust — 35 km · 6 February 2027',
      ftk_75km: 'Follow The Kust — 75 km · 6 February 2027',
      trg_shared: 'Trail Retreat Girona · 11–14 March 2027',
      trg_own: 'Trail Retreat Girona · 11–14 March 2027',
      madeira: 'Crossing Madeira · 5–9 May 2027',
      tmb_2026_4day: 'Tour du Mont Blanc · 4–9 August 2026',
      book_launch_dinner: 'Book 3 Launch · 20 June 2026 · De Koninck, Antwerp',
    }
    const eventName = eventNames[eventId] ?? eventId
    await sendEmail(email, `Confirmed: ${eventName.split('·')[0].trim()}`, emailBase(`
      <h1 style="font-size:28px;font-weight:400;margin-bottom:8px">See you there.</h1>
      <p>Hi ${name},</p>
      <p>Your registration for <strong>${eventName}</strong> is confirmed. ${amount ? `Total paid: ${amount}.` : ''}</p>
      <p>Full logistics and details will be sent closer to the date. Reply to this email with any questions.</p>
    `))
  }

  // ── Print ──────────────────────────────────────────────────────────────────
  else if (productType === 'print') {
    await sendEmail(email, 'Your print is ordered — Follow The Coast', emailBase(`
      <h1 style="font-size:28px;font-weight:400;margin-bottom:8px">Print ordered.</h1>
      <p>Hi ${name},</p>
      <p>Your Follow The Coast print is confirmed. ${amount ? `Total paid: ${amount}.` : ''}</p>
      <p>Prints are shipped within 10 working days. You'll receive a tracking number by email.</p>
    `))
  }

  return json({ received: true })
})
