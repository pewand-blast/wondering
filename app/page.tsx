import Link from 'next/link'
import {HeadlineCycler} from '@/components/HeadlineCycler'
import {HeroNativeVideo} from '@/components/HeroNativeVideo'
import {HeroVideoFrame} from '@/components/HeroVideoFrame'
import {PageShell} from '@/components/PageShell'
import {PartnerLogoBelt, type PartnerLogoBeltItem} from '@/components/PartnerLogoBelt'
import {StatCycler} from '@/components/StatCycler'
import {fetchSanity} from '@/lib/sanity'
import {urlFor} from '@/lib/sanity'
import {toPlainText} from '@/lib/text'
import {getEmbedUrl, getVideoPosterUrl} from '@/lib/video'
import {homeQuery} from '@/lib/queries'
import {filterLabels, placeholderFilms} from '@/lib/fallbacks'

const figmaHero = '/home-hero.jpg'
const figmaFeaturedFilm = '/home-featured-film.jpg'
const figmaFilmLeft = '/home-film-left.jpg'
const figmaFilmRight = '/home-film-right.jpg'

type HomePage = {
  heroVideoSource?: 'youtube' | 'vimeo' | 'mp4'
  heroVideoUrl?: string
  heroVideoFile?: unknown
  heroVideoFileUrl?: string
  heroHeadlineLines?: string[]
  heroVideoAutoplay?: boolean
  heroCta?: {label?: string; href?: string}
  aboutHeading?: string
  aboutBody?: string
  aboutCta?: {label?: string; href?: string}
  filmsHeading?: string
  filmsIntro?: string
  filmsCta?: {label?: string; href?: string}
  featuredFilms?: {film?: any}[]
  autoFeaturedFilms?: any[]
  impactHeading?: string
  impactCopy?: string
  impactBlocks?: {number?: string; copy?: string}[]
  impactCta?: {label?: string; href?: string}
  contactHeading?: string
  contactLeftParagraph?: string
  contactRightParagraph?: string
  contactCta?: {label?: string; href?: string}
  partnersHeading?: string
  partnerLogos?: {logo?: unknown; _key?: string}[]
}

function ArrowButton({label, href, variant = 'on-white'}: {label: string; href: string; variant?: 'on-white' | 'on-colour' | 'hero'}) {
  return (
    <Link className={`figma-home-button figma-home-button--${variant}`} href={href}>
      <span className="figma-home-button__text-mask">
        <span className="figma-home-button__text">{label}</span>
      </span>
      <span aria-hidden="true" className="figma-home-button__icon">
        <span className="figma-home-button__icon-bg" />
        <span className="figma-home-button__icon-mask">
          <span className="figma-home-button__icon-track">
            <span className="figma-home-button__arrow" />
            <span className="figma-home-button__arrow" />
            <span className="figma-home-button__arrow" />
          </span>
        </span>
      </span>
      <span aria-hidden="true" className="figma-home-button__hover-bg" />
    </Link>
  )
}

const fallbackPartnerLogos: PartnerLogoBeltItem[] = Array.from({length: 8}, (_, index) => ({
  src: '/partner-logo-example.svg',
  key: `fallback-${index}`,
}))

function HomePartnerLogos({logos}: {logos?: HomePage['partnerLogos']}) {
  const items: PartnerLogoBeltItem[] = logos?.length
    ? logos.map((item, index) => ({
        src: item.logo ? urlFor(item.logo).height(80).fit('max').auto('format').url() : '/partner-logo-example.svg',
        key: item._key || `partner-${index}`,
      }))
    : fallbackPartnerLogos

  return <PartnerLogoBelt className="figma-home-contact__logos" items={items} />
}

function filmHref(film: any) {
  return film?.slug?.current ? `/cinema/${film.slug.current}` : '/cinema'
}

function filmImage(film: any, fallback: string) {
  return film?.thumbnail
    ? urlFor(film.thumbnail).width(1400).height(800).fit('crop').auto('format').url()
    : fallback
}

function filmCategories(film: any) {
  return film?.categories?.map((key: string) => filterLabels[key] || key).join(' / ')
}

function filmDescription(film: any) {
  return toPlainText(film?.description) || film?.filmType || toPlainText(film?.summary) || 'Exploring human stories through storytelling, campaigns and community.'
}

function FilmHoverCard({film, fallbackImage, className}: {film: any; fallbackImage: string; className: string}) {
  return (
    <Link className={`figma-home-film-card ${className}`} href={filmHref(film)}>
      <img alt="" src={filmImage(film, fallbackImage)} />
      <span aria-hidden="true" className="figma-home-film-card__overlay" />
      <span aria-hidden="true" className="figma-home-film-card__rule" />
      <span className="figma-home-film-card__top">
        <span>{film?.title || 'Untitled film'}</span>
        <span>{film?.client || 'Client'}</span>
      </span>
      <span aria-hidden="true" className="figma-home-film-card__mobile-arrow">
        <span className="inline-arrow-link__arrow inline-arrow-link__arrow--current">→</span>
        <span className="inline-arrow-link__arrow inline-arrow-link__arrow--incoming">→</span>
      </span>
      <span className="figma-home-film-card__summary">{filmDescription(film)}</span>
      <span className="figma-home-film-card__categories">{filmCategories(film) || 'Social Campaigns / Research'}</span>
    </Link>
  )
}

