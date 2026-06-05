export const filterLabels: Record<string, string> = {
  'therapeutic-storytelling': 'Therapeutic Storytelling',
  'social-campaigns': 'Social Campaigns',
  community: 'Community',
  research: 'Research',
}

export const placeholderFilms = [
  {
    _id: 'film-1',
    title: 'Nerves',
    slug: {current: 'nerves'},
    client: 'Lea Gill',
    filmType: 'A relatable film about social anxiety.',
    categories: ['social-campaigns', 'research'],
    summary:
      '"I hate going to parties, but I have to go because my husband says I should." Nerves is a relatable film about social anxiety.',
  },
  {
    _id: 'film-2',
    title: 'Untitled film',
    slug: {current: 'untitled-film'},
    client: 'Client',
    filmType: 'Exploring human stories through storytelling, campaigns and community.',
    categories: ['therapeutic-storytelling'],
    summary: 'Exploring human stories through storytelling, campaigns and community.',
  },
]

export const fallbackSettings = {
  navigation: [
    {label: 'Home', href: '/'},
    {label: 'Cinema', href: '/cinema'},
    {label: 'Mission & Impact', href: '/mission-impact'},
    {label: 'About', href: '/about'},
    {label: 'Contact us', href: '/contact'},
  ],
  ctaEyebrow: 'Have a story to tell?',
  cta: {label: 'Let’s talk', href: '/contact'},
  footerContact: [] as unknown[],
  footerAddress: '',
  email: 'contact@wondering.com',
  phone: '+44 123 456 678',
  address: '14 Peacock Yard, London SE17 3LH',
  registrationNumber: '13384660',
  copyrightYear: 2026,
  socialLinks: {
    instagram: '#',
    linkedin: '#',
    youtube: '#',
  },
}
