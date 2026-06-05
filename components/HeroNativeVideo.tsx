'use client'

import {useEffect, useRef} from 'react'

type HeroNativeVideoProps = {
  src: string
  poster?: string | null
  autoplay?: boolean
}

export function HeroNativeVideo({src, poster, autoplay = true}: HeroNativeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoplay) return

    video.muted = true
    video.playsInline = true
    video.play().catch(() => {
      // Autoplay can still be denied in unusual browser states; the video remains decorative.
    })
  }, [autoplay, src])

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      autoPlay={autoplay}
      className="figma-home-hero__video figma-home-hero__video--native is-ready"
      controls={false}
      controlsList="nodownload nofullscreen noplaybackrate"
      disablePictureInPicture
      loop
      muted
      playsInline
      poster={poster || undefined}
      preload="metadata"
      src={src}
      tabIndex={-1}
    />
  )
}
