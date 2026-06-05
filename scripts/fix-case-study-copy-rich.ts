import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-01'})

function textFromBlock(block: any) {
  return block.text || block.children?.map((child: {text?: string}) => child.text).join('') || ''
}

function styleFromBlock(block: any, index: number) {
  if (block.style === 'p1' || block.style === 'p2') return block.style
  return index === 0 ? 'p1' : 'p2'
}

function portableTextBlock(block: any, index: number) {
  const text = textFromBlock(block).trim()
  if (!text) return null

  const keyBase = block._key || `copy-${index}`
  return {
    _key: keyBase,
    _type: 'block',
    style: styleFromBlock(block, index),
    markDefs: [],
    children: [
      {
        _key: `${keyBase}-span`,
        _type: 'span',
        marks: [],
        text,
      },
    ],
  }
}

const documents = await client.fetch(
  '*[_type == "caseStudy" && missionSection.copyRich != null]{_id, missionSection{copyRich}}',
)

for (const document of documents) {
  const copyRich = document.missionSection?.copyRich
  if (!Array.isArray(copyRich)) continue

  const nextCopyRich = copyRich
    .map(portableTextBlock)
    .filter(Boolean)

  await client.patch(document._id).set({'missionSection.copyRich': nextCopyRich}).commit()
  console.log(`Updated ${document._id}`)
}
