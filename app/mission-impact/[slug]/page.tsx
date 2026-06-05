import {ContentSections} from '@/components/ContentSections'
import {PageShell} from '@/components/PageShell'
import {SanityImage} from '@/components/SanityImage'
import {caseStudyBySlugQuery} from '@/lib/queries'
import {fetchSanity} from '@/lib/sanity'

export default async function CaseStudyPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const item = await fetchSanity<any>(caseStudyBySlugQuery, {slug})
  const title = item?.individualPage?.header || item?.missionSection?.header || 'Case study'
  const gallery = item?.individualPage?.gallery || []

  return (
    <PageShell headerAccent="green">
      <main className="case-detail-page">
        <div className="case-detail__layout">
          <div className="case-detail__content">
            <h1>{title}</h1>
            <ContentSections sections={item?.individualPage?.contentSections} />
          </div>
          <div className="case-gallery">
            {gallery.map((image: any, index: number) => {
              const isHalf = index % 2 === 1
              const align = index % 4 === 1 ? 'right' : 'left'

              return (
              <div className={`media-box case-gallery__item ${isHalf ? `case-gallery__item--half case-gallery__item--${align}` : 'case-gallery__item--full'}`} key={image._key}>
                <SanityImage image={image} />
              </div>
              )
            })}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
