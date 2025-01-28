import React, { useState } from 'react';
import {
  Box,
  TextField,
  Rating,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { reviewsApi, ReviewAttributes } from '../../services/api/reviews';

interface ReviewFormProps {
  tripId: string;
  onSubmit: (data: ReviewAttributes) => Promise<void>;
  onCancel: () => void;
  initialRating?: number;
  initialComment?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  tripId, 
  onSubmit, 
  onCancel,
  initialRating = null,
  initialComment = ''
}) => {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Please provide a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide a comment');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const reviewData: ReviewAttributes = {
        tripId,
        rating,
        comment: comment.trim(),
      };

      await onSubmit(reviewData);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography component="legend">Rating *</Typography>
        <Rating
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          precision={0.5}
          size="large"
        />
      </Box>

      <TextField
        fullWidth
        label="Review"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        error={Boolean(error && !comment.trim())}
        helperText={error && !comment.trim() ? 'Please provide a comment' : ''}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
        >
          {initialRating ? 'Update Review' : 'Submit Review'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewForm;
