export const NATIONALITIES = [
  'Indian', 'American', 'British', 'Canadian', 'Australian',
  'German', 'French', 'Japanese', 'Chinese', 'Brazilian',
] as const

export type Nationality = (typeof NATIONALITIES)[number]

export const HOBBIES_POOL = [
  'Reading', 'Traveling', 'Cooking', 'Gaming', 'Hiking',
  'Swimming', 'Painting', 'Dancing', 'Cycling', 'Photography',
  'Gardening', 'Fishing', 'Yoga', 'Singing', 'Writing',
] as const

export type Hobby = (typeof HOBBIES_POOL)[number]

export const TOTAL_PEOPLE = 500
