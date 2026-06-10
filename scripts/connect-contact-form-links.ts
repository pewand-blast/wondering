import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-01'})

await client
  .transaction()
  .patch('homePage', (patch) =>
    patch.set({
      'contactCta.href': '/contact#form',
    }),
  )
  .patch('siteSettings', (patch) =>
    patch.set({
      'cta.href': '/contact#form',
    }),
  )
  .patch('contactPage', (patch) =>
    patch.setIfMissing({
      contactForm: {
        _type: 'object',
        nameLabel: 'Name',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        messageLabel: 'Message',
        submitLabel: 'Send message',
      },
    }),
  )
  .commit()

console.log('Contact form links and initial labels updated.')
