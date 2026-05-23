/**
 * All GROQ queries — routed through Supabase proxy to bypass CSP.
 */

import { sanityFetch, urlFor } from './sanityClient'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiStage {
  id: string; stageNumber: number; title: string; country: string
  region: string | null; distanceKm: number | null
  startLocation: string; endLocation: string
  startCoord: { lat: number; lng: number } | null
  endCoord: { lat: number; lng: number } | null
  shoreholder: string | null; shoreholderSlug: string | null
  runDate: string | null; status: 'completed' | 'available' | 'locked' | 'booked'
  image: string; description: string | null; bookNumber: number | null; isIceland: boolean
}

export interface ApiShoreholder {
  id: string; slug: string; name: string; nationality: string | null
  bio: string | null; avatarUrl: string | null; instagramHandle: string | null
  stageNumber: number; runDate: string | null
}

export interface ApiPrint {
  id: string; slug: string; title: string; stageNumber: number | null
  imageUrl: string | null; priceEur: number; dimensions: string | null
  editionSize: number | null; available: boolean
}

export interface SanityBook {
  id: string; title: string; subtitle: string; bookId: string
  volumeNumber: number; price: number; description: string | null
  coverImageUrl: string | null; spreadImageUrls: string[]
  stageRange: string | null; available: boolean
}

export interface SanityEvent {
  id: string; title: string; slug: string; eventId: string | null
  meta: string | null; location: string | null; eventDate: string | null
  distanceKm: number | null; imageUrl: string | null
  registrationOpen: boolean; sortOrder: number | null
}

