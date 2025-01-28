import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import TripDetailsComponent from '../../components/trips/TripDetails';
import { tripsApi, TripResponse } from '../../services/api/trips';

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) {
        navigate('/trips');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await tripsApi.getTrip(id);
        setTrip(response);
      } catch (err) {
        setError('Failed to load trip details. Please try again later.');
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !trip) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Trip not found'}
        </Alert>
        <Link component={RouterLink} to="/trips">
          Back to Trips
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="hover"
        >
          Home
        </Link>
        <Link
          component={RouterLink}
          to="/trips"
          color="inherit"
          underline="hover"
        >
          Trips
        </Link>
        <Typography color="text.primary">
          {trip.title}
        </Typography>
      </Breadcrumbs>

      {/* Trip Details Component */}
      <TripDetailsComponent
        trip={trip}
        onBook={() => {
          // Optionally refresh trip data after booking
          window.location.reload();
        }}
      />
    </Container>
  );
};

export default TripDetailsPage;
