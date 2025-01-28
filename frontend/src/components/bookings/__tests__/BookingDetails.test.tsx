import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/dom';
import { waitFor } from '@testing-library/dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookingDetails from '../BookingDetails';
import { bookingsApi, BookingResponse } from '../../../services/api/bookings';

// Mock the API calls
jest.mock('../../../services/api/bookings', () => ({
  bookingsApi: {
    getBooking: jest.fn(),
    cancelBooking: jest.fn()
  }
}));

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('BookingDetails', () => {
  const mockBooking: BookingResponse = {
    id: 'booking-1',
    tripId: 'trip-1',
    userId: 'user-1',
    preferredDate: '2025-02-15T10:00:00Z',
    participants: 2,
    status: 'confirmed' as const,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    trip: {
      id: 'trip-1',
      title: 'Test Trip',
      startDate: '2025-02-15T10:00:00Z',
      endDate: '2025-02-20T10:00:00Z',
      price: 1000
    },
    user: {
      id: 'user-1',
      username: 'testuser'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderBookingDetails = (bookingId = 'booking-1') => {
    return render(
      <MemoryRouter initialEntries={[`/bookings/${bookingId}`]}>
        <Routes>
          <Route path="/bookings/:id" element={<BookingDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('shows loading state initially', () => {
    (bookingsApi.getBooking as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    
    renderBookingDetails();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch booking details';
    (bookingsApi.getBooking as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    renderBookingDetails();
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('displays booking not found message when no booking is returned', async () => {
    (bookingsApi.getBooking as jest.Mock).mockResolvedValueOnce(null);

    renderBookingDetails();
    expect(await screen.findByText('Booking not found')).toBeInTheDocument();
  });

  it('renders booking details correctly', async () => {
    (bookingsApi.getBooking as jest.Mock).mockResolvedValueOnce(mockBooking);

    renderBookingDetails();

    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
      expect(screen.getByText(`Booking ID: #${mockBooking.id.slice(0, 8)}`)).toBeInTheDocument();
      expect(screen.getByText('Number of Participants: 2')).toBeInTheDocument();
      const confirmedChip = screen.getByText('confirmed').closest('.MuiChip-root');
      expect(confirmedChip).toHaveClass('MuiChip-colorSuccess');
    });
  });

  it('handles booking cancellation', async () => {
    (bookingsApi.getBooking as jest.Mock).mockResolvedValueOnce(mockBooking);
    (bookingsApi.cancelBooking as jest.Mock).mockResolvedValueOnce(undefined);
    (bookingsApi.getBooking as jest.Mock).mockResolvedValueOnce({ ...mockBooking, status: 'cancelled' as const });

    renderBookingDetails();

    // Wait for the initial render
    await waitFor(() => {
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });

    // Find and click the cancel button
    const cancelButton = screen.getByRole('button', { name: 'Cancel Booking' });
    fireEvent.click(cancelButton);

    // Verify the booking was cancelled and details were updated
    await waitFor(() => {
      expect(bookingsApi.cancelBooking).toHaveBeenCalledWith('booking-1');
      expect(bookingsApi.getBooking).toHaveBeenCalledTimes(2);
      expect(screen.getByText('cancelled')).toBeInTheDocument();
    });
  });

  it('navigates back to bookings list when clicking back button', async () => {
    (bookingsApi.getBooking as jest.Mock).mockResolvedValueOnce(mockBooking);

    renderBookingDetails();

    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: 'Back to Bookings' });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/bookings');
  });

  it('hides cancel button for cancelled bookings', async () => {
    const cancelledBooking: BookingResponse = { ...mockBooking, status: 'cancelled' as const };
    (bookingsApi.getBooking as jest.Mock).mockResolvedValueOnce(cancelledBooking);

    renderBookingDetails();

    await waitFor(() => {
      expect(screen.getByText('cancelled')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Cancel Booking' })).not.toBeInTheDocument();
    });
  });
});
