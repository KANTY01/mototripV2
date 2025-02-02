import { useEffect, useState } from 'react'
import { Box, CircularProgress, Alert, Paper, Pagination } from '@mui/material'
import { useAppSelector } from '../../store/hooks'
import { tripApi } from '../../api/trips'
import UserTripList from './UserTripList'
import { Trip, TripLocation } from '../../types'

interface UserTripsContainerProps {
  userId?: number
  favorites?: boolean
}

const mapApiTripToTrip = (apiTrip: any): Trip => ({
  ...apiTrip,
  is_premium: apiTrip.is_premium || false,
  is_favorite: apiTrip.is_favorite || false,
  location: apiTrip.location || {
    latitude: 0,
    longitude: 0
  } as TripLocation
})

const UserTripsContainer = ({ userId, favorites }: UserTripsContainerProps) => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const currentUser = useAppSelector(state => state.auth.user)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true)
        const userIdToFetch = userId || currentUser?.id
        if (!userIdToFetch) {
          throw new Error('No user ID available')
        }
        const filters = userId ? { userId } : undefined
        const response = await tripApi.getTrips(filters, page, itemsPerPage)
        
        const mappedTrips = response.trips.map(mapApiTripToTrip)
        // If favorites is true, filter only favorited trips
        const filteredTrips = favorites
          ? mappedTrips.filter(trip => trip.is_favorite)
          : mappedTrips
        
        setTotalPages(response.pagination.total_pages)
        setTrips(filteredTrips)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trips')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [userId, currentUser, favorites, page])

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider' }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Paper>
    )
  }

  return (
    <Box>
      <UserTripList trips={trips} />
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  )
}
export default UserTripsContainer