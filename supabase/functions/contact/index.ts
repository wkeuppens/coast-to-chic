/**
 * contact Edge Function
 * Accepts form submissions and logs them.
 * Wire RESEND_API_KEY env var to enable email delivery.
 */

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const body = await req.json()
    const { name, email, subject, message, source, company } = body

    if (!email || !message) return json({ error: 'email and message required' }, 400)

    const subjectLine = company
      ? `Partnership enquiry — ${company}`
      : subject
      ? `New message from ${name} — ${subject}`
      : `New message from ${name ?? email}`

    // Log always
    console.log(`[contact] from=${email} source=${source ?? 'unknown'} subject="${subjectLine}"`)
    console.log(`[contact] message: ${message.slice(0, 200)}`)

    // ── Send via Resend if key is set ────────────────────────────────────────
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Follow The Coast <hello@followthecoast.com>',
          to: ['hello@followthecoast.com'],
          reply_to: email,
          subject: subjectLine,
          text: [
            `From: ${name ?? 'Unknown'} <${email}>`,
            company ? `Company: ${company}` : '',
            `Source: ${source ?? 'website'}`,
            '',
            message,
          ].filter(Boolean).join('\n'),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        console.error('Resend error:', err)
        // Don't fail the request — message was logged
      }
    }

    return json({ success: true })

  } catch (err) {
    console.error('Contact error:', err)
    return json({ error: err instanceof Error ? err.message : 'Internal error' }, 500)
  }
})
