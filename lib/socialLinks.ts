type SocialLink = {
  label: string
  href: string
}

export function getSocialLinks(value: unknown): SocialLink[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is SocialLink => Boolean(item?.label && item?.href)).slice(0, 3)
  }

  if (!value || typeof value !== 'object') return []

  const links = value as Record<string, unknown>

  return [
    {label: 'Instagram', href: links.instagram},
    {label: 'LinkedIn', href: links.linkedin},
    {label: 'YouTube', href: links.youtube},
  ].filter((item): item is SocialLink => typeof item.href === 'string' && Boolean(item.href))
}
