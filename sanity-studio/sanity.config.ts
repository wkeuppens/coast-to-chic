import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

// Replace these with your actual project values from sanity.io/manage
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'follow-the-coast',
  title: 'Follow The Coast',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            // Collections
            S.documentTypeListItem('stage').title('Stages'),
            S.documentTypeListItem('shoreholder').title('Shoreholders'),
            S.documentTypeListItem('book').title('Books'),
            S.documentTypeListItem('event').title('Events / Side Routes'),
            S.documentTypeListItem('print').title('Prints'),
            S.documentTypeListItem('photographer').title('Photographers'),
          ]),
    }),
    visionTool(), // GROQ query playground — useful for debugging
  ],

  schema: {
    types: schemaTypes,
  },
})
