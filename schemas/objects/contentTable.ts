import {defineField, defineType} from 'sanity'
import {ContentTableInput} from '../../components/studio/ContentTableInput'

export const contentTable = defineType({
  name: 'contentTable',
  title: 'Table',
  type: 'object',
  components: {
    input: ContentTableInput,
  },
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({cells}) {
              return {
                title: Array.isArray(cells) ? cells.join(' | ') : 'Row',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      rows: 'rows',
    },
    prepare({rows}) {
      const count = Array.isArray(rows) ? rows.length : 0

      return {
        title: 'Table',
        subtitle: `${count} ${count === 1 ? 'row' : 'rows'}`,
      }
    },
  },
})
