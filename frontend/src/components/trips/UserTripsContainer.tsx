import { useEffect, useState } from 'react'
import { Box, CircularProgress, Alert, Paper } from '@mui/material'
import { useAppSelector } from '../../store/hooks'
import { userApi } from '../../api/users'
import UserTripList from './UserTripList'
import { Trip } from '../../types'

interface UserTripsContainerProps {
  userId?: number
  favorites?: boolean
}

const UserTripsContainer = ({ userId, favorites }: UserTripsContainerProps) => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const currentUser = useAppSelector(state => state.auth.user)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true)
        const userIdToFetch = userId || currentUser?.id
        if (!userIdToFetch) {
          throw new Error('No user ID available')
        }
        const response = await userApi.getUserTrips(userIdToFetch)
        // If favorites is true, filter only favorited trips
        const filteredTrips = favorites 
          ? response.filter(trip => trip.is_favorite)
          : response
        setTrips(filteredTrips)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trips')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [userId, currentUser, favorites])

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

  return <UserTripList trips={trips} />
}

export default UserTripsContainer