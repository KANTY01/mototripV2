export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  role: UserRole
  experience_level?: string
  preferred_routes?: string[]
  motorcycle_details?: {
    make: string
    model: string
    year: number
  }
  trip_count?: number
  follower_count?: number
  review_count?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  username: string
}
