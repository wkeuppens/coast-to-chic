import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3l5lwj8d',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skGI48bUNDX01TWGTKO32ROfnDYZOKpAYb7vEK4njG8L8w80QizM6CVUPdwKcsRu5hMbqsDhafVnv1gwTuBUa3j9T7yooZJHOmSGKcu0z5z0qXGhok2tpZZpkB8t60XICY8Wo6GqzqNY0J1ZGuDjFGynQFOUdBC06anKDJnzomChsjg9GdGc',
  useCdn: false,
})

const args = process.argv.slice(2)
const mode = args[0] // 'open' or 'reset'

// May 27 2026 20:00 Belgium = 18:00 UTC
const REAL_RELEASE = '2026-05-27T18:00:00.000Z'
// 1 minute ago = open now
const NOW_OPEN = new Date(Date.now() - 60000).toISOString()

const releaseAt = mode === 'reset' ? REAL_RELEASE : NOW_OPEN

async function run() {
  await client.patch('siteSettings').set({ icelandReleaseAt: releaseAt }).commit()
  if (mode === 'reset') {
    console.log('✅ Reset to real release time: May 27 2026, 20:00 Belgium')
  } else {
    console.log('✅ Set to NOW — stages are open. Visit /iceland to preview.')
    console.log('   Run "node simulate-open.mjs reset" when done.')
  }
}

run().catch(console.error)
