import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/dom';
import { waitFor } from '@testing-library/dom';
import { MemoryRouter } from 'react-router-dom';
import BookingList from '../BookingList';
import { bookingsApi, BookingResponse } from '../../../services/api/bookings';

// Mock the API calls
jest.mock('../../../services/api/bookings', () => ({
  bookingsApi: {
    getUserBookings: jest.fn(),
    cancelBooking: jest.fn()
  }
}));

describe('BookingList', () => {
  const mockBookings: BookingResponse[] = [
    {
      id: 'booking-1',
      tripId: 'trip-1',
      userId: 'user-1',
      preferredDate: '2025-02-15T10:00:00Z',
      participants: 2,
      status: 'confirmed' as const,
      trip: {
        id: 'trip-1',
        title: 'Test Trip 1',
        startDate: '2025-02-15T10:00:00Z',
        endDate: '2025-02-20T10:00:00Z',
        price: 1000
      },
      user: {
        id: 'user-1',
        username: 'testuser'
      },
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'booking-2',
      tripId: 'trip-2',
      userId: 'user-1',
      preferredDate: '2025-03-20T10:00:00Z',
      participants: 1,
      status: 'pending' as const,
      trip: {
        id: 'trip-2',
        title: 'Test Trip 2',
        startDate: '2025-03-20T10:00:00Z',
        endDate: '2025-03-25T10:00:00Z',
        price: 800
      },
      user: {
        id: 'user-1',
        username: 'testuser'
      },
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z'
    },
    {
      id: 'booking-3',
      tripId: 'trip-3',
      userId: 'user-1',
      preferredDate: '2024-12-10T10:00:00Z',
      participants: 3,
      status: 'cancelled' as const,
      trip: {
        id: 'trip-3',
        title: 'Test Trip 3',
        startDate: '2024-12-10T10:00:00Z',
        endDate: '2024-12-15T10:00:00Z',
        price: 1200
      },
      user: {
        id: 'user-1',
        username: 'testuser'
      },
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-05T10:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (bookingsApi.getUserBookings as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <BookingList />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch bookings';
    (bookingsApi.getUserBookings as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter>
        <BookingList />
      </MemoryRouter>
    );

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('displays message when no bookings are found', async () => {
    (bookingsApi.getUserBookings as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <BookingList />
      </MemoryRouter>
    );

    expect(await screen.findByText('No bookings found')).toBeInTheDocument();
  });

  it('renders list of bookings with correct status colors', async () => {
    (bookingsApi.getUserBookings as jest.Mock).mockResolvedValueOnce(mockBookings);

    render(
      <MemoryRouter>
        <BookingList />
      </MemoryRouter>
    );

    await waitFor(() => {
      const confirmedChip = screen.getByText('confirmed').closest('.MuiChip-root');
      const pendingChip = screen.getByText('pending').closest('.MuiChip-root');
      const cancelledChip = screen.getByText('cancelled').closest('.MuiChip-root');
      
      expect(confirmedChip).toHaveClass('MuiChip-colorSuccess');
      expect(pendingChip).toHaveClass('MuiChip-colorWarning');
      expect(cancelledChip).toHaveClass('MuiChip-colorError');
    });
  });

  it('displays trip-specific bookings when tripId is provided', async () => {
    const tripId = 'trip-1';
    (bookingsApi.getTripBookings as jest.Mock).mockResolvedValueOnce({
      bookings: [mockBookings[0]],
      total: 1,
      page: 1,
      perPage: 10
    });

    render(
      <MemoryRouter>
        <BookingList tripId={tripId} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Trip 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Trip 2')).not.toBeInTheDocument();
      expect(bookingsApi.getTripBookings).toHaveBeenCalledWith(tripId, 1);
    });
  });

  it('displays user bookings when no tripId is provided', async () => {
    (bookingsApi.getUserBookings as jest.Mock).mockResolvedValueOnce({
      bookings: mockBookings,
      total: 3,
      page: 1,
      perPage: 10
    });

    render(
      <MemoryRouter>
        <BookingList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Trip 1')).toBeInTheDocument();
      expect(screen.getByText('Test Trip 2')).toBeInTheDocument();
      expect(screen.getByText('Test Trip 3')).toBeInTheDocument();
      expect(bookingsApi.getUserBookings).toHaveBeenCalledWith(1);
    });
  });

  it('handles booking cancellation', async () => {
    (bookingsApi.getUserBookings as jest.Mock).mockResolvedValueOnce(mockBookings);
    (bookingsApi.cancelBooking as jest.Mock).mockResolvedValueOnce(undefined);
    // Mock the second call to getUserBookings after cancellation
    (bookingsApi.getUserBookings as jest.Mock).mockResolvedValueOnce([
      { ...mockBookings[0], status: 'cancelled' },
      ...mockBookings.slice(1)
    ]);

    render(
      <MemoryRouter>
        <BookingList />
      </MemoryRouter>
    );

    // Wait for the initial render
    await waitFor(() => {
      expect(screen.getByText('confirmed')).toBeInTheDocument();
    });

    // Find and click the cancel button for the confirmed booking
    const cancelButton = screen.getAllByText('Cancel Booking')[0];
    fireEvent.click(cancelButton);

    // Verify the booking was cancelled
    await waitFor(() => {
      expect(bookingsApi.cancelBooking).toHaveBeenCalledWith('booking-1');
      expect(bookingsApi.getUserBookings).toHaveBeenCalledTimes(2);
    });
  });
});
