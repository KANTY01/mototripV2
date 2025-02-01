import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authApiSlice } from '../../api/auth'
import { PURGE } from 'redux-persist'
import { User } from '../../types/auth'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isLoading = false
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        Object.assign(state, initialState)
      })
      .addMatcher(
        authApiSlice.endpoints.login.matchPending,
        (state) => {
          state.isLoading = true
        }
      )
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.token
          state.user = payload.user
          state.isAuthenticated = true
          state.isLoading = false
        }
      )
      .addMatcher(
        authApiSlice.endpoints.login.matchRejected,
        (state, { error }) => {
          state.isLoading = false
          state.error = error.message || 'Login failed'
        }
      )
  }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