export interface SiteSettings {
  heroImageUrl: string | null; heroHeadline: string; heroSubline: string
  journeyLabel: string; journeyHeadline: string; journeyParagraphs: string[]
  howItWorksHeadline: string
  howItWorksSteps: { number: string; title: string; body: string }[]
  supportIncluded: string[]; pricingSolo: number; pricingDuo: number; pricingGroup: number
  totalKm: number | null; totalCountries: number | null
  totalRunners: number | null; booksSold: number | null
  icelandReleaseAt: string | null
  icelandPreviewMode: 'real' | 'countdown' | 'open' | 'locked' | null
  galleryImages: { imageUrl: string; alt: string; label: string }[]
  stageHighlights: { title: string; description: string; detail: string; href: string }[]
  bookSectionHeadline: string; bookSectionImageUrl: string | null
  pullQuote1: string; pullQuote2: string
  supportHeadline: string; supportBody: string
  partners: { name: string; url: string | null }[]
  seoTitle: string; seoDescription: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function imgUrl(source: unknown, width: number): string {
  if (!source) return ''
  try { return urlFor(source as Parameters<typeof urlFor>[0]).width(width).url() } catch { return '' }
}

// ── Stages ────────────────────────────────────────────────────────────────────

const STAGE_FIELDS = `_id,stageNumber,title,country,region,distanceKm,
  startLocation,endLocation,startCoord,endCoord,status,runDate,
  image,description,bookNumber,isIceland,
  "shoreholder":shoreholder->name,"shoreholderSlug":shoreholder->slug.current`

export async function fetchStages(): Promise<ApiStage[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(
    `*[_type=="stage"]|order(stageNumber asc){${STAGE_FIELDS}}`
  )
  return raw.map(mapStage)
}

function mapStage(r: Record<string, unknown>): ApiStage {
  return {
    id: r._id as string, stageNumber: r.stageNumber as number, title: r.title as string,
    country: r.country as string, region: (r.region as string | null) ?? null,
    distanceKm: (r.distanceKm as number | null) ?? null,
    startLocation: r.startLocation as string, endLocation: r.endLocation as string,
    startCoord: (r.startCoord as { lat: number; lng: number } | null) ?? null,
    endCoord: (r.endCoord as { lat: number; lng: number } | null) ?? null,
    shoreholder: (r.shoreholder as string | null) ?? null,
    shoreholderSlug: (r.shoreholderSlug as string | null) ?? null,
    runDate: (r.runDate as string | null) ?? null,
    status: r.status as ApiStage['status'],
    image: imgUrl(r.image, 840),
    description: (r.description as string | null) ?? null,
    bookNumber: (r.bookNumber as number | null) ?? null,
    isIceland: (r.isIceland as boolean) ?? false,
  }
}

export async function fetchStageTiles() {
  const stages = await fetchStages()
  const COLS = 6, TW = 420, TH = 280, GX = 24, GY = 24
  return stages.map((s, i) => ({
    id: s.id, title: s.title, stageNumber: s.stageNumber, location: s.startLocation,
    country: s.country, year: s.runDate ? new Date(s.runDate).getFullYear() : new Date().getFullYear(),
    season: getSeason(s.runDate), status: s.status === 'completed' ? 'Completed' : 'Upcoming',
    shoreholder: s.shoreholder ?? undefined,
    startCoord: s.startCoord ? [s.startCoord.lat, s.startCoord.lng] : undefined,
    endCoord: s.endCoord ? [s.endCoord.lat, s.endCoord.lng] : undefined,
    image: s.image, x: (i % COLS) * (TW + GX), y: Math.floor(i / COLS) * (TH + GY),
    width: TW, height: TH, link: `/register?stage=${s.stageNumber}`,
  }))
}

function getSeason(d: string | null) {
  if (!d) return 'Spring'
  const m = new Date(d).getMonth()
  return m < 3 ? 'Winter' : m < 6 ? 'Spring' : m < 9 ? 'Summer' : 'Autumn'
}

// ── Shoreholders ──────────────────────────────────────────────────────────────

export async function fetchShoreholders(): Promise<ApiShoreholder[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(`
    *[_type=="shoreholder"]|order(name asc){
      _id,slug,name,nationality,bio,avatar,instagramHandle,
      "stageNumber":*[_type=="stage"&&references(^._id)][0].stageNumber,
      "runDate":*[_type=="stage"&&references(^._id)][0].runDate
    }`)
  return raw.map(r => ({
    id: r._id as string, slug: (r.slug as { current: string })?.current ?? '',
    name: r.name as string, nationality: (r.nationality as string | null) ?? null,
    bio: (r.bio as string | null) ?? null, avatarUrl: imgUrl(r.avatar, 400),
    instagramHandle: (r.instagramHandle as string | null) ?? null,
    stageNumber: r.stageNumber as number, runDate: (r.runDate as string | null) ?? null,
  }))
}

// ── Books ─────────────────────────────────────────────────────────────────────

export async function fetchBooks(): Promise<SanityBook[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(`
    *[_type=="book"]|order(volumeNumber asc){
      _id,title,subtitle,bookId,volumeNumber,price,
      description,coverImage,spreadImages,stageRange,available}`)
  return raw.map(r => ({
    id: r._id as string, title: r.title as string, subtitle: r.subtitle as string,
    bookId: r.bookId as string, volumeNumber: r.volumeNumber as number, price: r.price as number,
    description: (r.description as string | null) ?? null, coverImageUrl: imgUrl(r.coverImage, 1200),
    spreadImageUrls: Array.isArray(r.spreadImages)
      ? (r.spreadImages as Parameters<typeof urlFor>[0][]).map(img => imgUrl(img, 1200)) : [],
    stageRange: (r.stageRange as string | null) ?? null, available: (r.available as boolean) ?? true,
  }))
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function fetchEvents(): Promise<SanityEvent[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(`
    *[_type=="event"]|order(sortOrder asc,eventDate asc){
      _id,title,slug,eventId,meta,location,eventDate,
      distanceKm,image,registrationOpen,sortOrder}`)
  return raw.map(r => ({
    id: r._id as string, title: r.title as string,
    slug: (r.slug as { current: string })?.current ?? '',
    eventId: (r.eventId as string | null) ?? null, meta: (r.meta as string | null) ?? null,
    location: (r.location as string | null) ?? null, eventDate: (r.eventDate as string | null) ?? null,
    distanceKm: (r.distanceKm as number | null) ?? null, imageUrl: imgUrl(r.image, 800),
    registrationOpen: (r.registrationOpen as boolean) ?? false,
    sortOrder: (r.sortOrder as number | null) ?? null,
  }))
}

// ── Prints ────────────────────────────────────────────────────────────────────

export async function fetchPrints(): Promise<ApiPrint[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(`
    *[_type=="print"&&available==true]|order(_createdAt desc){
      _id,slug,title,stageNumber,image,priceEur,dimensions,editionSize,available}`)
  return raw.map(r => ({
    id: r._id as string, slug: (r.slug as { current: string })?.current ?? '',
    title: r.title as string, stageNumber: (r.stageNumber as number | null) ?? null,
    imageUrl: imgUrl(r.image, 800), priceEur: r.priceEur as number,
    dimensions: (r.dimensions as string | null) ?? null,
    editionSize: (r.editionSize as number | null) ?? null, available: (r.available as boolean) ?? true,
  }))
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const results = await sanityFetch<SiteSettings[]>(`
    *[_type=="siteSettings"][0..0]{
      heroImage,heroHeadline,heroSubline,
      journeyLabel,journeyHeadline,journeyParagraphs,
      howItWorksHeadline,howItWorksSteps,supportIncluded,
      pricingSolo,pricingDuo,pricingGroup,
      totalKm,totalCountries,totalRunners,booksSold,
      icelandReleaseAt,icelandPreviewMode,
      galleryImages[]{image,alt,label},
      stageHighlights[]{title,description,detail,href},
      bookSectionHeadline,bookSectionImage,
      pullQuote1,pullQuote2,supportHeadline,supportBody,
      partners[]{name,url},seoTitle,seoDescription
    }`)

  const r = Array.isArray(results) ? results[0] : results
  if (!r) return null

  return {
    heroImageUrl: imgUrl((r as any).heroImage, 1920),
    heroHeadline: (r as any).heroHeadline || 'Follow The Coast',
    heroSubline: (r as any).heroSubline || "All of Europe's coastline. Counter-clockwise. 100 km at a time.",
    journeyLabel: (r as any).journeyLabel || 'The route',
    journeyHeadline: (r as any).journeyHeadline || 'Sea on the right. Always south.',
    journeyParagraphs: (r as any).journeyParagraphs || [],
    howItWorksHeadline: (r as any).howItWorksHeadline || 'A van. A photographer. You.',
    howItWorksSteps: (r as any).howItWorksSteps || [],
    supportIncluded: (r as any).supportIncluded || [],
    pricingSolo: (r as any).pricingSolo || 699,
    pricingDuo: (r as any).pricingDuo || 999,
    pricingGroup: (r as any).pricingGroup || 1299,
    totalKm: (r as any).totalKm ?? null,
    totalCountries: (r as any).totalCountries ?? null,
    totalRunners: (r as any).totalRunners ?? null,
    booksSold: (r as any).booksSold ?? null,
    icelandReleaseAt: (r as any).icelandReleaseAt ?? null,
    icelandPreviewMode: (r as any).icelandPreviewMode ?? null,
    galleryImages: ((r as any).galleryImages || []).map((g: any) => ({
      imageUrl: imgUrl(g.image, 1200), alt: g.alt || '', label: g.label || '',
    })),
    stageHighlights: (r as any).stageHighlights || [],
    bookSectionHeadline: (r as any).bookSectionHeadline || '5,000 km per volume',
    bookSectionImageUrl: imgUrl((r as any).bookSectionImage, 1600),
    pullQuote1: (r as any).pullQuote1 || 'Sea on the right. Always south. 100 km at a time.',
    pullQuote2: (r as any).pullQuote2 || 'Salty breeze. The sound of your own footsteps.',
    supportHeadline: (r as any).supportHeadline || 'This journey moves with support',
    supportBody: (r as any).supportBody || 'Follow the Coast continues thanks to runners, readers, and partners.',
    partners: (r as any).partners || [],
    seoTitle: (r as any).seoTitle || 'Follow The Coast',
    seoDescription: (r as any).seoDescription ?? null,
  }
}
