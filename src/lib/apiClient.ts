import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase'

const FUNCTION_MAP: Record<string, string> = {
  '/api/checkout':   'checkout',
  '/api/newsletter': 'newsletter',
  '/api/contact':    'contact',
}

function getFunctionUrl(path: string): string | null {
  const basePath = path.split('?')[0]
  for (const [apiPath, fnName] of Object.entries(FUNCTION_MAP)) {
    if (basePath === apiPath || basePath.startsWith(apiPath + '/')) {
      return `${SUPABASE_URL}/functions/v1/${fnName}${basePath.slice(apiPath.length)}`
    }
  }
  return null
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const fnUrl = getFunctionUrl(path)
  if (!fnUrl) throw new Error(`No backend configured for ${path}`)

  const res = await fetch(fnUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw Object.assign(new Error(err.error ?? `Request failed: ${path}`), { status: res.status })
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put:    <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
