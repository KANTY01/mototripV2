import { useState, useEffect } from 'react'
import { reviewApi, Review } from '../../api/reviews'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Alert
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Check as ApproveIcon,
  Block as RejectIcon,
  Flag as ReportIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const DashboardReviewWidget = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchReportedReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await reviewApi.adminGetAllReviews({
        reported: true,
        page: 1,
        perPage: 5
      })
      setReviews(response.data)
    } catch (err) {
      setError('Failed to fetch reviews')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportedReviews()
  }, [])

  const handleApprove = async (reviewId: number) => {
    try {
      await reviewApi.adminUpdateReview(reviewId, { status: 'approved' })
      fetchReportedReviews()
    } catch (err) {
      setError('Failed to approve review')
    }
  }

  const handleReject = async (reviewId: number) => {
    try {
      await reviewApi.adminUpdateReview(reviewId, { status: 'rejected' })
      fetchReportedReviews()
    } catch (err) {
      setError('Failed to reject review')
    }
  }

  const handleDelete = async (reviewId: number) => {
    try {
      await reviewApi.adminDeleteReview(reviewId)
      fetchReportedReviews()
    } catch (err) {
      setError('Failed to delete review')
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  if (reviews.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">No reported reviews</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" color="text.secondary">
          Recent Reported Reviews
        </Typography>
        <Button
          size="small"
          endIcon={<OpenInNewIcon />}
          onClick={() => navigate('/admin/reviews')}
        >
          View All
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Trip</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Reports</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.trip?.title}</TableCell>
                <TableCell>{review.user?.username}</TableCell>
                <TableCell>
                  {review.reports && review.reports > 0 ? (
                    <Chip
                      icon={<ReportIcon />}
                      label={review.reports}
                      color="warning"
                      size="small"
                    />
                  ) : (
                    '0'
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleApprove(review.id)}
                    title="Approve"
                  >
                    <ApproveIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => handleReject(review.id)}
                    title="Reject"
                  >
                    <RejectIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(review.id)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default DashboardReviewWidget