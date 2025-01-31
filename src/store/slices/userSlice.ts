import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from '../../api/users'
import { User } from '../../types/auth'

interface ProfileUpdate {
  username?: string
  experience_level?: string
  preferred_routes?: string[]
  motorcycle_details?: {
    make: string
    model: string
    year: number
  }
  avatar?: File
}

interface UserState {
  profile: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UserState = {
  profile: null,
  status: 'idle',
  error: null
}

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await userApi.getProfile()
    return response.data
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
  }
})

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: ProfileUpdate, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(data)
      return response.data
    } catch (error) {
      return rejectWithValue('Failed to update profile')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch profile'
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
  }
})

export default userSlice.reducer
