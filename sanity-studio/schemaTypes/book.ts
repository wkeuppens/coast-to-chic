import { defineField, defineType } from 'sanity'

export const book = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  preview: {
    select: { title: 'title', media: 'coverImage' },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'bookId',
      title: 'Book ID',
      description: 'Stripe product key — e.g. "book_1", "book_2", "book_3"',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'volumeNumber',
      title: 'Volume Number',
      type: 'number',
      validation: Rule => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'spreadImages',
      title: 'Spread Images',
      description: 'Interior book spread photos for the gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'stageRange',
      title: 'Stage Range',
      description: 'e.g. "Stages 1–47"',
      type: 'string',
    }),
    defineField({
      name: 'available',
      title: 'Available for Purchase',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
