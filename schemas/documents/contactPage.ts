import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    defineField({
      name: 'introHeading',
      title: 'Intro heading',
      type: 'string',
      initialValue: 'Partner with us',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro body',
      type: 'text',
      rows: 4,
      initialValue:
        'We work with organisations, charities, and communities to create films and campaigns that make a difference. If you’re exploring an idea or looking to collaborate, we’d love to hear from you.',
    }),
    defineField({
      name: 'introCta',
      title: 'Intro CTA',
      type: 'callToAction',
    }),
    defineField({
      name: 'contactHeading',
      title: 'Contact heading',
      type: 'string',
      initialValue: 'Contact',
    }),
    defineField({
      name: 'contactParagraph',
      title: 'Contact paragraph (legacy)',
      type: 'text',
      rows: 4,
      hidden: true,
    }),
    defineField({
      name: 'contactParagraphRich',
      title: 'Contact paragraph',
      type: 'styledText',
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
      title: 'Partners heading',
      type: 'string',
      initialValue: 'Our partners',
    }),
    defineField({
      name: 'partners',
      title: 'Partner logos',
      type: 'array',
      of: [{type: 'logoItem'}],
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials heading',
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
