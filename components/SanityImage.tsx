import Image from 'next/image'
import {urlFor} from '@/lib/sanity'

type SanityImageProps = {
  image?: unknown
  className?: string
  priority?: boolean
  sizes?: string
}

export function SanityImage({image, className, priority = false, sizes = '(max-width: 760px) 100vw, 50vw'}: SanityImageProps) {
  if (!image) {
    return <div className={`placeholder ${className || ''}`}>Image</div>
  }

  const src = urlFor(image).width(1400).height(900).fit('crop').auto('format').url()

  return (
    <Image
      alt=""
      className={className}
      height={900}
      priority={priority}
      sizes={sizes}
      src={src}
      width={1400}
    />
  )
}
