import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Rating,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  LocationOn,
  DateRange,
  Group,
  MonetizationOn,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { TripResponse } from '../../services/api/trips';
import { ReviewAttributes, reviewsApi } from '../../services/api/reviews';
import BookingForm from '../bookings/BookingForm';
import ReviewList from '../reviews/ReviewList';
import ReviewForm from '../reviews/ReviewForm';

interface TripDetailsProps {
  trip: TripResponse;
  onBook?: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip, onBook }) => {
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      active: 'success',
      completed: 'info',
      cancelled: 'error',
    } as const;
    return colors[status as keyof typeof colors] || 'default';
  };

  const handleBookingSubmit = () => {
    setShowBookingForm(false);
    if (onBook) onBook();
  };

  // Check if user has already reviewed this trip
  useEffect(() => {
    const checkUserReview = async () => {
      if (!user) return;
      try {
        const response = await reviewsApi.getReviews(trip.id.toString());
        const hasReviewed = response.reviews.some(review => review.userId === user.id);
        setUserHasReviewed(hasReviewed);
      } catch (err) {
        console.error('Error checking user review:', err);
      }
    };
    checkUserReview();
  }, [trip.id, user]);

  const handleReviewSubmit = async (data: ReviewAttributes): Promise<void> => {
    try {
      await reviewsApi.createReview(data);
      setShowReviewForm(false);
      setUserHasReviewed(true);
      setReviewError(null);
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review. Please try again.');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${trip.imageUrl || '/motorcycle-bg.jpg'})`,
          minHeight: '400px',
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        
        {/* Content */}
        <Grid container>
          <Grid item md={8}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography variant="h3" color="inherit" gutterBottom>
                {trip.title}
              </Typography>
              <Chip
                label={trip.status.toUpperCase()}
                color={getStatusColor(trip.status)}
                sx={{ mb: 2 }}
              />
              <Typography variant="h5" color="inherit" paragraph>
                {trip.description}
              </Typography>
              {trip.rating !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={trip.rating} readOnly precision={0.5} />
                  <Typography variant="body2">({trip.rating})</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Details Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Trip Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Trip Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn color="primary" />
                  <Typography>{trip.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DateRange color="primary" />
                  <Typography>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Group color="primary" />
                  <Typography>
                    {trip.availableSpots} spots available / {trip.capacity} total
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MonetizationOn color="primary" />
                  <Typography>${trip.price}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              {user && trip.status === 'active' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowBookingForm(true)}
                  disabled={trip.availableSpots === 0}
                >
                  Book Now
                </Button>
              )}
              {user && !userHasReviewed && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write Review
                </Button>
              )}
              {user && userHasReviewed && (
                <Button
                  variant="outlined"
                  disabled
                  sx={{ cursor: 'not-allowed' }}
                >
                  Already Reviewed
                </Button>
              )}
            </Box>

            {trip.availableSpots === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This trip is fully booked
              </Alert>
            )}
          </Paper>

          {/* Reviews Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Reviews
            </Typography>
            {reviewError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {reviewError}
              </Alert>
            )}
            <ReviewList 
              tripId={trip.id.toString()} 
              onReviewUpdated={() => setUserHasReviewed(true)}
            />
          </Paper>
        </Grid>

        {/* Organizer Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Organized by
            </Typography>
            <Typography>{trip.organizer.username}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog
        open={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Book Trip</DialogTitle>
        <DialogContent>
          <BookingForm
            tripId={trip.id}
            onSubmit={handleBookingSubmit}
            onCancel={() => setShowBookingForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        open={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <ReviewForm
            tripId={trip.id.toString()}
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowReviewForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TripDetails;