export default async function Home() {
  const data = (await fetchSanity<HomePage>(homeQuery)) || {}
  const selectedFilms = data.featuredFilms?.map((item) => item.film).filter(Boolean) || []
  const cmsFilms = selectedFilms.length ? selectedFilms : data.autoFeaturedFilms || []
  const films = cmsFilms.length ? cmsFilms : placeholderFilms
  const primaryFilm = films[0] || placeholderFilms[0]
  const secondaryFilm = films[1] || films[0] || placeholderFilms[1]
  const tertiaryFilm = films[2] || films[1] || films[0] || placeholderFilms[0]
  const heroLines = data.heroHeadlineLines?.length ? data.heroHeadlineLines : ['Real stories. Real change.']
  const heroVideoSource = data.heroVideoSource || (data.heroVideoFileUrl ? 'mp4' : 'youtube')
  const heroMp4Url = heroVideoSource === 'mp4' ? data.heroVideoFileUrl : null
  const heroEmbed = heroMp4Url ? null : getEmbedUrl(data.heroVideoUrl, data.heroVideoAutoplay ?? true, true)
  const heroPoster = heroMp4Url ? null : getVideoPosterUrl(data.heroVideoUrl) || figmaHero
  const heroImageSrc = heroEmbed ? heroPoster || figmaHero : figmaHero
  const impactStats = data.impactBlocks?.length
    ? data.impactBlocks
    : [{
        number: '93%',
        copy: 'Tempor aliqua incididunt magna, consequat culpa sunt esse non ullamco lorem Lorem deserunt caliqa.',
      }]

  return (
    <PageShell headerLogo="full" headerTone="light">
      <main className="figma-home">
        <section className={`figma-home-hero ${heroEmbed || heroMp4Url ? 'figma-home-hero--video' : 'figma-home-hero--image'}`}>
          {heroMp4Url ? null : <img alt="" className="figma-home-hero__image" src={heroImageSrc} />}
          {heroMp4Url ? <HeroNativeVideo autoplay={data.heroVideoAutoplay ?? true} poster={heroPoster} src={heroMp4Url} /> : null}
          {heroEmbed ? <HeroVideoFrame src={heroEmbed} /> : null}
          <div className="figma-home-hero__content">
            <HeadlineCycler lines={heroLines} />
            <ArrowButton href={data.heroCta?.href || '/cinema'} label={data.heroCta?.label || 'Enter Cinema'} variant="on-white" />
          </div>
        </section>

        <section className="figma-home-about">
          <h2>{data.aboutHeading || 'About us'}</h2>
          <p>
            {data.aboutBody ||
              'Wondering is a community interest company using film and storytelling as tools for change. Through research, collaboration, and lived experience, we turn real stories into impact, creating space for voices to be heard and understood.'}
          </p>
          <ArrowButton href={data.aboutCta?.href || '/about'} label={data.aboutCta?.label || 'Learn more'} variant="on-colour" />
        </section>

        <section className="figma-home-films">
          <div className="figma-home-films__intro">
            <h2>{data.filmsHeading || 'Our films'}</h2>
            <p>{data.filmsIntro || 'Exploring human stories through storytelling, campaigns and community.'}</p>
            <ArrowButton href={data.filmsCta?.href || '/cinema'} label={data.filmsCta?.label || 'Enter Cinema'} variant="on-white" />
          </div>

          <FilmHoverCard className="figma-home-featured-film" fallbackImage={figmaFeaturedFilm} film={primaryFilm} />

          <FilmHoverCard className="figma-home-film-image figma-home-film-image--left" fallbackImage={figmaFilmLeft} film={secondaryFilm} />
          <FilmHoverCard className="figma-home-film-image figma-home-film-image--right" fallbackImage={figmaFilmRight} film={tertiaryFilm} />
        </section>

        <section className="figma-home-impact">
          <h2 className="figma-home-impact__heading">{data.impactHeading || 'Why we do this'}</h2>
          <p className="figma-home-impact__copy">
            {data.impactCopy ||
              'Proident cillum quis nisi. Aliqua nisi sint anim adipisicing. Eu exercitation ad pariatur deserunt enim occaecat et ipsum nisi. In irure cupidatat velit Lorem cillum tempor excepteur reprehenderit do.'}
          </p>
          <StatCycler className="figma-home-impact__stat" stats={impactStats} />
          <ArrowButton href={data.impactCta?.href || '/mission-impact'} label={data.impactCta?.label || 'Explore our Mission & Impact'} variant="on-colour" />
        </section>

        <section className="figma-home-contact">
          <h2>{data.contactHeading || 'Shape stories with us'}</h2>
          <p className="figma-home-contact__left">
            {data.contactLeftParagraph ||
              'We make work that feels honest and human – stories that resonate, connect, and endure.'}
          </p>
          <div className="figma-home-contact__right">
            <p>
              {data.contactRightParagraph ||
                'We work with organisations, charities, and communities to create films and campaigns that make a difference. If you’re exploring an idea or want to collaborate, we’d love to hear from you.'}
            </p>
            <ArrowButton href={data.contactCta?.href || '/contact#form'} label={data.contactCta?.label || 'Start a conversation'} variant="on-white" />
          </div>
          <h3>{data.partnersHeading || 'Our partners'}</h3>
          <HomePartnerLogos logos={data.partnerLogos} />
        </section>
      </main>
    </PageShell>
  )
}
