import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const MeetingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meeting Details
      </Typography>
      <Typography variant="body1">
        Details for meeting ID: {id}
      </Typography>
    </Box>
  );
};

export default MeetingDetails;