import Link from 'next/link'
import {PageShell} from '@/components/PageShell'
import {SanityImage} from '@/components/SanityImage'
import {StatCycler} from '@/components/StatCycler'
import {caseStudiesQuery, missionQuery} from '@/lib/queries'
import {fetchSanity} from '@/lib/sanity'

const fallbackCaseStudies = [
  {
    _id: 'fallback-case-1',
    slug: {current: 'case-study-1'},
    missionSection: {
      heroImage: '/home-featured-film.jpg',
      header: 'Title',
      copyRich: [
        {
          _key: 'fallback-case-1-p1',
          style: 'p1',
          children: [{text: 'Et excepteur culpa nisi anim sunt est nisi anim id. Quis amet veniam reprehenderit nulla enim labore do. Deserunt laborum laboris eu cillum elit. Sunt irure irure eiusmod ad anim enim labore.'}],
        },
        {
          _key: 'fallback-case-1-p2',
          style: 'p2',
          children: [{text: 'Voluptate ullamco ullamco velit eu voluptate ut ullamco nisi amet aute Lorem. Excepteur proident culpa et mollit fugiat nulla irure dolore commodo proident sunt nulla laborum ea.'}],
        },
      ],
    },
  },
  {
    _id: 'fallback-case-2',
    slug: {current: 'case-study-2'},
    missionSection: {
      heroImage: '/home-film-left.jpg',
      header: 'Title',
      copyRich: [
        {
          _key: 'fallback-case-2-p1',
          style: 'p1',
          children: [{text: 'Et excepteur culpa nisi anim sunt est nisi anim id. Quis amet veniam reprehenderit nulla enim labore do. Deserunt laborum laboris eu cillum elit.'}],
        },
        {
          _key: 'fallback-case-2-p2',
          style: 'p2',
          children: [{text: 'In voluptate sint ex consequat deserunt sit culpa. Officia irure Lorem aliqua nostrud ipsum cillum aliqua proident laborum incididunt esse reprehenderit.'}],
        },
      ],
    },
  },
]

function CaseStudyImage({image}: {image?: unknown}) {
  if (typeof image === 'string') {
    return <img alt="" src={image} />
  }

  return <SanityImage image={image} sizes="(max-width: 980px) 100vw, 50vw" />
}

function blockText(block: any) {
  return block.text || block.children?.map((child: {text?: string}) => child.text).join('') || ''
}

function StyledCopy({blocks, fallback}: {blocks?: any[]; fallback?: string}) {
  if (blocks?.length) {
    return (
      <div className="styled-copy">
        {blocks.map((block) => {
          const text = blockText(block)
          if (!text) return null
          return <p className={block.style === 'p2' ? 'styled-copy__p2' : 'styled-copy__p1'} key={block._key}>{text}</p>
        })}
      </div>
    )
  }

  if (!fallback) return null
  return (
    <div className="styled-copy">
      <p className="styled-copy__p1">{fallback}</p>
    </div>
  )
}

export default async function MissionImpactPage() {
  const [page, caseStudiesData] = await Promise.all([
    fetchSanity<any>(missionQuery),
    fetchSanity<any[]>(caseStudiesQuery),
  ])
  const cmsCaseStudies = caseStudiesData || []
  const caseStudies = cmsCaseStudies.length ? cmsCaseStudies : fallbackCaseStudies
  const stats = page?.stats?.length ? page.stats : [{number: '93%', copy: 'Tempor aliqua incididunt magna, consequat culpa sunt esse non ullamco lorem Lorem deserunt caliqa.'}]

  return (
    <PageShell headerAccent="green">
      <main className="mission-impact-page">
        <section className="mission-impact-intro">
          <h1>{page?.missionHeading || 'Mission'}</h1>
          <p className="mission-impact-intro__statement">
            {page?.missionBody || 'Our mission is to create films that connect deeply with people through therapeutic storytelling and social campaigns.'}
          </p>
          <h2>{page?.impactHeading || 'Impact'}</h2>
          <p className="mission-impact-intro__copy">
            {page?.impactFirstParagraph || 'Proident cillum quis nisi. Aliqua nisi sint anim adipisicing. Eu exercitation ad pariatur deserunt enim occaecat et ipsum nisi. In irure cupidatat velit Lorem cillum tempor excepteur reprehenderit do.'}
          </p>
          <StatCycler className="mission-impact-intro__stat" stats={stats} />
        </section>

        <section className="mission-case-studies">
          <h2>{page?.caseStudiesHeading || 'Case studies'}</h2>
          <div className="mission-case-studies__list">
            {caseStudies.map((item: any, index: number) => (
              <article className="mission-case-card" key={`${item._id || item.slug?.current || 'case'}-${index}`}>
                <div className="mission-case-card__image">
                  <div className="mission-case-card__image-crop">
                    <CaseStudyImage image={item.missionSection?.heroImage} />
                  </div>
                </div>
                <div className="mission-case-card__content">
                  <h3>{item.missionSection?.header || 'Title'}</h3>
                  <StyledCopy blocks={item.missionSection?.copyRich} fallback={item.missionSection?.copy} />
                  <Link className="button-link small-copy mission-case-card__button" href={`/mission-impact/${item.slug?.current || ''}`}>
                    <span className="button-link__text-mask">
                      <span className="button-link__text">View more</span>
                    </span>
                    <span aria-hidden="true" className="button-link__icon">
                      <span className="button-link__icon-bg" />
                      <span className="button-link__icon-mask">
                        <span className="button-link__icon-track">
                          <span className="button-link__arrow" />
                          <span className="button-link__arrow" />
                          <span className="button-link__arrow" />
                        </span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="button-link__hover-bg" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
