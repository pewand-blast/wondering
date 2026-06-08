'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'

const revealSelector = [
  'main section > *',
  'main article',
  'main h1',
  'main h2',
  'main h3',
  'main p',
  'main .figma-home-button',
  'main .button-link',
  '.site-footer > *',
].join(',')

const textSelector = 'h1,h2,h3,p'
const activeAnimations = new WeakMap<HTMLElement, number[]>()

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function isPlainTextElement(element: Element) {
  if (!element.matches(textSelector)) return false
  if (element.closest('.headline-cycler, .stat-cycler, .topbar, .menu-popover, .site-footer')) return false
  if (element.children.length > 0) return false

  return Boolean(element.textContent?.replace(/\s+/g, ' ').trim())
}

function splitTextIntoLines(element: HTMLElement) {
  if (element.dataset.revealTextReady === 'true') return

  const text = element.textContent?.replace(/\s+/g, ' ').trim()
  if (!text) return

  element.dataset.revealTextReady = 'true'
  element.setAttribute('aria-label', text)

  const words = text.split(' ')
  element.innerHTML = words
    .map((word, index) => `<span data-reveal-word>${escapeHtml(word)}${index < words.length - 1 ? ' ' : ''}</span>`)
    .join('')

  const wordElements = Array.from(element.querySelectorAll<HTMLElement>('[data-reveal-word]'))
  const lines = wordElements.reduce<Array<{top: number; words: string[]}>>((groups, wordElement) => {
    const word = wordElement.textContent?.trim()
    if (!word) return groups

    const top = Math.round(wordElement.offsetTop)
    const currentGroup = groups[groups.length - 1]

    if (!currentGroup || Math.abs(currentGroup.top - top) > 2) {
      groups.push({top, words: [word]})
      return groups
    }

    currentGroup.words.push(word)
    return groups
  }, [])

  element.innerHTML = lines
    .map((line, index) => (
      `<span class="scroll-reveal-line-mask line-parent" aria-hidden="true">` +
      `<span class="scroll-reveal-line line-child" style="--line-index:${index}">${escapeHtml(line.words.join(' '))}</span>` +
      `</span>`
    ))
    .join('')
}

function splitTextIntoChars(element: HTMLElement) {
  if (element.dataset.revealTextReady === 'true') return

  const text = element.textContent?.replace(/\s+/g, ' ').trim()
  if (!text) return

  element.dataset.revealTextReady = 'true'
  element.setAttribute('aria-label', text)

  element.innerHTML = Array.from(text)
    .map((char, index) => {
      if (char === ' ') return '<span class="scroll-reveal-char-space" aria-hidden="true"> </span>'

      return (
        `<span class="scroll-reveal-char" aria-hidden="true" style="--char-index:${index}">` +
        `${escapeHtml(char)}` +
        `</span>`
      )
    })
    .join('')
}

function resplitTextElement(element: HTMLElement) {
  const text = element.getAttribute('aria-label')
  if (!text) return

  element.dataset.revealTextReady = 'false'
  element.textContent = text

  if (element.classList.contains('scroll-reveal--chars')) {
    splitTextIntoChars(element)
    return
  }

  splitTextIntoLines(element)
}

function prepareRevealElement(element: HTMLElement) {
  if (element.dataset.scrollReveal === 'true') return
  if (element.closest('.topbar, .menu-popover')) return
  if (element.classList.contains('stat-cycler__measure')) return

  element.dataset.scrollReveal = 'true'
  element.classList.add('scroll-reveal')

  if (isPlainTextElement(element)) {
    element.classList.add('scroll-reveal--text')

    if (element.matches('h2,h3')) {
      splitTextIntoChars(element)
      element.classList.add('scroll-reveal--chars')
      return
    }

    splitTextIntoLines(element)
    element.classList.add(element.matches('h1') ? 'scroll-reveal--heading' : 'scroll-reveal--paragraph')
  }
}

function expoOut(progress: number) {
  return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
}

