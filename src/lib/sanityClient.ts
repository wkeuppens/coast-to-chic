/**
 * Sanity client — routes ALL reads through Supabase Edge Function proxy.
 * This bypasses the CSP restriction in Lovable that blocks direct fetch()
 * to api.sanity.io and cdn.sanity.io from the browser.
 *
 * The sanity-proxy Edge Function forwards GROQ queries server-side
 * and returns results — no CORS issues, no CSP issues.
 */

import imageUrlBuilder from '@sanity/image-url'
import { createClient } from '@sanity/client'
import type { SanityImageSource } from '@sanity/image-url'
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseHeaders } from './supabase'

// Direct client — used only for image URL building (CDN URLs, not queries)
export const sanityClient = createClient({
  projectId: '3l5lwj8d',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Proxy fetch — all GROQ queries go through Supabase Edge Function
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/sanity-proxy`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify({ query, params }),
    })
    if (!res.ok) throw new Error(`Proxy error: ${res.status}`)
    const json = await res.json()
    return (json.result ?? []) as T
  } catch (err) {
    console.warn('[Sanity] Proxy fetch failed, returning empty:', err)
    return [] as unknown as T
  }
}
