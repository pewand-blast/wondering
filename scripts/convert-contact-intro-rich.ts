import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-01'})

function blockFromText(text: string, index: number) {
  return {
    _key: `introBody${index}`,
    _type: 'block',
    style: 'p1',
    markDefs: [],
    children: [
      {
        _key: `introBody${index}Span`,
        _type: 'span',
        marks: [],
        text,
      },
    ],
  }
}

const document = await client.fetch<{_id: string; introBody?: unknown} | null>(
  '*[_type == "contactPage" && _id == "contactPage"][0]{_id, introBody}',
)

if (!document) {
  console.log('No contactPage document found.')
} else if (typeof document.introBody !== 'string') {
  console.log('Contact intro body is already rich text.')
} else {
  const blocks = document.introBody
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(blockFromText)

  await client.patch(document._id).set({introBody: blocks}).commit()
  console.log('Contact intro body converted to rich text.')
}
