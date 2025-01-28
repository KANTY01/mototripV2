import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/dom';
import { waitFor } from '@testing-library/dom';
import { MemoryRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BookingForm from '../BookingForm';
import { createBooking, BookingResponse } from '../../../services/api/bookings';

// Mock the API call
jest.mock('../../../services/api/bookings', () => ({
  createBooking: jest.fn()
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

describe('BookingForm', () => {
  const defaultProps = {
    tripId: 'test-trip-id',
    availableSeats: 4,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-28'),
    onBookingComplete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderBookingForm = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BookingForm {...props} />
        </LocalizationProvider>
      </MemoryRouter>
    );
  };

  it('renders the booking form with initial values', () => {
    renderBookingForm();

    expect(screen.getByText('Book Your Trip')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Passengers')).toHaveValue(1);
    expect(screen.getByText('Available seats: 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Book Now' })).toBeInTheDocument();
  });

  it('shows error when submitting without selecting a date', async () => {
    renderBookingForm();

    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    expect(await screen.findByText('Please select a date')).toBeInTheDocument();
  });

  it('shows error when passengers exceed available seats', async () => {
    renderBookingForm();

    const passengersInput = screen.getByLabelText('Number of Passengers');
    fireEvent.change(passengersInput, { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    expect(await screen.findByText('Number of passengers must be between 1 and 4')).toBeInTheDocument();
  });

  it('successfully creates a booking and navigates to bookings page', async () => {
    const mockResponse: BookingResponse = {
      id: 'new-booking-id',
      tripId: 'test-trip-id',
      userId: 'test-user-id',
      bookingDate: new Date('2025-02-01').toISOString(),
      numberOfPassengers: 2,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const mockCreateBooking = createBooking as jest.MockedFunction<typeof createBooking>;
    mockCreateBooking.mockResolvedValueOnce(mockResponse);

    renderBookingForm();

    // Set passengers
    const passengersInput = screen.getByLabelText('Number of Passengers');
    fireEvent.change(passengersInput, { target: { value: '2' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith(expect.objectContaining({
        tripId: 'test-trip-id',
        numberOfPassengers: 2,
        status: 'PENDING'
      }));
    });

    expect(defaultProps.onBookingComplete).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/bookings');
  });

  it('shows error message when booking creation fails', async () => {
    const errorMessage = 'Failed to create booking';
    const mockCreateBooking = createBooking as jest.MockedFunction<typeof createBooking>;
    mockCreateBooking.mockRejectedValueOnce(new Error(errorMessage));

    renderBookingForm();

    // Set passengers
    const passengersInput = screen.getByLabelText('Number of Passengers');
    fireEvent.change(passengersInput, { target: { value: '2' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('disables submit button while loading', async () => {
    const mockCreateBooking = createBooking as jest.MockedFunction<typeof createBooking>;
    mockCreateBooking.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderBookingForm();

    // Set passengers
    const passengersInput = screen.getByLabelText('Number of Passengers');
    fireEvent.change(passengersInput, { target: { value: '2' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    expect(screen.getByRole('button', { name: 'Booking...' })).toBeDisabled();
  });
});
