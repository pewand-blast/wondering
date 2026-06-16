'use client'

import {useState, type FormEvent} from 'react'

type ContactFormLabels = {
  recipientEmail?: string
  nameLabel?: string
  emailLabel?: string
  phoneLabel?: string
  messageLabel?: string
  submitLabel?: string
}

export function ContactForm({labels}: {labels?: ContactFormLabels | null}) {
  const recipientEmail = labels?.recipientEmail || 'contact@wondering.com'
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const fields = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]))

    setStatus('sending')

    try {
      const response = await fetch('/api/form-submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          formName: 'Wondering contact form',
          recipientEmail,
          fields,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit form')
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
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
      <button className="contact-form__submit button-link small-copy" disabled={status === 'sending'} type="submit">
        <span className="button-link__text-mask">
          <span className="button-link__text">{status === 'sending' ? 'Sending' : labels?.submitLabel || 'Send message'}</span>
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
      {status === 'success' ? <p className="contact-form__status">Thanks, your message has been sent.</p> : null}
      {status === 'error' ? <p className="contact-form__status">Something went wrong. Please try again.</p> : null}
    </form>
  )
}
