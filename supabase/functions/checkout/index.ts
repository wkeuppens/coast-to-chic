import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const ORIGIN = Deno.env.get('SITE_URL') || 'https://preview--coast-to-chic.lovable.app'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Price helpers ──────────────────────────────────────────────────────────────

function stageLineItem(tier: string) {
  const prices: Record<string, { amount: number; name: string }> = {
    stage_solo:  { amount: 69900,  name: 'Stage Registration — Solo (1 runner)' },
    stage_duo:   { amount: 99900,  name: 'Stage Registration — Duo (2 runners)' },
    stage_group: { amount: 129900, name: 'Stage Registration — Team (3+ runners)' },
  }
  return prices[tier] ?? prices.stage_solo
}

function bookPrice(qty: number) {
  if (qty === 1) return 6500
  if (qty === 2) return 10900
  return 14900
}

function shippingAmount(countryCode: string, isBundle: boolean) {
  const isBE = countryCode === 'BE'
  if (isBE) return isBundle ? 2400 : 1200
  return isBundle ? 5800 : 2900
}

const EVENT_PRICES: Record<string, { amount: number; name: string }> = {
  ftk_35km:           { amount: 3900,  name: 'Follow The Kust — 35 km' },
  ftk_75km:           { amount: 5900,  name: 'Follow The Kust — 75 km' },
  homerun:            { amount: 19900, name: 'Home Run Venice — 100 km' },
  tmb_2026_4day:      { amount: 99900, name: 'Tour du Mont Blanc 2026 — 4 days' },
  tmb_2027_4day:      { amount: 99900, name: 'Tour du Mont Blanc 2027 — 4 days' },
  tmb_2027_7day:      { amount: 149900, name: 'Tour du Mont Blanc 2027 — 7 days' },
  iceland:            { amount: 0,     name: 'Iceland — TBD' },
  book_launch_dinner: { amount: 5500,  name: 'Book Launch Dinner' },
}

// ── Handler ────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const { productType, customerEmail, customerName } = body

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    let metadata: Record<string, string> = { customerName, productType }

    // ── Books ────────────────────────────────────────────────────────────────
    if (productType === 'book') {
      const { selectedBooks, addCanaryIslands, countryCode } = body
      const qty = selectedBooks.length
      const unitAmount = bookPrice(qty)
      const isBundle = qty > 1

      lineItems = [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Follow The Coast — Book${qty > 1 ? 's' : ''} (${selectedBooks.join(', ')})` },
            unit_amount: unitAmount * qty,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Shipping — ${countryCode === 'BE' ? 'Belgium' : 'Europe'}` },
            unit_amount: shippingAmount(countryCode, isBundle),
          },
          quantity: 1,
        },
      ]

      if (addCanaryIslands) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: { name: 'Follow The Coast — Canary Islands Add-on' },
            unit_amount: 2500,
          },
          quantity: 1,
        })
      }

      metadata = { ...metadata, selectedBooks: selectedBooks.join(','), countryCode }
    }

    // ── Stage ────────────────────────────────────────────────────────────────
    else if (productType === 'stage') {
      const { stageNumber, tier } = body
      const { amount, name } = stageLineItem(tier)
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

    // ── Event ────────────────────────────────────────────────────────────────
    else if (productType === 'event') {
      const { eventId, addDinner } = body
      const { amount, name } = EVENT_PRICES[eventId] ?? { amount: 0, name: eventId }
      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: { name },
          unit_amount: amount,
        },
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

    // ── Print ────────────────────────────────────────────────────────────────
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

    // ── Iceland Stage ────────────────────────────────────────────────────────
    else if (productType === 'event' && body.eventId === 'iceland') {
      const { stageNumber, teamMembers } = body

      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Iceland 2027 — Stage #${stageNumber}`,
            description: 'Includes 3 books, crew, photographer, food & logistics.',
          },
          unit_amount: 139900, // €1,399
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
      // Free event — no Stripe session needed, just return success
      return new Response(
        JSON.stringify({ success: true, message: 'Registered for book launch' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    else {
      return new Response(
        JSON.stringify({ error: 'Unknown product type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal', 'bancontact'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${ORIGIN}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/checkout?cancelled=true`,
      metadata,
      locale: 'auto',
    })

    return new Response(
      JSON.stringify({ paymentUrl: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Checkout error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
