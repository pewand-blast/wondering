import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-01'})

const applicationFields = [
  {_key: 'name', _type: 'object', fieldId: 'name', label: 'Name', inputType: 'text', required: true},
  {_key: 'email', _type: 'object', fieldId: 'email', label: 'Email', inputType: 'email', required: true},
  {_key: 'postcode', _type: 'object', fieldId: 'postcode', label: 'Postcode', inputType: 'text', required: true},
  {_key: 'phone', _type: 'object', fieldId: 'phone', label: 'Phone Number', inputType: 'tel', required: true},
  {_key: 'age', _type: 'object', fieldId: 'age', label: 'Age', inputType: 'number', required: false},
  {
    _key: 'project',
    _type: 'object',
    fieldId: 'project',
    label: 'Which project are you applying for?',
    inputType: 'select',
    required: true,
    options: ['SEL Mind (South East London // 18-30 age) - Therapeutic Filmmaking'],
  },
  {_key: 'madeFilm', _type: 'object', fieldId: 'madeFilm', label: 'Have you made a film before?', inputType: 'yesNo', required: false},
  {
    _key: 'about',
    _type: 'object',
    fieldId: 'about',
    label: 'Tell us something about yourself? Why do you want to join the project? (aim for 300 words)',
    inputType: 'textarea',
    required: true,
    rows: 6,
  },
  {
    _key: 'groupActivity',
    _type: 'object',
    fieldId: 'groupActivity',
    label: 'How do you feel about joining a group activity? Do you have any specific needs or access requirements?',
    inputType: 'textarea',
    required: true,
    rows: 5,
  },
  {_key: 'unavailableDates', _type: 'object', fieldId: 'unavailableDates', label: 'Are there any dates you cannot attend?', inputType: 'textarea', required: false, rows: 4},
]

const applyForm = {
  _type: 'object',
  heading: 'Online Application Form',
  recipientEmail: 'pewand@blast.co.uk',
  nameLabel: 'Name',
  emailLabel: 'Email',
  postcodeLabel: 'Postcode',
  phoneLabel: 'Phone Number',
  ageLabel: 'Age',
  projectLabel: 'Which project are you applying for?',
  projectOptions: ['SEL Mind (South East London // 18-30 age) - Therapeutic Filmmaking'],
  madeFilmLabel: 'Have you made a film before?',
  aboutLabel: 'Tell us something about yourself? Why do you want to join the project? (aim for 300 words)',
  groupLabel: 'How do you feel about joining a group activity? Do you have any specific needs or access requirements?',
  datesLabel: 'Are there any dates you cannot attend?',
  submitLabel: 'Submit application',
  fields: applicationFields,
}

const documents = await client.fetch<string[]>('*[_id in ["contactPage", "drafts.contactPage"]]._id')

await Promise.all(
  documents.map((id) => (
    client
      .patch(id)
      .set({
        applyCta: {
          _type: 'callToAction',
          label: 'Apply here',
          href: '#apply',
        },
        applyForm,
      })
      .commit()
  )),
)

console.log('Application form defaults added.')
