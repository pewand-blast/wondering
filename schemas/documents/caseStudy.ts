import {defineField, defineType} from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  fields: [
    defineField({
      name: 'missionSection',
      title: 'Mission & Impact page section',
      type: 'object',
      description: 'Content shown in the case study section on the Mission & Impact page. The link to the individual page is handled by the frontend.',
      fields: [
        defineField({
          name: 'heroImage',
          title: 'Hero image',
          type: 'imageWithAlt',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'header',
          title: 'Header',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'copyRich',
          title: 'Copy',
          type: 'styledText',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'copy',
          title: 'Legacy plain copy',
          type: 'text',
          rows: 5,
          hidden: true,
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'missionSection.header'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'individualPage',
      title: 'Individual case study page',
      type: 'object',
      fields: [
        defineField({
          name: 'header',
          title: 'Header',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'gallery',
          title: 'Gallery',
          type: 'array',
          of: [{type: 'imageWithAlt'}],
          description: 'Images shown in the gallery on the individual case study page.',
        }),
        defineField({
          name: 'contentSections',
          title: 'Content sections',
          type: 'caseStudyContent',
          description: 'Build the page with text, image, table, stat, and logo sections in any order.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'missionSection.header',
      subtitle: 'individualPage.header',
      media: 'missionSection.heroImage',
    },
  },
})
