import React from 'react';
import { Box, Typography } from '@mui/material';

const UserProfile: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1">
        Manage your profile and preferences
      </Typography>
    </Box>
  );
};

export default UserProfile;