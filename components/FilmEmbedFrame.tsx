'use client'

import {useEffect, useRef, useState} from 'react'

type FilmEmbedFrameProps = {
  src: string
  title: string
}

const INTERACTION_WINDOW = 3500

export function FilmEmbedFrame({src, title}: FilmEmbedFrameProps) {
  const [isInteractive, setIsInteractive] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const clearInteractionTimer = () => {
    if (!timeoutRef.current) return
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const enableInteraction = () => {
    clearInteractionTimer()
    setIsInteractive(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsInteractive(false)
      timeoutRef.current = null
    }, INTERACTION_WINDOW)
  }

  useEffect(() => {
    return clearInteractionTimer
  }, [])

  return (
    <div className={`film-embed-frame${isInteractive ? ' is-interactive' : ''}`} onPointerLeave={() => setIsInteractive(false)}>
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="film-embed-frame__iframe"
        src={src}
        title={title}
      />
      {!isInteractive ? (
        <button aria-label={`Enable video player for ${title}`} className="film-embed-frame__activator" onClick={enableInteraction} type="button" />
      ) : null}
    </div>
  )
}
