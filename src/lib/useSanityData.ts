/**
 * src/hooks/useSanityData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in hooks for fetching CMS content from Sanity.
 * Each hook replaces a static import from src/data/.
 *
 * Usage:
 *   const { data: stages, loading, error } = useStages()
 *   const { data: settings } = useSiteSettings()
 */

import { useState, useEffect } from 'react'
import {
  fetchStages,
  fetchStageTiles,
  fetchShoreholders,
  fetchBooks,
  fetchEvents,
  fetchPrints,
  fetchSiteSettings,
  type SanityBook,
  type SanityEvent,
  type SiteSettings,
  type ApiStage,
  type ApiShoreholder,
  type ApiPrint,
} from './sanityQueries'
import type { StageTileData } from '../data/stages'

type UseSanityResult<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

function useSanityFetch<T>(fetcher: () => Promise<T>): UseSanityResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetcher()
      .then(result => { if (!cancelled) { setData(result); setLoading(false) } })
      .catch(err => { if (!cancelled) { setError(err); setLoading(false) } })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading, error }
}

// ── Public hooks ──────────────────────────────────────────────────────────────

/** All 168 stages as ApiStage — replaces fetchStages() backend call */
export function useStages() {
  return useSanityFetch<ApiStage[]>(fetchStages)
}

/** Stages formatted for the archive canvas — replaces buildStages() */
export function useStageTiles() {
  return useSanityFetch<StageTileData[]>(fetchStageTiles)
}

/** Shoreholder profiles */
export function useShoreholders() {
  return useSanityFetch<ApiShoreholder[]>(fetchShoreholders)
}

/** Books catalog */
export function useBooks() {
  return useSanityFetch<SanityBook[]>(fetchBooks)
}

/** Events / side routes */
export function useEvents() {
  return useSanityFetch<SanityEvent[]>(fetchEvents)
}

/** Prints catalog */
export function usePrints() {
  return useSanityFetch<ApiPrint[]>(fetchPrints)
}

/** Site-wide settings and editable copy */
export function useSiteSettings() {
  return useSanityFetch<SiteSettings | null>(fetchSiteSettings)
}
