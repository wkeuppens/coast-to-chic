import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

const projectId = (import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined) || '3l5lwj8d'
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Use API directly — CDN has separate CORS rules
  token: import.meta.env.VITE_SANITY_TOKEN as string | undefined,
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
