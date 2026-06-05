import {PageShell} from '@/components/PageShell'
import {SanityImage} from '@/components/SanityImage'
import {aboutQuery} from '@/lib/queries'
import {fetchSanity} from '@/lib/sanity'

const fallbackSections = [
  {
    _key: 'therapeutic-storytelling',
    heading: 'Therapeutic Storytelling',
    body: 'Incididunt est esse dolore non ad. Aute culpa amet sit ipsum mollit enim proident id sunt reprehenderit sit. In elit eiusmod nostrud Lorem excepteur ipsum elit id veniam. Incididunt voluptate sunt aute consectetur mollit aliquip elit do non amet. Sint sint tempor pariatur ea officia aliquip qui occaecat.',
    fallbackImage: '/home-featured-film.jpg',
  },
  {
    _key: 'social-campaigns',
    heading: 'Social Campaigns',
    body: 'Incididunt est esse dolore non ad. Aute culpa amet sit ipsum mollit enim proident id sunt reprehenderit sit. In elit eiusmod nostrud Lorem excepteur ipsum elit id veniam. Incididunt voluptate sunt aute consectetur mollit aliquip elit do non amet. Sint sint tempor pariatur ea officia aliquip qui occaecat.',
    fallbackImage: '/home-film-right.jpg',
  },
  {
    _key: 'community-arts',
    heading: 'Community Arts Interventions',
    body: 'Incididunt est esse dolore non ad. Aute culpa amet sit ipsum mollit enim proident id sunt reprehenderit sit. In elit eiusmod nostrud Lorem excepteur ipsum elit id veniam. Incididunt voluptate sunt aute consectetur mollit aliquip elit do non amet. Sint sint tempor pariatur ea officia aliquip qui occaecat.',
    fallbackImage: '/home-film-left.jpg',
  },
  {
    _key: 'research',
    heading: 'Research',
    body: 'Incididunt est esse dolore non ad. Aute culpa amet sit ipsum mollit enim proident id sunt reprehenderit sit. In elit eiusmod nostrud Lorem excepteur ipsum elit id veniam. Incididunt voluptate sunt aute consectetur mollit aliquip elit do non amet. Sint sint tempor pariatur ea officia aliquip qui occaecat.',
    fallbackImage: '/home-hero.jpg',
  },
]

const fallbackTeamSections = [
  {
    _key: 'team-member-1',
    heading: 'Name Surname',
    body: 'Incididunt est esse dolore non ad. Aute culpa amet sit ipsum mollit enim proident id sunt reprehenderit sit. In elit eiusmod nostrud Lorem excepteur ipsum elit id veniam.',
    fallbackImage: '/home-film-left.jpg',
  },
  {
    _key: 'team-member-2',
    heading: 'Name Surname',
    body: 'Incididunt est esse dolore non ad. Aute culpa amet sit ipsum mollit enim proident id sunt reprehenderit sit. In elit eiusmod nostrud Lorem excepteur ipsum elit id veniam.',
    fallbackImage: '/home-film-right.jpg',
  },
]

function AboutSectionImage({section}: {section: any}) {
  if (section.image) {
    return <SanityImage image={section.image} />
  }

  return <img alt="" src={section.fallbackImage || '/home-featured-film.jpg'} />
}

export default async function AboutPage() {
  const page = await fetchSanity<any>(aboutQuery)
  const sections = page?.sections?.length
    ? page.sections.map((section: any, index: number) => ({
        ...section,
        fallbackImage: fallbackSections[index % fallbackSections.length].fallbackImage,
      }))
    : fallbackSections
  const teamSections = page?.teamSections?.length
    ? page.teamSections.map((section: any, index: number) => ({
        ...section,
        fallbackImage: fallbackTeamSections[index % fallbackTeamSections.length].fallbackImage,
      }))
    : fallbackTeamSections

  return (
    <PageShell headerAccent="brown">
      <main className="about-page">
        <section className="about-hero">
          <h1>{page?.introHeading || 'Who we are'}</h1>
          <p>
            {page?.introBody || 'We create films that sit between therapeutic storytelling and social campaigns - grounded in real experiences and made to resonate beyond the screen.'}
          </p>
        </section>

        <section className="about-work">
          <h2>{page?.sectionsHeading || 'What we do'}</h2>
          <div className="about-work__grid">
            {sections.map((section: any) => (
              <article className="about-work-card" key={section._key || section.heading}>
                <div className="about-work-card__image">
                  <AboutSectionImage section={section} />
                </div>
                <div className="about-work-card__copy">
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-work about-team">
          <h2>{page?.teamHeading || 'The team'}</h2>
          <div className="about-work__grid">
            {teamSections.map((section: any) => (
              <article className="about-work-card" key={section._key || section.heading}>
                <div className="about-work-card__image">
                  <AboutSectionImage section={section} />
                </div>
                <div className="about-work-card__copy">
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
