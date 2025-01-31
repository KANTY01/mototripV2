import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/authSlice'
import tripReducer from './slices/tripSlice'
import userReducer from './slices/userSlice'
import reviewReducer from './slices/reviewSlice'
import socialReducer from './slices/socialSlice'
import { authApiSlice } from '../api/auth'
import { adminApiSlice } from '../api/admin'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    user: userReducer,
    reviews: reviewReducer,
    social: socialReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(adminApiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
