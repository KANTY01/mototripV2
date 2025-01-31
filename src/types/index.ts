export interface User {
  id: number
  username: string
  avatar?: string
}

export interface Trip {
  id: number
  title: string
  description: string
  difficulty: string
  distance: number
  start_date: string
  end_date: string
  images?: string[]
  user?: User,
  is_premium: boolean
}

export interface Review {
  id: number
  trip_id: number
  user_id: number
  rating: number
  content: string
  images?: string[]
  created_at: string
  user: User
}
