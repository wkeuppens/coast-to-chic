import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3l5lwj8d',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skGI48bUNDX01TWGTKO32ROfnDYZOKpAYb7vEK4njG8L8w80QizM6CVUPdwKcsRu5hMbqsDhafVnv1gwTuBUa3j9T7yooZJHOmSGKcu0z5z0qXGhok2tpZZpkB8t60XICY8Wo6GqzqNY0J1ZGuDjFGynQFOUdBC06anKDJnzomChsjg9GdGc',
  useCdn: false,
})

// May 27 2026, 20:00 Belgium time (CEST = UTC+2) = 18:00 UTC
const RELEASE_AT = '2026-05-27T18:00:00.000Z'

async function setReleaseTime() {
  console.log(`Setting Iceland release time to: ${RELEASE_AT}`)
  console.log(`(= May 27 2026, 20:00 Belgium time / CEST)`)

  try {
    await client
      .patch('siteSettings')
      .set({ icelandReleaseAt: RELEASE_AT })
      .commit()
    console.log('✅ Release time set. Founders can adjust it anytime in Sanity → Site Settings → Stats tab.')
  } catch (e) {
    console.error('✗', e.message)
  }
}

setReleaseTime()
