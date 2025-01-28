import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { bookingsApi, BookingAttributes } from '../../services/api/bookings';

interface BookingFormProps {
  tripId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ tripId, onSubmit, onCancel }) => {
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!preferredDate) {
      setError('Please select a preferred date');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const bookingData: BookingAttributes = {
        tripId,
        participants,
        preferredDate: preferredDate.toISOString(),
        specialRequests: specialRequests.trim() || undefined,
      };

      await bookingsApi.createBooking(bookingData);
      onSubmit();
    } catch (err) {
      setError('Failed to submit booking. Please try again.');
      console.error('Error submitting booking:', err);
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

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Number of Participants</InputLabel>
        <Select
          value={participants}
          label="Number of Participants"
          onChange={(e) => setParticipants(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Preferred Date *
        </Typography>
        <DatePicker
          value={preferredDate}
          onChange={(date) => setPreferredDate(date)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: Boolean(error && !preferredDate),
              helperText: error && !preferredDate ? 'Please select a date' : '',
            },
          }}
        />
      </Box>

      <TextField
        fullWidth
        label="Special Requests (Optional)"
        multiline
        rows={4}
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
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
          Book Trip
        </Button>
      </Box>
    </Box>
  );
};

export default BookingForm;
