'use client'

import {useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties} from 'react'

type StatItem = {
  number?: string
  copy?: string
  _key?: string
}

type ParsedNumber = {
  decimals: number
  prefix: string
  suffix: string
  value: number
}

const cycleDelay = 8000
const countDuration = 1800
const copyFadeDuration = 1200

function parseStatNumber(value?: string): ParsedNumber | null {
  if (!value) return null

  const match = value.match(/-?\d+(?:\.\d+)?/)
  if (!match) return null

  const rawNumber = match[0]
  const numericValue = Number(rawNumber)
  if (!Number.isFinite(numericValue)) return null

  return {
    decimals: rawNumber.includes('.') ? rawNumber.split('.')[1].length : 0,
    prefix: value.slice(0, match.index),
    suffix: value.slice((match.index || 0) + rawNumber.length),
    value: numericValue,
  }
}

function formatStatNumber(value: number, parsed: ParsedNumber) {
  return `${parsed.prefix}${value.toFixed(parsed.decimals)}${parsed.suffix}`
}

function easeOutExpo(value: number) {
  return value === 1 ? 1 : 1 - Math.pow(2, -10 * value)
}

export function StatCycler({className, stats}: {className?: string; stats: StatItem[]}) {
  const items = useMemo(
    () => stats.filter((item) => item?.number || item?.copy),
    [stats],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [copyIndex, setCopyIndex] = useState(0)
  const [copyVisible, setCopyVisible] = useState(true)
  const activeItem = items[activeIndex] || items[0]
  const copyItem = items[copyIndex] || activeItem
  const parsedTarget = parseStatNumber(activeItem?.number)
  const [displayNumber, setDisplayNumber] = useState(activeItem?.number || '')
  const previousNumericValue = useRef(parsedTarget?.value || 0)
  const swapCopyTimer = useRef(0)
  const copyText = copyItem?.copy || ''
  const copyWords = useMemo(() => copyText.split(/\s+/).filter(Boolean), [copyText])
  const measureRef = useRef<HTMLParagraphElement | null>(null)
  const [copyLines, setCopyLines] = useState<string[]>(copyText ? [copyText] : [])

  useEffect(() => {
    window.clearTimeout(swapCopyTimer.current)

    if (items.length < 2) {
      setCopyIndex(0)
      setCopyVisible(true)
      return
    }

    const nextTimer = window.setInterval(() => {
      setCopyVisible(false)

      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % items.length

        window.clearTimeout(swapCopyTimer.current)
        swapCopyTimer.current = window.setTimeout(() => {
          setCopyIndex(nextIndex)
          window.requestAnimationFrame(() => {
            setCopyVisible(true)
          })
        }, copyFadeDuration * 0.55)

        return nextIndex
      })
    }, cycleDelay)

    return () => {
      window.clearInterval(nextTimer)
      window.clearTimeout(swapCopyTimer.current)
    }
  }, [items.length])

  useEffect(() => {
    const parsed = parseStatNumber(activeItem?.number)

    if (!parsed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayNumber(activeItem?.number || '')
      previousNumericValue.current = parsed?.value || 0
      return
    }

    const from = previousNumericValue.current
    const to = parsed.value
    const start = window.performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / countDuration, 1)
      const eased = easeOutExpo(progress)
      setDisplayNumber(formatStatNumber(from + (to - from) * eased, parsed))

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
        return
      }

      previousNumericValue.current = to
    }

    frame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frame)
  }, [activeItem?.number])

  useLayoutEffect(() => {
    const measureElement = measureRef.current
    if (!measureElement) {
      setCopyLines(copyText ? [copyText] : [])
      return
    }

    const measureLines = () => {
      const words = Array.from(measureElement.querySelectorAll<HTMLElement>('[data-word]'))
      if (!words.length) {
        setCopyLines(copyText ? [copyText] : [])
        return
      }

      const lines = words.reduce<Array<{top: number; text: string[]}>>((lineGroups, word) => {
        const top = Math.round(word.offsetTop)
        const currentLine = lineGroups[lineGroups.length - 1]
        const text = word.textContent?.trim()

        if (!text) return lineGroups

        if (!currentLine || Math.abs(currentLine.top - top) > 2) {
          lineGroups.push({top, text: [text]})
          return lineGroups
        }

        currentLine.text.push(text)
        return lineGroups
      }, [])

      setCopyLines(lines.map((line) => line.text.join(' ')))
    }

    const frame = window.requestAnimationFrame(measureLines)
    const observer = new ResizeObserver(measureLines)
    observer.observe(measureElement)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [copyText])

  if (!activeItem) return null

  return (
    <div className={`stat-cycler${items.length > 1 ? ' stat-cycler--cycling' : ''}${className ? ` ${className}` : ''}`}>
      <div className="stat-cycler__copy-mask">
        <p aria-hidden="true" className="stat-cycler__measure" ref={measureRef}>
          {copyWords.map((word, index) => (
            <span data-word key={`${word}-${index}`}>
              {word}
              {index < copyWords.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        <p className={`stat-cycler__copy ${copyVisible ? 'is-visible' : 'is-hidden'}`} key={copyItem?._key || `${copyIndex}-${copyItem?.copy}`}>
          {copyLines.map((line, index) => (
            <span className="stat-cycler__line-mask" key={`${line}-${index}`}>
              <span className="stat-cycler__line" style={{'--line-index': index} as CSSProperties}>
                {line}
              </span>
            </span>
          ))}
        </p>
      </div>
      <strong className="stat-cycler__number" key={activeItem._key || `${activeIndex}-${activeItem.number}`}>
        <span className="stat-cycler__number-mask">
          <span className="stat-cycler__number-inner">{parsedTarget ? displayNumber : activeItem.number}</span>
        </span>
      </strong>
    </div>
  )
}
