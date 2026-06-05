import {defineField, defineType} from 'sanity'

export const filmReference = defineType({
  name: 'filmReference',
  title: 'Film reference',
  type: 'object',
  fields: [
    defineField({
      name: 'film',
      title: 'Film',
      type: 'reference',
      to: [{type: 'film'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'film.title',
      subtitle: 'film.client',
      media: 'film.thumbnail',
    },
  },
})
