'use client'

import type {CSSProperties} from 'react'
import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {fallbackSettings} from '@/lib/fallbacks'
import {getSocialLinks} from '@/lib/socialLinks'

type Settings = typeof fallbackSettings

const socialIconPaths: Record<string, string> = {
  instagram: '/instagram-glyph.svg',
  linkedin: '/linkedin-icon-mask.svg',
  youtube: '/youtube-icon-mask.svg',
}

const redSocialIconPaths: Record<string, string> = {
  instagram: '/instagram-glyph-red.svg',
  linkedin: '/linkedin-icon-mask.svg',
  youtube: '/youtube-icon-mask.svg',
}

const greenSocialIconPaths: Record<string, string> = {
  instagram: '/instagram-glyph-green.svg',
  linkedin: '/linkedin-icon-mask.svg',
  youtube: '/youtube-icon-mask.svg',
}

const brownSocialIconPaths: Record<string, string> = {
  instagram: '/instagram-glyph-yellow.svg',
  linkedin: '/linkedin-icon-mask.svg',
  youtube: '/youtube-icon-mask.svg',
}

export function Header({
  tone = 'dark',
  logo = 'full',
  accent = 'default',
  settings,
}: {
  tone?: 'dark' | 'light'
  logo?: 'compact' | 'full'
  accent?: 'default' | 'red' | 'green' | 'brown'
  settings?: Partial<Settings> | null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isOverHero, setIsOverHero] = useState(tone === 'light')
  const closeTimerRef = useRef<number | null>(null)
  const pathname = usePathname()
  const data = {...fallbackSettings, ...settings}
  const iconPaths = accent === 'red' ? redSocialIconPaths : accent === 'green' ? greenSocialIconPaths : accent === 'brown' ? brownSocialIconPaths : socialIconPaths
  const socialLinks = getSocialLinks(data.socialLinks)
  const isCompactLogo = logo !== 'full' || hasScrolled
  const isMenuButtonActive = isOpen

  function openMenu() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsMenuVisible(true)
    setIsMenuClosing(false)
    setIsOpen(true)
  }

  function closeMenu() {
    setIsOpen(false)
    setIsMenuClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      setIsMenuVisible(false)
      setIsMenuClosing(false)
      closeTimerRef.current = null
    }, 720)
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  useEffect(() => {
    const updateScrollState = (scrollY = window.scrollY) => {
      const nextHasScrolled = scrollY > 20
      setHasScrolled((current) => current === nextHasScrolled ? current : nextHasScrolled)

      if (tone === 'light') {
        const hero = document.querySelector<HTMLElement>('.figma-home-hero')
        const heroEnd = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight
        const nextIsOverHero = scrollY < heroEnd - 80
        setIsOverHero((current) => current === nextIsOverHero ? current : nextIsOverHero)
      } else {
        setIsOverHero(false)
      }
    }
    const handleScroll = () => updateScrollState()
    const handleResize = () => updateScrollState()
    const handleSmoothScrollTarget = (event: Event) => {
      const smoothEvent = event as CustomEvent<{scrollY: number}>
      updateScrollState(smoothEvent.detail.scrollY)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, {passive: true})
    window.addEventListener('resize', handleResize)
    window.addEventListener('smooth-scroll-target', handleSmoothScrollTarget)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('smooth-scroll-target', handleSmoothScrollTarget)
    }
  }, [tone])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <header
        className={`topbar ${logo === 'full' ? 'topbar--full-logo' : ''} ${accent === 'red' ? 'topbar--red' : ''} ${accent === 'green' ? 'topbar--green' : ''} ${accent === 'brown' ? 'topbar--brown' : ''} ${isCompactLogo ? 'topbar--compact-logo' : ''} ${hasScrolled ? 'topbar--scrolled' : ''} ${isMenuButtonActive ? 'topbar--menu-open' : ''}`}
        style={{color: tone === 'light' && isOverHero ? '#fff' : accent === 'red' ? 'var(--dark-pink)' : accent === 'green' ? 'var(--green)' : accent === 'brown' ? 'var(--brown)' : 'var(--ink)'}}
      >
        <Link className="logo" href="/" aria-label="Wondering home">
          <span aria-hidden="true" className="logo-mark logo-mark--full" />
          <span aria-hidden="true" className="logo-mark logo-mark--icon" />
        </Link>
        <button className="menu-button" type="button" aria-label={isMenuButtonActive ? 'Close menu' : 'Open menu'} aria-expanded={isMenuButtonActive} onClick={toggleMenu}>
          <span aria-hidden="true" className="menu-button__hover" />
          <span aria-hidden="true" className="menu-button__line" />
        </button>
      </header>

      {isMenuVisible && (
        <div className={`menu-popover ${isMenuClosing ? 'is-closing' : ''}`} role="dialog" aria-modal="false" aria-label="Main menu">
          <div className="menu-panel">
            <nav className="menu-nav" aria-label="Main menu">
              {data.navigation.map((item) => {
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`)

                return (
                  <Link className={isActive ? 'is-active' : undefined} aria-current={isActive ? 'page' : undefined} key={item.href} href={item.href} onClick={closeMenu}>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="menu-cta">
              <p>{data.ctaEyebrow}</p>
              {data.cta?.href && (
                <Link className="inline-arrow-link" href={data.cta.href} onClick={closeMenu}>
                  <span>{data.cta.label}</span>
                  <span aria-hidden="true" className="inline-arrow-link__mask">
                    <span className="inline-arrow-link__arrow inline-arrow-link__arrow--current">→</span>
                    <span className="inline-arrow-link__arrow inline-arrow-link__arrow--incoming">→</span>
                  </span>
                </Link>
              )}
            </div>
            <div className="menu-socials" aria-label="Social links">
              {socialLinks.map((link) => (
                (() => {
                  const socialKey = link.label.toLowerCase().replace(/[^a-z]/g, '')
                  return (
                    <a key={link.label} className={`menu-social menu-social--${socialKey}`} href={link.href} aria-label={link.label} rel="noreferrer" target="_blank">
                      {socialKey === 'instagram' ? (
                        <img alt="" className="social-icon-image" src={iconPaths[socialKey]} />
                      ) : (
                        <span aria-hidden="true" className="social-icon-mask" style={{'--social-icon': `url(${iconPaths[socialKey]})`} as CSSProperties} />
                      )}
                      <span>{link.label}</span>
                    </a>
                  )
                })()
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
