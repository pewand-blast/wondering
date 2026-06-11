import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({
      name: 'introHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Who we are',
    }),
    defineField({
      name: 'introBody',
      title: 'Body',
      type: 'text',
      rows: 5,
      initialValue:
        'We create films that sit between therapeutic storytelling and social campaigns – grounded in real experiences and made to resonate beyond the screen.',
    }),
    defineField({
      name: 'sectionsHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'What we do',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{type: 'pageSection'}],
    }),
    defineField({
      name: 'teamHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'The team',
    }),
    defineField({
      name: 'teamSections',
      title: 'Team sections',
      type: 'array',
      of: [{type: 'pageSection'}],
    }),
  ],
})
