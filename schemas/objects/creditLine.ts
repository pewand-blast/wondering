import {defineField, defineType} from 'sanity'

export const creditLine = defineType({
  name: 'creditLine',
  title: 'Credit line',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'names',
      title: 'Names',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      names: 'names',
    },
    prepare({title, names}) {
      return {
        title,
        subtitle: Array.isArray(names) ? names.join(', ') : undefined,
      }
    },
  },
})
