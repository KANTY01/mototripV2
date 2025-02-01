import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import TripMap from '../trips/TripMap';
import { Trip } from '../../types';

const PremiumRoutePlanner: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    // Initialize with a default trip for route planning
    const defaultTrip: Trip = {
      id: 0,
      title: 'New Route',
      description: 'Plan your route',
      difficulty: 'medium',
      distance: 0,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      location: {
        latitude: 52.237049, // Default center (Warsaw)
        longitude: 21.017532,
        route_points: []
      },
      is_premium: true,
      images: [],
    };
    setTrip(defaultTrip);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!trip) {
    return null;
  }

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Route Planner
      </Typography>
      <Typography variant="body1" paragraph>
        Plan your motorcycle routes with our premium route planning tool.
      </Typography>
      <Box sx={{ height: '600px', width: '100%', mt: 3 }}>
        <TripMap 
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          trip={trip}
          height="100%"
          width="100%"
          showRoute={true}
          interactive={true}
        />
      </Box>
    </StyledBox>
  );
};

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': { boxShadow: 'none', borderColor: theme.palette.action.hover }
}));

export default PremiumRoutePlanner;