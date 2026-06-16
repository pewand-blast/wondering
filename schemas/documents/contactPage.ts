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
      initialValue: {label: 'Apply here', href: '#apply'},
    }),
    defineField({
      name: 'applyForm',
      title: 'Application form',
      type: 'object',
      description: 'Form labels for the application pop-up.',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'Online Application Form',
        }),
        defineField({
          name: 'recipientEmail',
          title: 'Recipient email',
          type: 'email',
          description: 'Application submissions will be sent to this address when form handling is connected.',
        }),
        defineField({
          name: 'fields',
          title: 'Fields',
          type: 'array',
          description: 'Controls the fields shown inside the application form.',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'fieldId',
                  title: 'Field ID',
                  type: 'string',
                  description: 'Used internally for the form value. Keep this short, lowercase, and unique.',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'inputType',
                  title: 'Field type',
                  type: 'string',
                  options: {
                    layout: 'dropdown',
                    list: [
                      {title: 'Text', value: 'text'},
                      {title: 'Email', value: 'email'},
                      {title: 'Phone', value: 'tel'},
                      {title: 'Number', value: 'number'},
                      {title: 'Select', value: 'select'},
                      {title: 'Yes / No switch', value: 'yesNo'},
                      {title: 'Long text', value: 'textarea'},
                    ],
                  },
                  initialValue: 'text',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'required',
                  title: 'Required',
                  type: 'boolean',
                  initialValue: false,
                }),
                defineField({
                  name: 'options',
                  title: 'Options',
                  type: 'array',
                  of: [{type: 'string'}],
                  hidden: ({parent}) => parent?.inputType !== 'select',
                }),
                defineField({
                  name: 'rows',
                  title: 'Rows',
                  type: 'number',
                  initialValue: 4,
                  hidden: ({parent}) => parent?.inputType !== 'textarea',
                }),
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'inputType',
                },
                prepare({title, subtitle}) {
                  return {
                    title: title || 'Untitled field',
                    subtitle: subtitle ? `Type: ${subtitle}` : undefined,
                  }
                },
              },
            },
          ],
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
          name: 'postcodeLabel',
          title: 'Postcode field label',
          type: 'string',
          initialValue: 'Postcode',
        }),
        defineField({
          name: 'phoneLabel',
          title: 'Phone field label',
          type: 'string',
          initialValue: 'Phone Number',
        }),
        defineField({
          name: 'ageLabel',
          title: 'Age field label',
          type: 'string',
          initialValue: 'Age',
        }),
        defineField({
          name: 'projectLabel',
          title: 'Project field label',
          type: 'string',
          initialValue: 'Which project are you applying for?',
        }),
        defineField({
          name: 'projectOptions',
          title: 'Project options',
          type: 'array',
          of: [{type: 'string'}],
          initialValue: ['SEL Mind (South East London // 18-30 age) - Therapeutic Filmmaking'],
        }),
        defineField({
          name: 'madeFilmLabel',
          title: 'Film experience field label',
          type: 'string',
          initialValue: 'Have you made a film before?',
        }),
        defineField({
          name: 'aboutLabel',
          title: 'About field label',
          type: 'string',
          initialValue: 'Tell us something about yourself? Why do you want to join the project? (aim for 300 words)',
        }),
        defineField({
          name: 'groupLabel',
          title: 'Group activity field label',
          type: 'string',
          initialValue: 'How do you feel about joining a group activity? Do you have any specific needs or access requirements?',
        }),
        defineField({
          name: 'datesLabel',
          title: 'Unavailable dates field label',
          type: 'string',
          initialValue: 'Are there any dates you cannot attend?',
        }),
        defineField({
          name: 'submitLabel',
          title: 'Submit button label',
          type: 'string',
          initialValue: 'Submit application',
        }),
      ],
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
