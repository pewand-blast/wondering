'use client'

import {useEffect, useRef, useState} from 'react'

type HeroVideoFrameProps = {
  src: string
}

const REVEAL_DELAY = 5200

export function HeroVideoFrame({src}: HeroVideoFrameProps) {
  const [isReady, setIsReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const revealTimer = useRef<number | null>(null)

  useEffect(() => {
    const clearRevealTimer = () => {
      if (revealTimer.current) {
        window.clearTimeout(revealTimer.current)
        revealTimer.current = null
      }
    }

    const hideVideo = () => {
      clearRevealTimer()
      setIsReady(false)
      if (iframeRef.current) iframeRef.current.style.opacity = '0'
    }

    const revealVideo = () => {
      clearRevealTimer()
      revealTimer.current = window.setTimeout(() => {
        if (iframeRef.current) iframeRef.current.style.opacity = ''
        setIsReady(true)
      }, REVEAL_DELAY)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideVideo()
        return
      }

      revealVideo()
    }

    const handlePageShow = () => {
      hideVideo()
      revealVideo()
    }

    const handleWindowBlur = () => {
      hideVideo()
    }

    const handleWindowFocus = () => {
      revealVideo()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('pagehide', hideVideo)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      clearRevealTimer()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('pagehide', hideVideo)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [])

  const handleLoad = () => {
    if (revealTimer.current) {
      window.clearTimeout(revealTimer.current)
    }

    revealTimer.current = window.setTimeout(() => {
      if (iframeRef.current) iframeRef.current.style.opacity = ''
      setIsReady(true)
    }, REVEAL_DELAY)
  }

  return (
    <iframe
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      aria-hidden="true"
      className={`figma-home-hero__video${isReady ? ' is-ready' : ''}`}
      onLoad={handleLoad}
      ref={iframeRef}
      referrerPolicy="strict-origin-when-cross-origin"
      src={src}
      tabIndex={-1}
      title="Wondering hero video"
    />
  )
}
