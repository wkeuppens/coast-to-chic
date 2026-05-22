import { defineField, defineType } from 'sanity'

/**
 * Singleton document — one per project.
 * Founders can edit all site-wide text here without touching code.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Prevent more than one settings document
  __experimental_actions: ['update', 'publish'],
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Large text over the hero image',
      initialValue: 'Follow The Coast',
    }),
    defineField({
      name: 'heroSubline',
      title: 'Hero Subline',
      type: 'string',
      initialValue: 'Sea on the right. Always south. 100 km at a time.',
    }),

    // ── Pull Quotes ───────────────────────────────────────────────────────
    defineField({
      name: 'pullQuote1',
      title: 'Pull Quote 1',
      description: 'After the Journey section',
      type: 'string',
      initialValue: 'Sea on the right. Always south. 100 km at a time.',
    }),
    defineField({
      name: 'pullQuote2',
      title: 'Pull Quote 2',
      description: 'After the Books section',
      type: 'string',
      initialValue: 'Salty breeze. The sound of your own footsteps.',
    }),

    // ── Journey Section ───────────────────────────────────────────────────
    defineField({
      name: 'journeyLabel',
      title: 'Journey Section Label',
      type: 'string',
      initialValue: 'The route',
    }),
    defineField({
      name: 'journeyHeadline',
      title: 'Journey Headline',
      type: 'string',
    }),
    defineField({
      name: 'journeyBody',
      title: 'Journey Body Text',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ── Stats (Marquee) ───────────────────────────────────────────────────
    defineField({
      name: 'totalStages',
      title: 'Total Stages',
      type: 'number',
      initialValue: 168,
    }),
    defineField({
      name: 'completedStages',
      title: 'Completed Stages',
      type: 'number',
    }),
    defineField({
      name: 'totalCountries',
      title: 'Countries',
      type: 'number',
      initialValue: 11,
    }),
    defineField({
      name: 'booksSold',
      title: 'Books Sold',
      type: 'number',
    }),

    // ── Support Section ───────────────────────────────────────────────────
    defineField({
      name: 'supportHeadline',
      title: 'Support Section Headline',
      type: 'string',
    }),
    defineField({
      name: 'supportBody',
      title: 'Support Section Body',
      type: 'text',
      rows: 3,
    }),

    // ── Partners ──────────────────────────────────────────────────────────
    defineField({
      name: 'partners',
      title: 'Partners',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: {
            select: { title: 'name' },
          },
        },
      ],
    }),

    // ── SEO Defaults ──────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
      initialValue: 'Follow The Coast',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 2,
    }),
  ],
})
