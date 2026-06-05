import {defineField, defineType} from 'sanity'

export const missionImpactPage = defineType({
  name: 'missionImpactPage',
  title: 'Mission & Impact page',
  type: 'document',
  fields: [
    defineField({
      name: 'missionHeading',
      title: 'Mission heading',
      type: 'string',
      initialValue: 'Mission',
    }),
    defineField({
      name: 'missionBody',
      title: 'Mission body',
      type: 'text',
      rows: 4,
      initialValue:
        'Our mission is to create films that connect deeply with people through therapeutic storytelling and social campaigns.',
    }),
    defineField({
      name: 'impactHeading',
      title: 'Impact heading',
      type: 'string',
      initialValue: 'Impact',
    }),
    defineField({
      name: 'impactFirstParagraph',
      title: 'Impact first paragraph',
      type: 'text',
      rows: 4,
      description: 'Standalone paragraph shown before the numbered stat copy.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats with linked copy',
      type: 'array',
      of: [{type: 'statBlock'}],
      description: 'Each number includes its own supporting paragraph.',
    }),
    defineField({
      name: 'caseStudiesHeading',
      title: 'Case studies heading',
      type: 'string',
      initialValue: 'Case studies',
    }),
    defineField({
      name: 'caseStudies',
      title: 'Case studies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'caseStudy'}]}],
    }),
  ],
})
