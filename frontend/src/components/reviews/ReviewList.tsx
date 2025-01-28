import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Divider,
  CircularProgress,
  Pagination,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../hooks/useAuth';
import { reviewsApi, ReviewResponse, ReviewAttributes } from '../../services/api/reviews';
import ReviewForm from './ReviewForm';
import { UserRole } from '../../types/auth';

interface ReviewListProps {
  tripId: string;
  onReviewUpdated?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ tripId, onReviewUpdated }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewResponse | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsApi.getReviews(tripId, page);
      setReviews(response.reviews);
      setTotalPages(Math.ceil(response.total / response.perPage));
    } catch (err) {
      setError('Failed to load reviews. Please try again later.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tripId, page]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && page === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  const handleEdit = (review: ReviewResponse) => {
    setEditingReview(review);
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      setLoading(true);
      await reviewsApi.deleteReview(tripId, reviewToDelete.id);
      await fetchReviews();
      onReviewUpdated?.();
    } catch (err) {
      setError('Failed to delete review. Please try again.');
      console.error('Error deleting review:', err);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleUpdateReview = async (updatedReview: ReviewAttributes) => {
    if (!editingReview) return;

    try {
      setLoading(true);
      await reviewsApi.updateReview(tripId, editingReview.id, updatedReview);
      await fetchReviews();
      setEditingReview(null);
      onReviewUpdated?.();
    } catch (err) {
      setError('Failed to update review. Please try again.');
      console.error('Error updating review:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No reviews yet. Be the first to review this trip!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {reviews.map((review, index) => (
        <React.Fragment key={review.id}>
          <Box sx={{ py: 2, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pr: 8 }}>
              <Avatar
                src={review.user.avatarUrl}
                alt={review.user.username}
                sx={{ mr: 2 }}
              >
                {review.user.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {review.user.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(review.createdAt)}
                </Typography>
              </Box>
              {user && (user.id === review.userId || user.role === 'ADMIN') && (
                <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(review)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setReviewToDelete(review);
                      setDeleteDialogOpen(true);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            
            <Box sx={{ ml: 7 }}>
              <Rating value={review.rating} readOnly precision={0.5} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
            </Box>
          </Box>
          {index < reviews.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Review Dialog */}
      {editingReview && (
        <Dialog
          open={Boolean(editingReview)}
          onClose={() => setEditingReview(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Review</DialogTitle>
          <DialogContent>
            <ReviewForm
              tripId={tripId}
              initialRating={editingReview.rating}
              initialComment={editingReview.comment}
              onSubmit={handleUpdateReview}
              onCancel={() => setEditingReview(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ReviewList;
