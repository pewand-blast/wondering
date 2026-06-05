import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({
      name: 'introHeading',
      title: 'Intro heading',
      type: 'string',
      initialValue: 'Who we are',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro body',
      type: 'text',
      rows: 5,
      initialValue:
        'We create films that sit between therapeutic storytelling and social campaigns – grounded in real experiences and made to resonate beyond the screen.',
    }),
    defineField({
      name: 'sectionsHeading',
      title: 'Sections heading',
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
      title: 'Team heading',
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
