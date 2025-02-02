import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import UserTripManagement from '../components/trips/UserTripManagement';

const MyTrips: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          My Trips
        </Typography>
        <UserTripManagement />
      </Paper>
    </Container>
  );
};

export default MyTrips;