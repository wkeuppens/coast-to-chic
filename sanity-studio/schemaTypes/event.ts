import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event / Side Route',
  type: 'document',
  preview: {
    select: { title: 'title', subtitle: 'eventDate', media: 'image' },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Used for the URL — e.g. "homerun", "tour-du-mont-blanc"',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'eventId',
      title: 'Event ID',
      description: 'Stripe product key — e.g. "homerun", "ftk_35km"',
      type: 'string',
    }),
    defineField({
      name: 'meta',
      title: 'Meta Line',
      description: 'Short summary shown on card — e.g. "Venice — 20 Apr 2026 — 100 km"',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
    }),
    defineField({
      name: 'distanceKm',
      title: 'Distance (km)',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'priceEur', title: 'Price (EUR)', type: 'number' },
            { name: 'productId', title: 'Product ID', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'registrationOpen',
      title: 'Registration Open',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      description: 'Lower numbers appear first',
      type: 'number',
    }),
  ],
})
