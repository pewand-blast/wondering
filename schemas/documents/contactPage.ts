import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    defineField({
      name: 'introHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Partner with us',
    }),
    defineField({
      name: 'introBody',
      title: 'Body',
      type: 'styledText',
    }),
    defineField({
      name: 'introCta',
      title: 'CTA',
      type: 'callToAction',
    }),
    defineField({
      name: 'contactHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Contact',
    }),
    defineField({
      name: 'contactParagraph',
      title: 'Paragraph (legacy)',
      type: 'text',
      rows: 4,
      hidden: true,
    }),
    defineField({
      name: 'contactParagraphRich',
      title: 'Paragraph',
      type: 'styledText',
    }),
    defineField({
      name: 'applyCta',
      title: 'CTA',
      type: 'callToAction',
      initialValue: {label: 'Apply here', href: '/apply'},
    }),
    defineField({
      name: 'contactForm',
      title: 'Contact form',
      type: 'object',
      description: 'Form labels and the email address that will receive submissions.',
      fields: [
        defineField({
          name: 'recipientEmail',
          title: 'Recipient email',
          type: 'email',
          description: 'Contact form submissions will be sent to this address.',
        }),
        defineField({
          name: 'nameLabel',
          title: 'Name field label',
          type: 'string',
          initialValue: 'Name',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email field label',
          type: 'string',
          initialValue: 'Email',
        }),
        defineField({
          name: 'phoneLabel',
          title: 'Phone field label',
          type: 'string',
          initialValue: 'Phone',
        }),
        defineField({
          name: 'messageLabel',
          title: 'Message field label',
          type: 'string',
          initialValue: 'Message',
        }),
        defineField({
          name: 'submitLabel',
          title: 'Submit button label',
          type: 'string',
          initialValue: 'Send message',
        }),
      ],
    }),
    defineField({
      name: 'partnersHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our partners',
    }),
    defineField({
      name: 'partners',
      title: 'Logos',
      type: 'array',
      of: [{type: 'logoItem'}],
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Testimonials',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'imageWithAlt',
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Job position, company',
              type: 'string',
            }),
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
              media: 'image',
            },
          },
        },
      ],
    }),
  ],
})
