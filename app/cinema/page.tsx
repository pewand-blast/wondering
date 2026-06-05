import Link from 'next/link'
import type {CSSProperties} from 'react'
import {PageShell} from '@/components/PageShell'
import {filterLabels, placeholderFilms} from '@/lib/fallbacks'
import {cinemaQuery, filmsQuery} from '@/lib/queries'
import {fetchSanity, urlFor} from '@/lib/sanity'
import {toPlainText} from '@/lib/text'

function filmHref(film: any) {
  return film?.slug?.current ? `/cinema/${film.slug.current}` : '/cinema'
}

function filmImage(film: any) {
  return film?.thumbnail
    ? urlFor(film.thumbnail).width(1400).height(900).fit('crop').auto('format').url()
    : '/home-featured-film.jpg'
}

function filmCategories(film: any) {
  return film?.categories?.map((key: string) => filterLabels[key] || key).join(' / ')
}

function filmDescription(film: any) {
  return toPlainText(film?.description) || film?.filmType || toPlainText(film?.summary) || 'Exploring human stories through storytelling, campaigns and community.'
}

const cinemaTilePattern = [
  {column: '3', row: 1},
  {column: '4', row: 1},
  {column: '3 / span 2', row: '2 / span 2'},
  {column: '2', row: 3},
  {column: '1 / span 2', row: '4 / span 2'},
  {column: '3', row: 5},
  {column: '3 / span 2', row: '6 / span 2'},
  {column: '1', row: 7},
  {column: '2', row: 7},
  {column: '1 / span 2', row: '8 / span 2'},
  {column: '3', row: 8},
]

function offsetGridRow(row: string | number, offset: number) {
  if (typeof row === 'number') {
    return String(row + offset)
  }

  const [start, span] = row.split('/').map((part) => part.trim())
  return `${Number(start) + offset} / ${span}`
}

function cinemaTileStyle(index: number) {
  const cycle = Math.floor(index / cinemaTilePattern.length)
  const pattern = cinemaTilePattern[index % cinemaTilePattern.length]
  const rowOffset = cycle * 9

  return {
    '--cinema-column': pattern.column,
    '--cinema-row': offsetGridRow(pattern.row, rowOffset),
  } as CSSProperties
}

function CinemaFilmTile({film, index}: {film: any; index: number}) {
  return (
    <Link className="figma-home-film-card cinema-film-tile" href={filmHref(film)} style={cinemaTileStyle(index)}>
      <img alt="" src={filmImage(film)} />
      <span aria-hidden="true" className="figma-home-film-card__overlay" />
      <span aria-hidden="true" className="figma-home-film-card__rule" />
      <span className="figma-home-film-card__top">
        <span>{film?.title || 'Untitled film'}</span>
        <span>{film?.client || 'Client'}</span>
      </span>
      <span className="figma-home-film-card__summary">{filmDescription(film)}</span>
      <span className="figma-home-film-card__categories">{filmCategories(film) || 'Category'}</span>
    </Link>
  )
}

export default async function CinemaPage({searchParams}: {searchParams: Promise<{filter?: string}>}) {
  const {filter} = await searchParams
  const activeFilter = filter && filterLabels[filter] ? filter : 'all'
  const [page, filmsData] = await Promise.all([
    fetchSanity<{intro?: string; featuredFilms?: {film?: any}[]}>(cinemaQuery),
    fetchSanity<any[]>(filmsQuery),
  ])
  const orderedFilms = page?.featuredFilms?.map((item) => item.film).filter(Boolean)
  const allFilms = orderedFilms?.length ? orderedFilms : filmsData?.length ? filmsData : placeholderFilms
  const films = activeFilter === 'all' ? allFilms : allFilms.filter((film) => film.categories?.includes(activeFilter))

  return (
    <PageShell headerAccent="red">
      <main className="cinema-page">
        <nav className="cinema-filter-row" aria-label="Cinema filters">
          <Link className={activeFilter === 'all' ? 'is-active' : ''} href="/cinema">View all</Link>
          {Object.entries(filterLabels).map(([key, label]) => (
            <span className="cinema-filter-row__item" key={key}>
              <span aria-hidden="true">/</span>
              <Link className={activeFilter === key ? 'is-active' : ''} href={`/cinema?filter=${key}`}>{label}</Link>
            </span>
          ))}
        </nav>
        <div className="cinema-layout-grid">
          <h1>{page?.intro || 'Exploring human stories through therapeutic storytelling and social campaigns.'}</h1>
          {films.map((film, index) => <CinemaFilmTile film={film} index={index} key={`${film._id || film.title || 'film'}-${index}`} />)}
        </div>
      </main>
    </PageShell>
  )
}
