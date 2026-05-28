/**
 * src/lib/api.ts
 * All FTC API calls routed through Supabase Edge Functions.
 * Replaces the old VITE_API_BASE_URL pattern which was never set.
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase'

async function req<T>(method: string, fnName: string, body?: unknown): Promise<T> {
  const url = `${SUPABASE_URL}/functions/v1/${fnName}`
  const res = await fetch(url, {
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
    throw Object.assign(new Error(err.error ?? `Request failed: ${fnName}`), { status: res.status })
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ApiStage {
  id: string; stageNumber: number; displayNumber?: number; title: string
  country: string; region: string | null; distanceKm: number | null
  startLocation: string; endLocation: string
  startCoord: { lat: number; lng: number } | null
  endCoord: { lat: number; lng: number } | null
  shoreholder: string | null; shoreholderSlug: string | null
  runDate: string | null; status: 'completed' | 'available' | 'locked' | 'booked'
  image: string; description: string | null; bookNumber: number | null; isIceland: boolean
}

export interface IcelandStage {
  id: string; stageNumber: number; displayNumber: number; title: string
  distanceKm: number | null; startLocation: string; endLocation: string
  startCoord: { lat: number; lng: number } | null
  endCoord: { lat: number; lng: number } | null
  runDate: string | null; startTime: string | null
  releaseAt: string | null; secondsUntilRelease: number | null
  status: 'locked' | 'available' | 'booked'
  image: string | null; description: string | null; shoreholder: string | null
}

export interface CheckoutResponse {
  paymentUrl?: string; success?: boolean; message?: string; error?: string
}

export interface SessionResponse {
  status: string; customerEmail: string | null; productType: string | null
  eventName: string | null; amountTotal: number | null; currency: string | null
  metadata?: Record<string, string>
}

export interface ApiShoreholder {
  id: string; slug: string; name: string; nationality: string | null
  bio: string | null; avatarUrl: string | null
  stageNumber: number; runDate: string | null; instagramHandle: string | null
}

export interface ApiPrint {
  id: string; slug: string; title: string; stageNumber: number | null
  imageUrl: string | null; priceEur: number; dimensions: string | null
  editionSize: number | null; available: boolean
}

// ── Checkout ───────────────────────────────────────────────────────────────────

export const checkout = {
  books: (params: {
    selectedBooks: string[]; countryCode: string
    customerEmail: string; customerName: string
    addCanaryIslands?: boolean
  }) => req<CheckoutResponse>('POST', 'checkout', { productType: 'book', ...params }),

  stage: (params: {
    stageNumber: number; tier: string
    customerEmail: string; customerName: string
  }) => req<CheckoutResponse>('POST', 'checkout', { productType: 'stage', ...params }),

  event: (params: {
    eventId: string; addDinner?: boolean
    customerEmail: string; customerName: string
    stageNumber?: number; teamMembers?: { name: string; email: string }[]
    [key: string]: unknown
  }) => req<CheckoutResponse>('POST', 'checkout', { productType: 'event', ...params }),

  bookLaunchFree: (params: { customerEmail: string; customerName: string }) =>
    req<CheckoutResponse>('POST', 'checkout', { productType: 'book_launch_free', ...params }),

  print: (params: { printId: string; printTitle: string; priceEur: number; customerEmail: string }) =>
    req<CheckoutResponse>('POST', 'checkout', { productType: 'print', ...params }),

  session: (sessionId: string) =>
    req<SessionResponse>('POST', 'checkout', { productType: 'session', sessionId }),
}

// ── Waitlist ───────────────────────────────────────────────────────────────────

export const waitlist = {
  joinIceland: (email: string, name?: string) =>
    req<{ success: boolean }>('POST', 'newsletter', { type: 'iceland_waitlist', email, name }),

  icelandCount: () =>
    req<{ count: number }>('POST', 'newsletter', { type: 'iceland_count' }),

  joinStage: (stageNumber: number, email: string, name?: string) =>
    req<{ success: boolean }>('POST', 'newsletter', { type: 'stage_waitlist', stageNumber, email, name }),
}

// ── Newsletter ─────────────────────────────────────────────────────────────────

export const newsletter = {
  subscribe: (email: string) =>
    req<{ success: boolean }>('POST', 'newsletter', { type: 'subscribe', email }),
}

// ── Contact ────────────────────────────────────────────────────────────────────

export const contact = {
  send: (params: { name: string; email: string; subject?: string; message: string; source?: string }) =>
    req<{ success: boolean }>('POST', 'contact', params),
}

// ── Archive (Sanity proxy) ─────────────────────────────────────────────────────

export const archive = {
  stats: async () => {
    const res = await req<{ result: unknown[] }>('POST', 'sanity-proxy', {
      query: '*[_type=="siteSettings"][0]{totalKm,totalCountries,totalRunners,booksSold}',
    })
    const r = (res as any).result?.[0] ?? {}
    return {
      completedStages: 239,
      totalStages: 407,
      totalKm: r.totalKm ?? 23900,
      countries: r.totalCountries ?? 11,
      runners: r.totalRunners ?? 312,
      booksSold: r.booksSold ?? 4000,
    }
  },
}

// ── Archive tiles — used by Register page to show available stages ────────────
// Routes through sanity-proxy. Returns stages matching ApiStage shape.
import { sanityFetch } from './sanityClient'

// Extend archive with tiles()
;(archive as any).tiles = async (): Promise<ApiStage[]> => {
  const raw = await sanityFetch<Record<string, unknown>[]>(`
    *[_type=="stage"&&isIceland!=true]|order(stageNumber asc){
      _id,stageNumber,title,country,region,distanceKm,
      startLocation,endLocation,startCoord,endCoord,
      status,runDate,description,bookNumber,isIceland,
      "shoreholder":shoreholder->name,
      "shoreholderSlug":shoreholder->slug.current
    }`)
  return raw.map((r: Record<string, unknown>) => ({
    id: r._id as string,
    stageNumber: r.stageNumber as number,
    displayNumber: r.stageNumber as number,
    title: r.title as string,
    country: r.country as string,
    region: (r.region as string | null) ?? null,
    distanceKm: (r.distanceKm as number | null) ?? null,
    startLocation: r.startLocation as string,
    endLocation: r.endLocation as string,
    startCoord: (r.startCoord as { lat: number; lng: number } | null) ?? null,
    endCoord: (r.endCoord as { lat: number; lng: number } | null) ?? null,
    shoreholder: (r.shoreholder as string | null) ?? null,
    shoreholderSlug: (r.shoreholderSlug as string | null) ?? null,
    runDate: (r.runDate as string | null) ?? null,
    status: r.status as ApiStage['status'],
    image: '',
    description: (r.description as string | null) ?? null,
    bookNumber: (r.bookNumber as number | null) ?? null,
    isIceland: (r.isIceland as boolean) ?? false,
  }))
}
