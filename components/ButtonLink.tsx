import Link from 'next/link'

export function ButtonLink({cta}: {cta?: {label?: string; href?: string} | null}) {
  if (!cta?.label || !cta?.href) return null

  return (
    <Link className="button-link small-copy" href={cta.href}>
      <span className="button-link__text-mask">
        <span className="button-link__text">{cta.label}</span>
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
  )
}
