import { sanityClient, urlFor } from './sanityClient'
import type { StageTileData } from '../data/stages'

// If Sanity isn't configured, all fetches return empty arrays silently.
const fetch = async <T>(query: string, params?: Record<string, unknown>): Promise<T> => {
  if (!sanityClient) return [] as unknown as T
  return sanityClient.fetch<T>(query, params)
}

// ── Local types ───────────────────────────────────────────────────────────────

export interface ApiStage {
  id: string
  stageNumber: number
  title: string
  country: string
  region: string | null
  distanceKm: number | null
  startLocation: string
  endLocation: string
  startCoord: { lat: number; lng: number } | null
  endCoord: { lat: number; lng: number } | null
  shoreholder: string | null
  shoreholderSlug: string | null
  runDate: string | null
  status: 'completed' | 'available' | 'locked' | 'booked'
  image: string
  description: string | null
  bookNumber: number | null
  isIceland: boolean
}

export interface ApiShoreholder {
  id: string
  slug: string
  name: string
  nationality: string | null
  bio: string | null
  avatarUrl: string | null
  instagramHandle: string | null
  stageNumber: number
  runDate: string | null
}

export interface ApiPrint {
  id: string
  slug: string
  title: string
  stageNumber: number | null
  imageUrl: string | null
  priceEur: number
  dimensions: string | null
  editionSize: number | null
  available: boolean
}

// ── Stages ────────────────────────────────────────────────────────────────────

const STAGE_FIELDS = `
  _id, stageNumber, title, country, region, distanceKm,
  startLocation, endLocation, startCoord, endCoord,
  status, runDate, image, description, bookNumber, isIceland,
  "shoreholder": shoreholder->name,
  "shoreholderSlug": shoreholder->slug.current,
`

export async function fetchStages(): Promise<ApiStage[]> {
  const raw = await fetch<Record<string, unknown>[]>(
    `*[_type == "stage"] | order(stageNumber asc) { ${STAGE_FIELDS} }`
  )
  return raw.map(mapStage)
}

export async function fetchStage(stageNumber: number): Promise<ApiStage | null> {
  const raw = await fetch<Record<string, unknown> | null>(
    `*[_type == "stage" && stageNumber == $stageNumber][0] { ${STAGE_FIELDS} }`,
    { stageNumber }
  )
  return raw ? mapStage(raw) : null
}

function mapStage(raw: Record<string, unknown>): ApiStage {
  return {
    id: raw._id as string,
    stageNumber: raw.stageNumber as number,
    title: raw.title as string,
    country: raw.country as string,
    region: (raw.region as string | null) ?? null,
    distanceKm: (raw.distanceKm as number | null) ?? null,
    startLocation: raw.startLocation as string,
    endLocation: raw.endLocation as string,
    startCoord: (raw.startCoord as { lat: number; lng: number } | null) ?? null,
    endCoord: (raw.endCoord as { lat: number; lng: number } | null) ?? null,
    shoreholder: (raw.shoreholder as string | null) ?? null,
    shoreholderSlug: (raw.shoreholderSlug as string | null) ?? null,
    runDate: (raw.runDate as string | null) ?? null,
    status: raw.status as ApiStage['status'],
    image: raw.image ? urlFor(raw.image as Parameters<typeof urlFor>[0]).width(840).url() : '',
    description: (raw.description as string | null) ?? null,
    bookNumber: (raw.bookNumber as number | null) ?? null,
    isIceland: (raw.isIceland as boolean) ?? false,
  }
}

export async function fetchStageTiles(): Promise<StageTileData[]> {
  const stages = await fetchStages()
  const TILE_W = 420, TILE_H = 280, COLS = 6, GAP_X = 24, GAP_Y = 24
  return stages.map((s, i) => ({
    id: s.id,
    title: s.title,
    stageNumber: s.stageNumber,
    location: s.startLocation,
    country: s.country,
    year: s.runDate ? new Date(s.runDate).getFullYear() : new Date().getFullYear(),
    season: getSeason(s.runDate),
    status: s.status === 'completed' ? 'Completed' : 'Upcoming',
    shoreholder: s.shoreholder ?? undefined,
    startCoord: s.startCoord ? [s.startCoord.lat, s.startCoord.lng] : undefined,
    endCoord: s.endCoord ? [s.endCoord.lat, s.endCoord.lng] : undefined,
    image: s.image,
    x: (i % COLS) * (TILE_W + GAP_X),
    y: Math.floor(i / COLS) * (TILE_H + GAP_Y),
    width: TILE_W,
    height: TILE_H,
    link: `/register?stage=${s.stageNumber}`,
  }))
}

