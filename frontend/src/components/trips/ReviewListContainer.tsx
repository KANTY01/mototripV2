import { useEffect, useState } from 'react'
import { Box, CircularProgress, Alert, Paper } from '@mui/material'
import { useAppSelector } from '../../store/hooks'
import ReviewList from './ReviewList'
import { Review } from '../../types'
import { reviewApi } from '../../api/reviews'

interface ReviewListContainerProps {
  userOnly?: boolean
}

const ReviewListContainer = ({ userOnly }: ReviewListContainerProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const currentUser = useAppSelector(state => state.auth.user)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        if (userOnly && !currentUser?.id) {
          throw new Error('No user ID available')
        }
        // For user-only reviews, we'll fetch only the current user's reviews
        // Otherwise, we'll fetch reviews for the trip
        const response = userOnly && currentUser?.id 
          ? await reviewApi.adminGetAllReviews({ userId: currentUser.id })
          : []
        // The tripId will be handled by the ReviewList component itself
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userOnly, currentUser])

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
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
      <Paper
        elevation={0}
        sx={{ p: 3, border: 1, borderColor: 'divider' }}
      >
        <Alert severity="error">{error}</Alert>
      </Paper>
    )
  }

  // Pass a dummy tripId since we're showing user reviews
  return <ReviewList tripId={0} />
}

export default ReviewListContainer