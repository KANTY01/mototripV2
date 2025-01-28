import { api } from './index';

export interface ReviewAttributes {
  rating: number;
  comment: string;
  tripId: string;
}

export interface ReviewResponse {
  id: string;
  rating: number;
  comment: string;
  tripId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: ReviewResponse[];
  total: number;
  page: number;
  perPage: number;
}

export const reviewsApi = {
  getReviews: async (tripId: string, page = 1): Promise<ReviewsResponse> => {
    const response = await api.get(`/trips/${tripId}/reviews`, {
      params: { page },
    });
    return response.data;
  },

  createReview: async (data: ReviewAttributes): Promise<ReviewResponse> => {
    const response = await api.post(`/trips/${data.tripId}/reviews`, data);
    return response.data;
  },

  updateReview: async (
    tripId: string,
    reviewId: string,
    data: Partial<ReviewAttributes>
  ): Promise<ReviewResponse> => {
    const response = await api.put(`/trips/${tripId}/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (tripId: string, reviewId: string): Promise<void> => {
    await api.delete(`/trips/${tripId}/reviews/${reviewId}`);
  },
};
