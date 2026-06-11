import Link from 'next/link'
import {ButtonLink} from '@/components/ButtonLink'
import {PageShell} from '@/components/PageShell'
import {PartnerLogoBelt, type PartnerLogoBeltItem} from '@/components/PartnerLogoBelt'
import {RichText} from '@/components/RichText'
import {SanityImage} from '@/components/SanityImage'
import {contactQuery} from '@/lib/queries'
import {fetchSanity, urlFor} from '@/lib/sanity'

type ContactPageData = {
  introHeading?: string
  introBody?: unknown
  introCta?: {label?: string; href?: string}
  contactHeading?: string
  contactParagraph?: string
  contactParagraphRich?: unknown
  applyCta?: {label?: string; href?: string}
  partnersHeading?: string
  partners?: {logo?: unknown; _key?: string}[]
  testimonialsHeading?: string
  testimonials?: {
    _key?: string
    image?: unknown
    name?: string
    role?: string
    quote?: string
  }[]
}

const fallbackPartnerLogos: PartnerLogoBeltItem[] = Array.from({length: 8}, (_, index) => ({
  src: '/partner-logo-example.svg',
  key: `fallback-${index}`,
}))

const fallbackTestimonials = [
  {
    _key: 'testimonial-1',
    image: null,
    name: 'Name Surname',
    role: 'Job position, Company',
    quote:
      '"Aliqua non ad adipisicing fugiat id voluptate amet eu ad occaecat sit culpa. Culpa aute tempor occaecat sint id aliqua officia magna cupidatat est et in. Magna do exercitation esse voluptate anim fugiat. Aliqua ut mollit in occaecat."',
    fallbackImage: '/home-film-left.jpg',
  },
  {
    _key: 'testimonial-2',
    image: null,
    name: 'Name Surname',
    role: 'Job position, Company',
    quote:
      '"Aliqua non ad adipisicing fugiat id voluptate amet eu ad occaecat sit culpa. Culpa aute tempor occaecat sint id aliqua officia magna cupidatat est et in. Magna do exercitation esse voluptate anim fugiat. Aliqua ut mollit in occaecat."',
    fallbackImage: '/home-film-right.jpg',
  },
]

function TextLines({text}: {text: string}) {
  return (
    <>
      {text.split('\n').map((line, index) => (
        line ? <p key={`${line}-${index}`}>{renderLinkedText(line)}</p> : <span aria-hidden="true" className="contact-text-spacer" key={`spacer-${index}`} />
      ))}
    </>
  )
}

function linkHrefForText(text: string) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return `mailto:${text}`
  const phoneCharacters = text.replace(/[^\d+]/g, '')
  if (/^\+?\d{7,}$/.test(phoneCharacters)) return `tel:${phoneCharacters}`
  return null
}

function renderLinkedText(text: string) {
  const parts = text.split(/([^\s@]+@[^\s@]+\.[^\s@]+|\+?\d[\d\s().-]{6,}\d)/g)

  return parts.map((part, index) => {
    const href = linkHrefForText(part.trim())

    if (!href) return <span key={`${part}-${index}`}>{part}</span>

    return (
      <Link href={href} key={`${part}-${index}`}>
        {part}
      </Link>
    )
  })
}

function ContactPartnerLogos({logos}: {logos?: ContactPageData['partners']}) {
  const items: PartnerLogoBeltItem[] = logos?.length
    ? logos.map((item, index) => ({
        src: item.logo ? urlFor(item.logo).height(80).fit('max').auto('format').url() : '/partner-logo-example.svg',
        key: item._key || `partner-${index}`,
      }))
    : fallbackPartnerLogos

  return <PartnerLogoBelt className="contact-partner-belt" items={items} />
}

function TestimonialImage({testimonial}: {testimonial: any}) {
  if (testimonial.image) {
    return <SanityImage image={testimonial.image} />
  }

  return <img alt="" src={testimonial.fallbackImage || '/home-film-left.jpg'} />
}

export default async function ContactPage() {
  const page = await fetchSanity<ContactPageData>(contactQuery)
  const testimonials = page?.testimonials?.length
    ? page.testimonials.map((testimonial, index) => ({
        ...testimonial,
        fallbackImage: fallbackTestimonials[index % fallbackTestimonials.length].fallbackImage,
      }))
    : fallbackTestimonials
  const introBodyFallback =
    'We work with organisations, charities, and communities to create films and campaigns that make a difference.\nIf you are exploring an idea or looking to collaborate, we would love to hear from you.'
  const contactParagraph =
    page?.contactParagraph ||
    'contact@wondering.com\n+44 123 456 678\n\n14 Peacock Yard, London SE17 3LH\nCIC Registration Number 13384660\n© Wondering CIC 2025'

  return (
    <PageShell>
      <main className="contact-page">
        <section className="contact-intro">
          <div className="contact-intro__column">
            <h1>{page?.introHeading || 'Partner with us'}</h1>
            <RichText className="contact-intro__body" fallback={introBodyFallback} value={page?.introBody} />
            <ButtonLink cta={page?.introCta || {label: 'Start a conversation', href: '/contact#form'}} />
          </div>

          <div className="contact-intro__column">
            <h2>{page?.contactHeading || 'Contact'}</h2>
            <div className="contact-intro__body contact-intro__body--contact">
              {Array.isArray(page?.contactParagraphRich) && page.contactParagraphRich.length ? (
                <RichText value={page.contactParagraphRich} />
              ) : (
                <TextLines text={contactParagraph} />
              )}
            </div>
            <ButtonLink cta={page?.applyCta || {label: 'Apply here', href: '/apply'}} />
          </div>
        </section>

        <section className="contact-partners">
          <h2>{page?.partnersHeading || 'Our partners'}</h2>
          <ContactPartnerLogos logos={page?.partners} />
        </section>

        <section className="contact-testimonials">
          <h2>{page?.testimonialsHeading || 'Testimonials'}</h2>
          <div className="contact-testimonials__grid">
            {testimonials.map((testimonial) => (
              <article className="contact-testimonial-card" key={testimonial._key || testimonial.name}>
                <div className="contact-testimonial-card__image">
                  <TestimonialImage testimonial={testimonial} />
                </div>
                <div className="contact-testimonial-card__copy">
                  <div>
                    <h3>{testimonial.name}</h3>
                    {testimonial.role && <p>{testimonial.role}</p>}
                  </div>
                  <blockquote>{testimonial.quote}</blockquote>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
