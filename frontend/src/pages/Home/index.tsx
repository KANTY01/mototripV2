import React from 'react';
import { Box, Typography } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to MotoTrip
      </Typography>
      <Typography variant="body1">
        Find and join motorcycle meetups in your area
      </Typography>
    </Box>
  );
};

export default Home;