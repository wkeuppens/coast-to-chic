/**
 * src/lib/sanityClient.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Sanity client configuration for Follow The Coast.
 * Install: bun add @sanity/client
 *
 * Set these in your .env file:
 *   VITE_SANITY_PROJECT_ID=your_project_id
 *   VITE_SANITY_DATASET=production
 *   VITE_SANITY_TOKEN=your_read_token  (optional — only needed for drafts)
 */

import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // CDN caching for production reads — set to false for live preview
  token: import.meta.env.VITE_SANITY_TOKEN, // Optional: for authenticated requests
})

/**
 * Build a full Sanity image URL from an image asset reference.
 * Usage: urlFor(stage.image).width(800).url()
 */
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
