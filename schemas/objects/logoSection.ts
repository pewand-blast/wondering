import {defineField, defineType} from 'sanity'

export const logoSection = defineType({
  name: 'logoSection',
  title: 'Logos',
  type: 'object',
  fields: [
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [{type: 'logoItem'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      logos: 'logos',
    },
    prepare({logos}) {
      const count = Array.isArray(logos) ? logos.length : 0

      return {
        title: 'Logos',
        subtitle: `${count} ${count === 1 ? 'logo' : 'logos'}`,
      }
    },
  },
})
