import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography
} from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { submitReview } from '../../store/slices/reviewSlice';
import { Review } from '../../types';

interface EditReviewDialogProps {
  open: boolean;
  onClose: () => void;
  review: Review;
}

const EditReviewDialog = ({ open, onClose, review }: EditReviewDialogProps) => {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('content', content);

      await dispatch(submitReview({
        reviewId: review.id,
        formData
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to update review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Review</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue || 0)}
            precision={0.5}
          />
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label="Review Content"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting || !content.trim() || rating === 0}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReviewDialog;