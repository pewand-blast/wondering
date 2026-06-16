'use client'

import {useId, useRef, useState} from 'react'

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
  const iframeName = useId().replace(/:/g, '')
  const formRef = useRef<HTMLFormElement | null>(null)
  const hasSubmitted = useRef(false)

  function handleSubmit() {
    hasSubmitted.current = true
    setStatus('sending')
  }

  function handleIframeLoad() {
    if (!hasSubmitted.current) return
    hasSubmitted.current = false
    formRef.current?.reset()
    window.setTimeout(() => {
      setStatus('success')
    }, 300)
  }

  return (
    <>
    <form
      action={`https://formsubmit.co/${encodeURIComponent(recipientEmail)}`}
      className="contact-form"
      method="POST"
      onSubmit={handleSubmit}
      ref={formRef}
      target={iframeName}
    >
      <input name="_subject" type="hidden" value="Wondering contact form" />
      <input name="_template" type="hidden" value="table" />
      <input name="_captcha" type="hidden" value="false" />
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
      {status === 'success' ? (
        <p className="contact-form__status">Form is submitted, thank you.</p>
      ) : (
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
      )}
    </form>
    <iframe aria-hidden="true" name={iframeName} onLoad={handleIframeLoad} style={{display: 'none'}} title="" />
    </>
  )
}
