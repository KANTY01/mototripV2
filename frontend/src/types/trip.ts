export type TripCategory = 'adventure' | 'touring' | 'sport' | 'cruiser' | 'offroad' | 'custom';

export interface TripTag {
  id: string;
  name: string;
}

export interface TripFilters {
  page?: number;
  search?: string;
  location?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  sortBy?: string;
  categories?: TripCategory[];
  tags?: string[];
}

export interface TripFormData {
  title: string;
  description: string;
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  price: string;
  capacity: string;
  category: TripCategory;
  tags: string[];
  imageUrl?: string;
}

export interface TripResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  rating?: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  availableSpots: number;
  category: TripCategory;
  tags: TripTag[];
  organizer: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const TRIP_CATEGORIES: { value: TripCategory; label: string }[] = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'touring', label: 'Touring' },
  { value: 'sport', label: 'Sport' },
  { value: 'cruiser', label: 'Cruiser' },
  { value: 'offroad', label: 'Off-road' },
  { value: 'custom', label: 'Custom' },
];

export const COMMON_TAGS = [
  'scenic', 'mountain', 'coastal', 'urban', 'weekend',
  'long-distance', 'beginner-friendly', 'experienced',
  'group', 'solo', 'camping', 'luxury', 'historical',
  'technical', 'relaxed'
];
