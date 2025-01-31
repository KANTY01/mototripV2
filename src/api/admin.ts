import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import api from './axiosConfig'
import { Trip } from '../types'
import { User } from '../types/user/user'

interface CreateTripData {
  title: string
  description: string
  difficulty: string
  distance: number
  start_date: string
  end_date: string
  images?: string[]
}
export interface Statistic {
  id: number
  category: string
  name: string
  value: number
  details?: Record<string, any>
}

interface UpdateTripData extends Partial<CreateTripData> {
  id: number
}

// RTK Query API
export const adminApiSlice = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Trips', 'Users', 'Statistics', 'Roles'],
  endpoints: (builder) => ({
    getStatistics: builder.query<Statistic[], void>({
      query: () => '/admin/statistics',
      providesTags: ['Statistics']
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/admin/users',
      providesTags: ['Users']
    }),
    getTrips: builder.query({
      query: () => '/admin/trips',
      providesTags: ['Trips']
    }),
    createTrip: builder.mutation<Trip, CreateTripData>({
      query: (tripData) => ({
        url: '/admin/trips',
        method: 'POST',
        body: tripData
      }),
      invalidatesTags: ['Trips']
    }),
    updateTrip: builder.mutation<Trip, UpdateTripData>({
      query: (tripData) => ({
        url: `/admin/trips/${tripData.id}`,
        method: 'PUT',
        body: tripData
      }),
      invalidatesTags: ['Trips']
    }),
    deleteTrips: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: '/admin/trips',
        method: 'DELETE',
        body: { ids }
      }),
      invalidatesTags: ['Trips']
    }),
    deleteUsers: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: '/admin/users',
        method: 'DELETE',
        body: { ids }
      }),
      invalidatesTags: ['Users']
    }),
    updateUserRole: builder.mutation<void, { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PUT',
        body: { role }
      }),
      invalidatesTags: ['Users', 'Roles']
    }),
    getTripById: builder.query<Trip, { id: number }>({
      query: (id) => `/admin/trips/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: 'Trips', id }]
    })
  }),
})

export const {
  useGetUsersQuery,
  useGetStatisticsQuery,
  useGetTripsQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripsMutation,
  useDeleteUsersMutation,
  useGetTripByIdQuery,
  useUpdateUserRoleMutation
} = adminApiSlice
