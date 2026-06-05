import type {ReactNode} from 'react'

type RichTextSpan = {
  _key?: string
  text?: string
  marks?: string[]
}

type RichTextMark = {
  _key?: string
  _type?: string
  href?: string
}

type RichTextBlock = {
  _key?: string
  _type?: string
  style?: string
  children?: RichTextSpan[]
  markDefs?: RichTextMark[]
}

function renderTextWithBreaks(text: string) {
  const lines = text.split('\n')

  if (lines.length === 1) {
    return text
  }

  return (
    <>
      {lines.map((line, index) => (
        <span key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  )
}

function renderMarkedText(span: RichTextSpan, markDefs: RichTextMark[] = []) {
  return (span.marks || []).reduce<ReactNode>((content, mark) => {
    if (mark === 'strong') {
      return <strong>{content}</strong>
    }

    if (mark === 'em') {
      return <em>{content}</em>
    }

    const link = markDefs.find((item) => item._key === mark && item._type === 'link')
    if (link?.href) {
      return (
        <a href={link.href} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} target={link.href.startsWith('http') ? '_blank' : undefined}>
          {content}
        </a>
      )
    }

    return content
  }, renderTextWithBreaks(span.text || ''))
}

function paragraphsFromPlainText(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function RichText({value, className, fallback}: {value?: unknown; className?: string; fallback?: string}) {
  if (Array.isArray(value)) {
    const blocks = value.filter((block): block is RichTextBlock => block?._type === 'block')

    if (blocks.length) {
      return (
        <div className={className}>
          {blocks.map((block, index) => (
            <p className={block.style === 'p2' ? 'rich-text-p2' : 'rich-text-p1'} key={block._key || index}>
              {block.children?.map((span, spanIndex) => (
                <span key={span._key || spanIndex}>{renderMarkedText(span, block.markDefs)}</span>
              ))}
            </p>
          ))}
        </div>
      )
    }
  }

  const text = typeof value === 'string' ? value : fallback
  const paragraphs = text ? paragraphsFromPlainText(text) : []

  if (!paragraphs.length) {
    return null
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
