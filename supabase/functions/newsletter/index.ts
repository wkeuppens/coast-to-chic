const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email } = await req.json()
    if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400, headers: corsHeaders })

    const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!

    // Add to Resend audience
    const res = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        audience_id: Deno.env.get('RESEND_AUDIENCE_ID'), // set in Supabase secrets
        unsubscribed: false,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      // If contact already exists, treat as success
      if (err.name === 'validation_error' && err.message?.includes('already exists')) {
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      throw new Error(err.message ?? 'Resend error')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Newsletter error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
