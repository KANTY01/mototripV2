import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CalendarMonth,
  Group,
  MonetizationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { bookingsApi, BookingResponse } from '../../services/api/bookings';

interface BookingListProps {
  tripId?: string; // Optional: to show bookings for a specific trip
}

const BookingList: React.FC<BookingListProps> = ({ tripId }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = tripId
        ? await bookingsApi.getTripBookings(tripId, page)
        : await bookingsApi.getUserBookings(page);

      setBookings(response.bookings);
      setTotalPages(Math.ceil(response.total / response.perPage));
    } catch (err) {
      setError('Failed to load bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, tripId]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setLoading(true);
      await bookingsApi.cancelBooking(selectedBooking.id);
      await fetchBookings(); // Refresh the list
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'error',
    } as const;
    return colors[status as keyof typeof colors] || 'default';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
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

  if (!loading && bookings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No bookings found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking.id}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" gutterBottom>
                    {booking.trip.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip
                      label={booking.status.toUpperCase()}
                      color={getStatusColor(booking.status)}
                    />
                    <Chip
                      icon={<Group />}
                      label={`${booking.participants} participants`}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonth color="action" />
                      <Typography>
                        Preferred Date: {formatDate(booking.preferredDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MonetizationOn color="action" />
                      <Typography>
                        Total: ${booking.trip.price * booking.participants}
                      </Typography>
                    </Box>
                  </Box>
                  {booking.specialRequests && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Special Requests:
                      </Typography>
                      <Typography color="text.secondary">
                        {booking.specialRequests}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      height: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/trips/${booking.tripId}`)}
                    >
                      View Trip
                    </Button>
                    {booking.status !== 'cancelled' && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setCancelDialogOpen(true);
                        }}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

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

      {/* Cancel Booking Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={loading}
          >
            No, Keep Booking
          </Button>
          <Button
            onClick={handleCancelBooking}
            color="error"
            disabled={loading}
          >
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingList;
