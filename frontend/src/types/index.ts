export type UserRole = 'admin' | 'user' | 'premium'

export interface PrivateUser {
  id: number
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

export interface User {
  id: number
  username: string
  email: string
  bio?: string
  avatar?: string
  role: UserRole
  experience_level?: string
  preferred_routes?: string[]
  motorcycle_details?: PrivateUser['motorcycle_details']
  stats?: UserStats
}

export interface RoutePoint {
  latitude: number
  longitude: number
  name?: string
  description?: string
  pointOfInterest?: boolean
  recommendedStop?: boolean
}

export interface UserStats {
  total_trips: number
  total_distance: number
  total_reviews: number
  achievements_count: number
  followers_count: number
  following_count: number
  average_rating: number
}

export interface TripLocation {
  latitude: number
  longitude: number
  route_points?: RoutePoint[]
  bounds?: {
    northeast: { lat: number; lng: number }
    southwest: { lat: number; lng: number }
  }
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
  user?: User
  is_premium?: boolean
  location: TripLocation
  is_favorite?: boolean
}

export interface ReviewVotes {
  upvotes: number
  downvotes: number
  user_vote?: 'up' | 'down'
}

export interface ReviewReport {
  id: number
  user_id: number
  review_id: number
  reason: string
  status: 'pending' | 'reviewed'
  created_at: string
}

export interface Review {
  id: number
  trip_id: number
  user_id: number
  rating: number
  content: string
  images?: string[]
  created_at: string
  user: {
    id: number
    username: string
    avatar?: string
    role?: UserRole
  }
  votes?: ReviewVotes
  reports_count?: number
  status?: 'active' | 'hidden' | 'deleted'
}

export interface PremiumRouteDetails {
  distance: string
  duration: string
  difficulty: string
  terrain: string
  fuelStops: number
  accommodation: string[]
}

export interface Waypoint {
  name: string
  description: string
  coordinates: [number, number]
  pointOfInterest?: string
  recommendedStop?: boolean
}

export interface PremiumContent {
  tripId: number
  title: string
  description: string
  routeDetails: PremiumRouteDetails
  waypoints: Waypoint[]
  premiumImages: string[]
  expertTips: string[]
  additionalFeatures?: {
    seasonalNotes?: string
    difficultyNotes?: string
    equipmentRecommendations?: string[]
  }
}
