import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authApiSlice } from '../../api/auth'
import { User } from '../../types/auth'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.token
          state.user = payload.user
          state.isAuthenticated = true
        }
      )
      .addMatcher(
        authApiSlice.endpoints.logout.matchFulfilled,
        (state) => {
          state.token = null
          state.user = null
          state.isAuthenticated = false
        }
      )
  }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
