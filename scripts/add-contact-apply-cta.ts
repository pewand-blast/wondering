import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-01'})

await client
  .patch('contactPage')
  .setIfMissing({
    applyCta: {
      _type: 'callToAction',
      label: 'Apply here',
      href: '/apply',
    },
  })
  .commit()

console.log('Contact apply CTA added.')
