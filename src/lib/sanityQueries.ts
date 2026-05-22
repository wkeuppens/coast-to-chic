/**
 * src/lib/sanityQueries.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All GROQ queries for FTC content.
 * Each query maps 1:1 to an existing TypeScript interface in src/types/api.ts
 * or src/data/stages.ts — field names are preserved intentionally.
 */

import { sanityClient, urlFor } from './sanityClient'
import type { StageTileData } from '../data/stages'

// If Sanity isn't configured, all fetches return empty arrays silently.
const fetch = async <T>(query: string, params?: Record<string, unknown>): Promise<T> => {
  if (!sanityClient) return [] as unknown as T
  return sanityClient.fetch<T>(query, params)
}

// ── Local types (aligned with Sanity schema, not backend API) ───────────────

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
  status: 'completed' | 'upcoming'
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
  _id,
  stageNumber,
  title,
  country,
  region,
  distanceKm,
  startLocation,
  endLocation,
  startCoord,
  endCoord,
  status,
  runDate,
  image,
  description,
  bookNumber,
  isIceland,
  "shoreholder": shoreholder->name,
  "shoreholderSlug": shoreholder->slug.current,
`

export async function fetchStages(): Promise<ApiStage[]> {
  const raw = await fetch(
    `*[_type == "stage"] | order(stageNumber asc) { ${STAGE_FIELDS} }`
  )
  return raw.map(mapStage)
}

export async function fetchStage(stageNumber: number): Promise<ApiStage> {
  const raw = await fetch(
    `*[_type == "stage" && stageNumber == $stageNumber][0] { ${STAGE_FIELDS} }`,
    { stageNumber }
  )
  return mapStage(raw)
}

export async function fetchCompletedStages(): Promise<ApiStage[]> {
  const raw = await fetch(
    `*[_type == "stage" && status == "completed"] | order(stageNumber asc) { ${STAGE_FIELDS} }`
  )
  return raw.map(mapStage)
}

function mapStage(raw: Record<string, unknown>): ApiStage {
  return {
    id: raw._id as string,
    stageNumber: raw.stageNumber as number,
    title: raw.title as string,
    country: raw.country as string,
    region: raw.region as string | null ?? null,
    distanceKm: raw.distanceKm as number | null ?? null,
    startLocation: raw.startLocation as string,
    endLocation: raw.endLocation as string,
    startCoord: raw.startCoord as { lat: number; lng: number } | null ?? null,
    endCoord: raw.endCoord as { lat: number; lng: number } | null ?? null,
    shoreholder: raw.shoreholder as string | null ?? null,
    shoreholderSlug: raw.shoreholderSlug as string | null ?? null,
    runDate: raw.runDate as string | null ?? null,
    status: raw.status as ApiStage['status'],
    image: raw.image ? urlFor(raw.image as Parameters<typeof urlFor>[0]).width(840).url() : '',
    description: raw.description as string | null ?? null,
    bookNumber: raw.bookNumber as number | null ?? null,
    isIceland: raw.isIceland as boolean ?? false,
  }
}

/**
 * Fetch stages formatted as StageTileData for the archive canvas.
 * Preserves the grid layout logic from the original stages.ts.
 */
export async function fetchStageTiles(): Promise<StageTileData[]> {
  const stages = await fetchStages()
  const TILE_W = 420
  const TILE_H = 280
  const COLS = 6
  const GAP_X = 24
  const GAP_Y = 24

  return stages.map((s, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return {
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
      x: col * (TILE_W + GAP_X),
      y: row * (TILE_H + GAP_Y),
      width: TILE_W,
      height: TILE_H,
      link: `/register?stage=${s.stageNumber}`,
    }
  })
}

function getSeason(date: string | null): string {
  if (!date) return 'Spring'
  const month = new Date(date).getMonth()
  if (month < 3) return 'Winter'
  if (month < 6) return 'Spring'
  if (month < 9) return 'Summer'
  return 'Autumn'
}

// ── Shoreholders ──────────────────────────────────────────────────────────────

export async function fetchShoreholders(): Promise<ApiShoreholder[]> {
  const raw = await fetch(`
    *[_type == "shoreholder"] | order(name asc) {
      _id,
      slug,
      name,
      nationality,
      bio,
      avatar,
      instagramHandle,
      "stageNumber": *[_type == "stage" && references(^._id)][0].stageNumber,
      "runDate": *[_type == "stage" && references(^._id)][0].runDate,
    }
  `)
  return raw.map((r: Record<string, unknown>) => ({
    id: r._id as string,
    slug: (r.slug as { current: string })?.current ?? '',
    name: r.name as string,
    nationality: r.nationality as string | null ?? null,
    bio: r.bio as string | null ?? null,
    avatarUrl: r.avatar ? urlFor(r.avatar as Parameters<typeof urlFor>[0]).width(400).url() : null,
    instagramHandle: r.instagramHandle as string | null ?? null,
    stageNumber: r.stageNumber as number,
    runDate: r.runDate as string | null ?? null,
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
  const raw = await fetch(`
    *[_type == "book"] | order(volumeNumber asc) {
      _id, title, subtitle, bookId, volumeNumber, price,
      description, coverImage, spreadImages, stageRange, available
    }
  `)
  return raw.map((r: Record<string, unknown>) => ({
    id: r._id as string,
    title: r.title as string,
    subtitle: r.subtitle as string,
    bookId: r.bookId as string,
    volumeNumber: r.volumeNumber as number,
    price: r.price as number,
    description: r.description as string | null ?? null,
    coverImageUrl: r.coverImage ? urlFor(r.coverImage as Parameters<typeof urlFor>[0]).width(800).url() : null,
    spreadImageUrls: Array.isArray(r.spreadImages)
      ? (r.spreadImages as Parameters<typeof urlFor>[0][]).map(img => urlFor(img).width(1200).url())
      : [],
    stageRange: r.stageRange as string | null ?? null,
    available: r.available as boolean ?? true,
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
  const raw = await fetch(`
    *[_type == "event"] | order(sortOrder asc, eventDate asc) {
      _id, title, slug, eventId, meta, location, eventDate,
      distanceKm, image, registrationOpen, sortOrder
    }
  `)
  return raw.map((r: Record<string, unknown>) => ({
    id: r._id as string,
    title: r.title as string,
    slug: (r.slug as { current: string })?.current ?? '',
    eventId: r.eventId as string | null ?? null,
    meta: r.meta as string | null ?? null,
    location: r.location as string | null ?? null,
    eventDate: r.eventDate as string | null ?? null,
    distanceKm: r.distanceKm as number | null ?? null,
    imageUrl: r.image ? urlFor(r.image as Parameters<typeof urlFor>[0]).width(800).url() : null,
    registrationOpen: r.registrationOpen as boolean ?? false,
    sortOrder: r.sortOrder as number | null ?? null,
  }))
}

// ── Prints ────────────────────────────────────────────────────────────────────

export async function fetchPrints(): Promise<ApiPrint[]> {
  const raw = await fetch(`
    *[_type == "print" && available == true] | order(_createdAt desc) {
      _id, slug, title, stageNumber, image, priceEur, dimensions, editionSize, available
    }
  `)
  return raw.map((r: Record<string, unknown>) => ({
    id: r._id as string,
    slug: (r.slug as { current: string })?.current ?? '',
    title: r.title as string,
    stageNumber: r.stageNumber as number | null ?? null,
    imageUrl: r.image ? urlFor(r.image as Parameters<typeof urlFor>[0]).width(800).url() : null,
    priceEur: r.priceEur as number,
    dimensions: r.dimensions as string | null ?? null,
    editionSize: r.editionSize as number | null ?? null,
    available: r.available as boolean ?? true,
  }))
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface SiteSettings {
  heroHeadline: string
  heroSubline: string
  pullQuote1: string
  pullQuote2: string
  journeyLabel: string
  journeyHeadline: string | null
  totalStages: number
  completedStages: number | null
  totalCountries: number
  booksSold: number | null
  supportHeadline: string | null
  supportBody: string | null
  partners: { name: string; url: string | null }[]
  seoTitle: string
  seoDescription: string | null
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  return fetch(`*[_type == "siteSettings"][0] {
    heroHeadline, heroSubline,
    pullQuote1, pullQuote2,
    journeyLabel, journeyHeadline,
    totalStages, completedStages, totalCountries, booksSold,
    supportHeadline, supportBody,
    partners[]{name, url},
    seoTitle, seoDescription
  }`)
}
