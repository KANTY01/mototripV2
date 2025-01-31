import { Box, Button, Container, Grid, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import TripCard from '../components/trips/TripCard'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchTrips } from '../store/slices/tripSlice'

const LandingPage = () => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { trips } = useSelector((state: RootState) => state.trips)

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const featuredTrips = trips.slice(0, 3)

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Amazing Motorcycle Trips
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Join the community of motorcycle enthusiasts and share your adventures
          </Typography>
          <Box sx={{ '& > :not(style)': { mr: 2 } }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              color="primary"
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/trips"
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Explore Trips
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.grey[100] }}>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Why Choose Our Platform
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Plan Your Routes
                </Typography>
                <Typography>
                  Create and share detailed motorcycle routes with the community
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Connect with Riders
                </Typography>
                <Typography>
                  Join a community of passionate motorcycle enthusiasts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Share Experiences
                </Typography>
                <Typography>
                  Share photos and stories from your motorcycle adventures
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Trips Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Featured Trips
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {featuredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/trips"
              variant="contained"
              size="large"
              color="primary"
            >
              View All Trips
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.primary.main, color: 'white' }}>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Ready to Start Your Journey?
          </Typography>
          <Typography align="center" sx={{ mb: 4 }}>
            Join our community today and start sharing your motorcycle adventures
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{ backgroundColor: 'white', color: theme.palette.primary.main }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
