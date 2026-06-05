import Link from 'next/link'
import {FilmEmbedFrame} from '@/components/FilmEmbedFrame'
import {PageShell} from '@/components/PageShell'
import {RichText} from '@/components/RichText'
import {SanityImage} from '@/components/SanityImage'
import {placeholderFilms} from '@/lib/fallbacks'
import {filmBySlugQuery} from '@/lib/queries'
import {fetchSanity} from '@/lib/sanity'
import {toPlainText} from '@/lib/text'
import {getEmbedUrl} from '@/lib/video'

export default async function FilmPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const film = (await fetchSanity<any>(filmBySlugQuery, {slug})) || placeholderFilms.find((item) => item.slug.current === slug)
  const embed = getEmbedUrl(film?.videoUrl)
  const mp4Url = film?.videoSource === 'mp4' || (!film?.videoUrl && film?.videoFileUrl) ? film?.videoFileUrl : null
  const summary = film?.summary
  const summaryFallback = film?.filmType || film?.description
  const hasSummary = Boolean(toPlainText(summary) || summaryFallback)
  const title = film?.title || 'Untitled film'
  const credits = film?.credits || []
  const firstCreditColumn = credits.slice(0, 2)
  const secondCreditColumn = credits.slice(2)

  return (
    <PageShell headerAccent="red" headerLogo="compact">
      <main className="film-detail-page">
        <section className="film-detail-media">
          {mp4Url ? (
            <video controls playsInline src={mp4Url} />
          ) : embed ? (
            <FilmEmbedFrame src={embed} title={title} />
          ) : (
            <SanityImage image={film?.thumbnail} priority />
          )}
        </section>

        <section className="film-detail-project">
          <div className="film-detail-project__intro">
            <h1>{title}</h1>
            {film?.client ? <p className="film-detail-project__client">{film.client}</p> : null}
            {hasSummary ? <RichText className="film-detail-project__copy" fallback={summaryFallback} value={summary} /> : null}

            <Link className="button-link small-copy film-detail-back" href="/cinema">
              <span className="button-link__text-mask">
                <span className="button-link__text">Back to Cinema</span>
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
            </Link>
          </div>

          <div className="film-detail-project__side">
            {credits.length ? (
              <div className="film-detail-credits">
                {[firstCreditColumn, secondCreditColumn].map((column, columnIndex) => (
                  <div className="film-detail-credits__column" key={columnIndex}>
                    {column.map((credit: any) => (
                      <div className="film-detail-credit" key={credit._key || credit.label}>
                        <p>{credit.label}</p>
                        <div className="film-detail-credit__names">
                          {credit.names?.map((name: string) => (
                            <span key={name}>{name}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}

            {film?.logos?.length ? (
              <div className="film-detail-logo-section">
                <div className="film-detail-logos" aria-label="Film logos">
                  {film.logos.map((logo: any) => (
                    <div className="film-detail-logo" key={logo._key}>
                      <SanityImage image={logo.logo || logo} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
