import { faker } from '@faker-js/faker'
import type { Person } from '../types/person'
import { NATIONALITIES, HOBBIES_POOL, TOTAL_PEOPLE } from '../constants'

export const people: Person[] = Array.from({ length: TOTAL_PEOPLE }, () => {
  const hobbiesCount = faker.number.int({ min: 0, max: 10 })

  return {
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 70 }),
    nationality: faker.helpers.arrayElement(NATIONALITIES),
    hobbies: faker.helpers.arrayElements(HOBBIES_POOL, hobbiesCount),
  }
})
