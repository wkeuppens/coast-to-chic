/**
 * Supabase Edge Function: sanity-proxy
 * Proxies GROQ queries to Sanity, bypassing browser CSP restrictions.
 * Called with: POST { query: string, params?: object }
 */

const SANITY_PROJECT_ID = '3l5lwj8d'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { query, params } = await req.json()
    if (!query) return new Response(JSON.stringify({ error: 'query required' }), { status: 400, headers: corsHeaders })

    const encoded = encodeURIComponent(query)
    let url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encoded}`

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url += `&$${k}=${encodeURIComponent(JSON.stringify(v))}`
      }
    }

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
