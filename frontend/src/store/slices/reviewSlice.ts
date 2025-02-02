import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Review, User } from '../../types'
import { reviewApi } from '../../api/reviews'

export interface ReviewPagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: ReviewPagination
}

export interface ReviewState {
  reviews: Review[]
  status: 'idle' | 'loading' | 'failed'
  pagination: ReviewPagination | null
  error: string | null
}

const initialState: ReviewState = {
  reviews: [],
  status: 'idle',
  pagination: null,
  error: null
}

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ 
    tripId, 
    page = 1, 
    sort = 'newest',
    perPage = 10 
  }: { 
    tripId: number
    page?: number
    sort?: string
    perPage?: number
  }, 
  { rejectWithValue }) => {
    try {
      const response = await reviewApi.getTripReviews(tripId, page, sort, perPage)
      return response as PaginatedResponse<Review>
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reviews')
    }
  }
)

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (userId: number, { rejectWithValue }) => {
    try {
      // Fetch both user's reviews and reviews on their trips
      const [userReviews, tripOwnerReviews] = await Promise.all([
        reviewApi.getUserReviews(userId),
        reviewApi.getTripOwnerReviews(userId)
      ])

      // Combine and deduplicate reviews
      const allReviews = [...userReviews.data, ...tripOwnerReviews.data]
      const uniqueReviews = Array.from(
        new Map(allReviews.map(review => [review.id, review])).values()
      )
      return uniqueReviews
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user reviews')
    }
  }
)

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ 
    tripId,
    reviewId,
    formData
  }: { 
    tripId?: number,
    reviewId?: number,
    formData: FormData 
  }, { rejectWithValue }) => {
    try {
      // Validate required fields are present
      const rating = formData.get('rating')
      const content = formData.get('content')
      
      if (!rating || !content) {
        throw new Error('Rating and content are required')
      }

      // Create a new FormData instance to ensure clean data
      const cleanFormData = new FormData()
      cleanFormData.append('rating', rating.toString())
      cleanFormData.append('content', content.toString())
      formData.getAll('images').forEach(image => cleanFormData.append('images', image))

      let response;
      if (reviewId) {
        response = await reviewApi.updateReview(reviewId, cleanFormData)
        if (!response || !response.id) {
          throw new Error('Invalid response from update review')
        }
        return response

      } else if (tripId) {
        const response = await reviewApi.createReview(tripId, cleanFormData)
        return response
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit review')
    }
  }
)

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'idle'
        state.reviews = action.payload.data
        state.pagination = action.payload.meta
        state.error = null
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      // Fetch user reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.status = 'idle'
        state.reviews = action.payload
        state.pagination = null // User reviews don't use pagination
        state.error = null
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.status = 'idle'
        if (action.meta.arg.reviewId) {
          // Update existing review
          state.reviews = state.reviews.map(review => 
            review.id === action.payload.id ? action.payload : review
          )
        } else {
          state.reviews = [action.payload, ...state.reviews]
        }
        state.error = null
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.status = 'idle'
        state.reviews = state.reviews.filter(review => review.id !== action.payload)
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { clearReviews } = reviewSlice.actions

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId: number, { rejectWithValue }) => {
    try {
      await reviewApi.deleteReview(reviewId)
      return reviewId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete review')
    }
  }
)

export const voteReview = createAsyncThunk(
  'reviews/voteReview',
  async ({ reviewId, voteType }: { reviewId: number, voteType: 'up' | 'down' }, { rejectWithValue }) => {
    try {
      return await reviewApi.voteReview(reviewId, voteType)
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to vote on review')
    }
  }
)

export const reportReview = createAsyncThunk(
  'reviews/reportReview',
  async ({ reviewId, reason }: { reviewId: number, reason: string }, { rejectWithValue }) => {
    try {
      return await reviewApi.reportReview(reviewId, reason)
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to report review')
    }
  }
)

export const selectReviews = (state: RootState) => state.reviews.reviews
export const selectReviewStatus = (state: RootState) => state.reviews.status
export const selectReviewPagination = (state: RootState) => state.reviews.pagination
export const selectReviewError = (state: RootState) => state.reviews.error
export const selectReviewById = (id: number) => (state: RootState) => 
  state.reviews.reviews.find(review => review.id === id)

export default reviewSlice.reducer
