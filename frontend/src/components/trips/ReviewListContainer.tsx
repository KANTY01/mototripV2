import { useEffect } from 'react'
import { Box, CircularProgress, Alert, Paper } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import ReviewList from './ReviewList'
import { 
  fetchUserReviews,
  selectReviews,
  selectReviewStatus,
  selectReviewError
} from '../../store/slices/reviewSlice'

interface ReviewListContainerProps {
  userOnly?: boolean
}

const ReviewListContainer = ({ userOnly }: ReviewListContainerProps) => {
  const currentUser = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectReviewStatus)
  const error = useAppSelector(selectReviewError)

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userOnly) {
        return; // Don't fetch if not in user-only mode
      }

      try {        
        if (currentUser?.id) {
          await dispatch(fetchUserReviews(currentUser.id)).unwrap()
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
      }
    }
    fetchReviews()
  }, [userOnly, currentUser, dispatch])

  if (status === 'loading') {
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

  return <ReviewList tripId={0} />
}

export default ReviewListContainer