'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {ContactForm} from './ContactForm'

type ContactFormLabels = {
  nameLabel?: string
  emailLabel?: string
  phoneLabel?: string
  messageLabel?: string
  submitLabel?: string
}

export function ContactFormModal({
  accent = 'default',
  labels,
}: {
  accent?: 'default' | 'red' | 'green' | 'brown'
  labels?: ContactFormLabels | null
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimer = useRef<number | null>(null)

  const openModal = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setIsClosing(false)
    setIsVisible(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsClosing(true)
    closeTimer.current = window.setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
      closeTimer.current = null
      if (window.location.hash === '#form') {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      }
    }, 720)
  }, [])

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
      const href = target?.getAttribute('href')

      if (href !== '#form' && !href?.endsWith('/contact#form')) return

      event.preventDefault()
      window.history.pushState(null, '', '#form')
      openModal()
    }
    const handleHashChange = () => {
      if (window.location.hash === '#form') {
        openModal()
      } else {
        closeModal()
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }

    document.addEventListener('click', handleLinkClick)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('keydown', handleKeyDown)
    if (window.location.hash === '#form') openModal()

    return () => {
      document.removeEventListener('click', handleLinkClick)
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeModal, openModal])

  useEffect(() => {
    document.documentElement.classList.toggle('contact-modal-open', isVisible)

    return () => {
      document.documentElement.classList.remove('contact-modal-open')
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className={`contact-modal contact-modal--${accent} ${isClosing ? 'is-closing' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
      role="presentation"
    >
      <section aria-label="Contact form" aria-modal="true" className="contact-modal__panel" role="dialog">
        <button aria-label="Close contact form" className="contact-modal__close" onClick={closeModal} type="button">
          <span />
        </button>
        <div className="contact-modal__content">
          <h2>Start a conversation</h2>
          <ContactForm labels={labels} />
        </div>
      </section>
    </div>
  )
}
