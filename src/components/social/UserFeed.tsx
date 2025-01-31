import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserFeed } from '../../store/slices/socialSlice'
import { RootState } from '../../store/store'
import { Box, Typography, CircularProgress } from '@mui/material'
import TripCard from '../trips/TripCard'

const UserFeed = () => {
  const dispatch = useDispatch()
  const { feed, status } = useSelector((state: RootState) => state.social)

  useEffect(() => {
    dispatch(fetchUserFeed())
  }, [dispatch])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Feed
      </Typography>

      {status === 'loading' && <CircularProgress />}

      {feed.map((trip) => (
        <Box key={trip.id} sx={{ mb: 3 }}>
          <TripCard trip={trip} onViewDetails={() => {}} />
        </Box>
      ))}
    </Box>
  )
}

export default UserFeed
