import { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { reviewApi, Review } from '../api/reviews'
import { RootState } from '../store/store'
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Paper, 
  Rating, 
  Avatar, 
  Grid, 
  Pagination, 
  Divider, 
  Chip,
  Button 
} from '@mui/material'
import { format } from 'date-fns'

interface ReviewsTabPanelProps {
  reviews: Review[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onRetry: () => void
}

const ReviewsTabPanel = memo(({ 
  reviews, 
  loading, 
  error, 
  page, 
  totalPages, 
  onPageChange,
  onRetry 
}: ReviewsTabPanelProps) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
      </Box>
    )
  }

  if (!reviews.length) {
    return (
      <Box p={4}>
        <Typography>No reviews found.</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {reviews.map((review) => (
        <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar 
                src={review.user?.avatar} 
                alt={review.user?.username || 'User'}
                sx={{ width: 48, height: 48 }}
              >
                {(review.user?.username?.[0] || '?').toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.trip?.title || 'Untitled Trip'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(review.created_at), 'MMM d, yyyy')}
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly precision={0.5} sx={{ my: 1 }} />
              {review.status && (
                <Chip
                  label={review.status}
                  color={review.status === 'approved' ? 'success' : 'error'}
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}
              <Typography>{review.content}</Typography>
              {review.images && review.images.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {review.images.map((image: string, index: number) => (
                      <Grid item key={index}>
                        <img 
                          src={image} 
                          alt={`Review image ${index + 1}`} 
                          style={{ 
                            width: 100, 
                            height: 100, 
                            objectFit: 'cover',
                            borderRadius: 4
                          }} 
                          loading="lazy"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => onPageChange(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
})

ReviewsTabPanel.displayName = 'ReviewsTabPanel'

const MyReviews = () => {
  const [tabValue, setTabValue] = useState(0)
  const [myReviews, setMyReviews] = useState<Review[]>([])
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([])
  const [myReviewsPage, setMyReviewsPage] = useState(1)
  const [receivedReviewsPage, setReceivedReviewsPage] = useState(1)
  const [myReviewsTotalPages, setMyReviewsTotalPages] = useState(1)
  const [receivedReviewsTotalPages, setReceivedReviewsTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const user = useSelector((state: RootState) => state.auth.user)
  
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/reviews')
    }
  }, [user, navigate])

  const fetchMyReviews = async (page: number) => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const response = await reviewApi.getUserReviews(user.id, page)
      setMyReviews(response.data.filter(review => !review.status || review.status === 'approved'))
      setMyReviewsTotalPages(response.meta.last_page)
    } catch (err) {
      setError('Failed to fetch your reviews')
      console.error('Error fetching user reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReceivedReviews = async (page: number) => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const response = await reviewApi.getTripOwnerReviews(user.id, page)
      setReceivedReviews(response.data.filter(review => review.status === 'approved'))
      setReceivedReviewsTotalPages(response.meta.last_page)
    } catch (err) {
      setError('Failed to fetch reviews on your trips')
      console.error('Error fetching trip owner reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      if (tabValue === 0) {
        fetchMyReviews(myReviewsPage)
      } else {
        fetchReceivedReviews(receivedReviewsPage)
      }
    }
  }, [tabValue, myReviewsPage, receivedReviewsPage, user])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleRetry = () => {
    if (tabValue === 0) {
      fetchMyReviews(myReviewsPage)
    } else {
      fetchReceivedReviews(receivedReviewsPage)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Reviews
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Reviews I've Written" />
          <Tab label="Reviews on My Trips" />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <ReviewsTabPanel
          reviews={myReviews}
          loading={loading}
          error={error}
          page={myReviewsPage}
          totalPages={myReviewsTotalPages}
          onPageChange={setMyReviewsPage}
          onRetry={handleRetry}
        />
      ) : (
        <ReviewsTabPanel
          reviews={receivedReviews}
          loading={loading}
          error={error}
          page={receivedReviewsPage}
          totalPages={receivedReviewsTotalPages}
          onPageChange={setReceivedReviewsPage}
          onRetry={handleRetry}
        />
      )}
    </Box>
  )
}

export default MyReviews