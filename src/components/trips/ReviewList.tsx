import { useEffect } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Rating,
  ImageList,
  ImageListItem,
  Paper,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchReviews, selectReviews, selectReviewStatus, selectReviewError } from '../../store/slices/reviewSlice'

interface ReviewListProps {
  tripId: number
}

const ReviewList = ({ tripId }: ReviewListProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch<AppDispatch>()
  const reviews = useSelector(selectReviews)
  const status = useSelector(selectReviewStatus)
  const error = useSelector(selectReviewError)

  useEffect(() => {
    dispatch(fetchReviews(tripId))
  }, [tripId])

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No reviews yet. Be the first to review this trip!
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {reviews.map((review, index) => (
        <Box key={review.id}>
          {index > 0 && <Divider sx={{ my: 3 }} />}
          <Box sx={{ mb: 3 }}>
            {/* Review Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={review.user.avatar}
                alt={review.user.username}
                sx={{ width: 40, height: 40, mr: 2 }}
              >
                {review.user.username[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {review.user.username}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Review Content */}
            <Typography variant="body1" sx={{ mb: 2 }}>
              {review.content}
            </Typography>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <ImageList
                variant="masonry"
                cols={isSmallScreen ? 2 : 3}
                gap={8}
                sx={{ mb: 0 }}
              >
                {review.images.map((image, imgIndex) => (
                  <ImageListItem key={imgIndex}>
                    <img
                      src={image}
                      alt={`Review image ${imgIndex + 1}`}
                      loading="lazy"
                      style={{ borderRadius: `${theme.shape.borderRadius}px` }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default ReviewList
