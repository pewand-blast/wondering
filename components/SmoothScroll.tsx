'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'

const ease = 0.085
const wheelMultiplier = 0.9
const settleDistance = 0.35
const minimumWheelDelta = 0.5
const maxWheelStep = 140

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function emitScrollTarget(scrollY: number) {
  window.dispatchEvent(new CustomEvent('smooth-scroll-target', {detail: {scrollY}}))
}

function normalizeWheelDelta(deltaY: number) {
  return clamp(deltaY, -maxWheelStep, maxWheelStep)
}

function canScrollInside(element: Element | null, deltaY: number) {
  let current = element

  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current)
    const canScrollY = /(auto|scroll)/.test(style.overflowY)

    if (canScrollY && current.scrollHeight > current.clientHeight) {
      const atTop = current.scrollTop <= 0
      const atBottom = current.scrollTop + current.clientHeight >= current.scrollHeight - 1

      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        return true
      }
    }

    current = current.parentElement
  }

  return false
}

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let currentY = window.scrollY
    let targetY = currentY
    let frame: number | null = null
    let isProgrammaticScroll = false
    let lastTimestamp = 0
    let lastProgrammaticScrollAt = 0

    const getMaxScroll = () => document.documentElement.scrollHeight - window.innerHeight

    const stop = () => {
      if (frame === null) return
      window.cancelAnimationFrame(frame)
      frame = null
    }

    const markProgrammaticScroll = () => {
      isProgrammaticScroll = true
      lastProgrammaticScrollAt = performance.now()
      window.requestAnimationFrame(() => {
        isProgrammaticScroll = false
      })
    }

    const tick = (timestamp: number) => {
      const delta = lastTimestamp ? Math.min(timestamp - lastTimestamp, 40) / 16.666 : 1
      const amount = 1 - Math.pow(1 - ease, delta)
      lastTimestamp = timestamp
      currentY += (targetY - currentY) * amount

      if (Math.abs(targetY - currentY) < settleDistance) {
        currentY = targetY
        markProgrammaticScroll()
        window.scrollTo(0, currentY)
        stop()
        return
      }

      markProgrammaticScroll()
      window.scrollTo(0, currentY)
      frame = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame !== null) return
      lastTimestamp = 0
      frame = window.requestAnimationFrame(tick)
    }

    const resetScrollState = () => {
      stop()

      if (!window.location.hash) {
        window.scrollTo(0, 0)
      }

      currentY = window.scrollY
      targetY = currentY
      emitScrollTarget(targetY)
    }

    const onWheel = (event: WheelEvent) => {
      if (document.documentElement.classList.contains('gallery-fullscreen-open')) return
      if (event.ctrlKey || event.metaKey) return
      if (Math.abs(event.deltaY) < minimumWheelDelta) return

      const element = event.target instanceof Element ? event.target : null
      if (element?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (canScrollInside(element, event.deltaY)) return

      event.preventDefault()
      currentY = frame === null ? window.scrollY : currentY
      const nextTargetY = clamp(targetY + normalizeWheelDelta(event.deltaY) * wheelMultiplier, 0, getMaxScroll())
      if (nextTargetY === targetY && frame !== null) return
      targetY = nextTargetY
      emitScrollTarget(targetY)
      start()
    }

    const onResize = () => {
      targetY = clamp(targetY, 0, getMaxScroll())
      emitScrollTarget(targetY)
    }

    const onScroll = () => {
      if (isProgrammaticScroll || frame !== null || performance.now() - lastProgrammaticScrollAt < 80) return
      currentY = window.scrollY
      targetY = currentY
      emitScrollTarget(targetY)
    }

    window.addEventListener('wheel', onWheel, {passive: false})
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onResize)

    const resetFrame = window.requestAnimationFrame(resetScrollState)

    return () => {
      window.cancelAnimationFrame(resetFrame)
      stop()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [pathname])

  return null
}
