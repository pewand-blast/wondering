import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-01'})

function textToBlock(text: string, index: number) {
  return {
    _key: `summary-${Date.now()}-${index}`,
    _type: 'block',
    style: 'p1',
    markDefs: [],
    children: [
      {
        _key: `span-${Date.now()}-${index}`,
        _type: 'span',
        marks: [],
        text,
      },
    ],
  }
}

async function main() {
  const films = (await client.fetch<{_id: string; summary?: unknown}[]>('*[_type == "film"]{_id, summary}')).filter(
    (film) => typeof film.summary === 'string',
  )
  const transaction = client.transaction()

  films.forEach((film) => {
    const blocks = String(film.summary)
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(textToBlock)

    transaction.patch(film._id, (patch) => patch.set({summary: blocks}))
  })

  if (!films.length) {
    console.log('No string summaries to convert.')
    return
  }

  await transaction.commit()
  console.log(`Converted ${films.length} film summary field(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
