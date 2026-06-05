import Link from 'next/link'
import {filterLabels} from '@/lib/fallbacks'
import {toPlainText} from '@/lib/text'
import {SanityImage} from './SanityImage'

type Film = {
  title?: string
  client?: string
  description?: unknown
  filmType?: string
  summary?: unknown
  categories?: string[]
  slug?: {current?: string}
  thumbnail?: unknown
}

export function FilmCard({film}: {film: Film}) {
  const href = film.slug?.current ? `/cinema/${film.slug.current}` : '/cinema'
  const categories = film.categories?.map((key) => filterLabels[key] || key).join(' / ')
  const description = toPlainText(film.description) || film.filmType || toPlainText(film.summary) || 'Description'

  return (
    <Link className="film-card" href={href}>
      <div className="media-box film-card__image">
        <SanityImage image={film.thumbnail} />
      </div>
      <div className="film-card__meta">
        <div>
          <p className="small-copy">{film.title || 'Untitled film'}</p>
          <p className="small-copy">{categories || 'Category'}</p>
          <p className="small-copy film-card__description">{description}</p>
        </div>
        <p className="small-copy">{film.client || 'Client'}</p>
      </div>
    </Link>
  )
}
