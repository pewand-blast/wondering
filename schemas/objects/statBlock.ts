import {defineField, defineType} from 'sanity'

export const statBlock = defineType({
  name: 'statBlock',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'Examples: 93%, +1.34',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'copy',
      title: 'Supporting copy',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'number',
      subtitle: 'copy',
    },
  },
})
