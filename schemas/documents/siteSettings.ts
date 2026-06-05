import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [{type: 'callToAction'}],
      initialValue: [
        {label: 'Home', href: '/'},
        {label: 'Cinema', href: '/cinema'},
        {label: 'Mission & Impact', href: '/mission-impact'},
        {label: 'About', href: '/about'},
        {label: 'Contact us', href: '/contact'},
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'ctaEyebrow',
      title: 'CTA eyebrow',
      type: 'string',
      initialValue: 'Have a story to tell?',
    }),
    defineField({
      name: 'cta',
      title: 'CTA link',
      type: 'callToAction',
      initialValue: {label: 'Let’s talk', href: '/contact'},
    }),
    defineField({
      name: 'footerContact',
      title: 'Contact',
      type: 'array',
      description: 'Highlight the email address or phone number and add a mailto: or tel: link.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Email or phone link',
                    type: 'url',
                    validation: (Rule) => Rule.uri({scheme: ['mailto', 'tel']}),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'footerAddress',
      title: 'Address',
      type: 'text',
      description: 'Line breaks entered here are preserved in the footer.',
      rows: 5,
    }),
  ],
})