function getSeason(date: string | null): string {
  if (!date) return 'Spring'
  const m = new Date(date).getMonth()
  if (m < 3) return 'Winter'
  if (m < 6) return 'Spring'
  if (m < 9) return 'Summer'
  return 'Autumn'
}

// ── Shoreholders ──────────────────────────────────────────────────────────────

export async function fetchShoreholders(): Promise<ApiShoreholder[]> {
  const raw = await fetch<Record<string, unknown>[]>(`
    *[_type == "shoreholder"] | order(name asc) {
      _id, slug, name, nationality, bio, avatar, instagramHandle,
      "stageNumber": *[_type == "stage" && references(^._id)][0].stageNumber,
      "runDate": *[_type == "stage" && references(^._id)][0].runDate,
    }
  `)
  return raw.map(r => ({
    id: r._id as string,
    slug: (r.slug as { current: string })?.current ?? '',
    name: r.name as string,
    nationality: (r.nationality as string | null) ?? null,
    bio: (r.bio as string | null) ?? null,
    avatarUrl: r.avatar ? urlFor(r.avatar as Parameters<typeof urlFor>[0]).width(400).url() : null,
    instagramHandle: (r.instagramHandle as string | null) ?? null,
    stageNumber: r.stageNumber as number,
    runDate: (r.runDate as string | null) ?? null,
  }))
}

// ── Books ─────────────────────────────────────────────────────────────────────

export interface SanityBook {
  id: string
  title: string
  subtitle: string
  bookId: string
  volumeNumber: number
  price: number
  description: string | null
  coverImageUrl: string | null
  spreadImageUrls: string[]
  stageRange: string | null
  available: boolean
}

export async function fetchBooks(): Promise<SanityBook[]> {
  const raw = await fetch<Record<string, unknown>[]>(`
    *[_type == "book"] | order(volumeNumber asc) {
      _id, title, subtitle, bookId, volumeNumber, price,
      description, coverImage, spreadImages, stageRange, available
    }
  `)
  return raw.map(r => ({
    id: r._id as string,
    title: r.title as string,
    subtitle: r.subtitle as string,
    bookId: r.bookId as string,
    volumeNumber: r.volumeNumber as number,
    price: r.price as number,
    description: (r.description as string | null) ?? null,
    coverImageUrl: r.coverImage ? urlFor(r.coverImage as Parameters<typeof urlFor>[0]).width(1200).url() : null,
    spreadImageUrls: Array.isArray(r.spreadImages)
      ? (r.spreadImages as Parameters<typeof urlFor>[0][]).map(img => urlFor(img).width(1200).url())
      : [],
    stageRange: (r.stageRange as string | null) ?? null,
    available: (r.available as boolean) ?? true,
  }))
}

// ── Events ────────────────────────────────────────────────────────────────────

export interface SanityEvent {
  id: string
  title: string
  slug: string
  eventId: string | null
  meta: string | null
  location: string | null
  eventDate: string | null
  distanceKm: number | null
  imageUrl: string | null
  registrationOpen: boolean
  sortOrder: number | null
}

export async function fetchEvents(): Promise<SanityEvent[]> {
  const raw = await fetch<Record<string, unknown>[]>(`
    *[_type == "event"] | order(sortOrder asc, eventDate asc) {
      _id, title, slug, eventId, meta, location, eventDate,
      distanceKm, image, registrationOpen, sortOrder
    }
  `)
  return raw.map(r => ({
    id: r._id as string,
    title: r.title as string,
    slug: (r.slug as { current: string })?.current ?? '',
    eventId: (r.eventId as string | null) ?? null,
    meta: (r.meta as string | null) ?? null,
    location: (r.location as string | null) ?? null,
    eventDate: (r.eventDate as string | null) ?? null,
    distanceKm: (r.distanceKm as number | null) ?? null,
    imageUrl: r.image ? urlFor(r.image as Parameters<typeof urlFor>[0]).width(800).url() : null,
    registrationOpen: (r.registrationOpen as boolean) ?? false,
    sortOrder: (r.sortOrder as number | null) ?? null,
  }))
}

// ── Prints ────────────────────────────────────────────────────────────────────

