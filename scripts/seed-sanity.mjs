import { createClient } from '@sanity/client'

const TOKEN = 'skGI48bUNDX01TWGTKO32ROfnDYZOKpAYb7vEK4njG8L8w80QizM6CVUPdwKcsRu5hMbqsDhafVnv1gwTuBUa3j9T7yooZJHOmSGKcu0z5z0qXGhok2tpZZpkB8t60XICY8Wo6GqzqNY0J1ZGuDjFGynQFOUdBC06anKDJnzomChsjg9GdGc'

const client = createClient({
  projectId: '3l5lwj8d',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

async function upsert(doc) {
  const { _id, ...rest } = doc
  try {
    await client.createOrReplace({ _id, ...rest })
    console.log(`✓ ${doc._type}: ${_id}`)
  } catch (e) {
    console.error(`✗ ${doc._type} ${_id}:`, e.message)
  }
}

async function seed() {
  console.log('\n── Site Settings ──────────────────────────────────')
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    heroHeadline: 'Follow The Coast',
    heroSubline: "All of Europe's coastline. Counter-clockwise. 100 km at a time.",
    journeyLabel: 'The route',
    journeyHeadline: 'Sea on the right. Always south.',
    journeyParagraphs: [
      'Started July 2019 from a beach in Knokke. Salt air, grey sky. The simple rule: keep the sea on your right and run south.',
      'Belgium. France. Spain. Portugal. Now Italy.',
      'Athens by end of 2026.',
    ],
    howItWorksHeadline: 'A van. A photographer. You.',
    howItWorksSteps: [
      { _key: 'step1', number: '01', title: 'Pick a stage', body: '100 km of coastline. You choose where.' },
      { _key: 'step2', number: '02', title: 'Plan the route', body: 'We give start and finish. You shape the middle.' },
      { _key: 'step3', number: '03', title: 'Run it', body: '7 am start. A van. A photographer. The coast.' },
    ],
    supportIncluded: [
      'Van with driver, 24 hours',
      'Photographer, all day',
      'Food, water, coffee',
      'Photos delivered after. Your name in the book',
    ],
    pricingSolo: 699,
    pricingDuo: 999,
    pricingGroup: 1299,
    totalKm: 8500,
    totalCountries: 11,
    totalRunners: 84,
    booksSold: 1200,
    stageHighlights: [
      { _key: 'sh1', title: 'EU Stages', description: 'Italy to Greece. The main line.', detail: '2026 — Open for registration', href: '/register' },
      { _key: 'sh2', title: 'Home Run', description: 'Venice. 100 km. Shared stage.', detail: '€199 — Open', href: '/homerun' },
    ],
    bookSectionHeadline: '5,000 km per volume',
    pullQuote1: 'Sea on the right. Always south. 100 km at a time.',
    pullQuote2: 'Salty breeze. The sound of your own footsteps.',
    supportHeadline: 'This journey moves with support',
    supportBody: 'Follow the Coast continues thanks to runners, readers, and partners who choose to carry it forward.',
    partners: [
      { _key: 'p1', name: 'Duvel', url: 'https://duvel.com' },
      { _key: 'p2', name: 'Victus', url: null },
      { _key: 'p3', name: "D'Ieteren", url: null },
    ],
    seoTitle: 'Follow The Coast',
    seoDescription: 'All of Europe\'s coastline. Counter-clockwise. 100 km at a time.',
  })

  console.log('\n── Events / Side Routes ───────────────────────────')
  const events = [
    {
      _id: 'event-homerun',
      _type: 'event',
      title: 'Home Run Venice',
      slug: { _type: 'slug', current: 'homerun' },
      eventId: 'homerun',
      meta: 'Venice — 20 Apr 2026 — 100 km',
      location: 'Venice, Italy',
      eventDate: '2026-04-20',
      distanceKm: 100,
      registrationOpen: true,
      sortOrder: 1,
    },
    {
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
      sortOrder: 2,
    },
    {
      _id: 'event-tmb',
      _type: 'event',
      title: 'Tour du Mont Blanc',
      slug: { _type: 'slug', current: 'tour-du-mont-blanc' },
      eventId: 'tmb_2027_7day',
      meta: 'France, Italy, Switzerland — Summer 2027 — 170 km',
      location: 'Chamonix, France',
      eventDate: '2027-07-01',
      distanceKm: 170,
      registrationOpen: true,
      sortOrder: 3,
    },
    {
      _id: 'event-iceland',
      _type: 'event',
      title: 'Iceland',
      slug: { _type: 'slug', current: 'iceland' },
      eventId: 'iceland',
      meta: 'Iceland — 2027',
      location: 'Iceland',
      eventDate: '2027-06-01',
      registrationOpen: false,
      sortOrder: 4,
    },
  ]
  for (const e of events) await upsert(e)

  console.log('\n── Books ───────────────────────────────────────────')
  const books = [
    {
      _id: 'book-vol1',
      _type: 'book',
      title: 'Follow The Coast — Volume I',
      subtitle: 'Knokke — San Sebastián',
      bookId: 'book_1',
      volumeNumber: 1,
      price: 65,
      description: 'The first 5,000 km. Belgium, France, Spain. From a grey beach in Knokke to the Basque coast.',
      stageRange: 'Stages 1–47',
      available: true,
    },
    {
      _id: 'book-vol2',
      _type: 'book',
      title: 'Follow The Coast — Volume II',
      subtitle: 'San Sebastián — Gibraltar',
      bookId: 'book_2',
      volumeNumber: 2,
      price: 65,
      description: 'The second volume. Spain\'s Atlantic and Mediterranean coasts. Basque Country to Gibraltar.',
      stageRange: 'Stages 48–95',
      available: true,
    },
    {
      _id: 'book-vol3',
      _type: 'book',
      title: 'Follow The Coast — Volume III',
      subtitle: 'Gibraltar — Monaco',
      bookId: 'book_3',
      volumeNumber: 3,
      price: 65,
      description: 'The third volume. The Mediterranean. Gibraltar through southern Spain, France, to Monaco.',
      stageRange: 'Stages 96–140',
      available: false,
    },
  ]
  for (const b of books) await upsert(b)

  console.log('\n✅ Seed complete')
}

seed().catch(console.error)
