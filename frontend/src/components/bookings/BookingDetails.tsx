import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import { format } from 'date-fns';
import { BookingResponse, bookingsApi } from '../../services/api/bookings';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await bookingsApi.getBooking(id);
        setBooking(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      await bookingsApi.cancelBooking(booking.id);
      // Refresh booking details
      const updatedBooking = await bookingsApi.getBooking(booking.id);
      setBooking(updatedBooking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!booking) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Booking not found
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Booking Details
        </Typography>
        <Chip
          label={booking.status}
          color={getStatusColor(booking.status) as any}
          size="medium"
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Information
              </Typography>
              <Typography variant="body1">
                Booking ID: #{booking.id.slice(0, 8)}
              </Typography>
              <Typography variant="body1">
                Date: {format(new Date(booking.preferredDate), 'PPP')}
              </Typography>
              <Typography variant="body1">
                Number of Participants: {booking.participants}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <Typography variant="body1">
                Created: {format(new Date(booking.createdAt), 'PPP pp')}
              </Typography>
              <Typography variant="body1">
                Last Updated: {format(new Date(booking.updatedAt), 'PPP pp')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button
          variant="outlined"
          onClick={() => navigate('/bookings')}
        >
          Back to Bookings
        </Button>
        {booking.status !== 'cancelled' && (
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelBooking}
          >
            Cancel Booking
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default BookingDetails;
