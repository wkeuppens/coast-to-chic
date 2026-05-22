import { defineField, defineType } from 'sanity'

export const stage = defineType({
  name: 'stage',
  title: 'Stage',
  type: 'document',
  orderings: [
    {
      title: 'Stage Number',
      name: 'stageNumberAsc',
      by: [{ field: 'stageNumber', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      stageNumber: 'stageNumber',
      status: 'status',
      media: 'image',
    },
    prepare({ title, stageNumber, status, media }) {
      return {
        title: `Stage ${stageNumber} — ${title}`,
        subtitle: status,
        media,
      }
    },
  },
  fields: [
    defineField({
      name: 'stageNumber',
      title: 'Stage Number',
      type: 'number',
      validation: Rule => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      description: 'e.g. "Sagres → Lagos"',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      options: {
        list: ['Portugal', 'Spain', 'France', 'Italy', 'Slovenia', 'Iceland'],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      description: 'e.g. "Algarve", "Basque Country"',
      type: 'string',
    }),
    defineField({
      name: 'startLocation',
      title: 'Start Location',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endLocation',
      title: 'End Location',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'distanceKm',
      title: 'Distance (km)',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Available', value: 'available' },
          { title: 'Locked', value: 'locked' },
          { title: 'Booked', value: 'booked' },
        ],
        layout: 'radio',
      },
      initialValue: 'locked',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'runDate',
      title: 'Run Date',
      type: 'date',
    }),
    defineField({
      name: 'image',
      title: 'Stage Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bookNumber',
      title: 'Book Number',
      description: 'Which FTC book this stage appears in',
      type: 'number',
    }),
    defineField({
      name: 'isIceland',
      title: 'Iceland Stage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'startCoord',
      title: 'Start Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ],
    }),
    defineField({
      name: 'endCoord',
      title: 'End Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ],
    }),
    defineField({
      name: 'shoreholder',
      title: 'Shoreholder',
      description: 'Reference to the runner who completed this stage',
      type: 'reference',
      to: [{ type: 'shoreholder' }],
    }),
  ],
})
