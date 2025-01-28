export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  availableSeats: number;
  location: string;
  imageUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdBy: {
    id: string;
    username: string;
  };
  // New motorcycle-specific fields
  routeType: 'highway' | 'offroad' | 'mixed';
  requiredExperience: 'beginner' | 'intermediate' | 'advanced';
  motorcycleTypes: string[];
  routeHighlights: string[];
  routeMapUrl: string;
  requiredGear: string[];
  distanceKm: number;
  estimatedDuration: string;
  terrainDifficulty: 'easy' | 'moderate' | 'challenging';
  restStops: {
    location: string;
    coordinates: [number, number];
    amenities: string[];
  }[];
  weatherInfo?: {
    temperature: number;
    conditions: string;
    forecast: string;
  };
}

export interface TripFilterParams {
  from?: string;
  to?: string;
  departureDate?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  routeType?: 'highway' | 'offroad' | 'mixed';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  motorcycleTypes?: string[];
  minDistance?: number;
  maxDistance?: number;
  terrainDifficulty?: 'easy' | 'moderate' | 'challenging';
}

export interface TripFilters {
  location: string;
  startDate: string | null;
  endDate: string | null;
  minPrice: string;
  maxPrice: string;
  capacityMin: string;
  sortBy?: 'price' | 'date' | 'capacity';
  sortOrder?: 'asc' | 'desc';
  // New motorcycle-specific filters
  routeType?: 'highway' | 'offroad' | 'mixed';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  motorcycleTypes?: string[];
  minDistance?: string;
  maxDistance?: string;
  terrainDifficulty?: 'easy' | 'moderate' | 'challenging';
}

export enum MeetingStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Meeting {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  imageUrl?: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: MeetingStatus;
  organizer: {
    id: number;
    username: string;
    email: string;
    role: string;
    profile: {
      id: number;
      userId: number;
      firstName: string;
      lastName: string;
      avatarUrl?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface TripCreateData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  location: string;
  images: File[];
  // New motorcycle-specific fields
  routeType: 'highway' | 'offroad' | 'mixed';
  requiredExperience: 'beginner' | 'intermediate' | 'advanced';
  motorcycleTypes: string[];
  routeHighlights: string[];
  routeMapUrl: string;
  requiredGear: string[];
  distanceKm: number;
  estimatedDuration: string;
  terrainDifficulty: 'easy' | 'moderate' | 'challenging';
  restStops: {
    location: string;
    coordinates: [number, number];
    amenities: string[];
  }[];
  weatherInfo?: {
    temperature: number;
    conditions: string;
    forecast: string;
  };
}
