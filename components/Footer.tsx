import Link from 'next/link'
import type {CSSProperties} from 'react'
import {fallbackSettings} from '@/lib/fallbacks'
import {getSocialLinks} from '@/lib/socialLinks'
import {RichText} from './RichText'

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

export function Footer({settings, accent = 'default'}: {settings?: Partial<Settings> | null; accent?: 'default' | 'red' | 'green' | 'brown'}) {
  const data = {...fallbackSettings, ...settings}
  const iconPaths = accent === 'red' ? redSocialIconPaths : accent === 'green' ? greenSocialIconPaths : accent === 'brown' ? brownSocialIconPaths : socialIconPaths
  const socialLinks = getSocialLinks(data.socialLinks)
  const hasFooterContact = Array.isArray(data.footerContact) && data.footerContact.length > 0
  const footerAddress = data.footerAddress || [
    data.address,
    data.registrationNumber ? `CIC Registration Number ${data.registrationNumber}` : null,
    data.copyrightYear ? `© Wondering CIC ${data.copyrightYear}` : null,
  ].filter(Boolean).join('\n')

  return (
    <footer className={`site-footer ${accent === 'red' ? 'site-footer--red' : ''} ${accent === 'green' ? 'site-footer--green' : ''} ${accent === 'brown' ? 'site-footer--brown' : ''}`}>
      <div className="footer-grid">
        <div className="footer-socials" aria-label="Social links">
          {socialLinks.map((link) => (
            (() => {
              const socialKey = link.label.toLowerCase().replace(/[^a-z]/g, '')
              return (
                <a key={link.label} className={`footer-social footer-social--${socialKey}`} href={link.href} aria-label={link.label} rel="noreferrer" target="_blank">
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
        <div className="rule">
          <p className="small-copy">{data.ctaEyebrow}</p>
          {data.cta?.href && (
            <Link className="small-copy inline-arrow-link" href={data.cta.href}>
              <span>{data.cta.label}</span>
              <span aria-hidden="true" className="inline-arrow-link__mask">
                <span className="inline-arrow-link__arrow inline-arrow-link__arrow--current">→</span>
                <span className="inline-arrow-link__arrow inline-arrow-link__arrow--incoming">→</span>
              </span>
            </Link>
          )}
        </div>
        <div className="rule">
          {hasFooterContact ? (
            <RichText className="footer-contact small-copy" value={data.footerContact} />
          ) : (
            <p className="footer-contact small-copy">
              <a href={`mailto:${data.email}`}>{data.email}</a>
              {'\n'}
              <a href={`tel:${data.phone.replace(/[^\d+]/g, '')}`}>{data.phone}</a>
            </p>
          )}
        </div>
        <div className="rule">
          <p className="footer-address small-copy">{footerAddress}</p>
        </div>
      </div>
      <div className="footer-logo">
        <span aria-hidden="true" className="logo-mark" />
      </div>
    </footer>
  )
}
