import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const ORIGIN = Deno.env.get('SITE_URL') || 'https://preview--coast-to-chic.lovable.app'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

// ── Prices ────────────────────────────────────────────────────────────────────

function stagePrice(tier: string) {
  return ({
    stage_solo:  { amount: 69900,  name: 'Stage — Solo (1 runner)' },
    stage_duo:   { amount: 99900,  name: 'Stage — Duo (2 runners)' },
    stage_group: { amount: 129900, name: 'Stage — Team (3+ runners)' },
  } as Record<string, { amount: number; name: string }>)[tier] ?? { amount: 69900, name: 'Stage Registration' }
}

function bookUnitPrice(qty: number) {
  if (qty === 1) return 6500
  if (qty === 2) return 10900
  return 14900
}

function shippingPrice(countryCode: string, bundle: boolean) {
  return countryCode === 'BE' ? (bundle ? 2400 : 1200) : (bundle ? 5800 : 2900)
}

const EVENTS: Record<string, { amount: number; name: string }> = {
  ftk_35km:           { amount: 3900,   name: 'Follow The Kust — 35 km' },
  ftk_75km:           { amount: 5900,   name: 'Follow The Kust — 75 km' },
  tmb_2026_4day:      { amount: 99900,  name: 'Tour du Mont Blanc 2026 — 4–9 Aug' },
  tmb_2027_4day:      { amount: 99900,  name: 'Tour du Mont Blanc 2027' },
  trg_shared:         { amount: 89900,  name: 'Trail Retreat Girona — Shared room' },
  trg_own:            { amount: 149900, name: 'Trail Retreat Girona — Private room' },
  madeira:            { amount: 79900,  name: 'Crossing Madeira' },
  book_launch_dinner: { amount: 4500,   name: 'Book 3 Launch — Walking dinner' },
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const body = await req.json()
    const { productType, customerEmail, customerName } = body

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    let metadata: Record<string, string> = {
      productType: productType ?? 'unknown',
      customerName: customerName ?? '',
    }

    // ── Session lookup ────────────────────────────────────────────────────────
    if (productType === 'session') {
      const { sessionId } = body
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      return json({
        status: session.status,
        customerEmail: session.customer_email,
        productType: session.metadata?.productType ?? null,
        eventName: session.metadata?.eventId ?? session.metadata?.eventName ?? null,
        amountTotal: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      })
    }

    // ── Free RSVP — no Stripe needed ─────────────────────────────────────────
    if (productType === 'book_launch_free') {
      // Store RSVP (just return success for now — email handled by webhook later)
      return json({ success: true, message: 'RSVP confirmed. See you there.' })
    }

    // ── Books ─────────────────────────────────────────────────────────────────
    if (productType === 'book') {
      const { selectedBooks, countryCode } = body
      const qty = selectedBooks?.length ?? 1
      lineItems = [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Follow The Coast — ${qty > 1 ? 'Books' : 'Book'} (${(selectedBooks ?? []).join(', ')})` },
            unit_amount: bookUnitPrice(qty) * qty,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Shipping — ${countryCode === 'BE' ? 'Belgium' : 'Europe'}` },
            unit_amount: shippingPrice(countryCode, qty > 1),
          },
          quantity: 1,
        },
      ]
      metadata = { ...metadata, selectedBooks: (selectedBooks ?? []).join(','), countryCode }
    }

    // ── EU Stage registration ─────────────────────────────────────────────────
    else if (productType === 'stage') {
      const { stageNumber, tier } = body
      const { amount, name } = stagePrice(tier)
      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: { name: `${name} — Stage #${stageNumber}` },
          unit_amount: amount,
        },
        quantity: 1,
      }]
      metadata = { ...metadata, stageNumber: String(stageNumber), tier }
    }

    // ── Iceland Stage ─────────────────────────────────────────────────────────
    else if (productType === 'event' && body.eventId === 'iceland') {
      const { stageNumber, teamMembers } = body
      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Iceland 2027 — Stage #${stageNumber}`,
            description: 'Includes 3 books, crew, photographer, food & logistics.',
          },
          unit_amount: 139900,
        },
        quantity: 1,
      }]
      const memberData: Record<string, string> = {}
      if (Array.isArray(teamMembers)) {
        teamMembers.forEach((m: { name: string; email: string }, i: number) => {
          memberData[`runner_${i + 1}_name`] = m.name
          memberData[`runner_${i + 1}_email`] = m.email
        })
      }
      metadata = {
        ...metadata,
        productType: 'iceland_stage',
        stageNumber: String(stageNumber),
        runnerCount: String(Array.isArray(teamMembers) ? teamMembers.length : 1),
        ...memberData,
      }
    }

    // ── Events ────────────────────────────────────────────────────────────────
    else if (productType === 'event') {
      const { eventId, addDinner } = body
      const ev = EVENTS[eventId]
      if (!ev) return json({ error: `Unknown event: ${eventId}` }, 400)
      lineItems = [{
        price_data: { currency: 'eur', product_data: { name: ev.name }, unit_amount: ev.amount },
        quantity: 1,
      }]
      if (addDinner && eventId.startsWith('ftk')) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: { name: 'Community Dinner' },
            unit_amount: 5500,
          },
          quantity: 1,
        })
      }
      metadata = { ...metadata, eventId }
    }

    // ── Print ─────────────────────────────────────────────────────────────────
    else if (productType === 'print') {
      const { printId, printTitle, priceEur } = body
      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Print — ${printTitle}` },
          unit_amount: Math.round(priceEur * 100),
        },
        quantity: 1,
      }]
      metadata = { ...metadata, printId }
    }

    else {
      return json({ error: 'Unknown product type' }, 400)
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal', 'bancontact'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${ORIGIN}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}`,
      metadata,
      locale: 'auto',
    })

    return json({ paymentUrl: session.url })

  } catch (err) {
    console.error('Checkout error:', err)
    return json({ error: err instanceof Error ? err.message : 'Internal error' }, 500)
  }
})
