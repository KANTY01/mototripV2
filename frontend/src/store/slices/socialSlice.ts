import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { socialApi } from '../../api/social'

interface SocialState {
  feed: any[]
  followers: any[]
  following: any[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: SocialState = {
  feed: [],
  followers: [],
  following: [],
  status: 'idle',
  error: null
}

export const fetchUserFeed = createAsyncThunk(
  'social/fetchUserFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await socialApi.getUserFeed()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }
)

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFeed.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserFeed.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.feed = action.payload
      })
      .addCase(fetchUserFeed.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch feed'
      })
  }
})

export default socialSlice.reducer
