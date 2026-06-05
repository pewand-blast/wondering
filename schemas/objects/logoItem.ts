import {defineField, defineType} from 'sanity'

export const logoItem = defineType({
  name: 'logoItem',
  title: 'Logo',
  type: 'object',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      media: 'logo',
    },
    prepare({media}) {
      return {
        title: 'Logo',
        media,
      }
    },
  },
})
