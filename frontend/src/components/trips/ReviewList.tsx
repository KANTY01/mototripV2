import { useEffect, useState } from 'react'
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
  useMediaQuery,
  Pagination,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { 
  fetchReviews, 
  selectReviews, 
  selectReviewStatus, 
  selectReviewError,
  selectReviewPagination 
} from '../../store/slices/reviewSlice'
import { useAuth } from '../../hooks/useAuth'
import ReviewCard from './ReviewCard'
import { Review } from '../../types'

interface ReviewListProps {
  tripId: number
  onEdit?: (review: Review) => void
}

type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating'

const ReviewList = ({ tripId, onEdit }: ReviewListProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const reviews = useAppSelector(selectReviews)
  const status = useAppSelector(selectReviewStatus)
  const error = useAppSelector(selectReviewError)
  const pagination = useAppSelector(selectReviewPagination)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortOption>('newest')
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    const loadReviews = async () => {
      try {
        await dispatch(fetchReviews({ 
          tripId, 
          page, 
          sort,
          perPage: 10 
        })).unwrap()
      } catch (err: any) {
        console.error('Failed to load reviews:', err)
      }
    }
    loadReviews()
  }, [dispatch, tripId, page, sort])

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (status === 'failed' && error) {
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

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSort(event.target.value as SortOption)
  }

  return (
    <Paper 
      elevation={0} 
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider'
      }}
    >
      {/* Sorting Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.primary">Reviews</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Sort by:
          </Typography>
          <Select
            id="sort-select"
            size="small"
            value={sort}
            onChange={handleSortChange}
            sx={{
              minWidth: 150,
              '& .MuiSelect-select': {
                py: 1
              }
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="highest_rating">Highest Rating</MenuItem>
            <MenuItem value="lowest_rating">Lowest Rating</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Reviews List */}
      {reviews.map((review, index) => (
        <Box key={review.id} sx={{ mb: 3 }}>
          {index > 0 && <Divider sx={{ my: 3 }} />}
          <ReviewCard 
            review={review}
            onEdit={() => onEdit?.(review)}
            isOwner={user?.id ? Number(user.id) === review.user_id : false}
            isAdmin={isAdmin}
          />
        </Box>
      ))}
      {reviews.length === 0 && (
        <Typography 
          color="text.secondary" 
          textAlign="center" 
          py={4}
          variant="body1"
        >
          No reviews yet. Be the first to review this trip!
        </Typography>
      )}

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} component="nav">
        {pagination && pagination.last_page > 1 && (
          <Pagination 
            count={pagination.last_page}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'text.secondary',
                borderColor: 'divider'
              }
            }}
          />
        )}
      </Box>
    </Paper>
  )
}

export default ReviewList
