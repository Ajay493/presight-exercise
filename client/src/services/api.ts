import axios from 'axios'
import type { PeopleResponse } from '../types/person'

const API_BASE = 'http://localhost:4000/api'

// Cache inflight fetches by serialized params key to prevent duplicate requests
const fetchCache = new Map<string, Promise<PeopleResponse>>()

export async function fetchPeople(
  page = 1,
  limit = 20,
  search = '',
  hobbies: string[] = [],
  nationality: string[] = []
): Promise<PeopleResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (search) params.append('search', search)
  if (hobbies.length) params.append('hobbies', hobbies.join(','))
  if (nationality.length) params.append('nationality', nationality.join(','))

  const key = params.toString()

  if (fetchCache.has(key)) {
    return fetchCache.get(key)!
  }

  const promise = axios
    .get<PeopleResponse>(`${API_BASE}/people?${key}`)
    .then((response) => response.data)
    .finally(() => {
      fetchCache.delete(key)
    })

  fetchCache.set(key, promise)

  return promise
}
