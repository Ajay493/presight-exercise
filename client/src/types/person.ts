export type Person = {
    id: string
    avatar: string
    first_name: string
    last_name: string
    age: number
    nationality: string
    hobbies: string[]
  }
  
  export type FilterOptions = {
    nationalities: string[]
    hobbies: string[]
  }
  
  export type SearchParams = {
    search?: string
    nationality?: string
    hobby?: string
    page?: number
    limit?: number
  }
  

  export type FiltersResponse = {
    topHobbies: string[]
    topNationalities: string[]
  }

export interface PeopleResponse {
  filters: FiltersResponse
  data: Person[]
  total: number
  page: number
  limit: number
}