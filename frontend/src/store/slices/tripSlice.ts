import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { tripApi } from '../../api/trips'

import { Trip } from '../../types'

interface TripFilters {
  difficulty?: 'easy' | 'moderate' | 'hard'
  minDistance?: number
  maxDistance?: number
  startDate?: string
  endDate?: string
}

interface TripState {
  trips: Trip[]
  selectedTrip: Trip | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

// Define initial state
const initialState: TripState = {
  trips: [],
  selectedTrip: null,
  status: 'idle',
  error: null
}

// Create the fetchTrips thunk
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tripApi.getTrips()
      return response.trips
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch trips'
      )
    }
  }
)

// Create the fetchTrip thunk
export const fetchTrip = createAsyncThunk(
  'trips/fetchTrip',
  async (tripId: number, { rejectWithValue }) => {
    try {
      return await tripApi.getTrip(tripId)
    } catch (err: any) {
      // If it's a premium trip, try to get premium content
      if (err.response?.status === 403 && err.response?.data?.message?.includes('premium')) {
        try {
          return await tripApi.getPremiumContent(tripId)
        } catch (error: any) {
          const message = error.response?.data?.message || error.message
          console.error('Failed to fetch premium trip:', message)
          return rejectWithValue(message)
        }
      }
      console.error('Failed to fetch trip:', err.message)
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch trip')
    }
  }
)

// Create the filterTrips thunk
export const filterTrips = createAsyncThunk(
  'trips/filterTrips',
  async (filters: TripFilters, { rejectWithValue }) => {
    try {
      const response = await tripApi.getTrips(filters)
      // Let the backend handle the filtering
      return response.trips
    } catch (error) {
      return rejectWithValue('Failed to filter trips')
    }
  }
)

// Create the slice
const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    resetTrips: (state) => {
      state.trips = []
      state.selectedTrip = null
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTrips cases
      .addCase(fetchTrips.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = 'idle'
        state.trips = action.payload
        state.error = null
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        console.error('Failed to fetch trips:', action.payload)
      })
      // fetchTrip cases
      .addCase(fetchTrip.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTrip.fulfilled, (state, action) => {
        state.status = 'idle'
        state.selectedTrip = action.payload
        state.error = null
      })
      .addCase(fetchTrip.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        if (typeof state.error === 'string' && state.error.includes('Premium')) {
          console.warn('Premium trip access denied:', state.error)
        } else if (typeof state.error === 'string') {
          console.error('Failed to fetch trip:', state.error)
        } else {
          console.error('Unexpected error type:', state.error)
        }
      })
      // filterTrips cases
      .addCase(filterTrips.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(filterTrips.fulfilled, (state, action) => {
        state.status = 'idle'
        state.trips = action.payload
        state.error = null
      })
      .addCase(filterTrips.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  }
})

// Export actions
export const { resetTrips } = tripSlice.actions

// Export selectors
export const selectTrips = (state: RootState) => state.trips.trips
export const selectSelectedTrip = (state: RootState) => state.trips.selectedTrip
export const selectTripStatus = (state: RootState) => state.trips.status
export const selectTripError = (state: RootState) => state.trips.error

// Export reducer as default
export default tripSlice.reducer
