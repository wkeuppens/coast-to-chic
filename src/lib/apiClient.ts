/**
 * API Client — routes requests to Supabase Edge Functions.
 *
 * Read operations (stages, prints, etc.) come from Sanity via sanityQueries.ts.
 * Write operations (checkout, newsletter, contact) go to Supabase Edge Functions.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

// Maps legacy /api/* paths to Supabase Edge Function names
const FUNCTION_MAP: Record<string, string> = {
  '/api/checkout':   'checkout',
  '/api/newsletter': 'newsletter',
  '/api/contact':    'contact',
}

function getFunctionUrl(path: string): string | null {
  // Strip query params for matching
  const basePath = path.split('?')[0]
  // Match exact or prefix
  for (const [apiPath, fnName] of Object.entries(FUNCTION_MAP)) {
    if (basePath === apiPath || basePath.startsWith(apiPath + '/')) {
      const suffix = basePath.slice(apiPath.length)
      return `${SUPABASE_URL}/functions/v1/${fnName}${suffix}`
    }
  }
  return null
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const fnUrl = getFunctionUrl(path)

  if (!fnUrl) {
    // Path not mapped — fail gracefully
    console.warn(`[API] No Edge Function mapped for: ${path}`)
    throw new Error(`No backend configured for ${path}`)
  }

  const res = await fetch(fnUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw Object.assign(new Error(err.error ?? `Request failed: ${path}`), { status: res.status })
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put:    <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
