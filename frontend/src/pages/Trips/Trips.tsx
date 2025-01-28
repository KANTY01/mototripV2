import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import TripList from '../../components/trips/TripList';
import { useAuth } from '../../hooks/useAuth';

const Trips: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Typography color="text.primary">Motorcycle Trips</Typography>
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
            Motorcycle Trips
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Discover amazing motorcycle trips and connect with fellow riders
          </Typography>

          {user && (
            <Button
              component={RouterLink}
              to="/trips/create"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Create New Trip
            </Button>
          )}
        </Box>
      </Paper>

      {/* Trip List with Filters */}
      <TripList />
    </Container>
  );
};

export default Trips;
