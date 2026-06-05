'use client'

import {useEffect, useState} from 'react'

type HeadlineCyclerProps = {
  lines: string[]
}

export function HeadlineCycler({lines}: HeadlineCyclerProps) {
  const cleanedLines = lines
    .map((line) => line.replace(/[\s\u2028\u2029\uFFFC]+/g, ' ').trim())
    .filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)

  useEffect(() => {
    if (cleanedLines.length < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        setPreviousIndex(currentIndex)
        return (currentIndex + 1) % cleanedLines.length
      })
    }, 6000)

    return () => window.clearInterval(timer)
  }, [cleanedLines.length])

  if (!cleanedLines.length) {
    return <h1>Real stories. Real change.</h1>
  }

  if (cleanedLines.length === 1) {
    return <h1>{cleanedLines[0]}</h1>
  }

  return (
    <h1 className="headline-cycler">
      {cleanedLines.map((line, index) => (
        <span className={index === activeIndex ? 'is-active' : index === previousIndex ? 'was-active' : ''} key={`${line}-${index}`}>
          {line}
        </span>
      ))}
    </h1>
  )
}
