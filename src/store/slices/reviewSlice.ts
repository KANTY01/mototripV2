import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Review } from '../../types'

interface ReviewState {
  reviews: Review[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: ReviewState = {
  reviews: [],
  status: 'idle',
  error: null
}

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (tripId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/reviews`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      return await response.json()
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reviews')
    }
  }
)

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ 
    tripId, 
    formData 
  }: { 
    tripId: number, 
    formData: FormData 
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/reviews`, {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error('Failed to submit review')
      }
      return await response.json()
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
        state.reviews = action.payload
        state.error = null
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.status = 'idle'
        state.reviews = [action.payload, ...state.reviews]
        state.error = null
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { clearReviews } = reviewSlice.actions

export const selectReviews = (state: RootState) => state.reviews.reviews
export const selectReviewStatus = (state: RootState) => state.reviews.status
export const selectReviewError = (state: RootState) => state.reviews.error

export default reviewSlice.reducer
