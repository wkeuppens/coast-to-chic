import { defineField, defineType } from 'sanity'

export const photographer = defineType({
  name: 'photographer',
  title: 'Photographer',
  type: 'document',
  preview: {
    select: { title: 'name', media: 'portrait' },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'portfolioImages',
      title: 'Portfolio Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'stages',
      title: 'Stages Photographed',
      type: 'array',
      of: [{ type: 'number' }],
    }),
  ],
})
