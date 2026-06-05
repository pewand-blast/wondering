import {defineArrayMember, defineType} from 'sanity'

export const caseStudyContent = defineType({
  name: 'caseStudyContent',
  title: 'Case study content sections',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'caseStudyTextSection',
      title: 'Text',
    }),
    defineArrayMember({
      type: 'imageWithAlt',
      title: 'Image',
    }),
    defineArrayMember({
      type: 'contentTable',
      title: 'Table',
    }),
    defineArrayMember({
      type: 'statBlock',
      title: 'Stat',
    }),
    defineArrayMember({
      type: 'logoSection',
      title: 'Logos',
    }),
  ],
})
