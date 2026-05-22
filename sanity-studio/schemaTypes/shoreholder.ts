import { defineField, defineType } from 'sanity'

export const shoreholder = defineType({
  name: 'shoreholder',
  title: 'Shoreholder',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      subtitle: 'nationality',
      media: 'avatar',
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'avatar',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      description: 'Without the @ symbol',
      type: 'string',
    }),
  ],
})
