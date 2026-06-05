import {defineArrayMember, defineField, defineType} from 'sanity'

export const caseStudyTextSection = defineType({
  name: 'caseStudyTextSection',
  title: 'Text section',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'P1', value: 'p1'},
            {title: 'P2', value: 'p2'},
          ],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              defineField({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) => Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Text',
      }
    },
  },
})
