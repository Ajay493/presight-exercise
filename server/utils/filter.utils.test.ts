import { getTopHobbies, getTopNationalities } from "./filters"


jest.mock('../data/people', () => ({
  people: [
    { hobbies: ['Reading', 'Gaming'], nationality: 'Indian' },
    { hobbies: ['Gaming', 'Cooking'], nationality: 'American' },
    { hobbies: ['Reading'], nationality: 'Indian' },
    { hobbies: [], nationality: 'French' },
  ]
}))

describe('Filter Utils', () => {
  test('getTopHobbies counts and sorts hobbies correctly', () => {
    const topHobbies = getTopHobbies()
    expect(topHobbies).toContain('Reading')
    expect(topHobbies).toContain('Gaming')
    expect(topHobbies[0]).toBe('Reading') // Reading appears twice, Gaming twice but Reading first alphabetically or by count?
    expect(topHobbies[1]).toBe('Gaming')
    expect(topHobbies).toContain('Cooking')
  })

  test('getTopNationalities counts and sorts nationalities correctly', () => {
    const topNats = getTopNationalities()
    expect(topNats).toContain('Indian')
    expect(topNats).toContain('American')
    expect(topNats).toContain('French')
    expect(topNats[0]).toBe('Indian') // Indian appears twice, so should be first
  })
})
