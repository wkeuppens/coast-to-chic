const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { name, email, subject, message } = await req.json()
    if (!email || !message) {
      return new Response(JSON.stringify({ error: 'Email and message required' }), { status: 400, headers: corsHeaders })
    }

    const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!
    const TO_EMAIL = Deno.env.get('CONTACT_TO_EMAIL') || 'hello@followthecoast.com'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Follow The Coast <noreply@followthecoast.com>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: subject ? `[FTC Contact] ${subject}` : `[FTC Contact] Message from ${name}`,
        html: `
          <p><strong>From:</strong> ${name} (${email})</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? 'Resend error')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Contact error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
