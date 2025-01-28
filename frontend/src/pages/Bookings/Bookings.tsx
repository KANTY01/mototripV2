import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BookingList from '../../components/bookings/BookingList';

const Bookings: React.FC = () => {
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
        <Typography color="text.primary">My Bookings</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #f6f8fc 0%, #e3f2fd 100%)',
        }}
      >
        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            My Bookings
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your motorcycle trip bookings and view your upcoming adventures
          </Typography>
        </Box>
      </Paper>

      {/* Bookings List */}
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <BookingList />
      </Paper>
    </Container>
  );
};

export default Bookings;
