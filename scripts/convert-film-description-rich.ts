import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-01'})

function textToBlock(text: string, index: number) {
  const keyBase = `description-${Date.now()}-${index}`

  return {
    _key: keyBase,
    _type: 'block',
    style: 'p1',
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

async function main() {
  const films = (await client.fetch<{_id: string; filmType?: unknown}[]>('*[_type == "film"]{_id, filmType}')).filter(
    (film) => typeof film.filmType === 'string',
  )

  if (!films.length) {
    console.log('No string film descriptions to convert.')
    return
  }

  const transaction = client.transaction()

  films.forEach((film) => {
    const blocks = String(film.filmType)
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(textToBlock)

    transaction.patch(film._id, (patch) => patch.set({filmType: blocks}))
  })

  await transaction.commit()
  console.log(`Converted ${films.length} film description field(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
