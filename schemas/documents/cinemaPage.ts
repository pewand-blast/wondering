import {defineField, defineType} from 'sanity'

export const cinemaPage = defineType({
  name: 'cinemaPage',
  title: 'Cinema page',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      initialValue: 'Exploring human stories through therapeutic storytelling and social campaigns.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredFilms',
      title: 'Featured / ordered films',
      type: 'array',
      of: [{type: 'filmReference'}],
      description: 'Controls the repeatable grid order. Films still carry their own filters/categories.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Cinema',
      }
    },
  },
})