export async function fetchPrints(): Promise<ApiPrint[]> {
  const raw = await fetch<Record<string, unknown>[]>(`
    *[_type == "print" && available == true] | order(_createdAt desc) {
      _id, slug, title, stageNumber, image, priceEur, dimensions, editionSize, available
    }
  `)
  return raw.map(r => ({
    id: r._id as string,
    slug: (r.slug as { current: string })?.current ?? '',
    title: r.title as string,
    stageNumber: (r.stageNumber as number | null) ?? null,
    imageUrl: r.image ? urlFor(r.image as Parameters<typeof urlFor>[0]).width(800).url() : null,
    priceEur: r.priceEur as number,
    dimensions: (r.dimensions as string | null) ?? null,
    editionSize: (r.editionSize as number | null) ?? null,
    available: (r.available as boolean) ?? true,
  }))
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface SiteSettings {
  // Hero
  heroImageUrl: string | null
  heroHeadline: string
  heroSubline: string
  // Journey
  journeyLabel: string
  journeyHeadline: string
  journeyParagraphs: string[]
  // How it works
  howItWorksHeadline: string
  howItWorksSteps: { number: string; title: string; body: string }[]
  supportIncluded: string[]
  pricingSolo: number
  pricingDuo: number
  pricingGroup: number
  // Stats
  totalKm: number | null
  totalCountries: number | null
  totalRunners: number | null
  booksSold: number | null
  // Gallery
  galleryImages: { imageUrl: string; alt: string; label: string }[]
  // Stage highlights
  stageHighlights: { title: string; description: string; detail: string; href: string }[]
  // Books
  bookSectionHeadline: string
  bookSectionImageUrl: string | null
  // Pull quotes
  pullQuote1: string
  pullQuote2: string
  // Support
  supportHeadline: string
  supportBody: string
  // Partners
  partners: { name: string; url: string | null }[]
  // SEO
  seoTitle: string
  seoDescription: string | null
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return null
  const r = await sanityClient.fetch<Record<string, unknown>>(`
    *[_type == "siteSettings"][0] {
      heroImage, heroHeadline, heroSubline,
      journeyLabel, journeyHeadline, journeyParagraphs,
      howItWorksHeadline, howItWorksSteps, supportIncluded,
      pricingSolo, pricingDuo, pricingGroup,
      totalKm, totalCountries, totalRunners, booksSold,
      galleryImages[]{ image, alt, label },
      stageHighlights[]{ title, description, detail, href },
      bookSectionHeadline, bookSectionImage,
      pullQuote1, pullQuote2,
      supportHeadline, supportBody,
      partners[]{ name, url },
      seoTitle, seoDescription
    }
  `)
  if (!r) return null
  return {
    heroImageUrl: r.heroImage ? urlFor(r.heroImage as Parameters<typeof urlFor>[0]).width(1920).url() : null,
    heroHeadline: (r.heroHeadline as string) || 'Follow The Coast',
    heroSubline: (r.heroSubline as string) || "All of Europe's coastline. Counter-clockwise. 100 km at a time.",
    journeyLabel: (r.journeyLabel as string) || 'The route',
    journeyHeadline: (r.journeyHeadline as string) || 'Sea on the right. Always south.',
    journeyParagraphs: (r.journeyParagraphs as string[]) || [],
    howItWorksHeadline: (r.howItWorksHeadline as string) || 'A van. A photographer. You.',
    howItWorksSteps: (r.howItWorksSteps as { number: string; title: string; body: string }[]) || [],
    supportIncluded: (r.supportIncluded as string[]) || [],
    pricingSolo: (r.pricingSolo as number) || 699,
    pricingDuo: (r.pricingDuo as number) || 999,
    pricingGroup: (r.pricingGroup as number) || 1299,
    totalKm: (r.totalKm as number | null) ?? null,
    totalCountries: (r.totalCountries as number | null) ?? null,
    totalRunners: (r.totalRunners as number | null) ?? null,
    booksSold: (r.booksSold as number | null) ?? null,
    galleryImages: ((r.galleryImages as { image: Parameters<typeof urlFor>[0]; alt: string; label: string }[]) || []).map(g => ({
      imageUrl: g.image ? urlFor(g.image).width(1200).url() : '',
      alt: g.alt || '',
      label: g.label || '',
    })),
    stageHighlights: (r.stageHighlights as { title: string; description: string; detail: string; href: string }[]) || [],
    bookSectionHeadline: (r.bookSectionHeadline as string) || '5,000 km per volume',
    bookSectionImageUrl: r.bookSectionImage ? urlFor(r.bookSectionImage as Parameters<typeof urlFor>[0]).width(1600).url() : null,
    pullQuote1: (r.pullQuote1 as string) || 'Sea on the right. Always south. 100 km at a time.',
    pullQuote2: (r.pullQuote2 as string) || 'Salty breeze. The sound of your own footsteps.',
    supportHeadline: (r.supportHeadline as string) || 'This journey moves with support',
    supportBody: (r.supportBody as string) || 'Follow the Coast continues thanks to runners, readers, and partners who choose to carry it forward.',
    partners: (r.partners as { name: string; url: string | null }[]) || [],
    seoTitle: (r.seoTitle as string) || 'Follow The Coast',
    seoDescription: (r.seoDescription as string | null) ?? null,
  }
}
