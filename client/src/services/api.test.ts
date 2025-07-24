import axios from 'axios'
import type { PeopleResponse } from '../types/person'
import { fetchPeople } from './api'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('fetchPeople', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches people with default params', async () => {
    const mockData: PeopleResponse = {
      data: [{
        id: '1',
        first_name: 'John',
        avatar: '',
        last_name: '',
        age: 0,
        nationality: '',
        hobbies: []
      }],
      total: 1,
      filters: {
          topHobbies: [],
          topNationalities: []
      },
      page: 1,
      limit: 20
    }
    mockedAxios.get.mockResolvedValueOnce({ data: mockData })

    const result = await fetchPeople()

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/people?page=1&limit=20')
    expect(result).toEqual(mockData)
  })
})
