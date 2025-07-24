import { faker } from '@faker-js/faker'
import { Person } from '../types/person'

let peopleCache: Person[] = []
const TOTAL_PEOPLE_COUNT = 500

export function setPeopleCache(newCache: Person[]) {
  peopleCache = newCache
}

function getTopHobbies(people: Person[]): string[] {
  const counts: Record<string, number> = {}
  people.forEach(p => {
    p.hobbies.forEach(h => {
      counts[h] = (counts[h] || 0) + 1
    })
  })

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([h]) => h)
}

function getTopNationalities(people: Person[]): string[] {
  const counts: Record<string, number> = {}
  people.forEach(p => {
    counts[p.nationality] = (counts[p.nationality] || 0) + 1
  })

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([n]) => n)
}

// Generate once only if empty
if (!peopleCache.length) {
  console.log(`Generating ${TOTAL_PEOPLE_COUNT} mock people...`)
  peopleCache = Array.from({ length: TOTAL_PEOPLE_COUNT }, () => ({
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 80 }),
    nationality: faker.location.country(),
    hobbies: faker.helpers.arrayElements(
      [
        'Reading', 'Gardening', 'Hiking', 'Cooking', 'Painting',
        'Cycling', 'Photography', 'Fishing', 'Yoga', 'Gaming',
        'Knitting', 'Writing', 'Dancing', 'Singing',
      ],
      { min: 0, max: 10 }
    ),
  }))
  console.log('Mock people generated.')
}

export interface GetPeopleParams {
  page: number
  limit: number
  search?: string
  hobbies?: string[]
  nationality?: string
}

export async function getFilteredPeople({ page, limit, search, hobbies, nationality }: GetPeopleParams) {
  const filtered = peopleCache.filter(p => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !p.first_name.toLowerCase().includes(q) &&
        !p.last_name.toLowerCase().includes(q)
      ) return false
    }

    if (hobbies?.length && !hobbies.every(h => p.hobbies.includes(h))) return false

    if (nationality && p.nationality !== nationality) return false

    return true
  })

  const total = filtered.length
  const start = (page - 1) * limit
  const paginatedData = filtered.slice(start, start + limit)

  return {
    data: paginatedData,
    total,
    page,
    limit,
    filters: {
      topHobbies: getTopHobbies(peopleCache),
      topNationalities: getTopNationalities(peopleCache),
    },
  }
}
