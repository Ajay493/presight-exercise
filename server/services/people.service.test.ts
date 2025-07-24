import { getFilteredPeople, GetPeopleParams, setPeopleCache } from './people.service'
import { Person } from '../types/person'

const testPeople: Person[] = [
  {
    id: '1',
    avatar: 'avatar1.png',
    first_name: 'Alice',
    last_name: 'Smith',
    age: 30,
    nationality: 'Indian',
    hobbies: ['Reading', 'Cooking'],
  },
  {
    id: '2',
    avatar: 'avatar2.png',
    first_name: 'Bob',
    last_name: 'Brown',
    age: 25,
    nationality: 'American',
    hobbies: ['Gaming', 'Fishing'],
  },
  {
    id: '3',
    avatar: 'avatar3.png',
    first_name: 'Charlie',
    last_name: 'Davis',
    age: 35,
    nationality: 'British',
    hobbies: ['Reading', 'Hiking'],
  },
]

beforeAll(() => {
  setPeopleCache(testPeople)
})

describe('getFilteredPeople', () => {
  it('should paginate results', async () => {
    const params: GetPeopleParams = { page: 1, limit: 2 }
    const result = await getFilteredPeople(params)
    expect(result.data.length).toBe(2)
    expect(result.total).toBe(3)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(2)
  })

  it('should filter by search term case-insensitive', async () => {
    const params: GetPeopleParams = { page: 1, limit: 10, search: 'alice' }
    const result = await getFilteredPeople(params)
    expect(result.total).toBe(1)
    expect(result.data[0].first_name).toBe('Alice')
  })

  it('should filter by hobbies', async () => {
    const params: GetPeopleParams = { page: 1, limit: 10, hobbies: ['Reading', 'Cooking'] }
    const result = await getFilteredPeople(params)
    expect(result.total).toBe(1)
    expect(result.data[0].first_name).toBe('Alice')
  })

  it('should filter by nationality', async () => {
    const params: GetPeopleParams = { page: 1, limit: 10, nationality: 'American' }
    const result = await getFilteredPeople(params)
    expect(result.total).toBe(1)
    expect(result.data[0].first_name).toBe('Bob')
  })

  it('should return top hobbies and nationalities', async () => {
    const result = await getFilteredPeople({ page: 1, limit: 10 })
    expect(result.filters.topHobbies).toContain('Reading')
    expect(result.filters.topNationalities).toContain('Indian')
  })
})
