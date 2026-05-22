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
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? 'production'

// Only initialise the client when a project ID is present.
// Without this guard, @sanity/client throws on startup and blanks the page.
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true,
      token: import.meta.env.VITE_SANITY_TOKEN as string | undefined,
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

export function urlFor(source: SanityImageSource) {
  if (!builder) return { url: () => '' } as ReturnType<typeof builder.image>
  return builder.image(source)
}
