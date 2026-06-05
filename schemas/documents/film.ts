import {defineField, defineType} from 'sanity'

export const film = defineType({
  name: 'film',
  title: 'Film',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client / artist',
      type: 'string',
    }),
    defineField({
      name: 'filmType',
      title: 'Description',
      type: 'styledText',
      description: 'Short rich text description shown on film cards. Use line breaks as needed.',
    }),
    defineField({
      name: 'categories',
      title: 'Filters',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Therapeutic Storytelling', value: 'therapeutic-storytelling'},
          {title: 'Social Campaigns', value: 'social-campaigns'},
          {title: 'Community', value: 'community'},
          {title: 'Research', value: 'research'},
        ],
        layout: 'dropdown',
      } as never,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoSource',
      title: 'Video source',
      type: 'string',
      description: 'Choose how the film detail video is supplied.',
      options: {
        list: [
          {title: 'YouTube', value: 'youtube'},
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'MP4 upload', value: 'mp4'},
        ],
        layout: 'radio',
      },
      initialValue: 'youtube',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video embed URL',
      type: 'url',
      description: 'YouTube or Vimeo URL used on the film detail page.',
      hidden: ({document}) => document?.videoSource === 'mp4',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['https'],
          allowRelative: false,
        }),
    }),
    defineField({
      name: 'videoFile',
      title: 'MP4 upload',
      type: 'file',
      description: 'Uploaded MP4 used on the film detail page with visible controls.',
      hidden: ({document}) => document?.videoSource !== 'mp4',
      options: {
        accept: 'video/mp4',
      },
    }),
    defineField({
      name: 'summary',
      title: 'Individual page copy',
      type: 'styledText',
      description: 'Rich text shown under the film title on the individual film page. Use P1/P2 styles and line breaks as needed.',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [{type: 'creditLine'}],
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [{type: 'logoItem'}],
      description: 'Logos managed per film, as shown in the design.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'thumbnail',
    },
  },
})
