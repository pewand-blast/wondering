'use client'

import type {FormEvent} from 'react'

type ContactFormLabels = {
  nameLabel?: string
  emailLabel?: string
  phoneLabel?: string
  messageLabel?: string
  submitLabel?: string
}

export function ContactForm({labels}: {labels?: ContactFormLabels | null}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>{labels?.nameLabel || 'Name'}</span>
        <input autoComplete="name" name="name" required type="text" />
      </label>
      <label>
        <span>{labels?.emailLabel || 'Email'}</span>
        <input autoComplete="email" name="email" required type="email" />
      </label>
      <label>
        <span>{labels?.phoneLabel || 'Phone'}</span>
        <input autoComplete="tel" name="phone" type="tel" />
      </label>
      <label className="contact-form__message">
        <span>{labels?.messageLabel || 'Message'}</span>
        <textarea name="message" required rows={6} />
      </label>
      <button className="contact-form__submit" type="submit">
        <span>{labels?.submitLabel || 'Send message'}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
