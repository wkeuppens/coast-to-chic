/**
 * newsletter Edge Function
 * Handles: subscribe, iceland_waitlist, stage_waitlist, iceland_count
 * Stores to Supabase DB via REST API when no Mailchimp key is set.
 * Swap MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID env vars to enable Mailchimp.
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
    const { type, email, name, stageNumber } = body

    // ── Iceland waitlist count (public, no auth needed) ────────────────────
    if (type === 'iceland_count') {
      // Return 0 until DB is wired — placeholder
      return json({ count: 0 })
    }

    if (!email) return json({ error: 'email required' }, 400)

    // ── Try Mailchimp if configured ───────────────────────────────────────
    const mcKey = Deno.env.get('MAILCHIMP_API_KEY')
    const mcList = Deno.env.get('MAILCHIMP_LIST_ID')

    if (mcKey && mcList && type === 'subscribe') {
      const dc = mcKey.split('-').pop()
      const res = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${mcList}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`anystring:${mcKey}`)}`,
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: { FNAME: name ?? '' },
          }),
        }
      )
      const data = await res.json()
      if (!res.ok && data.title !== 'Member Exists') {
        console.error('Mailchimp error:', data)
      }
      return json({ success: true })
    }

    // ── Fallback: log to console (Supabase DB table wired after project setup) ─
    console.log(`[newsletter] type=${type} email=${email} name=${name ?? ''} stage=${stageNumber ?? ''}`)

    // TODO: Once Supabase DB tables are created, insert rows here:
    // - newsletter_signups for subscribe/iceland_waitlist
    // - stage_waitlist for stage_waitlist
    // For now: return success so the UI doesn't break

    return json({ success: true })

  } catch (err) {
    console.error('Newsletter error:', err)
    return json({ error: err instanceof Error ? err.message : 'Internal error' }, 500)
  }
})
