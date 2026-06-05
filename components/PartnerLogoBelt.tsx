'use client'

import {useEffect, useRef, useState} from 'react'

export type PartnerLogoBeltItem = {
  src: string
  key: string
}

type PartnerLogoBeltProps = {
  items: PartnerLogoBeltItem[]
  className?: string
}

export function PartnerLogoBelt({items, className}: PartnerLogoBeltProps) {
  const beltRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const belt = beltRef.current
    if (!belt) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {rootMargin: '240px 0px'},
    )

    observer.observe(belt)
    return () => observer.disconnect()
  }, [])

  const beltItems = items.length < 6 ? Array.from({length: Math.ceil(6 / items.length)}, () => items).flat() : items

  return (
    <div className={className} aria-label="Partner logos" ref={beltRef}>
      <div className={`partner-logo-belt${isVisible ? ' is-visible' : ''}`}>
        {[0, 1].map((groupIndex) => (
          <div aria-hidden={groupIndex === 1 ? 'true' : undefined} className="partner-logo-belt__group" key={groupIndex}>
            {beltItems.map((logo, index) => {
              const image = <img alt="" decoding="async" loading="lazy" src={logo.src} />
              return (
                <span className="partner-logo-belt__item" key={`${groupIndex}-${logo.key}-${index}`}>
                  {image}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
