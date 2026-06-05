export function getEmbedUrl(url?: string | null, autoplay = false, loop = false) {
  if (!url) return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')
    const params = new URLSearchParams()

    if (autoplay) {
      params.set('autoplay', '1')
      params.set('autohide', '1')
      params.set('mute', '1')
      params.set('controls', '0')
      params.set('cc_load_policy', '0')
      params.set('color', 'white')
      params.set('playsinline', '1')
      params.set('disablekb', '1')
      params.set('fs', '0')
      params.set('iv_load_policy', '3')
      params.set('modestbranding', '1')
      params.set('rel', '0')
      params.set('showinfo', '0')
    }

    if (loop) {
      params.set('loop', '1')
    }

    if (host.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      if (!videoId) return url
      if (loop) params.set('playlist', videoId)
      return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
    }

    if (host.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '')
      if (!videoId) return url
      if (loop) params.set('playlist', videoId)
      return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
    }

    if (host.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop()
      if (!videoId) return url
      if (autoplay) {
        params.set('background', '1')
        params.set('muted', '1')
      }
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`
    }
  } catch {
    return url
  }

  return url
}

export function getVideoPosterUrl(url?: string | null) {
  if (!url) return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')

    if (host.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      if (!videoId) return null
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }

    if (host.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '')
      if (!videoId) return null
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
  } catch {
    return null
  }

  return null
}
