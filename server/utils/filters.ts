import { people } from '../data/people'

// Utility to count and return top entries from an array of strings
function getTopEntries<T extends string>(
  extractor: (person: typeof people[number]) => T | T[],
  top = 20
): T[] {
  const counts: Record<string, number> = {}

  people.forEach(person => {
    const values = extractor(person)
    const valueArray = Array.isArray(values) ? values : [values]

    valueArray.forEach(val => {
      counts[val] = (counts[val] || 0) + 1
    })
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([value]) => value as T)
}

export const getTopHobbies = () =>
  getTopEntries(person => person.hobbies)

export const getTopNationalities = () =>
  getTopEntries(person => person.nationality)
