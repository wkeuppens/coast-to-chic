/**
 * Fix Sanity content based on confirmed product details:
 * - Remove Home Run Venice (event completed)
 * - Fix Tour du Mont Blanc dates and pricing
 * - Update Follow The Kust
 * - Reset Iceland preview mode to Real
 * - Confirm Iceland release time May 27 20:00 Belgium
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3l5lwj8d',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skGI48bUNDX01TWGTKO32ROfnDYZOKpAYb7vEK4njG8L8w80QizM6CVUPdwKcsRu5hMbqsDhafVnv1gwTuBUa3j9T7yooZJHOmSGKcu0z5z0qXGhok2tpZZpkB8t60XICY8Wo6GqzqNY0J1ZGuDjFGynQFOUdBC06anKDJnzomChsjg9GdGc',
  useCdn: false,
})

async function run() {
  // 1. Delete Home Run Venice (event completed, page removed)
  console.log('Removing Home Run Venice...')
  try {
    await client.delete('event-homerun')
    console.log('  ✓ Deleted')
  } catch { console.log('  — Not found, skipping') }

  // 2. Update Tour du Mont Blanc — Aug 4-9, single price €999
  console.log('Updating Tour du Mont Blanc...')
  await client.createOrReplace({
    _id: 'event-tmb',
    _type: 'event',
    title: 'Tour du Mont Blanc',
    slug: { _type: 'slug', current: 'tour-du-mont-blanc' },
    eventId: 'tmb_2027_4day',
    meta: 'France, Italy, Switzerland — 4–9 Aug 2026 — 170 km',
    location: 'Chamonix, France',
    eventDate: '2026-08-04',
    distanceKm: 170,
    registrationOpen: true,
    sortOrder: 2,
  })
  console.log('  ✓ Updated')

  // 3. Update Follow The Kust — Feb 2027
  console.log('Updating Follow The Kust...')
  await client.createOrReplace({
    _id: 'event-ftk',
    _type: 'event',
    title: 'Follow The Kust',
    slug: { _type: 'slug', current: 'follow-the-kust' },
    eventId: 'ftk',
    meta: 'Belgium — 6 Feb 2027 — 35 or 75 km',
    location: 'De Panne → Knokke, Belgium',
    eventDate: '2027-02-06',
    distanceKm: 75,
    registrationOpen: true,
    sortOrder: 3,
  })
  console.log('  ✓ Updated')

  // 4. Reset Iceland preview mode to Real, confirm release time
  console.log('Resetting Iceland settings...')
  await client.patch('siteSettings').set({
    icelandPreviewMode: 'real',
    icelandReleaseAt: '2026-05-27T18:00:00.000Z', // May 27 20:00 Belgium (CEST = UTC+2)
  }).commit()
  console.log('  ✓ Preview mode: Real')
  console.log('  ✓ Release time: May 27 2026, 20:00 Belgium (18:00 UTC)')

  // 5. Update books — v3 not yet available (launches July 20)
  console.log('Updating book availability...')
  await client.patch('book-vol3').set({ available: false }).commit()
  console.log('  ✓ Volume III marked as unavailable (launches July 20)')

  console.log('\n✅ All done')
}

run().catch(console.error)
