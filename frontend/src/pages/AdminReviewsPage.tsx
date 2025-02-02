import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { reviewApi, Review } from '../api/reviews'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  FormControlLabel,
  Switch,
  TextField,
  Pagination,
  Alert
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Check as ApproveIcon,
  Block as RejectIcon,
  Flag as ReportIcon
} from '@mui/icons-material'

interface ReviewDetailsDialogProps {
  review: Review | null
  open: boolean
  onClose: () => void
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onDelete: (id: number) => void
}

const ReviewDetailsDialog = ({
  review,
  open,
  onClose,
  onApprove,
  onReject,
  onDelete
}: ReviewDetailsDialogProps) => {
  if (!review) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Review Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Trip: {review.trip?.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            By: {review.user?.username}
          </Typography>
          <Rating value={review.rating} readOnly sx={{ my: 1 }} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={review.status || 'Pending'}
                color={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'error' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              />
            </Box>
            {review.content}
          </Typography>
          {review.images && review.images.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  style={{
                    maxWidth: 200,
                    maxHeight: 200,
                    marginRight: 8,
                    marginBottom: 8,
                    borderRadius: 4
                  }}
                />
              ))}
            </Box>
          )}
          {review.reports && review.reports > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This review has been reported {review.reports} times
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => {
            onDelete(review.id)
            onClose()
          }}
        >
          Delete
        </Button>
        <Button
          startIcon={<RejectIcon />}
          color="warning"
          onClick={() => {
            onReject(review.id)
            onClose()
          }}
        >
          Reject
        </Button>
        <Button
          startIcon={<ApproveIcon />}
          color="success"
          onClick={() => {
            onApprove(review.id)
            onClose()
          }}
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showReportedOnly, setShowReportedOnly] = useState(false)
  const { isAdmin, hasValidToken } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, meta } = await reviewApi.adminGetAllReviews({
        reported: showReportedOnly,
        page,
        per_page: 10
      })
      setReviews(data || [])
      setTotalPages(meta.last_page)
    } catch (err) {
      console.error('Error fetching admin reviews:', err)
      setError('Failed to fetch reviews')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [page, showReportedOnly, hasValidToken])

  const handleApprove = async (reviewId: number) => {
    try {
      await reviewApi.adminUpdateReview(reviewId, { status: 'approved' as const })
      fetchReviews()
    } catch (err) {
      setError('Failed to approve review')
    }
  }

  const handleReject = async (reviewId: number) => {
    try {
      await reviewApi.adminUpdateReview(reviewId, { status: 'rejected' as const })
      fetchReviews()
    } catch (err) {
      setError('Failed to reject review')
    }
  }

  const handleDelete = async (reviewId: number) => {
    try {
      await reviewApi.adminDeleteReview(reviewId)
      fetchReviews()
    } catch (err) {
      setError('Failed to delete review')
    }
  }

  const filteredReviews = reviews
    .filter(review => {
      const searchLower = searchTerm.toLowerCase()
      return review.content?.toLowerCase().includes(searchLower) ||
        review.user?.username?.toLowerCase().includes(searchLower) ||
        review.trip?.title?.toLowerCase().includes(searchLower)
    })

  if (!isAdmin) {
    return <Box p={3}>You do not have permission to access this page.</Box>
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Review Management
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showReportedOnly}
              onChange={(e) => setShowReportedOnly(e.target.checked)}
            />
          }
          label="Show Reported Only"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trip</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Reports</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.trip?.title}</TableCell>
                <TableCell>{review.user?.username}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly size="small" />
                </TableCell>
                <TableCell>
                  {review.content?.length > 100
                    ? `${review.content?.substring(0, 100)}...`
                    : review.content}
                </TableCell>
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
                  {review.status ? (
                    <Chip
                      label={review.status}
                      color={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'error' : 'default'}
                      size="small"
                    />
                  ) : (
                    <Chip label="Pending" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedReview(review)}
                    title="View Details"
                  >
                    <ReportIcon />
                  </IconButton>
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

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <ReviewDetailsDialog
        review={selectedReview}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    </Box>
  )
}

export default AdminReviewsPage