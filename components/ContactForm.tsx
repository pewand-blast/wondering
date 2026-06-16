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
      <button className="contact-form__submit button-link small-copy" type="submit">
        <span className="button-link__text-mask">
          <span className="button-link__text">{labels?.submitLabel || 'Send message'}</span>
        </span>
        <span aria-hidden="true" className="button-link__icon">
          <span className="button-link__icon-bg" />
          <span className="button-link__icon-mask">
            <span className="button-link__icon-track">
              <span className="button-link__arrow" />
              <span className="button-link__arrow" />
              <span className="button-link__arrow" />
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="button-link__hover-bg" />
      </button>
    </form>
  )
}
