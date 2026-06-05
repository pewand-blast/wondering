import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {media} from 'sanity-plugin-media'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'demo'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'wondering',
  title: 'Wondering CMS',
  projectId,
  dataset,
  plugins: [
    media(),
    structureTool({structure}),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  studio: {
    components: {},
  },
})
