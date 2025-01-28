import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import TripList from '../../components/trips/TripList';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Hero Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #f6f8fc 0%, #e3f2fd 100%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              maxWidth: 800,
              mx: 'auto',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Welcome to MotorTrip
              {user && <span>, {user.username}!</span>}
            </Typography>
            
            <Typography variant="h5" color="text.secondary" paragraph>
              Your trusted platform for motorcycle adventures. Discover amazing routes, 
              connect with fellow riders, and embark on unforgettable journeys.
            </Typography>

            {!user ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Join Now
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/trips')}
                >
                  Browse Trips
                </Button>
                {user.role === 'ADMIN' && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/admin')}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Featured Trips Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            Featured Motorcycle Trips
          </Typography>
          <TripList />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
