import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'rtz6khm8'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-06-01',
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: unknown) {
  return builder.image(source as never)
}

export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}) {
  try {
    return await client.fetch<T>(query, params, {cache: 'no-store'})
  } catch (error) {
    console.error(error)
    return null
  }
}
