import { defineField, defineType } from 'sanity'

export const print = defineType({
  name: 'print',
  title: 'Print',
  type: 'document',
  preview: {
    select: { title: 'title', subtitle: 'dimensions', media: 'image' },
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
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'stageNumber',
      title: 'Stage Number',
      description: 'Which stage this print is from',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Print Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'priceEur',
      title: 'Price (EUR)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      description: 'e.g. "50 × 70 cm"',
      type: 'string',
    }),
    defineField({
      name: 'editionSize',
      title: 'Edition Size',
      description: 'Total number of prints in the edition',
      type: 'number',
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
})
