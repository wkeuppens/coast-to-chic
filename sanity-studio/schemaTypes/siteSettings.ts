import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'journey', title: 'Journey' },
    { name: 'howItWorks', title: 'How It Works' },
    { name: 'stats', title: 'Stats' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'stages', title: 'Stage Highlights' },
    { name: 'books', title: 'Books' },
    { name: 'quotes', title: 'Pull Quotes' },
    { name: 'support', title: 'Support' },
    { name: 'partners', title: 'Partners' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Follow The Coast',
    }),
    defineField({
      name: 'heroSubline',
      title: 'Hero Subline',
      description: 'Small text below the headline',
      type: 'string',
      group: 'hero',
      initialValue: 'All of Europe\'s coastline. Counter-clockwise. 100 km at a time.',
    }),

    // ── Journey ───────────────────────────────────────────────────────────
    defineField({
      name: 'journeyLabel',
      title: 'Section Label',
      type: 'string',
      group: 'journey',
      initialValue: 'The route',
    }),
    defineField({
      name: 'journeyHeadline',
      title: 'Headline',
      type: 'string',
      group: 'journey',
      initialValue: 'Sea on the right. Always south.',
    }),
    defineField({
      name: 'journeyParagraphs',
      title: 'Body Paragraphs',
      description: 'Each item is one paragraph',
      type: 'array',
      group: 'journey',
      of: [{ type: 'text', rows: 2 }],
      initialValue: [
        'Started July 2019 from a beach in Knokke. Salt air, grey sky. The simple rule: keep the sea on your right and run south.',
        'Belgium. France. Spain. Portugal. Now Italy.',
        'Athens by end of 2026.',
      ],
    }),

    // ── How It Works ──────────────────────────────────────────────────────
    defineField({
      name: 'howItWorksHeadline',
      title: 'Headline',
      type: 'string',
      group: 'howItWorks',
      initialValue: 'A van. A photographer. You.',
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'Steps',
      type: 'array',
      group: 'howItWorks',
      of: [{
        type: 'object',
        fields: [
          { name: 'number', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text', rows: 2 },
        ],
        preview: { select: { title: 'title' } },
      }],
      initialValue: [
        { number: '01', title: 'Pick a stage', body: '100 km of coastline. You choose where.' },
        { number: '02', title: 'Plan the route', body: 'We give start and finish. You shape the middle.' },
        { number: '03', title: 'Run it', body: '7 am start. A van. A photographer. The coast.' },
      ],
    }),
    defineField({
      name: 'supportIncluded',
      title: 'Support Included Items',
      type: 'array',
      group: 'howItWorks',
      of: [{ type: 'string' }],
      initialValue: [
        'Van with driver, 24 hours',
        'Photographer, all day',
        'Food, water, coffee',
        'Photos delivered after. Your name in the book',
      ],
    }),
    defineField({
      name: 'pricingSolo',
      title: 'Price — 1 person (EUR)',
      type: 'number',
      group: 'howItWorks',
      initialValue: 699,
    }),
    defineField({
      name: 'pricingDuo',
      title: 'Price — 2 people (EUR)',
      type: 'number',
      group: 'howItWorks',
      initialValue: 999,
    }),
    defineField({
      name: 'pricingGroup',
      title: 'Price — 3 or more (EUR)',
      type: 'number',
      group: 'howItWorks',
      initialValue: 1299,
    }),

    // ── Stats ─────────────────────────────────────────────────────────────
    defineField({
      name: 'icelandReleaseAt',
      title: 'Iceland — Stage Release Time',
      description: 'All 46 Iceland stages go live at this moment. Adjust here to change the release time.',
      type: 'datetime',
      group: 'stats',
      options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm', timeStep: 15 },
    }),
    defineField({
      name: 'totalKm',
      title: 'Total km run',
      type: 'number',
      group: 'stats',
    }),
    defineField({
      name: 'totalCountries',
      title: 'Countries',
      type: 'number',
      group: 'stats',
      initialValue: 11,
    }),
    defineField({
      name: 'totalRunners',
      title: 'Runners',
      type: 'number',
      group: 'stats',
    }),
    defineField({
      name: 'booksSold',
      title: 'Books sold',
      type: 'number',
      group: 'stats',
    }),

    // ── Gallery ───────────────────────────────────────────────────────────
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      description: 'Horizontal scroll gallery on the homepage',
      type: 'array',
      group: 'gallery',
      of: [{
        type: 'object',
        fields: [
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'alt', title: 'Alt text', type: 'string' },
          { name: 'label', title: 'Label', description: 'e.g. "Stage 089"', type: 'string' },
        ],
        preview: { select: { title: 'label', media: 'image' } },
      }],
    }),

    // ── Stage Highlights ──────────────────────────────────────────────────
    defineField({
      name: 'stageHighlights',
      title: 'Stage Highlights',
      description: 'Rows shown on the homepage stages section',
      type: 'array',
      group: 'stages',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'string' },
          { name: 'detail', title: 'Detail', description: 'e.g. "2026 — Open for registration"', type: 'string' },
          { name: 'href', title: 'Link', type: 'string' },
        ],
        preview: { select: { title: 'title', subtitle: 'detail' } },
      }],
      initialValue: [
        { title: 'EU Stages', description: 'Italy to Greece. The main line.', detail: '2026 — Open for registration', href: '/register' },
        { title: 'Home Run', description: 'Venice. 100 km. Shared stage.', detail: '€199 — Open', href: '/homerun' },
      ],
    }),

    // ── Books ─────────────────────────────────────────────────────────────
    defineField({
      name: 'bookSectionHeadline',
      title: 'Books Section Headline',
      type: 'string',
      group: 'books',
      initialValue: '5,000 km per volume',
    }),
    defineField({
      name: 'bookSectionImage',
      title: 'Books Section Image',
      type: 'image',
      group: 'books',
      options: { hotspot: true },
    }),

    // ── Pull Quotes ───────────────────────────────────────────────────────
    defineField({
      name: 'pullQuote1',
      title: 'Pull Quote 1',
      description: 'After the Journey section',
      type: 'string',
      group: 'quotes',
      initialValue: 'Sea on the right. Always south. 100 km at a time.',
    }),
    defineField({
      name: 'pullQuote2',
      title: 'Pull Quote 2',
      description: 'After the Books section',
      type: 'string',
      group: 'quotes',
      initialValue: 'Salty breeze. The sound of your own footsteps.',
    }),

    // ── Support ───────────────────────────────────────────────────────────
    defineField({
      name: 'supportHeadline',
      title: 'Support Section Headline',
      type: 'string',
      group: 'support',
      initialValue: 'This journey moves with support',
    }),
    defineField({
      name: 'supportBody',
      title: 'Support Section Body',
      type: 'text',
      group: 'support',
      rows: 3,
      initialValue: 'Follow the Coast continues thanks to runners, readers, and partners who choose to carry it forward.',
    }),

    // ── Partners ──────────────────────────────────────────────────────────
    defineField({
      name: 'partners',
      title: 'Partners',
      type: 'array',
      group: 'partners',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'url', title: 'URL', type: 'url' },
        ],
        preview: { select: { title: 'name' } },
      }],
      initialValue: [
        { name: 'Duvel' },
        { name: 'Victus' },
        { name: "D'Ieteren" },
      ],
    }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
      group: 'seo',
      initialValue: 'Follow The Coast',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
      group: 'seo',
      rows: 2,
    }),
  ],
})
