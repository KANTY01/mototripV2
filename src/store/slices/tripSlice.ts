import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import api from '../../api/axiosConfig'

import { Trip } from '../../types'

interface TripFilters {
  difficulty?: string
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
      const response = await api.get('/trips')
      return response.data
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
      const response = await api.get(`/trips/${tripId}`)
      return response.data
    } catch (error) {
      return rejectWithValue('Failed to fetch trip')
    }
  }
)

// Create the filterTrips thunk
export const filterTrips = createAsyncThunk(
  'trips/filterTrips',
  async (filters: TripFilters, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      let trips = state.trips.trips

      if (filters.difficulty) {
        trips = trips.filter(t => t.difficulty === filters.difficulty)
      }
      if (filters.minDistance) {
        trips = trips.filter(t => t.distance >= filters.minDistance!)
      }
      if (filters.maxDistance) {
        trips = trips.filter(t => t.distance <= filters.maxDistance!)
      }
      if (filters.startDate) {
        trips = trips.filter(t => new Date(t.start_date) >= new Date(filters.startDate!))
      }
      if (filters.endDate) {
        trips = trips.filter(t => new Date(t.end_date) <= new Date(filters.endDate!))
      }

      return trips
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
