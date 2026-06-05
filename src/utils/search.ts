export type SearchResult = {
  id: string | number
  title: string
  excerpt: string
  type: string
  collectionRoute: string
  imageUrl?: string | null
}

export type SearchResponse = {
  docs: SearchResult[]
  totalDocs: number
  hasNextPage: boolean
}

/** Minimum characters before a query hits the API. Shared by the UI and the helper. */
export const MIN_QUERY_LENGTH = 3

/** Results fetched per page. */
export const PAGE_SIZE = 20

const EMPTY_RESPONSE: SearchResponse = { docs: [], totalDocs: 0, hasNextPage: false }

/**
 * Query the Payload search index.
 *
 * Single source of truth for the search request shape — the overlay and any
 * other caller go through here so the query stays consistent.
 *
 * @param signal optional AbortSignal so callers can cancel a stale request.
 * @throws Error when the API responds with a non-OK status, so callers can
 *   surface a real failure instead of silently rendering "no results".
 */
export async function searchPayload(
  query: string,
  type?: string,
  page = 1,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  if (query.length < MIN_QUERY_LENGTH) return EMPTY_RESPONSE

  const params = new URLSearchParams()
  params.set('limit', String(PAGE_SIZE))
  params.set('page', String(page))
  params.set('depth', '0')

  if (type) {
    params.set('where[and][0][or][0][title][like]', query)
    params.set('where[and][0][or][1][excerpt][like]', query)
    params.set('where[and][1][type][equals]', type)
  } else {
    params.set('where[or][0][title][like]', query)
    params.set('where[or][1][excerpt][like]', query)
  }

  const res = await fetch(`/api/search?${params.toString()}`, { signal })
  if (!res.ok) throw new Error(`Search request failed (${res.status})`)
  return res.json()
}