function power3Out(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

function power4Out(progress: number) {
  return 1 - Math.pow(1 - progress, 4)
}

function cancelElementAnimations(element: HTMLElement) {
  const frames = activeAnimations.get(element)
  if (!frames) return

  frames.forEach((frame) => window.cancelAnimationFrame(frame))
  activeAnimations.delete(element)
}

function setLineFinalState(element: HTMLElement) {
  const chars = Array.from(element.querySelectorAll<HTMLElement>('.scroll-reveal-char'))
  chars.forEach((char) => {
    char.style.opacity = '1'
    char.style.transform = 'translate3d(0, 0, 0)'
  })

  const lines = Array.from(element.querySelectorAll<HTMLElement>('.scroll-reveal-line'))
  lines.forEach((line) => {
    line.style.opacity = '1'
    line.style.transform = 'translate3d(0, 0, 0)'
  })
}

function animateValue({
  delay = 0,
  duration,
  ease,
  onUpdate,
}: {
  delay?: number
  duration: number
  ease: (progress: number) => number
  onUpdate: (progress: number) => void
}) {
  let frame = 0
  const start = window.performance.now() + delay

  const tick = (now: number) => {
    if (now < start) {
      frame = window.requestAnimationFrame(tick)
      return
    }

    const rawProgress = Math.min((now - start) / duration, 1)
    onUpdate(ease(rawProgress))

    if (rawProgress < 1) {
      frame = window.requestAnimationFrame(tick)
    }
  }

  frame = window.requestAnimationFrame(tick)
  return frame
}

function animateReveal(element: HTMLElement) {
  if (element.dataset.revealAnimated === 'true') return

  element.dataset.revealAnimated = 'true'
  element.classList.add('is-revealed')
  cancelElementAnimations(element)

  const baseDelay = Number(element.style.getPropertyValue('--reveal-index') || 0) * 70
  const frames: number[] = []

  if (element.classList.contains('scroll-reveal--text')) {
    if (element.classList.contains('scroll-reveal--chars')) {
      const chars = Array.from(element.querySelectorAll<HTMLElement>('.scroll-reveal-char'))

      chars.forEach((char, index) => {
        char.style.opacity = '0'
        char.style.transform = 'translate3d(-6px, 0, 0)'
        frames.push(animateValue({
          delay: baseDelay + (index * 18),
          duration: 850,
          ease: power3Out,
          onUpdate: (progress) => {
            char.style.opacity = String(progress)
            char.style.transform = `translate3d(${(1 - progress) * -6}px, 0, 0)`
          },
        }))
      })

      activeAnimations.set(element, frames)
      return
    }

    const isHeading = element.classList.contains('scroll-reveal--heading')
    const fromY = isHeading ? 18 : 24
    const stagger = isHeading ? 70 : 55
    const ease = isHeading ? power4Out : expoOut
    const lines = Array.from(element.querySelectorAll<HTMLElement>('.scroll-reveal-line'))

    lines.forEach((line, index) => {
      line.style.opacity = '0'
      line.style.transform = `translate3d(0, ${fromY}px, 0)`
      frames.push(animateValue({
        delay: baseDelay + (index * stagger),
        duration: 1600,
        ease,
        onUpdate: (progress) => {
          line.style.opacity = String(progress)
          line.style.transform = `translate3d(0, ${(1 - progress) * fromY}px, 0)`
        },
      }))
    })

    window.setTimeout(() => {
      if (element.dataset.revealAnimated === 'true') {
        setLineFinalState(element)
      }
    }, baseDelay + (lines.length * stagger) + 1680)
  } else {
    const fromY = 16

    element.style.opacity = '0'
    element.style.transform = `translate3d(0, ${fromY}px, 0)`
    frames.push(animateValue({
      delay: baseDelay,
      duration: 1100,
      ease: power3Out,
      onUpdate: (progress) => {
        element.style.opacity = String(progress)
        element.style.transform = `translate3d(0, ${(1 - progress) * fromY}px, 0)`
      },
    }))
  }

  activeAnimations.set(element, frames)
}

function isMediaElementOrWrapper(element: HTMLElement) {
  if (element.matches('img, picture, video, iframe')) return true
  if (element.matches('.figma-home-button, .button-link')) return false
  if (element.matches(textSelector)) return false

  return Boolean(element.querySelector('img, picture, video, iframe'))
}

export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.querySelector('.site-shell')
    if (!root) return

    const revealElements = Array.from(root.querySelectorAll<HTMLElement>(revealSelector))
      .filter((element) => {
        if (element.closest('.figma-home-hero')) return false
        if (element.closest('.stat-cycler__measure')) return false
        if (element.matches('.footer-logo') || element.closest('.footer-logo')) return false
        if (isMediaElementOrWrapper(element)) return false
        return Boolean(element.offsetParent || element.getClientRects().length)
      })

    const parentCounts = new WeakMap<Element, number>()

    revealElements.forEach((element) => {
      prepareRevealElement(element)

      const parent = element.parentElement || root
      const index = parentCounts.get(parent) || 0
      parentCounts.set(parent, index + 1)
      element.style.setProperty('--reveal-index', String(Math.min(index, 8)))
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          animateReveal(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -16% 0px',
        threshold: 0.12,
      },
    )

    revealElements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
        animateReveal(element)
        return
      }

      observer.observe(element)
    })

    let resizeFrame = 0
    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(() => {
        revealElements.forEach((element) => {
          if (!element.classList.contains('scroll-reveal--text')) return
          resplitTextElement(element)
          if (element.dataset.revealAnimated === 'true') {
            setLineFinalState(element)
          }
        })
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(resizeFrame)
      window.removeEventListener('resize', handleResize)
      revealElements.forEach(cancelElementAnimations)
      observer.disconnect()
    }
  }, [pathname])

  return null
}
