import {SanityImage} from './SanityImage'
import type {ReactNode} from 'react'

type Block = Record<string, any>

function renderMarks(text: string, marks: string[] = [], markDefs: Block[] = []) {
  return marks.reduce<ReactNode>((content, mark) => {
    if (mark === 'strong') return <strong>{content}</strong>
    if (mark === 'em') return <em>{content}</em>

    const link = markDefs.find((item) => item._key === mark && item._type === 'link')
    if (link?.href) {
      return (
        <a href={link.href} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} target={link.href.startsWith('http') ? '_blank' : undefined}>
          {content}
        </a>
      )
    }

    return content
  }, text)
}

function renderText(blocks?: Block[]) {
  return blocks?.map((block) => {
    const children = block.children?.filter((child: {text?: string}) => child.text) || []
    if (!children.length) return null
    const content = children.map((child: {text?: string; marks?: string[]; _key?: string}, index: number) => (
      <span key={child._key || index}>{renderMarks(child.text || '', child.marks, block.markDefs)}</span>
    ))

    return <p className={block.style === 'p2' ? 'content-builder__p2' : 'content-builder__p1'} key={block._key}>{content}</p>
  })
}

export function ContentSections({sections}: {sections?: Block[]}) {
  if (!sections?.length) return null

  return (
    <div className="content-builder">
      {sections.map((section) => {
        if (section._type === 'caseStudyTextSection') {
          return <div className="content-builder__text" key={section._key}>{renderText(section.body)}</div>
        }

        if (section._type === 'imageWithAlt') {
          return (
            <div className="content-builder__image" key={section._key}>
              <SanityImage image={section} />
            </div>
          )
        }

        if (section._type === 'contentTable') {
          return (
            <div className="content-table-wrap" key={section._key}>
              <table className="content-table">
                <tbody>
                  {section.rows?.map((row: Block) => (
                    <tr key={row._key}>
                      {row.cells?.map((cell: string, index: number) => <td key={`${row._key}-${index}`}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (section._type === 'statBlock') {
          return (
            <div className="content-builder__stat" key={section._key}>
              <p>{section.copy}</p>
              <strong>{section.number}</strong>
            </div>
          )
        }

        if (section._type === 'logoSection') {
          return (
            <div className="content-builder__logos" key={section._key}>
              {section.logos?.map((logo: Block) => (
                <div className="content-builder__logo" key={logo._key}>
                  <SanityImage image={logo.logo} />
                </div>
              ))}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
