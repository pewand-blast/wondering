type PortableTextBlock = {
  _type?: string
  children?: {text?: string}[]
}

export function toPlainText(value: unknown) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''

  return value
    .map((block: PortableTextBlock) => {
      if (block?._type !== 'block') return ''
      return block.children?.map((child) => child.text || '').join('') || ''
    })
    .filter(Boolean)
    .join('\n')
}
